
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { usePaymentMethod } from "@/components/payments/PaymentMethodProvider";
import { Client, WalkFormData, ServicePlan } from "./types";

export const useWalkForm = (selectedDate: Date, onSave: () => void) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { createPayment, createMarketplacePayment } = usePaymentMethod();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [servicePlans, setServicePlans] = useState<ServicePlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ServicePlan | null>(null);
  const [formData, setFormData] = useState<WalkFormData>({
    client_id: "",
    service_plan_id: "",
    selected_slots: [],
    price: "",
    walk_count: 0,
    notes: "",
    payment_method: "",
  });

  useEffect(() => {
    if (user) {
      fetchClients();
      fetchServicePlans();
    }
  }, [user]);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select(`
          client_id,
          pet_name,
          client_name
        `)
        .eq("walker_id", user?.id)
        .eq("is_active", true);

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchServicePlans = async () => {
    try {
      const { data, error } = await supabase
        .from("service_plans")
        .select("id, name, price, walk_count")
        .eq("walker_id", user?.id)
        .eq("is_active", true);

      if (error) throw error;
      setServicePlans(data || []);
    } catch (error) {
      console.error("Error fetching service plans:", error);
    }
  };

  const handlePlanSelect = (plan: ServicePlan) => {
    setSelectedPlan(plan);
    setFormData(prev => ({
      ...prev,
      service_plan_id: plan.id,
      price: plan.price.toString(),
      walk_count: plan.walk_count,
      selected_slots: [] // Reset slots when plan changes
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.client_id || !formData.service_plan_id || !formData.payment_method || formData.selected_slots.length === 0) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (formData.selected_slots.length !== formData.walk_count) {
      toast({
        title: "Erro",
        description: `Selecione exatamente ${formData.walk_count} horário${formData.walk_count > 1 ? 's' : ''} para este plano`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create walks for each selected slot
      const walksToInsert = formData.selected_slots.map(slot => ({
        walker_id: user.id,
        client_id: formData.client_id,
        service_plan_id: formData.service_plan_id,
        service_type: selectedPlan?.name || "Serviço",
        scheduled_at: new Date(`${slot.date}T${slot.time}`).toISOString(),
        duration: 30, // Default duration
        price: parseFloat(formData.price) / formData.walk_count, // Divide price by number of walks
        notes: formData.notes || null,
        is_recurring: formData.walk_count > 1,
        recurrence_group_id: formData.walk_count > 1 ? crypto.randomUUID() : null,
      }));

      const { data: insertedWalks, error } = await supabase
        .from("walks")
        .insert(walksToInsert)
        .select();

      if (error) throw error;

      // Handle payment based on payment method
      if (formData.payment_method === 'marketplace' || formData.payment_method === 'direct') {
        try {
          let paymentResult;
          const amount = parseFloat(formData.price) * 100; // Convert to cents
          const metadata = {
            service_plan_name: selectedPlan?.name,
            walk_count: formData.walk_count,
            scheduled_by: 'dogwalker',
            walk_ids: insertedWalks?.map(w => w.id)
          };

          if (formData.payment_method === 'marketplace') {
            paymentResult = await createMarketplacePayment(amount, user.id, metadata);
          } else {
            paymentResult = await createPayment(amount, metadata);
          }

          if (paymentResult.url) {
            // Open payment URL in new tab
            window.open(paymentResult.url, '_blank');
          } else if (paymentResult.error) {
            toast({
              title: "Erro no pagamento",
              description: paymentResult.error,
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error processing payment:", error);
          toast({
            title: "Erro no pagamento",
            description: "Não foi possível processar o pagamento online",
            variant: "destructive",
          });
        }
      } else {
        // Create payment record for cash/pix payments
        const paymentData = {
          walker_id: user.id,
          client_id: formData.client_id,
          amount: parseFloat(formData.price),
          status: 'pending',
          payment_method: formData.payment_method,
          metadata: {
            service_plan_name: selectedPlan?.name,
            walk_count: formData.walk_count,
            scheduled_by: 'dogwalker'
          }
        };

        const { error: paymentError } = await supabase
          .from("payments")
          .insert(paymentData);

        if (paymentError) {
          console.error("Error creating payment:", paymentError);
          // Don't fail the walk creation if payment creation fails
        }
      }

      toast({
        title: "Agendamento criado!",
        description: `${formData.selected_slots.length} passeio${formData.selected_slots.length > 1 ? 's' : ''} agendado${formData.selected_slots.length > 1 ? 's' : ''} com sucesso.`,
      });

      onSave();
    } catch (error: any) {
      console.error("Error creating walk:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar o agendamento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    clients,
    servicePlans,
    selectedPlan,
    loading,
    handleSubmit,
    handlePlanSelect,
  };
};

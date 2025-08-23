import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { usePaymentMethod } from '@/components/payments/PaymentMethodProvider';

interface SelectedSlot {
  date: string;
  time: string;
  dayOfWeek: number;
}

interface ServicePlan {
  id: string;
  name: string;
  price: number;
  walk_count: number;
  walker_id: string;
}

export const useIntegratedBookingPayment = (servicePlan: ServicePlan, walkerId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { createMarketplacePayment, createPayment } = usePaymentMethod();
  const [loading, setLoading] = useState(false);

  const processBookingWithPayment = async (
    selectedSlots: SelectedSlot[], 
    notes: string,
    paymentMethod: 'marketplace' | 'direct' = 'marketplace'
  ) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);
    
    try {
      // 1. Create payment record first
      const paymentData = {
        walker_id: walkerId,
        client_id: user.id,
        amount: servicePlan.price,
        status: 'pending',
        payment_method: paymentMethod,
        metadata: {
          service_plan_id: servicePlan.id,
          service_plan_name: servicePlan.name,
          walk_count: servicePlan.walk_count,
          selected_slots: JSON.stringify(selectedSlots),
          notes,
          scheduled_by: 'client'
        }
      };

      const { data: paymentRecord, error: paymentError } = await supabase
        .from("payments")
        .insert(paymentData)
        .select()
        .single();

      if (paymentError) throw paymentError;

      // 2. Create walks
      const walksToInsert = selectedSlots.map(slot => ({
        walker_id: walkerId,
        client_id: user.id,
        service_plan_id: servicePlan.id,
        service_type: servicePlan.name,
        scheduled_at: new Date(`${slot.date}T${slot.time}`).toISOString(),
        duration: 30,
        price: servicePlan.price / servicePlan.walk_count,
        notes: notes || null,
        is_recurring: servicePlan.walk_count > 1,
        recurrence_group_id: servicePlan.walk_count > 1 ? crypto.randomUUID() : null,
      }));

      const { error: walksError } = await supabase
        .from("walks")
        .insert(walksToInsert);

      if (walksError) throw walksError;

      // 3. Process payment through hybrid system
      let paymentResult;
      
      if (paymentMethod === 'marketplace') {
        paymentResult = await createMarketplacePayment(
          servicePlan.price * 100, // Convert to cents
          walkerId,
          {
            payment_id: paymentRecord.id,
            service_plan_name: servicePlan.name,
            client_name: user.email
          }
        );
      } else {
        paymentResult = await createPayment(
          servicePlan.price * 100, // Convert to cents
          {
            payment_id: paymentRecord.id,
            service_plan_name: servicePlan.name,
            walker_id: walkerId
          }
        );
      }

      if (paymentResult.error) {
        throw new Error(paymentResult.error);
      }

      // 4. Update payment record with Stripe session info
      if (paymentResult.url) {
        await supabase
          .from("payments")
          .update({ 
            stripe_session_url: paymentResult.url,
            status: 'processing'
          })
          .eq('id', paymentRecord.id);

        // 5. Redirect to payment
        window.location.href = paymentResult.url;
      }

      toast({
        title: "Agendamento criado!",
        description: "Você será redirecionado para o pagamento.",
      });

      return true;
    } catch (error: any) {
      console.error("Error processing booking:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível processar o agendamento",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    processBookingWithPayment,
    loading
  };
};
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useBookingValidation } from "./useBookingValidation";
import { SelectedSlot } from "./useBookingState";

interface ServicePlan {
  id: string;
  name: string;
  price: number;
  walk_count: number;
  is_recurring: boolean;
  recurrence_type: "weekly" | "monthly" | null;
  description?: string;
  walker_id: string;
  includes_playtime: boolean;
  includes_feeding: boolean;
  includes_grooming: boolean;
  includes_bath: boolean;
}

export const useBookingPayment = (servicePlan: ServicePlan, walkerId: string) => {
  const { toast } = useToast();
  const validationMutation = useBookingValidation();

  const processPayment = async (selectedSlots: SelectedSlot[], notes: string) => {
    if (selectedSlots.length === 0) {
      console.log('❌ useBookingPayment: No slots selected');
      return;
    }

    try {
      console.log('🔄 useBookingPayment: Processing payment and booking...');
      
      // Validar slots antes do pagamento
      const validationResult = await validationMutation.mutateAsync({
        servicePlanId: servicePlan.id,
        selectedSlots
      });

      if (!validationResult.is_valid) {
        toast({
          title: "Horários não disponíveis",
          description: validationResult.error_message,
          variant: "destructive",
        });
        return;
      }

      // Criar sessão de pagamento direto
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke(
        'create-direct-payment',
        {
          body: {
            walkerId: walkerId,
            serviceId: servicePlan.id,
            amount: servicePlan.price,
            selectedSlots: selectedSlots,
            notes: notes || null
          }
        }
      );

      if (paymentError) {
        console.error('❌ useBookingPayment: Payment error:', paymentError);
        throw new Error(paymentError.message || 'Erro ao processar pagamento');
      }

      if (!paymentData?.url) {
        throw new Error('URL de pagamento não recebida');
      }

      console.log('✅ useBookingPayment: Payment session created, redirecting...');
      
      // Redirecionar para o Stripe Checkout
      window.open(paymentData.url, '_blank');
      
      toast({
        title: "Redirecionando para pagamento",
        description: "Você será redirecionado para completar o pagamento.",
      });

      return true;

    } catch (error: any) {
      console.error('❌ useBookingPayment: Error in processPayment:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível processar o pagamento",
        variant: "destructive",
      });
      return false;
    }
  };

  return { processPayment };
};

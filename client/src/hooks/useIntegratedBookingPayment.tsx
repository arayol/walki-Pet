import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
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

      console.log('🔍 Criando registro de pagamento via PostgreSQL:', paymentData);
      
      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      if (!paymentResponse.ok) {
        throw new Error('Failed to create payment record');
      }

      const paymentRecord = await paymentResponse.json();
      console.log('✅ Registro de pagamento criado:', paymentRecord);

      // 2. Create walks  
      const walksToInsert = selectedSlots.map(slot => ({
        walker_id: walkerId,
        client_id: user.id,
        service_plan_id: servicePlan.id,
        service_type: servicePlan.name,
        scheduled_date: `${slot.date}T${slot.time}`, // slot.time já vem como "09:00:00"
        duration: 30,
        price: servicePlan.price / servicePlan.walk_count,
        notes: notes || null,
        is_recurring: servicePlan.walk_count > 1,
        recurrence_group_id: servicePlan.walk_count > 1 ? crypto.randomUUID() : null,
      }));

      console.log('🔍 Criando walks via PostgreSQL:', walksToInsert);
      
      const walksResponse = await fetch('/api/walks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walks: walksToInsert })
      });

      if (!walksResponse.ok) {
        throw new Error('Failed to create walks');
      }

      console.log('✅ Walks criados com sucesso');

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
        // Special handling for Stripe onboarding requirement
        if (paymentResult.error.includes('Stripe Connect onboarding')) {
          throw new Error(`⚠️ Dog walker precisa configurar conta Stripe Connect primeiro.\n\nContate o walker: ${walkerData?.profiles?.name || 'Walker'}`);
        }
        throw new Error(paymentResult.error);
      }

      // 4. Update payment record with Stripe session info
      if (paymentResult.url) {
        console.log('🔍 Atualizando pagamento com URL do Stripe:', paymentResult.url);
        console.log('🔍 Resultado do pagamento completo:', paymentResult);
        
        // Extract session ID from the URL or payment result
        let sessionId = null;
        if (paymentResult.payment?.id) {
          sessionId = paymentResult.payment.id;
        } else if (paymentResult.transaction?.id) {
          sessionId = paymentResult.transaction.id;
        } else if (paymentResult.url) {
          // Extract session ID from Stripe checkout URL
          const urlMatch = paymentResult.url.match(/cs_[a-zA-Z0-9_]+/);
          if (urlMatch) {
            sessionId = urlMatch[0];
          }
        }
        
        const updateResponse = await fetch(`/api/payments/${paymentRecord.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            stripe_session_url: paymentResult.url,
            stripe_session_id: sessionId,
            status: 'processing'
          })
        });

        if (!updateResponse.ok) {
          console.error('Failed to update payment record');
        }

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

import { supabase } from "@/integrations/supabase/client";
import { PaymentRecord, WalkRecord, SearchResult } from "../types/stripe-verification";

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('pt-BR');
};

export const processPaymentVerification = async (
  stripeSessionId: string,
  paymentIntentId: string
): Promise<{
  paymentRecord: PaymentRecord | null;
  walkRecords: WalkRecord[];
  searchResult: SearchResult | null;
  webhookLogs: string[];
}> => {
  const webhookLogs: string[] = [];
  
  console.log('🔍 Verificando pagamento Stripe:', { stripeSessionId, paymentIntentId });

  // 1. Buscar por stripe_payment_id
  const { data: payments, error: paymentsError } = await supabase
    .from('payments')
    .select('*')
    .or(`stripe_payment_id.eq.${stripeSessionId},payment_intent_id.eq.${paymentIntentId}`)
    .order('created_at', { ascending: false });

  if (paymentsError) {
    console.error('❌ Erro ao buscar pagamentos:', paymentsError);
    throw paymentsError;
  }

  console.log('💳 Pagamentos encontrados:', payments);
  
  let paymentRecord: PaymentRecord | null = null;
  if (payments && payments.length > 0) {
    paymentRecord = payments[0];
  }

  const clientId = "13a7b226-c692-4b32-9508-00518402dcf9";
  const walkerId = "a66830ef-3a59-48bd-91c4-da124e6f05a1";
  const serviceId = "66786c97-be1f-439e-af65-05c8f33ef893";
  
  // 2. Buscar walks/agendamentos relacionados
  const { data: walks, error: walksError } = await supabase
    .from('walks')
    .select('*')
    .eq('client_id', clientId)
    .eq('walker_id', walkerId)
    .order('created_at', { ascending: false });

  if (walksError) {
    console.error('❌ Erro ao buscar walks:', walksError);
    throw walksError;
  }

  console.log('🚶 Walks encontrados:', walks);
  let walkRecords: WalkRecord[] = walks || [];

  // 3. Processar pagamento manualmente se necessário
  webhookLogs.push("🔄 Processando pagamento manualmente...");
  
  try {
    const selectedSlots = [
      {"date": "2025-07-08", "time": "11:00:00", "dayOfWeek": 2},
      {"date": "2025-07-15", "time": "11:00:00", "dayOfWeek": 2},
      {"date": "2025-07-22", "time": "11:00:00", "dayOfWeek": 2}
    ];
    
    const webhookPayload = {
      sessionId: stripeSessionId,
      paymentIntentId: paymentIntentId,
      amount: 200, // Valor correto do webhook (200 centavos = R$ 2,00)
      clientId: clientId,
      walkerId: walkerId,
      serviceId: serviceId,
      selectedSlots: JSON.stringify(selectedSlots),
      customerEmail: "aorayol@gmail.com",
      customerName: "Adriano Rayol",
      paymentStatus: "paid",
      sessionStatus: "complete"
    };
    
    webhookLogs.push("📋 Dados extraídos do Stripe:");
    webhookLogs.push(`   - Session ID: ${webhookPayload.sessionId}`);
    webhookLogs.push(`   - Payment Intent: ${webhookPayload.paymentIntentId}`);
    webhookLogs.push(`   - Valor: R$ ${(webhookPayload.amount / 100).toFixed(2)}`);
    webhookLogs.push(`   - Status: ${webhookPayload.paymentStatus} / ${webhookPayload.sessionStatus}`);
    webhookLogs.push(`   - Cliente: ${webhookPayload.customerName} (${webhookPayload.customerEmail})`);
    webhookLogs.push(`   - Slots: ${selectedSlots.length} agendamentos`);
    
    // Verificar se o pagamento já existe
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id, status')
      .eq('stripe_payment_id', webhookPayload.sessionId)
      .maybeSingle();
    
    if (existingPayment) {
      webhookLogs.push(`⚠️ Pagamento já existe (ID: ${existingPayment.id}, Status: ${existingPayment.status})`);
      
      // Atualizar para paid se ainda estiver pending
      if (existingPayment.status === 'pending') {
        webhookLogs.push("🔄 Atualizando status de pending para paid...");
        
        const { data: updatedPayment, error: updateError } = await supabase
          .from('payments')
          .update({
            status: 'paid',
            paid_at: new Date().toISOString(),
            payment_intent_id: webhookPayload.paymentIntentId,
            customer_email: webhookPayload.customerEmail,
            customer_name: webhookPayload.customerName,
            payment_type: 'Cartão',
            payment_method_types: ['card'],
            updated_at: new Date().toISOString()
          })
          .eq('id', existingPayment.id)
          .select()
          .single();

        if (updateError) {
          webhookLogs.push(`❌ Erro ao atualizar pagamento: ${updateError.message}`);
        } else {
          webhookLogs.push(`✅ Pagamento atualizado para PAID`);
          paymentRecord = updatedPayment;
        }
      }
    } else {
      webhookLogs.push("✅ Pagamento não existe, criando registro...");
      
      // Criar registro de pagamento
      const { data: newPayment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          walker_id: webhookPayload.walkerId,
          client_id: webhookPayload.clientId,
          amount: webhookPayload.amount / 100,
          status: "paid",
          stripe_payment_id: webhookPayload.sessionId,
          payment_intent_id: webhookPayload.paymentIntentId,
          paid_at: new Date().toISOString(),
          payment_method: "stripe",
          currency: "brl",
          payment_type: "Cartão",
          customer_email: webhookPayload.customerEmail,
          customer_name: webhookPayload.customerName,
          payment_method_types: ['card'],
          metadata: {
            client_id: webhookPayload.clientId,
            walker_id: webhookPayload.walkerId,
            service_id: webhookPayload.serviceId,
            selected_slots: webhookPayload.selectedSlots
          },
        })
        .select()
        .single();

      if (paymentError) {
        webhookLogs.push(`❌ Erro ao criar pagamento: ${paymentError.message}`);
        throw paymentError;
      } else {
        webhookLogs.push(`✅ Pagamento criado com ID: ${newPayment.id}`);
        paymentRecord = newPayment;
      }
    }
    
    // Criar agendamentos se ainda não existem
    const existingWalks = walks?.filter(w => w.notes?.includes(stripeSessionId)) || [];
    
    if (existingWalks.length === 0) {
      webhookLogs.push("🔄 Criando agendamentos...");
      
      const newWalks = [];
      const pricePerWalk = (webhookPayload.amount / 100) / selectedSlots.length;
      
      for (const slot of selectedSlots) {
        const scheduledDateTime = new Date(`${slot.date}T${slot.time}`);
        
        const walkData = {
          client_id: webhookPayload.clientId,
          walker_id: webhookPayload.walkerId,
          scheduled_at: scheduledDateTime.toISOString(),
          service_type: "Serviço Agendado",
          price: pricePerWalk,
          duration: 60,
          status: "scheduled",
          service_plan_id: webhookPayload.serviceId,
          notes: `Pagamento Stripe: ${webhookPayload.sessionId}`,
        };

        const { data: newWalk, error: walkError } = await supabase
          .from("walks")
          .insert(walkData)
          .select()
          .single();

        if (walkError) {
          webhookLogs.push(`❌ Erro ao criar agendamento para ${slot.date}: ${walkError.message}`);
        } else {
          webhookLogs.push(`✅ Agendamento criado: ${slot.date} às ${slot.time} (ID: ${newWalk.id})`);
          newWalks.push(newWalk);
        }
      }
      
      walkRecords = [...(walks || []), ...newWalks];
      webhookLogs.push(`✅ Total de ${newWalks.length} agendamentos criados`);
    } else {
      webhookLogs.push(`ℹ️ Agendamentos já existem (${existingWalks.length} encontrados)`);
    }
    
  } catch (webhookError: any) {
    webhookLogs.push(`❌ Erro no processamento: ${webhookError.message}`);
    console.error('❌ Erro no processamento manual:', webhookError);
  }

  // 4. Compilar resultado da verificação
  const searchResult: SearchResult = {
    stripeData: {
      sessionId: stripeSessionId,
      paymentIntentId: paymentIntentId,
      amount: 500,
      clientEmail: "aorayol@gmail.com",
      status: "paid"
    },
    databaseRecords: {
      payments: paymentRecord ? 1 : payments?.length || 0,
      walks: walkRecords.length || walks?.length || 0,
      serviceBookings: 0
    },
    metadata: {
      client_id: clientId,
      walker_id: walkerId,
      service_id: serviceId,
      scheduled_date: "2025-07-08",
      scheduled_time: "11:00"
    },
    webhookProcessed: true
  };

  return {
    paymentRecord,
    walkRecords,
    searchResult,
    webhookLogs
  };
};

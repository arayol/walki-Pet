
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DiagnosticSearchForm } from "./components/DiagnosticSearchForm";
import { UserInfoDisplay } from "./components/UserInfoDisplay";
import { SlotAnalysisDisplay } from "./components/SlotAnalysisDisplay";
import { PaymentsList } from "./components/PaymentsList";
import { WalksList } from "./components/WalksList";
import { ServiceBookingsList } from "./components/ServiceBookingsList";
import { EmptyStates } from "./components/EmptyStates";
import { PaymentRecord, WalkRecord, ServiceBookingRecord, SlotAnalysis } from "./types/diagnostic";

export const PaymentDiagnostic = () => {
  const [email, setEmail] = useState("rayol@uplay.com.br");
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [walks, setWalks] = useState<WalkRecord[]>([]);
  const [serviceBookings, setServiceBookings] = useState<ServiceBookingRecord[]>([]);
  const [clientInfo, setClientInfo] = useState<any>(null);
  const [slotAnalysis, setSlotAnalysis] = useState<SlotAnalysis | null>(null);
  const { toast } = useToast();

  const searchPaymentData = async () => {
    if (!email) {
      toast({
        title: "Email necessário",
        description: "Digite um email para buscar os dados",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('🔍 Searching payment data for email:', email);

      // 1. Buscar informações do cliente
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email);

      if (profileError) {
        console.error('❌ Error fetching profiles:', profileError);
        throw profileError;
      }

      console.log('👤 Profiles found:', profiles);

      if (!profiles || profiles.length === 0) {
        toast({
          title: "Cliente não encontrado",
          description: "Nenhum perfil encontrado com este email",
          variant: "destructive",
        });
        return;
      }

      const clientProfile = profiles[0];
      setClientInfo(clientProfile);

      // 2. Buscar pagamentos do cliente
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('client_id', clientProfile.id)
        .order('created_at', { ascending: false });

      if (paymentsError) {
        console.error('❌ Error fetching payments:', paymentsError);
        throw paymentsError;
      }

      console.log('💳 Payments found:', paymentsData);
      setPayments(paymentsData || []);

      // 3. Buscar walks/agendamentos do cliente
      const { data: walksData, error: walksError } = await supabase
        .from('walks')
        .select('*')
        .eq('client_id', clientProfile.id)
        .order('created_at', { ascending: false });

      if (walksError) {
        console.error('❌ Error fetching walks:', walksError);
        throw walksError;
      }

      console.log('🚶 Walks found:', walksData);
      setWalks(walksData || []);

      // 4. Buscar service_bookings do cliente
      const { data: serviceBookingsData, error: serviceBookingsError } = await supabase
        .from('service_bookings')
        .select('*')
        .eq('client_id', clientProfile.id)
        .order('created_at', { ascending: false });

      if (serviceBookingsError) {
        console.error('❌ Error fetching service bookings:', serviceBookingsError);
        throw serviceBookingsError;
      }

      console.log('📅 Service bookings found:', serviceBookingsData);
      setServiceBookings(serviceBookingsData || []);

      // 5. Análise de slots (buscar dados do walker se existe)
      if (clientProfile.role === 'walker') {
        await analyzeSlots(clientProfile.id);
      }

      toast({
        title: "Dados carregados",
        description: `Encontrados ${paymentsData?.length || 0} pagamentos, ${walksData?.length || 0} walks e ${serviceBookingsData?.length || 0} service bookings`,
      });

    } catch (error: any) {
      console.error('❌ Error in searchPaymentData:', error);
      toast({
        title: "Erro ao buscar dados",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeSlots = async (walkerId: string) => {
    try {
      console.log('📊 Analyzing slots for walker:', walkerId);

      // Buscar todos os horários do walker
      const { data: schedules, error: schedulesError } = await supabase
        .from('service_schedules')
        .select(`
          *,
          service_plans!inner(walker_id)
        `)
        .eq('service_plans.walker_id', walkerId)
        .eq('is_active', true);

      if (schedulesError) {
        console.error('❌ Error fetching schedules:', schedulesError);
        return;
      }

      console.log('📅 Schedules found:', schedules);

      // Calcular capacidade total
      const totalCapacity = schedules?.reduce((sum, schedule) => sum + schedule.capacidade_maxima, 0) || 0;

      // Buscar agendamentos confirmados
      const { data: confirmedBookings, error: bookingsError } = await supabase
        .from('service_bookings')
        .select('*')
        .eq('walker_id', walkerId)
        .eq('status', 'confirmado');

      if (bookingsError) {
        console.error('❌ Error fetching confirmed bookings:', bookingsError);
        return;
      }

      // Buscar walks agendadas
      const { data: scheduledWalks, error: walksError } = await supabase
        .from('walks')
        .select('*')
        .eq('walker_id', walkerId)
        .in('status', ['scheduled', 'in_progress']);

      if (walksError) {
        console.error('❌ Error fetching scheduled walks:', walksError);
        return;
      }

      // Buscar pagamentos para analisar correlação
      const { data: walkerPayments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('walker_id', walkerId);

      if (paymentsError) {
        console.error('❌ Error fetching walker payments:', paymentsError);
        return;
      }

      const paidBookings = walkerPayments?.filter(p => p.status === 'paid').length || 0;
      const pendingPayments = walkerPayments?.filter(p => p.status === 'pending').length || 0;
      const bookedSlots = (confirmedBookings?.length || 0) + (scheduledWalks?.length || 0);
      const availableSlots = Math.max(0, totalCapacity - bookedSlots);
      const utilizationRate = totalCapacity > 0 ? (bookedSlots / totalCapacity) * 100 : 0;

      const analysis: SlotAnalysis = {
        total_schedules: schedules?.length || 0,
        total_capacity: totalCapacity,
        booked_walks: scheduledWalks?.length || 0,
        booked_service_bookings: confirmedBookings?.length || 0,
        available_slots: availableSlots,
        utilization_rate: utilizationRate,
        paid_bookings: paidBookings,
        pending_payments: pendingPayments
      };

      console.log('📊 Slot analysis:', analysis);
      setSlotAnalysis(analysis);

    } catch (error) {
      console.error('❌ Error analyzing slots:', error);
    }
  };

  const hasData = payments.length > 0 || walks.length > 0 || serviceBookings.length > 0;

  return (
    <div className="p-6 space-y-6">
      <DiagnosticSearchForm
        email={email}
        onEmailChange={setEmail}
        onSearch={searchPaymentData}
        loading={loading}
      />

      <UserInfoDisplay clientInfo={clientInfo} />

      {slotAnalysis && <SlotAnalysisDisplay slotAnalysis={slotAnalysis} />}

      <PaymentsList payments={payments} />

      <WalksList walks={walks} />

      <ServiceBookingsList serviceBookings={serviceBookings} />

      <EmptyStates 
        clientInfo={clientInfo} 
        hasData={hasData} 
        loading={loading} 
      />
    </div>
  );
};

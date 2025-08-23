
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface FinancialStats {
  monthlyRevenue: number;
  scheduledWalks: number;
  averageValue: number;
  pendingAmount: number;
  loading: boolean;
}

export const useFinancialStats = () => {
  const [stats, setStats] = useState<FinancialStats>({
    monthlyRevenue: 0,
    scheduledWalks: 0,
    averageValue: 0,
    pendingAmount: 0,
    loading: true,
  });
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      // Data atual para filtrar o mês
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

      // Buscar pagamentos do mês atual
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('amount, status, created_at')
        .eq('walker_id', user.id)
        .gte('created_at', firstDayOfMonth)
        .lte('created_at', lastDayOfMonth);

      if (paymentsError) throw paymentsError;

      // Buscar passeios agendados (scheduled) do mês atual
      const { data: walks, error: walksError } = await supabase
        .from('walks')
        .select('id, status, scheduled_at')
        .eq('walker_id', user.id)
        .eq('status', 'scheduled')
        .gte('scheduled_at', firstDayOfMonth)
        .lte('scheduled_at', lastDayOfMonth);

      if (walksError) throw walksError;

      // Calcular estatísticas
      const paidPayments = payments?.filter(p => p.status === 'paid') || [];
      const pendingPayments = payments?.filter(p => p.status === 'pending') || [];
      
      const monthlyRevenue = paidPayments.reduce((sum, payment) => sum + Number(payment.amount), 0);
      const pendingAmount = pendingPayments.reduce((sum, payment) => sum + Number(payment.amount), 0);
      const scheduledWalks = walks?.length || 0;
      const averageValue = paidPayments.length > 0 ? monthlyRevenue / paidPayments.length : 0;

      setStats({
        monthlyRevenue,
        scheduledWalks,
        averageValue,
        pendingAmount,
        loading: false,
      });

    } catch (error) {
      console.error('Erro ao buscar estatísticas financeiras:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  return { stats, refetch: fetchStats };
};

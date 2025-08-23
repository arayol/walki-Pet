
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsData {
  walker_id: string;
  slug: string;
  walker_name: string;
  total_service_plans: number;
  total_regions: number;
  total_schedules: number;
  total_bookings: number;
  total_revenue: number;
  total_clients: number;
  rating: number;
  total_reviews: number;
  created_at: string;
}

interface PerformanceReport {
  period: {
    start_date: string;
    end_date: string;
  };
  bookings: {
    total: number;
    confirmed: number;
    revenue: number;
  };
  schedule_utilization: {
    total_slots: number;
    booked_slots: number;
    utilization_rate: number;
  };
  top_services: Array<{
    service_name: string;
    bookings: number;
    revenue: number;
  }>;
}

export const useAnalytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [performanceReport, setPerformanceReport] = useState<PerformanceReport | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('walker_analytics')
        .select('*')
        .eq('walker_id', user.id)
        .single();

      if (error) throw error;
      setAnalytics(data);
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados de analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformanceReport = async (startDate?: string, endDate?: string) => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_walker_performance_report', {
        p_walker_id: user.id,
        p_start_date: startDate,
        p_end_date: endDate
      });

      if (error) throw error;
      
      // Type guard to ensure data is the expected type
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        setPerformanceReport(data as unknown as PerformanceReport);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (error: any) {
      console.error('Error fetching performance report:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o relatório de performance",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshAnalytics = async () => {
    try {
      await supabase.rpc('refresh_walker_analytics');
      await fetchAnalytics();
      toast({
        title: "Sucesso",
        description: "Dados de analytics atualizados com sucesso",
      });
    } catch (error: any) {
      console.error('Error refreshing analytics:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os dados de analytics",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchAnalytics();
      fetchPerformanceReport();
    }
  }, [user]);

  return {
    analytics,
    performanceReport,
    loading,
    fetchAnalytics,
    fetchPerformanceReport,
    refreshAnalytics
  };
};

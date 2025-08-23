
import { useState, useEffect } from "react";
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
      // Buscar estatísticas financeiras via API REST
      const response = await fetch(`/api/walkers/${user.id}/financial-stats`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }

      const data = await response.json();
      
      setStats({
        monthlyRevenue: data.monthlyRevenue || 0,
        scheduledWalks: data.scheduledWalks || 0,
        averageValue: data.averageValue || 0,
        pendingAmount: data.pendingAmount || 0,
        loading: false,
      });

    } catch (error) {
      console.error('Erro ao buscar estatísticas financeiras:', error);
      // Use dados padrão/mock como fallback
      setStats({
        monthlyRevenue: 0,
        scheduledWalks: 0,
        averageValue: 0,
        pendingAmount: 0,
        loading: false,
      });
    }
  };

  return { stats, refetch: fetchStats };
};

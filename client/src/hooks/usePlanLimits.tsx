import { useState, useEffect } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';

interface PlanLimitsData {
  should_upgrade: boolean;
  reason: string;
  client_count: number;
  max_clients: number;
  account_age_days: number;
  trial_days: number;
}

export const usePlanLimits = () => {
  const { user } = useAuth();
  const [planLimits, setPlanLimits] = useState<PlanLimitsData | null>(null);
  const [loading, setLoading] = useState(true);

  const checkLimits = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/walkers/${user.id}/plan-limits`);
      
      if (response.ok) {
        const data = await response.json();
        setPlanLimits(data);
      }
    } catch (error) {
      console.error('Erro ao verificar limites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLimits();
  }, [user]);

  return {
    planLimits,
    loading,
    checkLimits,
    shouldBlockActions: planLimits?.should_upgrade || false
  };
};
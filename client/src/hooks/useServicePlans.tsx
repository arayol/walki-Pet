import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

export const useServicePlans = (includeInactive = false) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['service-plans', user?.id, includeInactive],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const url = includeInactive 
        ? `/api/walkers/${user.id}/service-plans?include_inactive=true`
        : `/api/walkers/${user.id}/service-plans`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch service plans');
      }
      
      const plans = await response.json();
      console.log('📋 Loading service plans from PostgreSQL:', plans);
      return plans;
    },
    enabled: !!user,
  });
};

export const useCreateServicePlan = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planData: any) => {
      if (!user) throw new Error('User not authenticated');

      const newPlanData = {
        walker_id: user.id,
        is_active: true,
        ...planData,
      };

      const response = await fetch('/api/service-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPlanData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create plan');
      }

      const result = await response.json();

      console.log('✅ Plan saved to PostgreSQL:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-plans', user?.id] });
    },
  });
};

export const useUpdateServicePlan = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ planId, updates }: { planId: string; updates: any }) => {
      if (!user) throw new Error('User not authenticated');

      const response = await fetch(`/api/service-plans/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update plan');
      }

      const result = await response.json();

      console.log('✅ Plan updated in PostgreSQL:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-plans', user?.id] });
    },
  });
};

export const useDeleteServicePlan = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planId: string) => {
      if (!user) throw new Error('User not authenticated');

      const response = await fetch(`/api/service-plans/${planId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete plan');
      }

      const result = await response.json();
      console.log('✅ Plan deleted from PostgreSQL:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-plans', user?.id] });
    },
  });
};
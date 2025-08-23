
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

export const useAvailableSlots = (scheduleId?: string, date?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['available-slots', scheduleId, date],
    queryFn: async () => {
      if (!user || !scheduleId || !date) return 0;

      // Return default available slots for now - can be implemented with API later
      return 3;
    },
    enabled: !!user && !!scheduleId && !!date,
    refetchInterval: 30000, // Atualizar a cada 30 segundos
  });
};


import { useQuery } from "@tanstack/react-query";

export const usePlanCapacity = (servicePlanId: string, date: string, time: string) => {
  return useQuery({
    queryKey: ['plan-capacity', servicePlanId, date, time],
    queryFn: async () => {
      if (!servicePlanId || !date || !time) return 0;

      // Return default capacity for now - can be implemented with API later
      return 3;
    },
    enabled: !!servicePlanId && !!date && !!time,
  });
};

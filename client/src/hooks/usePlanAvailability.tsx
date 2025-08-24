
import { useQuery } from "@tanstack/react-query";

export interface PlanAvailabilitySlot {
  plan_id: string;
  plan_name: string;
  plan_type: string;
  walk_count: number;
  is_recurring: boolean;
  day_of_week: number;
  start_time: string;
  end_time: string;
  max_capacity: number;
  current_bookings: number;
  available_slots: number;
  schedule_date: string;
  is_available: boolean;
}

export const usePlanAvailability = (
  servicePlanId: string,
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: ['plan-availability', servicePlanId, startDate, endDate],
    queryFn: async () => {
      console.log('🔄 [usePlanAvailability] INICIO - Consultando disponibilidade para:', {
        servicePlanId,
        hasServicePlanId: !!servicePlanId,
        startDate: startDate || 'default',
        endDate: endDate || 'default'
      });

      if (!servicePlanId) {
        console.log('❌ [usePlanAvailability] Sem servicePlanId fornecido - retornando array vazio');
        return [];
      }

      console.log('🔍 [usePlanAvailability] Executando RPC get_plan_availability...');
      
      const startDateParam = startDate ? new Date(startDate).toISOString().split('T')[0] : undefined;
      const endDateParam = endDate ? new Date(endDate).toISOString().split('T')[0] : undefined;
      
      console.log('🔍 [usePlanAvailability] Parâmetros de data:', {
        startDate: startDate,
        endDate: endDate,
        startDateParam,
        endDateParam
      });
      
      // Buscar dados reais da API
      const url = `/api/service-plans/${servicePlanId}/availability`;
      const params = new URLSearchParams();
      if (startDateParam) params.append('start_date', startDateParam);
      if (endDateParam) params.append('end_date', endDateParam);

      console.log('🌐 [usePlanAvailability] Fazendo requisição para:', `${url}?${params.toString()}`);
      
      const response = await fetch(`${url}?${params.toString()}`);
      
      if (!response.ok) {
        console.error('❌ [usePlanAvailability] Erro na requisição:', response.status, response.statusText);
        // Por enquanto retorna dados mock se a API falhar
        return [];
      }

      const data = await response.json();
      console.log('📡 [usePlanAvailability] Resposta da API:', data);

      console.log('✅ [usePlanAvailability] RPC executado com sucesso');
      console.log('🔍 [usePlanAvailability] Resultado bruto:', data);
      console.log('🔍 [usePlanAvailability] Tipo de dados:', Array.isArray(data) ? 'Array' : typeof data);
      console.log('🔍 [usePlanAvailability] Quantidade de items:', data?.length || 0);
      
      if (data && data.length > 0) {
        console.log('🔍 [usePlanAvailability] Analisando TODOS os slots retornados:');
        data.forEach((slot: any, index: number) => {
          console.log(`   Slot ${index + 1}:`, {
            schedule_date: slot.schedule_date,
            day_of_week: slot.day_of_week,
            start_time: slot.start_time,
            end_time: slot.end_time,
            max_capacity: slot.max_capacity,
            current_bookings: slot.current_bookings,
            available_slots: slot.available_slots,
            is_available: slot.is_available
          });
        });
      } else {
        console.log('⚠️ [usePlanAvailability] Nenhum slot disponível retornado');
      }

      return data as PlanAvailabilitySlot[];
    },
    enabled: !!servicePlanId,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

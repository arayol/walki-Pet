
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface ServiceSchedule {
  id: string;
  service_plan_id: string;
  service_region_id: string;
  dia_semana: number;
  hora_inicio: string;
  hora_fim: string;
  capacidade_maxima: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateServiceScheduleData {
  service_plan_id: string;
  dia_semana: number;
  hora_inicio: string;
  hora_fim: string;
  capacidade_maxima: number;
}

export const useServiceSchedules = (servicePlanId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: schedules, isLoading } = useQuery({
    queryKey: ['service-schedules', servicePlanId],
    queryFn: async () => {
      if (!user || !servicePlanId) return [];

      console.log('🔄 [useServiceSchedules] Buscando horários para plano:', servicePlanId);

      try {
        const url = `/api/service-schedules?service_plan_id=${servicePlanId}`;
        console.log('🌐 [useServiceSchedules] URL:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          console.error('❌ [useServiceSchedules] Erro na requisição:', response.status);
          return [];
        }

        const data = await response.json();
        console.log('✅ [useServiceSchedules] Horários encontrados:', data.length);
        return data as ServiceSchedule[];
      } catch (error) {
        console.error('❌ [useServiceSchedules] Erro:', error);
        return [];
      }
    },
    enabled: !!user && !!servicePlanId,
  });

  const createScheduleMutation = useMutation({
    mutationFn: async (data: CreateServiceScheduleData) => {
      console.log('🔄 [useServiceSchedules] Criando horário:', data);
      
      const response = await fetch('/api/service-schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar horário');
      }

      const result = await response.json();
      console.log('✅ [useServiceSchedules] Horário criado:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-schedules'] });
      toast({
        title: "Horário adicionado!",
        description: "O horário foi cadastrado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível adicionar o horário",
        variant: "destructive",
      });
    },
  });

  const updateScheduleMutation = useMutation({
    mutationFn: async ({ scheduleId, data }: { scheduleId: string; data: Partial<ServiceSchedule> }) => {
      console.log('🔄 [useServiceSchedules] Atualizando horário:', { scheduleId, data });
      
      const response = await fetch(`/api/service-schedules/${scheduleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar horário');
      }

      const result = await response.json();
      console.log('✅ [useServiceSchedules] Horário atualizado:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-schedules'] });
      toast({
        title: "Horário atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar o horário",
        variant: "destructive",
      });
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: async (scheduleId: string) => {
      console.log('🔄 [useServiceSchedules] Deletando horário:', scheduleId);
      
      const response = await fetch(`/api/service-schedules/${scheduleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao deletar horário');
      }

      console.log('✅ [useServiceSchedules] Horário deletado');
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-schedules'] });
      toast({
        title: "Horário removido!",
        description: "O horário foi removido com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível remover o horário",
        variant: "destructive",
      });
    },
  });

  return {
    schedules: schedules || [],
    isLoading,
    createSchedule: createScheduleMutation.mutate,
    updateSchedule: updateScheduleMutation.mutate,
    deleteSchedule: deleteScheduleMutation.mutate,
    isCreating: createScheduleMutation.isPending,
    isUpdating: updateScheduleMutation.isPending,
    isDeleting: deleteScheduleMutation.isPending,
  };
};

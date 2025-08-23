
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
  service_region_id: string;
  dia_semana: number;
  hora_inicio: string;
  hora_fim: string;
  capacidade_maxima: number;
}

export const useServiceSchedules = (servicePlanId?: string, serviceRegionId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: schedules, isLoading } = useQuery({
    queryKey: ['service-schedules', servicePlanId, serviceRegionId],
    queryFn: async () => {
      if (!user || !servicePlanId) return [];

      // Return empty schedules for now - can be implemented with API later
      return [] as ServiceSchedule[];
    },
    enabled: !!user && !!servicePlanId,
  });

  const createScheduleMutation = useMutation({
    mutationFn: async (data: CreateServiceScheduleData) => {
      // Simulate successful creation for now - can be implemented with API later
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      return { id: `schedule-${Date.now()}`, ...data };
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
      // Simulate successful update for now - can be implemented with API later
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
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
      // Simulate successful deletion for now - can be implemented with API later
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
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

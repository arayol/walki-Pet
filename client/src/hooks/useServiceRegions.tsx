
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface ServiceRegion {
  id: string;
  service_plan_id: string;
  cep: string;
  raio_km: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateServiceRegionData {
  service_plan_id: string;
  cep: string;
  raio_km: number;
}

export const useServiceRegions = (servicePlanId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: regions, isLoading } = useQuery({
    queryKey: ['service-regions', servicePlanId],
    queryFn: async () => {
      if (!user || !servicePlanId) return [];

      const response = await fetch(`/api/service-plans/${servicePlanId}/regions`);
      if (!response.ok) {
        throw new Error('Failed to fetch service regions');
      }
      
      const regions = await response.json();
      console.log('📋 Loading service regions from PostgreSQL for plan:', servicePlanId, regions);
      return regions;
    },
    enabled: !!user && !!servicePlanId,
  });

  const createRegionMutation = useMutation({
    mutationFn: async (data: CreateServiceRegionData) => {
      if (!user) throw new Error('User not authenticated');

      const regionData = {
        service_plan_id: data.service_plan_id,
        cep: data.cep,
        raio_km: data.raio_km,
        is_active: true,
      };

      const response = await fetch('/api/service-regions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(regionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create region');
      }

      const result = await response.json();

      console.log('✅ Region saved to PostgreSQL:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-regions'] });
      toast({
        title: "Região adicionada!",
        description: "A região de atendimento foi cadastrada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível adicionar a região",
        variant: "destructive",
      });
    },
  });

  const deleteRegionMutation = useMutation({
    mutationFn: async (regionId: string) => {
      if (!user) throw new Error('User not authenticated');

      const response = await fetch(`/api/service-regions/${regionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete region');
      }

      const result = await response.json();

      console.log('✅ Region deleted from PostgreSQL:', regionId);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-regions'] });
      toast({
        title: "Região removida!",
        description: "A região de atendimento foi removida com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível remover a região",
        variant: "destructive",
      });
    },
  });

  const toggleRegionMutation = useMutation({
    mutationFn: async ({ regionId, isActive }: { regionId: string; isActive: boolean }) => {
      if (!user) throw new Error('User not authenticated');

      // Load existing regions and update the specified one
      const existingRegions = loadRegionsFromStorage(user.id);
      const regionIndex = existingRegions.findIndex(region => region.id === regionId);
      
      if (regionIndex === -1) {
        throw new Error('Region not found');
      }

      existingRegions[regionIndex] = {
        ...existingRegions[regionIndex],
        is_active: isActive,
        updated_at: new Date().toISOString(),
      };

      // Save back to localStorage
      saveRegionsToStorage(user.id, existingRegions);

      console.log('✅ Region updated in localStorage:', existingRegions[regionIndex]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-regions'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar a região",
        variant: "destructive",
      });
    },
  });

  return {
    regions: regions || [],
    isLoading,
    createRegion: createRegionMutation.mutate,
    deleteRegion: deleteRegionMutation.mutate,
    toggleRegion: toggleRegionMutation.mutate,
    isCreating: createRegionMutation.isPending,
    isDeleting: deleteRegionMutation.isPending,
  };
};

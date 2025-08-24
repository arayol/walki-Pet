import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Clock, Calendar, Users, Settings } from "lucide-react";
import { ServiceSchedulesManager } from "@/components/service-schedules/ServiceSchedulesManager";
import { DayTimeSelector } from "@/components/service-schedules/DayTimeSelector";
import { useServiceSchedules } from "@/hooks/useServiceSchedules";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ServicePlan {
  id: string;
  name: string;
  description: string;
  price: string;
  walk_count: number;
}

interface ServiceRegion {
  id: string;
  service_plan_id: string;
  cep: string;
  radius: number;
  name: string;
}

interface DayTimeSlot {
  days: number[];
  hora_inicio: string;
  hora_fim: string;
  capacidade_maxima: number;
}


export const AvailabilitySchedulesManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  
  // Buscar service plans do walker
  const { data: servicePlans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['service-plans', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      console.log('🔍 [AvailabilitySchedules] Buscando service plans para walker:', user.id);
      
      const response = await fetch(`/api/walkers/${user.id}/service-plans`);
      if (!response.ok) return [];
      
      const plans = await response.json();
      console.log('✅ [AvailabilitySchedules] Service plans encontrados:', plans.length);
      return plans;
    },
    enabled: !!user?.id,
  });

  // Buscar regions do plano selecionado
  const { data: serviceRegions = [], isLoading: regionsLoading } = useQuery({
    queryKey: ['service-regions', selectedPlan],
    queryFn: async () => {
      if (!selectedPlan) return [];
      
      console.log('🔍 [AvailabilitySchedules] Buscando regions para plano:', selectedPlan);
      
      const response = await fetch(`/api/service-plans/${selectedPlan}/regions`);
      if (!response.ok) return [];
      
      const regions = await response.json();
      console.log('✅ [AvailabilitySchedules] Regions encontradas:', regions.length);
      return regions;
    },
    enabled: !!selectedPlan,
  });

  // Hook para schedules do plano/região selecionados
  const { schedules, isLoading: schedulesLoading, createSchedule } = useServiceSchedules(
    selectedPlan, 
    selectedRegion
  );

  // Auto-selecionar primeiro plano se disponível
  useEffect(() => {
    if (servicePlans.length > 0 && !selectedPlan) {
      setSelectedPlan(servicePlans[0].id);
    }
  }, [servicePlans, selectedPlan]);

  // Auto-selecionar primeira região se disponível
  useEffect(() => {
    if (serviceRegions.length > 0 && !selectedRegion) {
      setSelectedRegion(serviceRegions[0].id);
    }
  }, [serviceRegions, selectedRegion]);

  const handleQuickAddSchedules = async (slots: DayTimeSlot[]) => {
    if (!selectedPlan || !selectedRegion) {
      toast({
        title: "Erro",
        description: "Selecione um plano e região primeiro",
        variant: "destructive",
      });
      return;
    }

    console.log('🔄 [AvailabilitySchedules] Adicionando horários rápidos:', slots);

    try {
      for (const slot of slots) {
        for (const day of slot.days) {
          await createSchedule({
            service_plan_id: selectedPlan,
            service_region_id: selectedRegion,
            dia_semana: day,
            hora_inicio: slot.hora_inicio,
            hora_fim: slot.hora_fim,
            capacidade_maxima: slot.capacidade_maxima,
          });
        }
      }
      
      setShowQuickAdd(false);
      toast({
        title: "Sucesso!",
        description: `${slots.reduce((acc, slot) => acc + slot.days.length, 0)} horários adicionados`,
      });
    } catch (error) {
      console.error('❌ [AvailabilitySchedules] Erro ao adicionar horários:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar os horários",
        variant: "destructive",
      });
    }
  };

  if (plansLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horários de Disponibilidade
          </CardTitle>
          <CardDescription>Carregando seus planos de serviço...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (servicePlans.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horários de Disponibilidade
          </CardTitle>
          <CardDescription>Configure os horários que você estará disponível para atender</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertDescription>
              Você precisa criar pelo menos um plano de serviço antes de configurar horários. 
              Vá para a página de <strong>Serviços</strong> para criar seus planos.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const selectedPlanData = servicePlans.find((p: ServicePlan) => p.id === selectedPlan);
  const selectedRegionData = serviceRegions.find((r: ServiceRegion) => r.id === selectedRegion);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horários de Disponibilidade
            </CardTitle>
            <CardDescription>
              Configure os horários que você estará disponível para cada plano e região
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowQuickAdd(true)}
              disabled={!selectedPlan || !selectedRegion}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Rápido
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Seletor de Plano */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Plano de Serviço</label>
          <div className="flex flex-wrap gap-2">
            {servicePlans.map((plan: ServicePlan) => (
              <Badge
                key={plan.id}
                variant={selectedPlan === plan.id ? "default" : "outline"}
                className="cursor-pointer p-2"
                onClick={() => {
                  setSelectedPlan(plan.id);
                  setSelectedRegion(""); // Reset region selection
                }}
                data-testid={`plan-badge-${plan.id}`}
              >
                <div className="text-center">
                  <div className="font-medium">{plan.name}</div>
                  <div className="text-xs opacity-70">R$ {plan.price}</div>
                </div>
              </Badge>
            ))}
          </div>
        </div>

        {/* Seletor de Região */}
        {selectedPlan && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Região de Atendimento</label>
            {regionsLoading ? (
              <div className="animate-pulse h-6 bg-gray-200 rounded w-1/3"></div>
            ) : serviceRegions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {serviceRegions.map((region: ServiceRegion) => (
                  <Badge
                    key={region.id}
                    variant={selectedRegion === region.id ? "default" : "outline"}
                    className="cursor-pointer p-2"
                    onClick={() => setSelectedRegion(region.id)}
                    data-testid={`region-badge-${region.id}`}
                  >
                    <div className="text-center">
                      <div className="font-medium">{region.name || `CEP ${region.cep}`}</div>
                      <div className="text-xs opacity-70">{region.radius}km</div>
                    </div>
                  </Badge>
                ))}
              </div>
            ) : (
              <Alert>
                <AlertDescription>
                  Nenhuma região configurada para este plano. Configure regiões na página de <strong>Serviços</strong>.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Gerenciador de Horários */}
        {selectedPlan && selectedRegion && selectedPlanData && selectedRegionData && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm">
                Configurando horários para <strong>{selectedPlanData.name}</strong> na região <strong>{selectedRegionData.name || `CEP ${selectedRegionData.cep}`}</strong>
              </span>
            </div>

            <ServiceSchedulesManager
              servicePlanId={selectedPlan}
              serviceRegionId={selectedRegion}
              servicePlanName={selectedPlanData.name}
              regionCep={selectedRegionData.cep}
            />

            {/* Resumo dos horários */}
            {schedules && schedules.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    Resumo dos Horários
                  </span>
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  {schedules.length} horário(s) configurado(s) • 
                  Total de {schedules.reduce((acc, s) => acc + (s.capacidade_maxima || 1), 0)} vaga(s) disponível(is)
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal de Adição Rápida */}
        <Dialog open={showQuickAdd} onOpenChange={setShowQuickAdd}>
          <DialogContent className="sm:max-w-2xl" aria-describedby="quick-add-description">
            <DialogHeader>
              <DialogTitle>Adicionar Horários Rapidamente</DialogTitle>
              <div id="quick-add-description" className="text-sm text-muted-foreground">
                Configure múltiplos horários de uma vez para {selectedPlanData?.name}
              </div>
            </DialogHeader>
            <DayTimeSelector
              onSave={handleQuickAddSchedules}
              onCancel={() => setShowQuickAdd(false)}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
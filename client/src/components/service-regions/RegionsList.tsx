
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, MapPin, Trash2, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useServiceRegions } from '@/hooks/useServiceRegions';
import { ServiceSchedulesManager } from '@/components/service-schedules/ServiceSchedulesManager';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface RegionsListProps {
  servicePlanId: string;
  servicePlanName: string;
  onAddRegion: () => void;
}

export const RegionsList = ({ servicePlanId, servicePlanName, onAddRegion }: RegionsListProps) => {
  const { regions, isLoading, deleteRegion, toggleRegion } = useServiceRegions(servicePlanId);
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());

  const toggleRegionExpansion = (regionId: string) => {
    const newExpanded = new Set(expandedRegions);
    if (newExpanded.has(regionId)) {
      newExpanded.delete(regionId);
    } else {
      newExpanded.add(regionId);
    }
    setExpandedRegions(newExpanded);
  };

  const handleDelete = (regionId: string) => {
    if (confirm('Tem certeza que deseja excluir esta região? Todos os horários serão perdidos.')) {
      deleteRegion(regionId);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Regiões Cadastradas ({regions.length})
        </h3>
        <Button onClick={onAddRegion} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nova Região
        </Button>
      </div>

      {regions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-muted-foreground">Nenhuma região cadastrada ainda.</p>
            <p className="text-sm text-muted-foreground">
              Adicione uma região para começar a configurar seus horários de atendimento.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {regions.map((region) => {
            const isExpanded = expandedRegions.has(region.id);
            
            return (
              <Card key={region.id} className={!region.is_active ? 'opacity-60' : ''}>
                <Collapsible>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-base">CEP: {region.cep}</CardTitle>
                          <Badge variant={region.is_active ? "default" : "secondary"}>
                            {region.is_active ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Raio de atendimento: {region.raio_km} km
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={region.is_active}
                          onCheckedChange={(checked) => 
                            toggleRegion({ regionId: region.id, isActive: checked })
                          }
                        />
                        
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleRegionExpansion(region.id)}
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Horários
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 ml-2" />
                            ) : (
                              <ChevronDown className="h-4 w-4 ml-2" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(region.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <ServiceSchedulesManager
                        servicePlanId={servicePlanId}
                        serviceRegionId={region.id}
                        servicePlanName={servicePlanName}
                        regionCep={region.cep}
                      />
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

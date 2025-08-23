
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, Users, Clock } from 'lucide-react';
import { ServiceSchedule, useServiceSchedules } from '@/hooks/useServiceSchedules';
import { useAvailableSlots } from '@/hooks/useAvailableSlots';
import { format } from 'date-fns';

interface ScheduleCardProps {
  schedule: ServiceSchedule;
  servicePlanId: string;
  serviceRegionId: string;
}

export const ScheduleCard = ({ schedule, servicePlanId, serviceRegionId }: ScheduleCardProps) => {
  const [isToggling, setIsToggling] = useState(false);
  const { updateSchedule, deleteSchedule } = useServiceSchedules(servicePlanId, serviceRegionId);
  
  // Verificar disponibilidade para hoje
  const today = format(new Date(), 'yyyy-MM-dd');
  const { data: availableSlots } = useAvailableSlots(schedule.id, today);

  const handleToggleActive = async () => {
    setIsToggling(true);
    try {
      await updateSchedule({
        scheduleId: schedule.id,
        data: { is_active: !schedule.is_active }
      });
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir este horário?')) {
      deleteSchedule(schedule.id);
    }
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5); // Remove os segundos
  };

  return (
    <Card className={`transition-all duration-200 ${!schedule.is_active ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {formatTime(schedule.hora_inicio)} - {formatTime(schedule.hora_fim)}
              </span>
              <Badge variant={schedule.is_active ? "default" : "secondary"}>
                {schedule.is_active ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Capacidade: {schedule.capacidade_maxima}</span>
              </div>
              
              {availableSlots !== undefined && (
                <div className="flex items-center gap-1">
                  <span>Disponível hoje: {availableSlots}</span>
                  {availableSlots === 0 && (
                    <Badge variant="destructive" className="text-xs">
                      Lotado
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={schedule.is_active}
              onCheckedChange={handleToggleActive}
              disabled={isToggling}
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

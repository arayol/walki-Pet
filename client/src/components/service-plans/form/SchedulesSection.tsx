import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Clock, Trash2, Edit2, CalendarDays } from "lucide-react";
import { DayTimeSelector } from "@/components/service-schedules/DayTimeSelector";
import { useServiceSchedules } from "@/hooks/useServiceSchedules";

interface SchedulesSectionProps {
  servicePlanId?: string; // Optional for new plans
  servicePlanName: string;
}

interface DayTimeSlot {
  days: number[];
  hora_inicio: string;
  hora_fim: string;
  capacidade_maxima: number;
}

const DIAS_SEMANA = [
  { value: 1, label: 'Seg' },
  { value: 2, label: 'Ter' },
  { value: 3, label: 'Qua' },
  { value: 4, label: 'Qui' },
  { value: 5, label: 'Sex' },
  { value: 6, label: 'Sáb' },
  { value: 7, label: 'Dom' },
];

export const SchedulesSection = ({ servicePlanId, servicePlanName }: SchedulesSectionProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { schedules = [], createSchedule, deleteSchedule, isCreating } = useServiceSchedules(servicePlanId);

  const getDayLabel = (dayNumber: number) => {
    const day = DIAS_SEMANA.find(d => d.value === dayNumber);
    return day ? day.label : dayNumber.toString();
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5); // Remove seconds if present
  };

  const handleAddSchedules = async (slots: DayTimeSlot[]) => {
    if (!servicePlanId) {
      console.error('Service plan ID required to create schedules');
      return;
    }

    try {
      for (const slot of slots) {
        for (const day of slot.days) {
          await createSchedule({
            service_plan_id: servicePlanId,
            dia_semana: day,
            hora_inicio: slot.hora_inicio,
            hora_fim: slot.hora_fim,
            capacidade_maxima: slot.capacidade_maxima,
          });
        }
      }
      setShowAddForm(false);
    } catch (error) {
      console.error('Erro ao criar horários:', error);
    }
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    if (confirm('Tem certeza que deseja excluir este horário?')) {
      deleteSchedule(scheduleId);
    }
  };

  const groupedSchedules = schedules.reduce((acc, schedule) => {
    const key = `${schedule.hora_inicio}-${schedule.hora_fim}-${schedule.capacidade_maxima}`;
    if (!acc[key]) {
      acc[key] = {
        hora_inicio: schedule.hora_inicio,
        hora_fim: schedule.hora_fim,
        capacidade_maxima: schedule.capacidade_maxima,
        days: [],
        scheduleIds: []
      };
    }
    acc[key].days.push(schedule.dia_semana);
    acc[key].scheduleIds.push(schedule.id);
    return acc;
  }, {} as Record<string, any>);

  if (!servicePlanId) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-medium">Horários de Disponibilidade</h3>
        </div>
        
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Os horários poderão ser configurados após salvar o plano.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-medium">Horários de Disponibilidade</h3>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowAddForm(true)}
          disabled={isCreating}
          data-testid="add-schedule-button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Horário
        </Button>
      </div>

      <div className="space-y-3">
        {Object.keys(groupedSchedules).length === 0 ? (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Nenhum horário configurado ainda. Clique em "Adicionar Horário" para começar.
            </AlertDescription>
          </Alert>
        ) : (
          Object.values(groupedSchedules).map((group: any, index) => (
            <Card key={index} className="p-4">
              <CardContent className="p-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {formatTime(group.hora_inicio)} - {formatTime(group.hora_fim)}
                      </span>
                      <Badge variant="outline">
                        {group.capacidade_maxima} vaga{group.capacidade_maxima > 1 ? 's' : ''}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {group.days.sort().map((day: number) => (
                        <Badge key={day} variant="secondary" className="text-xs">
                          {getDayLabel(day)}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        group.scheduleIds.forEach((id: string) => handleDeleteSchedule(id));
                      }}
                      className="text-red-600 hover:text-red-800"
                      data-testid={`delete-schedule-group-${index}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        <p>
          <strong>💡 Dica:</strong> Os horários configurados aqui serão aplicados a todas as regiões deste plano.
          Clientes poderão agendar serviços nos horários disponíveis.
        </p>
      </div>

      {/* Modal para adicionar horários */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-2xl" aria-describedby="add-schedule-description">
          <DialogHeader>
            <DialogTitle>Configurar Horários</DialogTitle>
            <div id="add-schedule-description" className="text-sm text-muted-foreground">
              Configure os horários quando você estará disponível para o plano: <strong>{servicePlanName}</strong>
            </div>
          </DialogHeader>
          <DayTimeSelector
            onSave={handleAddSchedules}
            onCancel={() => setShowAddForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
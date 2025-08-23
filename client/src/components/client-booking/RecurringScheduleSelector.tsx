
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { format, addDays, startOfWeek, addWeeks, addMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ScheduleSlot {
  date: string;
  time: string;
  dayOfWeek: number;
}

interface RecurringScheduleSelectorProps {
  servicePlan: {
    id: string;
    name: string;
    walk_count: number;
    is_recurring: boolean;
    recurrence_type: "weekly" | "monthly" | null;
  };
  onScheduleChange: (slots: ScheduleSlot[]) => void;
  selectedSlots: ScheduleSlot[];
}

const DAYS_OF_WEEK = [
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
];

const TIME_OPTIONS = [
  "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00"
];

export const RecurringScheduleSelector = ({
  servicePlan,
  onScheduleChange,
  selectedSlots
}: RecurringScheduleSelectorProps) => {
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  const handleDayToggle = (dayValue: number) => {
    const newDays = selectedDays.includes(dayValue)
      ? selectedDays.filter(d => d !== dayValue)
      : [...selectedDays, dayValue];
    
    setSelectedDays(newDays);
  };

  const handleTimeToggle = (time: string) => {
    const newTimes = selectedTimes.includes(time)
      ? selectedTimes.filter(t => t !== time)
      : [...selectedTimes, time];
    
    setSelectedTimes(newTimes);
  };

  const generateScheduleSlots = () => {
    if (selectedDays.length === 0 || selectedTimes.length === 0) return [];

    const slots: ScheduleSlot[] = [];
    const today = new Date();
    const startDate = startOfWeek(today, { weekStartsOn: 1 }); // Segunda-feira

    // Gerar slots para os próximos 3 meses
    const endDate = addMonths(today, 3);
    
    if (servicePlan.recurrence_type === "weekly") {
      // Para planos semanais, gerar todas as semanas até o fim do período
      let currentWeek = startDate;
      
      while (currentWeek <= endDate) {
        selectedDays.forEach(dayOfWeek => {
          const slotDate = addDays(currentWeek, dayOfWeek === 0 ? 6 : dayOfWeek - 1);
          
          if (slotDate >= today && slotDate <= endDate) {
            selectedTimes.forEach(time => {
              slots.push({
                date: format(slotDate, "yyyy-MM-dd"),
                time,
                dayOfWeek
              });
            });
          }
        });
        
        currentWeek = addWeeks(currentWeek, 1);
      }
    } else {
      // Para planos mensais, gerar apenas as datas do mês atual
      const daysInMonth = selectedDays.length * selectedTimes.length;
      let currentDate = today;
      let slotsGenerated = 0;
      
      while (slotsGenerated < servicePlan.walk_count && currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        
        if (selectedDays.includes(dayOfWeek)) {
          selectedTimes.forEach(time => {
            if (slotsGenerated < servicePlan.walk_count) {
              slots.push({
                date: format(currentDate, "yyyy-MM-dd"),
                time,
                dayOfWeek
              });
              slotsGenerated++;
            }
          });
        }
        
        currentDate = addDays(currentDate, 1);
      }
    }

    return slots;
  };

  useEffect(() => {
    const slots = generateScheduleSlots();
    onScheduleChange(slots);
  }, [selectedDays, selectedTimes, servicePlan]);

  const totalSlotsNeeded = servicePlan.walk_count;
  const currentSlotsSelected = selectedDays.length * selectedTimes.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Configurar Agendamento Recorrente
          </CardTitle>
          <div className="text-sm text-gray-600">
            <p>Plano: <strong>{servicePlan.name}</strong></p>
            <p>
              {servicePlan.recurrence_type === "weekly" 
                ? `${servicePlan.walk_count} passeios por semana`
                : `${servicePlan.walk_count} passeios por mês`
              }
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Seleção de dias da semana */}
          <div>
            <h4 className="font-medium mb-3">Selecione os dias da semana:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <Button
                  key={day.value}
                  variant={selectedDays.includes(day.value) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDayToggle(day.value)}
                  className="justify-start"
                >
                  {day.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Seleção de horários */}
          <div>
            <h4 className="font-medium mb-3">Selecione os horários:</h4>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {TIME_OPTIONS.map((time) => (
                <Button
                  key={time}
                  variant={selectedTimes.includes(time) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTimeToggle(time)}
                  className="justify-center"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {time}
                </Button>
              ))}
            </div>
          </div>

          {/* Resumo da seleção */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Resumo da seleção:</span>
              <Badge variant={currentSlotsSelected === totalSlotsNeeded ? "default" : "destructive"}>
                {currentSlotsSelected} / {totalSlotsNeeded} slots
              </Badge>
            </div>
            
            {currentSlotsSelected !== totalSlotsNeeded && (
              <div className="flex items-center gap-2 text-amber-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>
                  {currentSlotsSelected < totalSlotsNeeded 
                    ? `Selecione mais ${totalSlotsNeeded - currentSlotsSelected} combinações de dia/horário`
                    : `Remova ${currentSlotsSelected - totalSlotsNeeded} combinações de dia/horário`
                  }
                </span>
              </div>
            )}

            {selectedSlots.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium mb-2">Próximos agendamentos:</p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {selectedSlots.slice(0, 8).map((slot, index) => (
                    <div key={index} className="text-xs bg-white p-2 rounded flex justify-between">
                      <span>{format(new Date(slot.date), "dd/MM/yyyy - EEEE", { locale: ptBR })}</span>
                      <span>{slot.time}</span>
                    </div>
                  ))}
                  {selectedSlots.length > 8 && (
                    <p className="text-xs text-gray-500 text-center">
                      + {selectedSlots.length - 8} agendamentos adicionais...
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

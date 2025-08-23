
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users } from "lucide-react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { usePlanAvailability, PlanAvailabilitySlot } from "@/hooks/usePlanAvailability";

interface SelectedSlot {
  date: string;
  time: string;
  dayOfWeek: number;
}

interface AvailabilityCalendarProps {
  servicePlanId: string;
  selectedSlots: SelectedSlot[];
  onSlotsChange: (slots: SelectedSlot[]) => void;
  maxSlots: number;
  planType: 'recurring' | 'single';
}

export const AvailabilityCalendar = ({
  servicePlanId,
  selectedSlots,
  onSlotsChange,
  maxSlots,
  planType
}: AvailabilityCalendarProps) => {
  const [selectedWeek, setSelectedWeek] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  const startDate = format(selectedWeek, 'yyyy-MM-dd');
  const endDate = format(addDays(selectedWeek, 30), 'yyyy-MM-dd');
  
  const { data: availability = [], isLoading } = usePlanAvailability(
    servicePlanId,
    startDate,
    endDate
  );

  console.log('🔍 [AvailabilityCalendar] Dados de disponibilidade:', availability.length, 'slots');

  // Agrupar slots por dia da semana
  const slotsByDay = useMemo(() => {
    const grouped: Record<number, PlanAvailabilitySlot[]> = {};
    
    availability.forEach(slot => {
      if (!grouped[slot.day_of_week]) {
        grouped[slot.day_of_week] = [];
      }
      grouped[slot.day_of_week].push(slot);
    });
    
    return grouped;
  }, [availability]);

  const weekDays = [
    { day: 1, name: 'Segunda', shortName: 'Seg' },
    { day: 2, name: 'Terça', shortName: 'Ter' },
    { day: 3, name: 'Quarta', shortName: 'Qua' },
    { day: 4, name: 'Quinta', shortName: 'Qui' },
    { day: 5, name: 'Sexta', shortName: 'Sex' },
    { day: 6, name: 'Sábado', shortName: 'Sáb' },
    { day: 7, name: 'Domingo', shortName: 'Dom' }
  ];

  const handleSlotSelect = (slot: PlanAvailabilitySlot) => {
    const newSlot: SelectedSlot = {
      date: slot.schedule_date,
      time: slot.start_time,
      dayOfWeek: slot.day_of_week
    };

    const isAlreadySelected = selectedSlots.some(
      s => s.date === newSlot.date && s.time === newSlot.time
    );

    if (isAlreadySelected) {
      // Remover slot
      const updatedSlots = selectedSlots.filter(
        s => !(s.date === newSlot.date && s.time === newSlot.time)
      );
      onSlotsChange(updatedSlots);
    } else {
      // Adicionar slot se não exceder o limite
      if (selectedSlots.length < maxSlots) {
        onSlotsChange([...selectedSlots, newSlot]);
      }
    }
  };

  const isSlotSelected = (slot: PlanAvailabilitySlot) => {
    return selectedSlots.some(
      s => s.date === slot.schedule_date && s.time === slot.start_time
    );
  };

  const canSelectSlot = (slot: PlanAvailabilitySlot) => {
    if (!slot.is_available) return false;
    if (planType === 'single' && slot.current_bookings > 0) return false;
    return true;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Carregando disponibilidade...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Horários Disponíveis
          </CardTitle>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Selecione até {maxSlots} horários por semana
            </p>
            <Badge variant="outline">
              {selectedSlots.length}/{maxSlots} selecionados
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weekDays.map(({ day, name, shortName }) => {
              const daySlots = slotsByDay[day] || [];
              
              return (
                <div key={day} className="border rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-3 text-center">
                    {name}
                  </h4>
                  
                  {daySlots.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-4">
                      Sem horários disponíveis
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {daySlots.map((slot, index) => {
                        const isSelected = isSlotSelected(slot);
                        const canSelect = canSelectSlot(slot);
                        const isDisabled = !canSelect || (selectedSlots.length >= maxSlots && !isSelected);
                        
                        return (
                          <Button
                            key={`${slot.schedule_date}-${slot.start_time}-${index}`}
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className={`w-full justify-between text-xs ${
                              isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            onClick={() => handleSlotSelect(slot)}
                            disabled={isDisabled}
                          >
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {slot.start_time.substring(0, 5)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{slot.available_slots}/{slot.max_capacity}</span>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

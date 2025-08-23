
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PlanAvailabilitySlot } from "@/hooks/usePlanAvailability";
import { SlotCard } from "./SlotCard";

interface SelectedDay {
  date: string;
  dayOfWeek: number;
  availableSlots: PlanAvailabilitySlot[];
}

interface SelectedSlot {
  date: string;
  time: string;
  dayOfWeek: number;
}

interface TimeSlotSelectorProps {
  selectedDays: SelectedDay[];
  selectedSlots: SelectedSlot[];
  onSlotsChange: (slots: SelectedSlot[]) => void;
  maxSlots: number;
}

export const TimeSlotSelector = ({
  selectedDays,
  selectedSlots,
  onSlotsChange,
  maxSlots
}: TimeSlotSelectorProps) => {
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
      const updatedSlots = selectedSlots.filter(
        s => !(s.date === newSlot.date && s.time === newSlot.time)
      );
      onSlotsChange(updatedSlots);
    } else {
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

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Selecionar Horários
        </CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Escolha um horário para cada dia selecionado
          </p>
          <Badge variant="outline" className="animate-pulse">
            {selectedSlots.length}/{maxSlots} horários
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {selectedDays.map((day) => (
            <div key={day.date} className="border rounded-lg p-4 bg-gradient-to-r from-gray-50 to-white animate-in slide-in-from-left-4">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <span>
                  {format(new Date(day.date), 'EEEE, dd/MM/yyyy', { locale: ptBR })}
                </span>
                {selectedSlots.some(s => s.date === day.date) && (
                  <CheckCircle className="h-4 w-4 text-green-600 animate-in zoom-in-50" />
                )}
              </h4>
              
              {day.availableSlots.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum horário disponível para este dia</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {day.availableSlots.map((slot, index) => {
                    const isSelected = isSlotSelected(slot);
                    const isDisabled = !isSelected && selectedSlots.length >= maxSlots;
                    
                    return (
                      <SlotCard
                        key={`${slot.schedule_date}-${slot.start_time}-${index}`}
                        slot={slot}
                        isSelected={isSelected}
                        isDisabled={isDisabled}
                        onSelect={() => handleSlotSelect(slot)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

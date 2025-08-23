
import { Calendar } from "lucide-react";
import { format, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DayCard } from "./DayCard";

interface WeekDay {
  date: string;
  dayOfWeek: number;
  slotsCount: number;
}

interface WeekGroupProps {
  weekStart: Date;
  days: WeekDay[];
  onDaySelect: (date: string, dayOfWeek: number) => void;
  isDaySelected: (date: string) => boolean;
  maxDays: number;
  selectedDaysCount: number;
}

export const WeekGroup = ({
  weekStart,
  days,
  onDaySelect,
  isDaySelected,
  maxDays,
  selectedDaysCount,
}: WeekGroupProps) => {
  return (
    <div className="animate-in slide-in-from-bottom-4">
      <h4 className="font-medium text-sm mb-4 text-gray-700 flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        Semana de {format(weekStart, 'dd/MM', { locale: ptBR })}
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {days.map((day) => {
          const isSelected = isDaySelected(day.date);
          const isDisabled = !isSelected && selectedDaysCount >= maxDays;
          
          return (
            <DayCard
              key={day.date}
              date={day.date}
              dayOfWeek={day.dayOfWeek}
              slotsCount={day.slotsCount}
              isSelected={isSelected}
              isDisabled={isDisabled}
              onSelect={() => onDaySelect(day.date, day.dayOfWeek)}
            />
          );
        })}
      </div>
    </div>
  );
};

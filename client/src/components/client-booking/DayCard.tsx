
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DayCardProps {
  date: string;
  dayOfWeek: number;
  slotsCount: number;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: () => void;
}

const weekDays = {
  1: 'Seg', 2: 'Ter', 3: 'Qua', 4: 'Qui', 
  5: 'Sex', 6: 'Sáb', 7: 'Dom'
};

export const DayCard = ({ 
  date, 
  dayOfWeek, 
  slotsCount, 
  isSelected, 
  isDisabled, 
  onSelect 
}: DayCardProps) => {
  const getStatusIcon = () => {
    if (slotsCount === 0) return <XCircle className="h-4 w-4 text-red-500" />;
    if (isSelected) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (isDisabled) return <Clock className="h-4 w-4 text-gray-400" />;
    return null;
  };

  const getCardStyle = () => {
    if (slotsCount === 0) return 'bg-red-50 border-red-300 text-red-500 cursor-not-allowed';
    if (isSelected) return 'bg-green-100 border-green-500 text-green-700 shadow-lg scale-105';
    if (isDisabled) return 'bg-gray-50 border-gray-300 text-gray-400 cursor-not-allowed';
    return 'bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:shadow-md hover:-translate-y-1';
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={`
        h-auto p-4 flex flex-col items-center gap-2 transition-all duration-300 transform
        ${getCardStyle()}
      `}
      onClick={onSelect}
      disabled={isDisabled || slotsCount === 0}
    >
      {/* Status Icon */}
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <span className="font-medium text-sm">
          {format(new Date(date), 'dd/MM', { locale: ptBR })}
        </span>
      </div>

      {/* Dia da semana */}
      <div className="text-xs opacity-75">
        {weekDays[dayOfWeek === 0 ? 7 : dayOfWeek as keyof typeof weekDays]}
      </div>

      {/* Badge de horários disponíveis */}
      {slotsCount > 0 && !isDisabled && (
        <Badge 
          variant={isSelected ? "secondary" : "outline"}
          className="text-xs px-2 py-0 h-5"
        >
          {slotsCount} horário{slotsCount !== 1 ? 's' : ''}
        </Badge>
      )}
    </Button>
  );
};

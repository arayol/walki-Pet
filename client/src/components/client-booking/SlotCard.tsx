
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, CheckCircle } from "lucide-react";
import { PlanAvailabilitySlot } from "@/hooks/usePlanAvailability";

interface SlotCardProps {
  slot: PlanAvailabilitySlot;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: () => void;
}

export const SlotCard = ({ slot, isSelected, isDisabled, onSelect }: SlotCardProps) => {
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      size="sm"
      className={`
        relative overflow-hidden transition-all duration-300 transform
        ${isSelected 
          ? 'bg-blue-600 text-white shadow-lg scale-105 border-blue-600' 
          : 'hover:shadow-md hover:-translate-y-0.5'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        min-h-[60px] flex flex-col justify-center p-3
      `}
      onClick={onSelect}
      disabled={isDisabled}
    >
      {/* Indicador de seleção */}
      {isSelected && (
        <div className="absolute top-1 right-1">
          <CheckCircle className="h-3 w-3 text-white" />
        </div>
      )}

      {/* Horário */}
      <div className="flex items-center gap-1 mb-1">
        <Clock className="h-3 w-3" />
        <span className="font-medium text-xs">
          {slot.start_time.substring(0, 5)}
        </span>
      </div>

      {/* Capacidade */}
      <div className="flex items-center gap-1">
        <Users className="h-3 w-3" />
        <span className="text-xs">
          {slot.available_slots}/{slot.max_capacity}
        </span>
      </div>

      {/* Badge de disponibilidade */}
      {slot.available_slots > 0 && !isSelected && (
        <Badge 
          variant="secondary" 
          className="absolute -top-1 -right-1 text-[10px] px-1 py-0 h-4 animate-pulse"
        >
          {slot.available_slots}
        </Badge>
      )}
    </Button>
  );
};

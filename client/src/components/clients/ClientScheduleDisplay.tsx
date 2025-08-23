
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";

interface ClientScheduleDisplayProps {
  preferredDays?: string[] | null;
  preferredTimes?: string[] | null;
  additionalNotes?: string | null;
}

export const ClientScheduleDisplay = ({ 
  preferredDays, 
  preferredTimes, 
  additionalNotes 
}: ClientScheduleDisplayProps) => {
  const hasScheduleInfo = (preferredDays && preferredDays.length > 0) || 
                         (preferredTimes && preferredTimes.length > 0) || 
                         additionalNotes;

  if (!hasScheduleInfo) {
    return null;
  }

  return (
    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
      <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
        <Calendar className="h-4 w-4 mr-1" />
        Preferências de Horário
      </h4>
      
      {preferredDays && preferredDays.length > 0 && (
        <div className="mb-2">
          <p className="text-xs text-blue-600 mb-1">Dias preferidos:</p>
          <div className="flex flex-wrap gap-1">
            {preferredDays.map((day, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {day}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {preferredTimes && preferredTimes.length > 0 && (
        <div className="mb-2">
          <p className="text-xs text-blue-600 mb-1 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Horários preferidos:
          </p>
          <div className="flex flex-wrap gap-1">
            {preferredTimes.map((time, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {time}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {additionalNotes && (
        <div>
          <p className="text-xs text-blue-600 mb-1">Observações:</p>
          <p className="text-xs text-gray-700">{additionalNotes}</p>
        </div>
      )}
    </div>
  );
};

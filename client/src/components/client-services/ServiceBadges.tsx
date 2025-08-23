
import { Badge } from "@/components/ui/badge";

interface ServiceBadgesProps {
  walkCount: number;
  recurrenceType?: string;
  isRecurring: boolean;
}

export const ServiceBadges = ({ walkCount, recurrenceType, isRecurring }: ServiceBadgesProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        {walkCount}x por {recurrenceType === "weekly" ? "semana" : "mês"}
      </Badge>
      {isRecurring && (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Plano Recorrente
        </Badge>
      )}
    </div>
  );
};

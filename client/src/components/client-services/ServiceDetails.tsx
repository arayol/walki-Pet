
import { Calendar, Clock } from "lucide-react";

interface ServiceDetailsProps {
  walkCount: number;
  duration?: string;
}

export const ServiceDetails = ({ walkCount, duration }: ServiceDetailsProps) => {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-600">
      <div className="flex items-center">
        <Calendar className="h-4 w-4 mr-1" />
        <span>{walkCount} passeio{walkCount > 1 ? 's' : ''}</span>
      </div>
      {duration && (
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>{duration}</span>
        </div>
      )}
    </div>
  );
};

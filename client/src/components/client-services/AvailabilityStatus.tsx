
import { Users } from "lucide-react";

interface AvailabilityStatusProps {
  totalSlots: number;
}

export const AvailabilityStatus = ({ totalSlots }: AvailabilityStatusProps) => {
  const getAvailabilityStatus = () => {
    if (totalSlots === 0) return { color: "bg-red-500", text: "Esgotado", textColor: "text-red-700" };
    if (totalSlots <= 2) return { color: "bg-yellow-500", text: "Poucas vagas", textColor: "text-yellow-700" };
    return { color: "bg-green-500", text: "Disponível", textColor: "text-green-700" };
  };

  const availability = getAvailabilityStatus();

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${availability.color}`}></div>
      <span className={`text-xs font-medium ${availability.textColor}`}>
        {availability.text}
      </span>
    </div>
  );
};

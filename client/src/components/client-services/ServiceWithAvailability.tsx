
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { ServicePlanWithAvailability } from "@/types/service";
import { AvailabilityStatus } from "./AvailabilityStatus";
import { ServiceDetails } from "./ServiceDetails";
import { AvailabilitySlots } from "./AvailabilitySlots";
import { IncludedServices } from "./IncludedServices";
import { ServiceBadges } from "./ServiceBadges";

interface ServiceWithAvailabilityProps {
  service: ServicePlanWithAvailability;
  onSelect: () => void;
}

export const ServiceWithAvailability = ({ service, onSelect }: ServiceWithAvailabilityProps) => {
  console.log('🔍 ServiceWithAvailability: Rendering service:', service);
  
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);

  const getRecurrenceText = () => {
    if (!service.is_recurring) return "Serviço avulso";
    return service.recurrence_type === "weekly" ? "Por semana" : "Por mês";
  };

  const getTotalAvailableSlots = () => {
    return service.available_regions.reduce((total, region) => total + region.available_slots, 0);
  };

  const totalSlots = getTotalAvailableSlots();

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200 relative">
      <AvailabilityStatus totalSlots={totalSlots} />

      <CardHeader className="pb-4">
        <div className="flex justify-between items-start pr-20">
          <div className="flex-1">
            <CardTitle className="text-xl text-gray-900 mb-2">
              {service.name}
            </CardTitle>
            <ServiceDetails walkCount={service.walk_count} duration={service.duration} />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(service.price)}
            </div>
            <div className="text-sm text-gray-500">
              {getRecurrenceText()}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <AvailabilitySlots 
          availableRegions={service.available_regions} 
          totalSlots={totalSlots} 
        />

        <ServiceBadges 
          walkCount={service.walk_count}
          recurrenceType={service.recurrence_type}
          isRecurring={service.is_recurring}
        />

        {service.description && (
          <div className="mb-4">
            <p className="text-gray-600 text-sm leading-relaxed">
              {service.description}
            </p>
          </div>
        )}

        <IncludedServices
          includesPlaytime={service.includes_playtime}
          includesFeeding={service.includes_feeding}
          includesGrooming={service.includes_grooming}
          includesBath={service.includes_bath}
        />

        <Button
          onClick={onSelect}
          disabled={totalSlots === 0}
          className={`w-full font-semibold py-3 rounded-lg transition-all duration-200 ${
            totalSlots === 0 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white group-hover:scale-[1.02]"
          }`}
        >
          <Heart className="h-4 w-4 mr-2" />
          {totalSlots === 0 ? "Sem vagas disponíveis" : "Selecionar Este Serviço"}
        </Button>
      </CardContent>
    </Card>
  );
};

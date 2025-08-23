
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Calendar, 
  Clock, 
  Scissors, 
  Utensils, 
  Bath,
  ChevronDown,
  ChevronUp 
} from "lucide-react";

interface ServicePlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration?: string;
  includes_playtime: boolean;
  includes_feeding: boolean;
  includes_grooming: boolean;
  includes_bath: boolean;
  walk_count: number;
  is_recurring: boolean;
  recurrence_type?: string;
  preferred_days?: string[];
  image_url?: string;
}

interface ServiceCardProps {
  service: ServicePlan;
  onSelect: () => void;
}

export const ServiceCard = ({ service, onSelect }: ServiceCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);

  const getRecurrenceText = () => {
    if (!service.is_recurring) return "Serviço avulso";
    return service.recurrence_type === "weekly" ? "Por semana" : "Por mês";
  };

  const getIncludedServices = () => {
    const included = [];
    if (service.includes_playtime) included.push({ icon: Heart, text: "Brincadeiras" });
    if (service.includes_feeding) included.push({ icon: Utensils, text: "Alimentação" });
    if (service.includes_grooming) included.push({ icon: Scissors, text: "Cuidados básicos" });
    if (service.includes_bath) included.push({ icon: Bath, text: "Banho" });
    return included;
  };

  const includedServices = getIncludedServices();

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl text-gray-900 mb-2">
              {service.name}
            </CardTitle>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{service.walk_count} passeio{service.walk_count > 1 ? 's' : ''}</span>
              </div>
              {service.duration && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{service.duration}</span>
                </div>
              )}
            </div>
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
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {service.walk_count}x por {service.recurrence_type === "weekly" ? "semana" : "mês"}
          </Badge>
          {service.is_recurring && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Plano Recorrente
            </Badge>
          )}
        </div>

        {/* Description */}
        {service.description && (
          <div className="mb-4">
            <p className="text-gray-600 text-sm leading-relaxed">
              {service.description}
            </p>
          </div>
        )}

        {/* Included Services */}
        {includedServices.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              <span>Serviços inclusos ({includedServices.length})</span>
              {showDetails ? (
                <ChevronUp className="h-4 w-4 ml-1" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-1" />
              )}
            </button>
            
            {showDetails && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {includedServices.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <Icon className="h-4 w-4 mr-2 text-blue-500" />
                      <span>{item.text}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Preferred Days */}
        {service.preferred_days && service.preferred_days.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Dias sugeridos:</p>
            <div className="flex flex-wrap gap-1">
              {service.preferred_days.map((day, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {day}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Select Button */}
        <Button
          onClick={onSelect}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 group-hover:scale-[1.02]"
        >
          <Heart className="h-4 w-4 mr-2" />
          Selecionar Este Serviço
        </Button>
      </CardContent>
    </Card>
  );
};


import { ServiceCard } from "./ServiceCard";

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

interface ServicesListProps {
  services: ServicePlan[];
  onServiceSelect: (service: ServicePlan) => void;
}

export const ServicesList = ({ services, onServiceSelect }: ServicesListProps) => {
  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🐕</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum serviço disponível
          </h3>
          <p className="text-gray-600">
            Este dog walker ainda não cadastrou seus serviços. 
            Entre em contato diretamente para combinar um atendimento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onSelect={() => onServiceSelect(service)}
        />
      ))}
    </div>
  );
};


import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ServiceWithAvailability } from "@/components/client-services/ServiceWithAvailability";
import { ServicePlanWithAvailability } from "@/types/service";

interface ServicesSectionProps {
  services: ServicePlanWithAvailability[];
  onServiceSelect: (service: ServicePlanWithAvailability) => void;
}

export const ServicesSection = ({ services, onServiceSelect }: ServicesSectionProps) => {
  console.log('🔍 ServicesSection: Rendering with services:', services);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços Disponíveis</CardTitle>
        <CardDescription>
          Escolha o serviço que melhor atende às necessidades do seu pet
        </CardDescription>
      </CardHeader>
      <CardContent>
        {services.length === 0 ? (
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <ServiceWithAvailability
                key={service.id}
                service={service}
                onSelect={() => onServiceSelect(service)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

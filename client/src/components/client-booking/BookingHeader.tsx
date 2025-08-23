
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ServicePlan {
  id: string;
  name: string;
  price: number;
  walk_count: number;
  is_recurring: boolean;
  description?: string;
}

interface BookingHeaderProps {
  servicePlan: ServicePlan;
}

export const BookingHeader = ({ servicePlan }: BookingHeaderProps) => {
  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl">Configurar Agendamento</CardTitle>
        <div className="text-sm text-gray-600">
          <p>Serviço: <strong>{servicePlan.name}</strong></p>
          <p>Passeios: <strong>{servicePlan.walk_count} por {servicePlan.is_recurring ? 'mês' : 'vez'}</strong></p>
          {servicePlan.description && (
            <p className="mt-2">{servicePlan.description}</p>
          )}
        </div>
      </CardHeader>
    </Card>
  );
};


import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, ChevronDown, ChevronUp } from "lucide-react";
import { ServicePlanCard } from "./ServicePlanCard";

interface ServicePlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  walk_count: number;
  is_recurring: boolean;
  recurrence_type?: string;
  includes_bath: boolean;
  includes_grooming: boolean;
  includes_feeding: boolean;
  includes_playtime: boolean;
}

interface ServicePlansSectionProps {
  servicePlans: ServicePlan[];
  onSelectPlan: () => void;
}

export const ServicePlansSection = ({ servicePlans, onSelectPlan }: ServicePlansSectionProps) => {
  const [showAllPlans, setShowAllPlans] = useState(false);

  const visiblePlans = showAllPlans ? servicePlans : servicePlans.slice(0, 6);
  const hasMorePlans = servicePlans.length > 6;

  if (servicePlans.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-6 w-6 mr-2 text-blue-500" />
            Planos de Serviço
          </CardTitle>
          <CardDescription>Escolha o plano ideal para seu pet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum plano disponível no momento.</p>
            <p className="text-sm text-gray-400 mt-2">Este walker ainda não cadastrou seus planos de serviço.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="h-6 w-6 mr-2 text-blue-500" />
          Planos de Serviço
        </CardTitle>
        <CardDescription>Escolha o plano ideal para seu pet</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Grid de Planos - Responsivo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visiblePlans.map((plan) => (
              <ServicePlanCard
                key={plan.id}
                plan={plan}
                onSelectPlan={onSelectPlan}
              />
            ))}
          </div>

          {/* Botão Ver Mais/Menos */}
          {hasMorePlans && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAllPlans(!showAllPlans)}
                className="flex items-center gap-2"
              >
                {showAllPlans ? (
                  <>
                    Ver Menos
                    <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Ver Mais Planos ({servicePlans.length - 6})
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

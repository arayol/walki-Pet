import { ServicePlanCard } from "./ServicePlanCard";
import { ServicePlansEmptyState } from "./ServicePlansEmptyState";
import { ServicePlansLoading } from "./ServicePlansLoading";
import { ServicePlan } from "@/apps/walker/pages/ServicePlans";

interface ServicePlansListProps {
  plans: ServicePlan[];
  isLoading: boolean;
  onEditPlan: (plan: ServicePlan) => void;
  onRefetch: () => void;
}

export const ServicePlansList = ({
  plans,
  isLoading,
  onEditPlan,
  onRefetch
}: ServicePlansListProps) => {
  if (isLoading) {
    return <ServicePlansLoading />;
  }

  if (plans.length === 0) {
    return <ServicePlansEmptyState />;
  }

  // Separar planos ativos e inativos
  const activePlans = plans.filter(plan => plan.is_active);
  const inactivePlans = plans.filter(plan => !plan.is_active);

  return (
    <div className="space-y-8">
      {/* Planos Ativos */}
      {activePlans.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Planos Ativos ({activePlans.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePlans.map((plan) => (
              <ServicePlanCard
                key={plan.id}
                plan={plan}
                onEdit={onEditPlan}
                onRefetch={onRefetch}
              />
            ))}
          </div>
        </div>
      )}

      {/* Planos Inativos */}
      {inactivePlans.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-500 mb-6">
            Planos Inativos ({inactivePlans.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inactivePlans.map((plan) => (
              <ServicePlanCard
                key={plan.id}
                plan={plan}
                onEdit={onEditPlan}
                onRefetch={onRefetch}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

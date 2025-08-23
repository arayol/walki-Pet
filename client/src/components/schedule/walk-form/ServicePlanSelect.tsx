import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ServicePlan } from "./types";

interface ServicePlanSelectProps {
  servicePlans: ServicePlan[];
  value: string;
  onChange: (value: string) => void;
  onPlanSelect: (plan: ServicePlan) => void;
}

export const ServicePlanSelect = ({ servicePlans, value, onChange, onPlanSelect }: ServicePlanSelectProps) => {
  const handleChange = (planId: string) => {
    onChange(planId);
    const selectedPlan = servicePlans.find(plan => plan.id === planId);
    if (selectedPlan) {
      onPlanSelect(selectedPlan);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="service_plan_id">Plano de Serviço *</Label>
      <Select value={value} onValueChange={handleChange} required>
        <SelectTrigger>
          <SelectValue placeholder="Selecione um plano" />
        </SelectTrigger>
        <SelectContent>
          {servicePlans.map((plan) => (
            <SelectItem key={plan.id} value={plan.id}>
              {plan.name} - R$ {plan.price.toFixed(2)} ({plan.walk_count} passeio{plan.walk_count > 1 ? 's' : ''})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
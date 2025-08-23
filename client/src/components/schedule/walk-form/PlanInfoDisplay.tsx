import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ServicePlan } from "./types";

interface PlanInfoDisplayProps {
  plan: ServicePlan | null;
}

export const PlanInfoDisplay = ({ plan }: PlanInfoDisplayProps) => {
  if (!plan) return null;

  return (
    <Card className="bg-muted/50">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Preço (R$)</Label>
            <div className="text-lg font-semibold">
              R$ {plan.price.toFixed(2)}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Quantidade de Passeios</Label>
            <div className="text-lg font-semibold">
              {plan.walk_count} passeio{plan.walk_count > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
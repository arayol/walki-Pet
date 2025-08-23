
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { ServicePlanForm } from "./types";

interface ServicesSectionProps {
  form: ServicePlanForm;
  walkCount: number;
  onIncrementWalkCount: () => void;
  onDecrementWalkCount: () => void;
  onWalkCountChange: (value: string) => void;
}

export const ServicesSection = ({ 
  form, 
  walkCount, 
  onIncrementWalkCount, 
  onDecrementWalkCount, 
  onWalkCountChange 
}: ServicesSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Serviços Inclusos</h3>
      
      <div className="space-y-2">
        <Label>Quantidade de passeios por semana *</Label>
        <div className="flex items-center gap-x-1.5 max-w-xs">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onDecrementWalkCount}
            disabled={walkCount <= 1}
            className="h-8 w-8 p-0"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={walkCount}
            onChange={(e) => onWalkCountChange(e.target.value)}
            min="1"
            max="50"
            className="h-8 text-center"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onIncrementWalkCount}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

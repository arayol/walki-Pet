
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ServicePlanForm } from "./types";

interface PricingSectionProps {
  form: ServicePlanForm;
}

export const PricingSection = ({ form }: PricingSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Preço</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Valor (R$) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            {...form.register("price")}
            placeholder="0.00"
          />
          {form.formState.errors.price && (
            <p className="text-sm text-red-600">{form.formState.errors.price.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Tipo de Cobrança</Label>
          <div className="flex items-center space-x-2">
            <Switch
              checked={form.watch("is_recurring")}
              onCheckedChange={(checked) => form.setValue("is_recurring", checked)}
            />
            <span className="text-sm">
              {form.watch("is_recurring") ? "Recorrente" : "Pagamento único"}
            </span>
          </div>
        </div>
      </div>

      {form.watch("is_recurring") && (
        <div className="space-y-2">
          <Label>Frequência</Label>
          <Select
            value={form.watch("recurrence_type") || ""}
            onValueChange={(value) => form.setValue("recurrence_type", value as "weekly" | "monthly")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a frequência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaymentMethodSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const PaymentMethodSelect = ({ value, onChange, disabled }: PaymentMethodSelectProps) => {
  return (
    <div className="space-y-2">
      <Label>Forma de Pagamento *</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione a forma de pagamento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="marketplace">Pagamento Online (Split)</SelectItem>
          <SelectItem value="direct">Pagamento Direto</SelectItem>
          <SelectItem value="cash">Dinheiro</SelectItem>
          <SelectItem value="pix">PIX</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DurationPriceFieldsProps {
  duration: string;
  price: string;
  onDurationChange: (duration: string) => void;
  onPriceChange: (price: string) => void;
}

export const DurationPriceFields = ({ duration, price, onDurationChange, onPriceChange }: DurationPriceFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="duration">Duração (minutos) *</Label>
        <Select value={duration} onValueChange={onDurationChange} required>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30 minutos</SelectItem>
            <SelectItem value="45">45 minutos</SelectItem>
            <SelectItem value="60">60 minutos</SelectItem>
            <SelectItem value="90">90 minutos</SelectItem>
            <SelectItem value="120">120 minutos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Preço (R$) *</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          min="0"
          required
          placeholder="0.00"
          value={price}
          onChange={(e) => onPriceChange(e.target.value)}
        />
      </div>
    </div>
  );
};

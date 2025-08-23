
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ServiceTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const ServiceTypeSelect = ({ value, onChange }: ServiceTypeSelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="service_type">Tipo de Serviço *</Label>
      <Select value={value} onValueChange={onChange} required>
        <SelectTrigger>
          <SelectValue placeholder="Selecione o serviço" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Passeio Simples">Passeio Simples</SelectItem>
          <SelectItem value="Passeio Longo">Passeio Longo</SelectItem>
          <SelectItem value="Cuidados Especiais">Cuidados Especiais</SelectItem>
          <SelectItem value="Visita Rápida">Visita Rápida</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

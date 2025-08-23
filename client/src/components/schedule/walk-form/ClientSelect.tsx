
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Client } from "./types";

interface ClientSelectProps {
  clients: Client[];
  value: string;
  onChange: (value: string) => void;
}

export const ClientSelect = ({ clients, value, onChange }: ClientSelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="client_id">Cliente/Pet *</Label>
      <Select value={value} onValueChange={onChange} required>
        <SelectTrigger>
          <SelectValue placeholder="Selecione um cliente" />
        </SelectTrigger>
        <SelectContent>
          {clients.map((client) => (
            <SelectItem key={client.client_id} value={client.client_id}>
              {client.pet_name} ({client.client_name})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

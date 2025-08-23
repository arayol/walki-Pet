
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface NotesFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const NotesField = ({ value, onChange }: NotesFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Observações</Label>
      <Textarea
        id="notes"
        rows={3}
        placeholder="Instruções especiais, local de encontro, etc..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

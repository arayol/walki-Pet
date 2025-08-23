
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  loading: boolean;
}

export const FormActions = ({ onCancel, loading }: FormActionsProps) => {
  return (
    <div className="flex justify-end space-x-3 pt-6 border-t">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit" disabled={loading}>
        {loading ? "Agendando..." : "Agendar Passeio"}
      </Button>
    </div>
  );
};

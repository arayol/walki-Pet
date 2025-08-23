
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BookingActionsProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
  isValidSelection: boolean;
  loading: boolean;
}

export const BookingActions = ({
  notes,
  onNotesChange,
  onCancel,
  onConfirm,
  isValidSelection,
  loading,
}: BookingActionsProps) => {
  return (
    <Card>
      <CardContent className="pt-4 sm:pt-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Instruções especiais, informações sobre o pet, etc..."
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              rows={3}
              className="text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              disabled={!isValidSelection || loading}
              className={`w-full sm:w-auto min-w-[120px] transition-all duration-300 ${
                isValidSelection 
                  ? 'bg-green-600 hover:bg-green-700 animate-pulse' 
                  : ''
              }`}
            >
              {loading ? "Processando..." : "Confirmar Agendamento"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

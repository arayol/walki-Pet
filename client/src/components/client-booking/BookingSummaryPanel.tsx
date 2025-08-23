
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SelectedSlot {
  date: string;
  time: string;
  dayOfWeek: number;
}

interface ServicePlan {
  id: string;
  name: string;
  price: number;
  walk_count: number;
  is_recurring: boolean;
  description?: string;
}

interface BookingSummaryPanelProps {
  servicePlan: ServicePlan;
  selectedSlots: SelectedSlot[];
  notes?: string;
  isComplete: boolean;
}

const dayNames = {
  1: 'Segunda-feira',
  2: 'Terça-feira',
  3: 'Quarta-feira',
  4: 'Quinta-feira',
  5: 'Sexta-feira',
  6: 'Sábado',
  7: 'Domingo'
};

export const BookingSummaryPanel = ({ 
  servicePlan, 
  selectedSlots, 
  notes,
  isComplete
}: BookingSummaryPanelProps) => {
  const sortedSlots = [...selectedSlots].sort((a, b) => {
    if (a.dayOfWeek !== b.dayOfWeek) {
      return a.dayOfWeek - b.dayOfWeek;
    }
    return a.time.localeCompare(b.time);
  });

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Resumo do Agendamento
          {isComplete && (
            <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informações do Plano */}
        <div>
          <h4 className="font-medium text-sm mb-2">Plano Selecionado</h4>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium">{servicePlan.name}</span>
              <Badge variant="secondary">
                {servicePlan.walk_count} passeios/mês
              </Badge>
            </div>
            {servicePlan.description && (
              <p className="text-sm text-gray-600 mb-2">
                {servicePlan.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{servicePlan.walk_count} passeios</span>
              <span>
                {servicePlan.is_recurring ? 'Plano Mensal' : 'Agendamento Único'}
              </span>
            </div>
          </div>
        </div>

        {/* Progresso da Seleção */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-sm">Progresso</h4>
            <Badge variant={isComplete ? "default" : "secondary"}>
              {selectedSlots.length}/{servicePlan.walk_count}
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(selectedSlots.length / servicePlan.walk_count) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {isComplete 
              ? "Seleção completa! Pronto para confirmar."
              : `Selecione mais ${servicePlan.walk_count - selectedSlots.length} horário${servicePlan.walk_count - selectedSlots.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>

        {/* Horários Selecionados */}
        {selectedSlots.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Horários Selecionados</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {sortedSlots.map((slot, index) => (
                <div 
                  key={`${slot.date}-${slot.time}-${index}`}
                  className="flex items-center justify-between bg-green-50 rounded-lg p-3 border border-green-200 animate-in slide-in-from-right-4"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div>
                      <span className="text-sm font-medium text-green-800">
                        {dayNames[slot.dayOfWeek as keyof typeof dayNames]}
                      </span>
                      <div className="text-xs text-green-600">
                        {format(new Date(slot.date), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-mono font-medium text-green-800">
                      {slot.time.substring(0, 5)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Observações */}
        {notes && (
          <div>
            <h4 className="font-medium text-sm mb-2">Observações</h4>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-700">{notes}</p>
            </div>
          </div>
        )}

        {/* Status */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Status:</span>
            <Badge variant={isComplete ? "default" : "secondary"}>
              {isComplete 
                ? "Pronto para confirmar" 
                : "Seleção incompleta"
              }
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

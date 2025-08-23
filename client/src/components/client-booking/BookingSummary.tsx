
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";
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

interface BookingSummaryProps {
  servicePlan: ServicePlan;
  selectedSlots: SelectedSlot[];
  notes?: string;
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

export const BookingSummary = ({ 
  servicePlan, 
  selectedSlots, 
  notes 
}: BookingSummaryProps) => {
  const sortedSlots = [...selectedSlots].sort((a, b) => {
    // Ordenar por dia da semana, depois por horário
    if (a.dayOfWeek !== b.dayOfWeek) {
      return a.dayOfWeek - b.dayOfWeek;
    }
    return a.time.localeCompare(b.time);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Resumo do Agendamento
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

        {/* Horários Selecionados */}
        {selectedSlots.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">
              Horários Selecionados ({selectedSlots.length}/{servicePlan.walk_count})
            </h4>
            <div className="space-y-2">
              {sortedSlots.map((slot, index) => (
                <div 
                  key={`${slot.date}-${slot.time}-${index}`}
                  className="flex items-center justify-between bg-blue-50 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">
                      {dayNames[slot.dayOfWeek as keyof typeof dayNames]}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
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
            <span className="text-sm font-medium">Status do agendamento:</span>
            <Badge variant={selectedSlots.length === servicePlan.walk_count ? "default" : "secondary"}>
              {selectedSlots.length === servicePlan.walk_count 
                ? "Pronto para confirmar" 
                : `${servicePlan.walk_count - selectedSlots.length} horários restantes`
              }
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

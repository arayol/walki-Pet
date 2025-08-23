
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface TimeSlotsProps {
  date: Date;
  availableSlots: string[];
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
}

export const TimeSlots = ({ date, availableSlots, selectedTime, onTimeSelect }: TimeSlotsProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (time: string) => {
    return `${time}h`;
  };

  const getTimeSlotStatus = (time: string) => {
    // Simular alguns horários como ocupados
    const busySlots = ['11:00', '15:00'];
    return busySlots.includes(time) ? 'busy' : 'available';
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-6 w-6 mr-2 text-blue-600" />
          Escolha o Horário
        </CardTitle>
        <p className="text-gray-600">
          {formatDate(date)}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {availableSlots.map((time) => {
              const status = getTimeSlotStatus(time);
              const isSelected = selectedTime === time;
              const isBusy = status === 'busy';
              
              return (
                <Button
                  key={time}
                  variant={isSelected ? "default" : "outline"}
                  disabled={isBusy}
                  onClick={() => onTimeSelect(time)}
                  className={`p-3 h-auto flex flex-col items-center ${
                    isSelected 
                      ? "bg-blue-600 hover:bg-blue-700" 
                      : isBusy 
                      ? "opacity-50 cursor-not-allowed" 
                      : "hover:bg-blue-50 hover:border-blue-300"
                  }`}
                >
                  <span className="font-semibold">{formatTime(time)}</span>
                  <span className="text-xs opacity-75">
                    {isBusy ? "Ocupado" : "Disponível"}
                  </span>
                </Button>
              );
            })}
          </div>

          {availableSlots.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum horário disponível
              </h3>
              <p className="text-gray-600">
                Não há horários disponíveis para esta data. 
                Tente selecionar outra data.
              </p>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Informações Importantes</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Os horários mostrados são baseados na disponibilidade do dog walker</li>
              <li>• Recomendamos agendar com pelo menos 24h de antecedência</li>
              <li>• Em caso de chuva, o passeio pode ser reagendado</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

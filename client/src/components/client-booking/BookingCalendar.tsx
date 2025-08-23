
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ServicePlan {
  id: string;
  name: string;
  preferred_days?: string[];
  is_recurring: boolean;
  recurrence_type?: string;
}

interface BookingCalendarProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date | null;
  service: ServicePlan;
}

export const BookingCalendar = ({ onDateSelect, selectedDate, service }: BookingCalendarProps) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);

  // Calcular próximo mês
  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
  
  // Simular dias indisponíveis (em uma implementação real, viria do backend)
  const unavailableDates = [
    new Date(2024, 11, 25), // Natal
    new Date(2024, 11, 31), // Ano novo
    new Date(2025, 5, 15),  // Exemplo junho 2025
  ];

  const isDateDisabled = (date: Date) => {
    // Não permitir datas passadas
    if (date < today) return true;
    
    // Verificar se a data está na lista de indisponíveis
    return unavailableDates.some(unavailable => 
      date.toDateString() === unavailable.toDateString()
    );
  };

  const getDayRecommendation = (date: Date) => {
    if (!service.preferred_days || service.preferred_days.length === 0) return null;
    
    const dayNames = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    const dayName = dayNames[date.getDay()];
    
    return service.preferred_days.includes(dayName) ? 'recommended' : null;
  };

  const handlePreviousMonth = () => {
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    if (prevMonth >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(prevMonth);
    }
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const canGoPrevious = currentMonth > new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Escolha a Data</span>
          {service.preferred_days && service.preferred_days.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <span className="text-sm text-gray-600 mr-2">Dias sugeridos:</span>
              {service.preferred_days.map((day, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {day}
                </Badge>
              ))}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-200 rounded-full mr-2"></div>
              <span>Dias recomendados</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-200 rounded-full mr-2"></div>
              <span>Disponível</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-200 rounded-full mr-2"></div>
              <span>Indisponível</span>
            </div>
          </div>

          {/* Navegação de Meses */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousMonth}
              disabled={!canGoPrevious}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Mês Anterior
            </Button>
            
            <div className="text-center">
              <span className="text-lg font-semibold">
                {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextMonth}
              className="flex items-center"
            >
              Próximo Mês
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Calendários dos dois meses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mês atual */}
            <div>
              <Calendar
                mode="single"
                selected={selectedDate || undefined}
                onSelect={(date) => date && onDateSelect(date)}
                disabled={isDateDisabled}
                month={currentMonth}
                className="rounded-md border [&_.rdp-nav]:hidden"
                modifiers={{
                  recommended: (date) => getDayRecommendation(date) === 'recommended'
                }}
                modifiersStyles={{
                  recommended: { backgroundColor: '#dcfce7', color: '#166534' }
                }}
              />
            </div>

            {/* Próximo mês */}
            <div>
              <Calendar
                mode="single"
                selected={selectedDate || undefined}
                onSelect={(date) => date && onDateSelect(date)}
                disabled={isDateDisabled}
                month={nextMonth}
                className="rounded-md border [&_.rdp-nav]:hidden"
                modifiers={{
                  recommended: (date) => getDayRecommendation(date) === 'recommended'
                }}
                modifiersStyles={{
                  recommended: { backgroundColor: '#dcfce7', color: '#166534' }
                }}
              />
            </div>
          </div>

          {service.is_recurring && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Plano Recorrente</h4>
              <p className="text-sm text-blue-700">
                Este é um plano {service.recurrence_type === 'weekly' ? 'semanal' : 'mensal'}. 
                Após a confirmação, os próximos agendamentos serão automaticamente criados 
                conforme a frequência do plano.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

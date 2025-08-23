
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, CheckCircle, ChevronDown, ChevronRight } from "lucide-react";
import { usePlanAvailability } from "@/hooks/usePlanAvailability";
import { useScheduleSlots, WeekDay, DayDate, TimeSlot } from "@/hooks/useScheduleSlots";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SelectedSlot {
  date: string;
  time: string;
  dayOfWeek: number;
}

interface DaySelectorProps {
  servicePlanId: string;
  selectedSlots: SelectedSlot[];
  onSlotsChange: (slots: SelectedSlot[]) => void;
  maxSlots: number;
  planType: 'recurring' | 'single';
}

export const DaySelector = ({
  servicePlanId,
  selectedSlots,
  onSlotsChange,
  maxSlots,
  planType
}: DaySelectorProps) => {
  const [openWeekDays, setOpenWeekDays] = useState<number[]>([]);
  const [openDates, setOpenDates] = useState<string[]>([]);
  
  console.log('🔄 [DaySelector] Componente inicializado com:', {
    servicePlanId,
    hasServicePlanId: !!servicePlanId,
    selectedSlots: selectedSlots.length,
    maxSlots,
    planType
  });
  
  // Buscar disponibilidade dos próximos 30 dias
  const startDate = new Date().toISOString().split('T')[0];
  const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  console.log('🔍 [DaySelector] Período de busca:', { startDate, endDate });
  
  const { data: availability = [], isLoading, error } = usePlanAvailability(
    servicePlanId,
    startDate,
    endDate
  );

  console.log('🔍 [DaySelector] Estado da query:', {
    isLoading,
    hasError: !!error,
    availabilityCount: availability.length,
    availability: availability.length > 0 ? availability.slice(0, 2) : 'empty' // mostrar apenas os 2 primeiros
  });

  // Processar dados em estrutura hierárquica
  const weekDays = useScheduleSlots(availability);
  
  console.log('🔍 [DaySelector] Dados processados em weekDays:', {
    weekDaysCount: weekDays.length,
    weekDays: weekDays.map(wd => ({
      dayOfWeek: wd.dayOfWeek,
      dayName: wd.dayName,
      datesCount: wd.dates.length
    }))
  });

  const toggleWeekDay = (dayOfWeek: number) => {
    setOpenWeekDays(prev => 
      prev.includes(dayOfWeek) 
        ? prev.filter(d => d !== dayOfWeek)
        : [...prev, dayOfWeek]
    );
  };

  const toggleDate = (dateKey: string) => {
    setOpenDates(prev => 
      prev.includes(dateKey) 
        ? prev.filter(d => d !== dateKey)
        : [...prev, dateKey]
    );
  };

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    console.log('🔍 [DaySelector] Selecionando horário:', {
      schedule_date: timeSlot.scheduleDate,
      start_time: timeSlot.time,
      day_of_week: timeSlot.dayOfWeek
    });

    const newSlot: SelectedSlot = {
      date: timeSlot.scheduleDate,
      time: timeSlot.time,
      dayOfWeek: timeSlot.dayOfWeek
    };

    const existingSlotIndex = selectedSlots.findIndex(
      s => s.date === newSlot.date && s.time === newSlot.time
    );

    if (existingSlotIndex >= 0) {
      // Remover se já está selecionado
      const updatedSlots = selectedSlots.filter((_, index) => index !== existingSlotIndex);
      onSlotsChange(updatedSlots);
    } else {
      // Adicionar se ainda há espaço
      if (selectedSlots.length < maxSlots) {
        onSlotsChange([...selectedSlots, newSlot]);
      }
    }
  };

  const isTimeSlotSelected = (timeSlot: TimeSlot) => {
    return selectedSlots.some(
      s => s.date === timeSlot.scheduleDate && s.time === timeSlot.time
    );
  };

  const isTimeSlotDisabled = (timeSlot: TimeSlot) => {
    return !isTimeSlotSelected(timeSlot) && selectedSlots.length >= maxSlots;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Carregando horários disponíveis...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Erro ao carregar disponibilidade</p>
            <p className="text-sm text-gray-500">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Selecionar Dias e Horários
        </CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Escolha {maxSlots} horários para os passeios
          </p>
          <Badge variant="outline" className="animate-pulse">
            {selectedSlots.length}/{maxSlots} selecionados
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {weekDays.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">Nenhum horário disponível encontrado</p>
            <p className="text-sm text-gray-400 mt-2">
              Verifique se existem horários configurados para este plano
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {weekDays.map((weekDay) => (
              <div key={weekDay.dayOfWeek} className="border rounded-lg overflow-hidden">
                {/* Cabeçalho do Dia da Semana */}
                <Collapsible 
                  open={openWeekDays.includes(weekDay.dayOfWeek)}
                  onOpenChange={() => toggleWeekDay(weekDay.dayOfWeek)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-4 h-auto text-left hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${
                          selectedSlots.some(s => s.dayOfWeek === weekDay.dayOfWeek) 
                            ? 'bg-blue-500' : 'bg-gray-300'
                        }`} />
                        <span className="font-medium text-base">{weekDay.dayName}</span>
                        <Badge variant="outline">
                          {weekDay.dates.length} {weekDay.dates.length === 1 ? 'data' : 'datas'}
                        </Badge>
                      </div>
                      {openWeekDays.includes(weekDay.dayOfWeek) ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="px-4 pb-4 space-y-3">
                      {weekDay.dates.map((dateInfo) => {
                        const dateKey = `${weekDay.dayOfWeek}-${dateInfo.date}`;
                        return (
                          <div key={dateKey} className="ml-6 border-l-2 border-gray-200 pl-4">
                            {/* Cabeçalho da Data */}
                            <Collapsible 
                              open={openDates.includes(dateKey)}
                              onOpenChange={() => toggleDate(dateKey)}
                            >
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="w-full justify-between p-3 h-auto text-left hover:bg-blue-50"
                                >
                                  <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium">{dateInfo.displayDate}</span>
                                    <Badge variant="secondary" className="text-xs">
                                      {dateInfo.totalSlots} vagas
                                    </Badge>
                                    {selectedSlots.some(s => s.date === dateInfo.date) && (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    )}
                                  </div>
                                  {openDates.includes(dateKey) ? 
                                    <ChevronDown className="h-4 w-4" /> : 
                                    <ChevronRight className="h-4 w-4" />
                                  }
                                </Button>
                              </CollapsibleTrigger>
                              
                              <CollapsibleContent>
                                <div className="ml-6 mt-3 space-y-2">
                                  <div className="flex items-center gap-2 mb-3">
                                    <Clock className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-medium text-gray-700">
                                      Horários disponíveis:
                                    </span>
                                  </div>
                                  
                                  {/* Lista de Horários */}
                                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                    {dateInfo.timeSlots.map((timeSlot) => {
                                      const isSelected = isTimeSlotSelected(timeSlot);
                                      const isDisabled = isTimeSlotDisabled(timeSlot);
                                      
                                      return (
                                        <Button
                                          key={`${dateInfo.date}-${timeSlot.time}`}
                                          variant={isSelected ? "default" : "outline"}
                                          size="sm"
                                          className={`
                                            relative transition-all duration-200 h-12 flex flex-col gap-1 p-2
                                            ${isSelected ? 'bg-blue-600 text-white shadow-md' : ''}
                                            ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}
                                          `}
                                          onClick={() => handleTimeSlotSelect(timeSlot)}
                                          disabled={isDisabled}
                                        >
                                          {isSelected && (
                                            <CheckCircle className="absolute top-1 right-1 h-3 w-3" />
                                          )}
                                          
                                          <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            <span className="text-xs font-medium">
                                              {timeSlot.displayTime}
                                            </span>
                                          </div>
                                          
                                          <div className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            <span className="text-xs">
                                              {timeSlot.availableSlots}
                                            </span>
                                          </div>
                                        </Button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

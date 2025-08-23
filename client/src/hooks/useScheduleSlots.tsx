
import { useMemo } from "react";
import { PlanAvailabilitySlot } from "./usePlanAvailability";

// Função para gerar horários em intervalos de 1 hora
const generateTimeSlots = (startTime: string, endTime: string): string[] => {
  const slots: string[] = [];
  
  // Parse das horas
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  let currentHour = startHour;
  let currentMinute = startMinute;
  
  while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
    const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}:00`;
    slots.push(timeString);
    
    // Incrementar em 1 hora
    currentHour += 1;
    if (currentHour >= 24) break;
  }
  
  return slots;
};

interface WeekDay {
  dayOfWeek: number;
  dayName: string;
  dates: DayDate[];
}

interface DayDate {
  date: string;
  displayDate: string;
  totalSlots: number;
  timeSlots: TimeSlot[];
}

interface TimeSlot {
  time: string;
  displayTime: string;
  availableSlots: number;
  scheduleDate: string;
  dayOfWeek: number;
}

export const useScheduleSlots = (availability: PlanAvailabilitySlot[]) => {
  return useMemo(() => {
    console.log('🔍 [useScheduleSlots] Processando availability:', availability);
    
    if (!availability || availability.length === 0) {
      console.log('❌ [useScheduleSlots] Nenhuma disponibilidade encontrada');
      return [];
    }

    // Agrupar por dia da semana
    const groupedByWeekDay: Record<number, PlanAvailabilitySlot[]> = {};
    
    availability.forEach(slot => {
      console.log('🔍 [useScheduleSlots] Processando slot:', {
        day_of_week: slot.day_of_week,
        schedule_date: slot.schedule_date,
        start_time: slot.start_time,
        end_time: slot.end_time,
        available_slots: slot.available_slots,
        is_available: slot.is_available
      });
      
      if (!groupedByWeekDay[slot.day_of_week]) {
        groupedByWeekDay[slot.day_of_week] = [];
      }
      groupedByWeekDay[slot.day_of_week].push(slot);
    });

    const weekDays: WeekDay[] = [];
    const dayNames = {
      1: 'Segunda-feira',
      2: 'Terça-feira', 
      3: 'Quarta-feira',
      4: 'Quinta-feira',
      5: 'Sexta-feira',
      6: 'Sábado',
      7: 'Domingo'
    };

    Object.entries(groupedByWeekDay).forEach(([dayOfWeek, slots]) => {
      const dayNum = parseInt(dayOfWeek);
      console.log(`🔍 [useScheduleSlots] Processando ${dayNames[dayNum as keyof typeof dayNames]}:`, slots.length, 'slots');
      
      // Agrupar por data
      const groupedByDate: Record<string, PlanAvailabilitySlot[]> = {};
      slots.forEach(slot => {
        if (!groupedByDate[slot.schedule_date]) {
          groupedByDate[slot.schedule_date] = [];
        }
        groupedByDate[slot.schedule_date].push(slot);
      });

      const dates: DayDate[] = [];
      
      Object.entries(groupedByDate).forEach(([date, dateSlots]) => {
        console.log(`🔍 [useScheduleSlots] Processando data ${date}:`, dateSlots.length, 'slots');
        
        // Para cada slot base, gerar todos os horários do intervalo
        const allTimeSlots: TimeSlot[] = [];
        
        dateSlots.forEach(baseSlot => {
          // Só incluir slots que têm vagas disponíveis
          if (baseSlot.available_slots > 0 && baseSlot.is_available) {
            const timeSlots = generateTimeSlots(baseSlot.start_time, baseSlot.end_time);
            console.log(`🔍 [useScheduleSlots] Horários gerados para ${date}:`, timeSlots);
            
            timeSlots.forEach(timeSlot => {
              allTimeSlots.push({
                time: timeSlot,
                displayTime: timeSlot.substring(0, 5), // HH:MM
                availableSlots: baseSlot.available_slots, // Usar vagas disponíveis da agenda
                scheduleDate: date,
                dayOfWeek: dayNum
              });
            });
          } else {
            console.log(`❌ [useScheduleSlots] Slot sem vagas para ${date}:`, {
              available_slots: baseSlot.available_slots,
              is_available: baseSlot.is_available
            });
          }
        });

        // Remover duplicatas e ordenar - só incluir slots com vagas
        const uniqueTimeSlots = allTimeSlots
          .filter((slot, index, self) => 
            index === self.findIndex(s => s.time === slot.time) && slot.availableSlots > 0
          )
          .sort((a, b) => a.time.localeCompare(b.time));

        console.log(`🔍 [useScheduleSlots] Horários únicos disponíveis para ${date}:`, uniqueTimeSlots);

        // Só incluir a data se há slots disponíveis
        if (uniqueTimeSlots.length > 0) {
          const displayDate = new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit'
          });

          dates.push({
            date,
            displayDate,
            totalSlots: uniqueTimeSlots.reduce((sum, slot) => sum + slot.availableSlots, 0),
            timeSlots: uniqueTimeSlots
          });
        }
      });

      // Ordenar datas e só incluir o dia da semana se há datas com slots
      if (dates.length > 0) {
        dates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        weekDays.push({
          dayOfWeek: dayNum,
          dayName: dayNames[dayNum as keyof typeof dayNames] || `Dia ${dayNum}`,
          dates
        });
      }
    });

    // Ordenar dias da semana
    weekDays.sort((a, b) => a.dayOfWeek - b.dayOfWeek);

    console.log('✅ [useScheduleSlots] Resultado final processado:', weekDays);
    return weekDays;
  }, [availability]);
};

export type { WeekDay, DayDate, TimeSlot };

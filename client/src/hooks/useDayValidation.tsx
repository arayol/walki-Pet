
import { useMemo } from "react";
import { PlanAvailabilitySlot } from "./usePlanAvailability";

interface SelectedDay {
  date: string;
  dayOfWeek: number;
  availableSlots: PlanAvailabilitySlot[];
}

interface DayValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const useDayValidation = (
  selectedDays: SelectedDay[],
  maxDays: number,
  planType: 'recurring' | 'single'
) => {
  return useMemo((): DayValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validar número de dias selecionados
    if (selectedDays.length === 0) {
      errors.push('Selecione pelo menos um dia para o agendamento');
    } else if (selectedDays.length > maxDays) {
      errors.push(`Máximo de ${maxDays} dias permitidos para este plano`);
    }

    // Validar se todos os dias têm horários disponíveis
    selectedDays.forEach((day, index) => {
      if (day.availableSlots.length === 0) {
        errors.push(`Dia ${day.date} não possui horários disponíveis`);
      }
    });

    // Para planos únicos, verificar se não há conflito de datas
    if (planType === 'single') {
      const uniqueDates = new Set(selectedDays.map(d => d.date));
      if (uniqueDates.size !== selectedDays.length) {
        errors.push('Não é possível selecionar o mesmo dia múltiplas vezes');
      }
    }

    // Avisos para otimização
    if (selectedDays.length < maxDays && selectedDays.length > 0) {
      warnings.push(`Você pode selecionar mais ${maxDays - selectedDays.length} dia(s)`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }, [selectedDays, maxDays, planType]);
};

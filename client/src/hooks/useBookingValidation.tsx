
import { useMutation } from "@tanstack/react-query";

export interface SelectedSlot {
  date: string;
  time: string;
  dayOfWeek: number;
}

export interface SlotValidation {
  date: string;
  time: string;
  is_valid: boolean;
  available_slots: number;
  message: string;
}

export interface ValidationResult {
  is_valid: boolean;
  error_message: string;
  slot_validations: SlotValidation[];
}

export const useBookingValidation = () => {
  return useMutation({
    mutationFn: async ({ 
      servicePlanId, 
      selectedSlots 
    }: {
      servicePlanId: string;
      selectedSlots: SelectedSlot[];
    }) => {
      console.log('🔍 [useBookingValidation] Validando slots:', selectedSlots);
      
      // Verificar se todos os slots têm data no formato correto
      const validatedSlots = selectedSlots.map(slot => {
        // Garantir que a data está no formato YYYY-MM-DD
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(slot.date)) {
          console.error('❌ [useBookingValidation] Data inválida:', slot.date);
          throw new Error(`Data inválida: ${slot.date}. Esperado formato YYYY-MM-DD`);
        }
        
        // Garantir que o time está no formato correto
        const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/;
        if (!timeRegex.test(slot.time)) {
          console.error('❌ [useBookingValidation] Horário inválido:', slot.time);
          throw new Error(`Horário inválido: ${slot.time}. Esperado formato HH:MM ou HH:MM:SS`);
        }

        return {
          date: slot.date,
          time: slot.time.length === 5 ? `${slot.time}:00` : slot.time // Garantir formato HH:MM:SS
        };
      });

      console.log('🔍 [useBookingValidation] Slots validados:', validatedSlots);

      // Primeira validação: verificar disponibilidade através da função get_plan_availability
      console.log('🔍 [useBookingValidation] Verificando disponibilidade dos slots...');
      
      for (let i = 0; i < validatedSlots.length; i++) {
        const slot = validatedSlots[i];
        console.log(`🔍 [useBookingValidation] Verificando slot ${i + 1}:`, slot);
        
        try {
          const response = await fetch(`/api/service-plans/${servicePlanId}/availability?start_date=${slot.date}&end_date=${slot.date}`);
          const availabilityData = await response.json();
          console.log(`🔍 [useBookingValidation] Disponibilidade para ${slot.date}:`, availabilityData);
          
          // Verificar se o horário específico está disponível
          const availableSlot = availabilityData?.find((av: any) => 
            av.schedule_date === slot.date && 
            slot.time >= av.start_time && 
            slot.time < av.end_time &&
            av.available_slots > 0
          );
          
          if (!availableSlot) {
            console.log(`❌ [useBookingValidation] Slot ${slot.date} às ${slot.time} não encontrado na disponibilidade`);
          } else {
            console.log(`✅ [useBookingValidation] Slot ${slot.date} às ${slot.time} disponível com ${availableSlot.available_slots} vagas`);
          }
        } catch (availabilityError) {
          console.error('❌ [useBookingValidation] Erro ao verificar disponibilidade:', availabilityError);
        }
      }

      // Executar a validação oficial
      const response = await fetch(`/api/service-plans/${servicePlanId}/validate-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          selected_slots: validatedSlots
        })
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }
      
      const data = await response.json();

      console.log('✅ [useBookingValidation] Resultado da validação:', data);
      
      // A API retorna um objeto diretamente, não um array
      const result = data;
      
      if (!result || typeof result !== 'object') {
        throw new Error('Erro na validação dos horários');
      }

      // Parse dos slot_validations do JSON para o tipo correto
      const parsedSlotValidations: SlotValidation[] = Array.isArray(result.slot_validations) 
        ? result.slot_validations.map((validation: any) => ({
            date: validation.date,
            time: validation.time,
            is_valid: validation.is_valid,
            available_slots: validation.available_slots,
            message: validation.message
          }))
        : [];

      console.log('🔍 [useBookingValidation] Validações dos slots individuais:', parsedSlotValidations);

      return {
        is_valid: result.is_valid,
        error_message: result.error_message,
        slot_validations: parsedSlotValidations
      } as ValidationResult;
    },
  });
};


import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
        
        const { data: availabilityData, error: availabilityError } = await supabase.rpc('get_plan_availability', {
          p_service_plan_id: servicePlanId,
          p_start_date: slot.date,
          p_end_date: slot.date
        });

        if (availabilityError) {
          console.error('❌ [useBookingValidation] Erro ao verificar disponibilidade:', availabilityError);
        } else {
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
        }
      }

      // Executar a validação oficial
      const { data, error } = await supabase.rpc('validate_booking_slots', {
        p_service_plan_id: servicePlanId,
        p_selected_slots: validatedSlots
      });

      if (error) {
        console.error('❌ [useBookingValidation] Erro:', error);
        throw error;
      }

      console.log('✅ [useBookingValidation] Resultado da validação:', data);
      
      // A função retorna um array, mas queremos o primeiro elemento
      const result = data && data.length > 0 ? data[0] : null;
      
      if (!result) {
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

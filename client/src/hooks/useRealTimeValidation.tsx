
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useBookingValidation } from "./useBookingValidation";
import { useToast } from "@/hooks/use-toast";

interface SelectedSlot {
  date: string;
  time: string;
  dayOfWeek: number;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  loading: boolean;
}

// Regex fora do componente para não recriar
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}(:\d{2})?$/;

export const useRealTimeValidation = (
  servicePlanId: string,
  selectedSlots: SelectedSlot[],
  enabled: boolean = true
) => {
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    errors: [],
    warnings: [],
    loading: false
  });
  
  const validationMutation = useBookingValidation();
  const { toast, dismiss } = useToast();
  
  // Use useRef para controle de estado e lifecycle
  const lastValidationKeyRef = useRef<string>("");
  const toastIdRef = useRef<string | undefined>();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup no unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
      // Cleanup toast se existir
      if (toastIdRef.current) {
        dismiss(toastIdRef.current);
      }
    };
  }, [dismiss]);

  // Chave de validação otimizada
  const validationKey = useMemo(() => {
    if (!enabled || !selectedSlots.length) return "";

    const validSlots = selectedSlots.filter(
      s => DATE_RE.test(s.date) && TIME_RE.test(s.time)
    );

    if (!validSlots.length) return "";
    
    // Evitar sort() mutável - criar nova array
    const sortable = [...validSlots].map(s => `${s.date}-${s.time}`).sort();
    return `${servicePlanId}-${sortable.join("|")}`;
  }, [servicePlanId, enabled, selectedSlots]);

  // Callback com dependências estáveis - não fecha sobre selectedSlots
  const validateSlots = useCallback(
    async (key: string, slots: SelectedSlot[]) => {
      console.log('🔍 [useRealTimeValidation] Iniciando validação para:', key);
      
      // Cancelar request anterior se existir
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Criar novo AbortController
      abortControllerRef.current = new AbortController();
      
      try {
        // Estado único com loading
        if (isMountedRef.current) {
          setValidation(prev => ({ ...prev, loading: true }));
        }

        const result = await validationMutation.mutateAsync({
          servicePlanId,
          selectedSlots: slots
        });

        // Verificar se ainda está montado antes de atualizar estado
        if (!isMountedRef.current) return;

        const errors: string[] = [];
        const warnings: string[] = [];

        if (!result.is_valid) {
          errors.push(result.error_message);
        }

        // Verificar slots individuais
        result.slot_validations.forEach(slot => {
          if (!slot.is_valid) {
            errors.push(`${slot.date} às ${slot.time}: ${slot.message}`);
          } else if (slot.available_slots <= 2) {
            warnings.push(`${slot.date} às ${slot.time}: Poucos horários restantes (${slot.available_slots})`);
          }
        });

        // Estado único final
        setValidation({
          isValid: result.is_valid,
          errors,
          warnings,
          loading: false
        });

        console.log('✅ [useRealTimeValidation] Validação concluída:', {
          isValid: result.is_valid,
          errorsCount: errors.length,
          warningsCount: warnings.length
        });

        // Toast idempotente - fechar anterior e abrir novo
        if (!result.is_valid && errors.length > 0) {
          // Fechar toast anterior se existir
          if (toastIdRef.current) {
            dismiss(toastIdRef.current);
          }

          const toastResult = toast({
            title: "Horários indisponíveis",
            description: "Alguns horários selecionados não estão mais disponíveis",
            variant: "destructive",
          });
          
          toastIdRef.current = toastResult.id;
        }

      } catch (error: any) {
        // Ignorar se foi cancelado
        if (error instanceof DOMException && error.name === 'AbortError') return;
        
        console.error('❌ [useRealTimeValidation] Erro na validação:', error);
        
        if (isMountedRef.current) {
          setValidation({
            isValid: false,
            errors: ['Erro ao validar horários'],
            warnings: [],
            loading: false
          });
        }
      }
    },
    [servicePlanId, validationMutation, toast, dismiss] // deps estáveis
  );

  // Effect com correção do loop infinito
  useEffect(() => {
    // Reset se não habilitado
    if (!enabled) {
      setValidation({
        isValid: true,
        errors: [],
        warnings: [],
        loading: false
      });
      lastValidationKeyRef.current = "";
      if (toastIdRef.current) {
        dismiss(toastIdRef.current);
        toastIdRef.current = undefined;
      }
      return;
    }

    // Se não há slots selecionados, reset sem erro
    if (!selectedSlots.length) {
      setValidation({
        isValid: true,
        errors: [],
        warnings: [],
        loading: false
      });
      lastValidationKeyRef.current = "";
      if (toastIdRef.current) {
        dismiss(toastIdRef.current);
        toastIdRef.current = undefined;
      }
      return;
    }

    // Se a chave não mudou, não fazer nada
    if (!validationKey || validationKey === lastValidationKeyRef.current) {
      return;
    }

    // Marcar a chave ANTES de qualquer async operation
    lastValidationKeyRef.current = validationKey;

    // Reiniciar debounce se necessário
    if (timerRef.current) clearTimeout(timerRef.current);

    // Capturar slots localmente para evitar closures
    const validSlots = selectedSlots.filter(
      s => DATE_RE.test(s.date) && TIME_RE.test(s.time)
    );

    // Agendar validação
    timerRef.current = setTimeout(() => {
      if (isMountedRef.current && validSlots.length > 0) {
        validateSlots(validationKey, validSlots);
      }
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [enabled, validationKey]); // deps mínimas e estáveis - removeido validateSlots

  return validation;
};

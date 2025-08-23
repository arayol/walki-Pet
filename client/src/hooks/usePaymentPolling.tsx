import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PaymentStatus {
  status: 'pending' | 'paid' | 'error';
  processed: boolean;
  message?: string;
  error?: string;
}

export const usePaymentPolling = (sessionId: string | null, enabled: boolean = false) => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({ 
    status: 'pending', 
    processed: false 
  });
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!sessionId || !enabled) return;

    let pollCount = 0;
    const maxPolls = 20; // 20 tentativas = 10 minutos (30s cada)
    
    setIsPolling(true);
    
    const checkPaymentStatus = async () => {
      try {
        console.log(`🔄 Verificando status do pagamento (tentativa ${pollCount + 1}/${maxPolls})`);
        
        const { data, error } = await supabase.functions.invoke('check-payment-status', {
          body: { sessionId }
        });

        if (error) {
          console.error('❌ Erro ao verificar pagamento:', error);
          setPaymentStatus({
            status: 'error',
            processed: false,
            error: error.message
          });
          setIsPolling(false);
          return;
        }

        console.log('📊 Status do pagamento:', data);
        
        if (data.status === 'paid' && data.processed) {
          console.log('✅ Pagamento confirmado!');
          setPaymentStatus({
            status: 'paid',
            processed: true,
            message: data.message
          });
          setIsPolling(false);
          return;
        }

        pollCount++;
        
        if (pollCount >= maxPolls) {
          console.log('⏰ Tempo limite de polling atingido');
          setPaymentStatus({
            status: 'error',
            processed: false,
            error: 'Tempo limite de verificação atingido. Verifique o status manualmente.'
          });
          setIsPolling(false);
          return;
        }

        // Continuar polling a cada 30 segundos
        setTimeout(checkPaymentStatus, 30000);
        
      } catch (error: any) {
        console.error('❌ Erro no polling:', error);
        setPaymentStatus({
          status: 'error',
          processed: false,
          error: error.message
        });
        setIsPolling(false);
      }
    };

    // Verificação inicial imediata
    checkPaymentStatus();

    // Cleanup
    return () => {
      setIsPolling(false);
    };
  }, [sessionId, enabled]);

  return {
    paymentStatus,
    isPolling
  };
};
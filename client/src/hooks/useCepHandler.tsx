
import { useState } from 'react';
import { useViaCEP } from './useViaCEP';
import { useToast } from '@/hooks/use-toast';

export const useCepHandler = () => {
  const [clientCep, setClientCep] = useState('');
  const [cepValidated, setCepValidated] = useState(false);
  const { fetchCEPData, formatCEP } = useViaCEP();
  const { toast } = useToast();

  const handleCepChange = (value: string) => {
    const formatted = formatCEP(value);
    setClientCep(formatted);
    setCepValidated(false);
    
    console.log('📝 CEP changed:', value, 'Formatted:', formatted);
  };

  const validateCep = async (): Promise<boolean> => {
    if (clientCep.length < 9) return false;
    
    const cleanCep = clientCep.replace(/\D/g, '');
    console.log('🔍 Validating CEP with ViaCEP...', cleanCep);
    
    const cepData = await fetchCEPData(cleanCep);
    if (cepData) {
      console.log('✅ CEP is valid');
      setCepValidated(true);
      return true;
    } else {
      console.log('❌ CEP is invalid');
      setCepValidated(false);
      toast({
        title: "CEP Inválido",
        description: "Por favor, verifique o CEP informado",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    clientCep,
    setClientCep: handleCepChange,
    cepValidated,
    setCepValidated,
    validateCep,
    hasLocation: cepValidated
  };
};

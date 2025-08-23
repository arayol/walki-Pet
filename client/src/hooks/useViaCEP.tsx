
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ViaCEPData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export const useViaCEP = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validateCEP = (cep: string): boolean => {
    const cleanCEP = cep.replace(/\D/g, '');
    return cleanCEP.length === 8;
  };

  const formatCEP = (cep: string): string => {
    const cleanCEP = cep.replace(/\D/g, '');
    return cleanCEP.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const fetchCEPData = async (cep: string): Promise<ViaCEPData | null> => {
    if (!validateCEP(cep)) {
      toast({
        title: "CEP Inválido",
        description: "Por favor, insira um CEP válido com 8 dígitos",
        variant: "destructive",
      });
      return null;
    }

    setLoading(true);
    try {
      const cleanCEP = cep.replace(/\D/g, '');
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      
      if (!response.ok) {
        throw new Error('Erro ao consultar CEP');
      }

      const data: ViaCEPData = await response.json();
      
      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "O CEP informado não foi encontrado na base de dados",
          variant: "destructive",
        });
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      toast({
        title: "Erro",
        description: "Não foi possível consultar o CEP. Tente novamente.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    validateCEP,
    formatCEP,
    fetchCEPData,
  };
};

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ConsultationData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
}

export const useConsultation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendConsultation = async (data: ConsultationData & { subject?: string }) => {
    setIsLoading(true);
    
    try {
      // Simulate successful consultation sending for now
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

      toast({
        title: "Consulta enviada com sucesso!",
        description: "Nossa equipe entrará em contato em breve.",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error sending consultation:', error);
      toast({
        title: "Erro ao enviar consulta",
        description: "Tente novamente ou entre em contato conosco diretamente.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendConsultation,
    isLoading
  };
};
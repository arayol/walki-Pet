import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Settings, CheckCircle } from "lucide-react";

export const ManualProcessPaymentsButton = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const processManualPayments = async () => {
    setLoading(true);
    try {
      console.log('🔄 Executando processamento manual de pagamentos...');
      
      const { data, error } = await supabase.functions.invoke('manual-process-payments', {
        body: {}
      });
      
      if (error) {
        console.error('❌ Erro:', error);
        toast({
          title: "Erro",
          description: `Erro ao processar: ${error.message}`,
          variant: "destructive",
        });
      } else {
        console.log('✅ Resultado:', data);
        toast({
          title: "Processamento Concluído",
          description: `${data.message || 'Processamento manual executado com sucesso'}`,
        });
      }
    } catch (err) {
      console.error('❌ Exception:', err);
      toast({
        title: "Erro",
        description: "Erro inesperado ao processar pagamentos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={processManualPayments} 
      disabled={loading}
      variant="outline"
      className="flex items-center gap-2"
    >
      {loading ? (
        <Settings className="h-4 w-4 animate-spin" />
      ) : (
        <CheckCircle className="h-4 w-4" />
      )}
      {loading ? 'Processando...' : 'Processar Pagamentos Pendentes Manualmente'}
    </Button>
  );
};
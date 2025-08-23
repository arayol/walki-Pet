import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw } from "lucide-react";

export const ProcessPendingWalksButton = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const processPendingWalks = async () => {
    setLoading(true);
    try {
      console.log('🔄 Calling process-pending-walks function...');
      
      const { data, error } = await supabase.functions.invoke('process-pending-walks', {
        body: {}
      });
      
      if (error) {
        console.error('❌ Error:', error);
        toast({
          title: "Erro",
          description: `Erro ao processar: ${error.message}`,
          variant: "destructive",
        });
      } else {
        console.log('✅ Success:', data);
        toast({
          title: "Sucesso",
          description: `${data.message || 'Processamento concluído'}`,
        });
      }
    } catch (err) {
      console.error('❌ Exception:', err);
      toast({
        title: "Erro",
        description: "Erro inesperado ao processar",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={processPendingWalks} 
      disabled={loading}
      variant="outline"
      className="flex items-center gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
      {loading ? 'Processando...' : 'Corrigir Pagamentos sem Agendamentos'}
    </Button>
  );
};
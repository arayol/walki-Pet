import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, AlertTriangle } from "lucide-react";

export const ClearTestDataButton = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const clearTestData = async () => {
    if (!confirm("⚠️ ATENÇÃO: Isso vai deletar TODOS os pagamentos e agendamentos dos usuários arayol@gmail.com e aorayol@gmail.com. Confirma?")) {
      return;
    }

    setLoading(true);
    try {
      console.log('🧹 Limpando dados de teste...');
      
      const { data, error } = await supabase.functions.invoke('clear-test-data', {
        body: {}
      });
      
      if (error) {
        console.error('❌ Erro:', error);
        toast({
          title: "Erro",
          description: `Erro ao limpar dados: ${error.message}`,
          variant: "destructive",
        });
      } else {
        console.log('✅ Resultado:', data);
        toast({
          title: "Dados Limpos",
          description: data.message,
        });
      }
    } catch (err) {
      console.error('❌ Exception:', err);
      toast({
        title: "Erro",
        description: "Erro inesperado ao limpar dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={clearTestData} 
      disabled={loading}
      variant="destructive"
      className="flex items-center gap-2"
    >
      {loading ? (
        <AlertTriangle className="h-4 w-4 animate-pulse" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
      {loading ? 'Limpando...' : 'Limpar Dados de Teste'}
    </Button>
  );
};
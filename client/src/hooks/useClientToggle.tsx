
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useClientToggle = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const toggleClientStatus = async (clientId: string, currentStatus: boolean) => {
    setLoading(true);
    try {
      // Simulate successful toggle for now - can be implemented with API later
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

      toast({
        title: "Status atualizado",
        description: `Cliente ${!currentStatus ? "ativado" : "desativado"} com sucesso`,
      });

      return !currentStatus;
    } catch (error) {
      console.error("Error toggling client status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do cliente",
        variant: "destructive",
      });
      return currentStatus;
    } finally {
      setLoading(false);
    }
  };

  return { toggleClientStatus, loading };
};


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { ServiceRegionsManager } from "@/components/service-regions/ServiceRegionsManager";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface RegionsManagerModalProps {
  currentPlanId: string;
  planName: string;
  onClose: () => void;
}

export const RegionsManagerModal = ({ 
  currentPlanId, 
  planName, 
  onClose 
}: RegionsManagerModalProps) => {
  const { toast } = useToast();
  const [isValidating, setIsValidating] = useState(false);

  const validateCompletion = async () => {
    setIsValidating(true);
    
    try {
      // Verificar se há regiões cadastradas
      const regionsResponse = await fetch(`/api/service-plans/${currentPlanId}/regions`);
      const regions = regionsResponse.ok ? await regionsResponse.json() : [];
      
      // Verificar se há horários cadastrados
      const schedulesResponse = await fetch(`/api/service-plans/${currentPlanId}/schedules`);
      const schedules = schedulesResponse.ok ? await schedulesResponse.json() : [];
      
      if (regions.length === 0) {
        toast({
          title: "Configuração incompleta",
          description: "É necessário adicionar pelo menos uma região de atendimento antes de concluir.",
          variant: "destructive",
        });
        return false;
      }
      
      if (schedules.length === 0) {
        toast({
          title: "Configuração incompleta", 
          description: "É necessário adicionar pelo menos um horário de atendimento antes de concluir.",
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao validar configuração:', error);
      toast({
        title: "Erro",
        description: "Não foi possível validar a configuração. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleClose = async () => {
    const isValid = await validateCompletion();
    if (isValid) {
      onClose();
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gerenciar Regiões - {planName}</CardTitle>
              <CardDescription>
                Configure as regiões e horários onde você oferece este serviço
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ServiceRegionsManager
            servicePlanId={currentPlanId}
            servicePlanName={planName}
          />
          <div className="flex justify-end mt-6 pt-4 border-t">
            <Button onClick={handleClose} disabled={isValidating}>
              {isValidating ? "Verificando..." : "Concluir Configuração"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

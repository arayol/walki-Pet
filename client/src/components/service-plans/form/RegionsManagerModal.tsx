
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { ServiceRegionsManager } from "@/components/service-regions/ServiceRegionsManager";

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
            <Button variant="ghost" size="sm" onClick={onClose}>
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
            <Button onClick={onClose}>
              Concluir Configuração
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

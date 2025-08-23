import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, X } from "lucide-react";
import { ServicePlan } from "@/apps/walker/pages/ServicePlans";
import { useToast } from "@/hooks/use-toast";

interface DeletePlanModalProps {
  plan: ServicePlan;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export const DeletePlanModal = ({ plan, isOpen, onClose, onDelete }: DeletePlanModalProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Simulate successful deletion for now - can be implemented with API later
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

      toast({
        title: "Plano excluído!",
        description: `O plano "${plan.name}" foi excluído com sucesso.`,
      });

      onDelete();
      onClose();
    } catch (error: any) {
      console.error("Error deleting plan:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível excluir o plano",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Excluir Plano</CardTitle>
                <CardDescription>Esta ação não pode ser desfeita</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Tem certeza que deseja excluir o plano <strong>"{plan.name}"</strong>?
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Nota:</strong> O plano será desativado mas os dados serão mantidos para fins de relatório e histórico.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={loading}
            >
              {loading ? "Excluindo..." : "Excluir Plano"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PlanLimitsGuard } from "@/components/plan-limits/PlanLimitsGuard";

interface ClientsHeaderProps {
  onAddClient: () => void;
}

export const ClientsHeader = ({ onAddClient }: ClientsHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-2">Gerencie seus clientes e pets</p>
        </div>
        <PlanLimitsGuard action="adicionar novos clientes">
          <Button onClick={onAddClient}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </PlanLimitsGuard>
      </div>
    </div>
  );
};

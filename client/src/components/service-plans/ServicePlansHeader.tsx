
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

interface ServicePlansHeaderProps {
  activeTab: 'walks' | 'extras' | 'disabled';
  onTabChange: (tab: 'walks' | 'extras' | 'disabled') => void;
  onNewPlan: () => void;
}

export const ServicePlansHeader = ({
  activeTab,
  onTabChange,
  onNewPlan
}: ServicePlansHeaderProps) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Meus Planos de Serviço
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie seus pacotes de passeios e serviços extras
            </p>
          </div>
          
          <Button onClick={onNewPlan} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Plano
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as 'walks' | 'extras' | 'disabled')}>
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="walks">Passeios</TabsTrigger>
            <TabsTrigger value="extras">Serviços Extras</TabsTrigger>
            <TabsTrigger value="disabled">Serviços Desabilitados</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

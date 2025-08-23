
import { Button } from "@/components/ui/button";
import { User, Plus } from "lucide-react";

interface ClientsEmptyStateProps {
  searchTerm: string;
  onAddClient: () => void;
}

export const ClientsEmptyState = ({ searchTerm, onAddClient }: ClientsEmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {searchTerm ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
      </h3>
      <p className="text-gray-600 mb-4">
        {searchTerm 
          ? "Tente ajustar sua busca" 
          : "Comece adicionando seu primeiro cliente ou compartilhe seu link de convite"
        }
      </p>
      {!searchTerm && (
        <Button onClick={onAddClient}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Cliente
        </Button>
      )}
    </div>
  );
};

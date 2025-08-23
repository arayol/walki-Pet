
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientServicesHeaderProps {
  onGoBack: () => void;
}

export const ClientServicesHeader = ({ onGoBack }: ClientServicesHeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Button 
            variant="ghost" 
            onClick={onGoBack}
            className="flex items-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Serviços</h1>
          <div className="w-20"></div>
        </div>
      </div>
    </header>
  );
};

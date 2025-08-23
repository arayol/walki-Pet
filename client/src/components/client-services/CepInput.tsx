
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CepInputProps {
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
  hasLocation?: boolean;
  onValidate?: () => void;
}

export const CepInput = ({ value, onChange, loading, hasLocation, onValidate }: CepInputProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.replace(/\D/g, '');
    
    // Limitar a 8 dígitos
    if (inputValue.length > 8) {
      inputValue = inputValue.substring(0, 8);
    }
    
    // Formatar CEP: 12345-678
    if (inputValue.length > 5) {
      inputValue = `${inputValue.substring(0, 5)}-${inputValue.substring(5)}`;
    }
    
    onChange(inputValue);
  };

  return (
    <Card className="mb-6 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              Informe seu CEP para ver os serviços disponíveis
            </h3>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="00000-000"
                  value={value}
                  onChange={handleInputChange}
                  className="pl-10 text-lg h-12"
                  maxLength={9}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              
              <Button
                onClick={onValidate}
                disabled={value.length < 9 || loading}
                className="px-6 h-12"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Buscando...
                  </>
                ) : (
                  'Confirmar'
                )}
              </Button>
              
              {hasLocation && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">Localização confirmada</span>
                </div>
              )}
            </div>
            
            {loading && (
              <div className="mt-2 flex items-center gap-2 text-blue-600">
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span className="text-sm">Buscando serviços na sua região...</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

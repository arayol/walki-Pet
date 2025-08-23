
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Clock, Calendar } from "lucide-react";

interface ValidationStatusProps {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  selectedCount: number;
  requiredCount: number;
  planName: string;
}

export const ValidationStatus = ({
  isValid,
  errors,
  warnings,
  selectedCount,
  requiredCount,
  planName
}: ValidationStatusProps) => {
  const getStatusIcon = () => {
    if (errors.length > 0) return <AlertCircle className="h-4 w-4" />;
    if (selectedCount === requiredCount) return <CheckCircle className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  const getStatusColor = () => {
    if (errors.length > 0) return "destructive";
    if (selectedCount === requiredCount) return "default";
    return "secondary";
  };

  const getStatusText = () => {
    if (errors.length > 0) return "Correções necessárias";
    if (selectedCount === requiredCount) return "Pronto para confirmar";
    return "Seleção em andamento";
  };

  return (
    <div className="space-y-4">
      {/* Status Principal */}
      <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="font-medium text-gray-900">{planName}</h3>
            <p className="text-sm text-gray-600">
              {selectedCount} de {requiredCount} horários selecionados
            </p>
          </div>
        </div>
        <Badge variant={getStatusColor()} className="flex items-center gap-1">
          {getStatusIcon()}
          {getStatusText()}
        </Badge>
      </div>

      {/* Progresso Visual */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progresso</span>
          <span>{Math.round((selectedCount / requiredCount) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ease-out ${
              selectedCount === requiredCount 
                ? 'bg-green-500' 
                : selectedCount > 0 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300'
            }`}
            style={{ width: `${Math.min((selectedCount / requiredCount) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Erros */}
      {errors.map((error, index) => (
        <Alert key={`error-${index}`} variant="destructive" className="animate-in slide-in-from-left-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ))}

      {/* Avisos */}
      {warnings.map((warning, index) => (
        <Alert key={`warning-${index}`} className="animate-in slide-in-from-left-2">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{warning}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

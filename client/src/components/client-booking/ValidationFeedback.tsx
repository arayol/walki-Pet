
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, Loader2 } from "lucide-react";
import { useMemo } from "react";

interface ValidationFeedbackProps {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  loading: boolean;
  selectedCount: number;
  requiredCount: number;
}

export const ValidationFeedback = ({
  isValid,
  errors,
  warnings,
  loading,
  selectedCount,
  requiredCount
}: ValidationFeedbackProps) => {
  // Memorizar o status para evitar re-renderizações desnecessárias
  const status = useMemo(() => {
    if (errors.length > 0) return "error";
    if (selectedCount === requiredCount) return "complete";
    return "progress";
  }, [errors.length, selectedCount, requiredCount]);

  const statusConfig = useMemo(() => {
    switch (status) {
      case "error":
        return {
          icon: AlertCircle,
          color: "text-red-500",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          badge: { variant: "destructive" as const, text: "Erro" }
        };
      case "complete":
        return {
          icon: CheckCircle,
          color: "text-green-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          badge: { variant: "default" as const, text: "Completo" }
        };
      default:
        return {
          icon: Clock,
          color: "text-blue-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          badge: { variant: "secondary" as const, text: "Em andamento" }
        };
    }
  }, [status]);

  if (loading) {
    return (
      <Alert className="border-blue-200 bg-blue-50">
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertDescription className="flex items-center gap-2">
          Validando horários selecionados...
        </AlertDescription>
      </Alert>
    );
  }

  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-3">
      {/* Status Geral */}
      <div className={`flex items-center justify-between p-4 border rounded-lg transition-all duration-300 ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
        <div className="flex items-center gap-3">
          <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
          <div>
            <span className="font-medium text-gray-900">
              {selectedCount} de {requiredCount} horários selecionados
            </span>
            <div className="text-sm text-gray-600 mt-1">
              {status === "complete" 
                ? "Seleção completa! Pronto para confirmar."
                : `Selecione mais ${requiredCount - selectedCount} horário${requiredCount - selectedCount !== 1 ? 's' : ''}`
              }
            </div>
          </div>
        </div>
        <Badge variant={statusConfig.badge.variant}>
          {statusConfig.badge.text}
        </Badge>
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
        <Alert key={`warning-${index}`} className="border-yellow-200 bg-yellow-50 animate-in slide-in-from-left-2">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">{warning}</AlertDescription>
        </Alert>
      ))}

      {/* Sucesso */}
      {isValid && selectedCount === requiredCount && errors.length === 0 && (
        <Alert className="border-green-200 bg-green-50 animate-in slide-in-from-left-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Todos os horários estão disponíveis e prontos para confirmação!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

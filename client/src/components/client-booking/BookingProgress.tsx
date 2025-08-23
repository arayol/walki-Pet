
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, AlertCircle } from "lucide-react";

interface BookingProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  stepStatus: ('completed' | 'current' | 'pending' | 'error')[];
}

export const BookingProgress = ({ 
  currentStep, 
  totalSteps, 
  stepLabels, 
  stepStatus 
}: BookingProgressProps) => {
  const getStepIcon = (index: number, status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'current':
        return <Circle className="h-5 w-5 text-blue-600 fill-current" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      case 'current':
        return 'text-blue-700 font-medium';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          Progresso do Agendamento
          <Badge variant="outline">
            Etapa {currentStep} de {totalSteps}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stepLabels.map((label, index) => (
            <div key={index} className="flex items-center gap-3">
              {getStepIcon(index, stepStatus[index])}
              <span className={`text-sm transition-colors duration-200 ${getStepColor(stepStatus[index])}`}>
                {label}
              </span>
              {stepStatus[index] === 'current' && (
                <div className="ml-auto">
                  <div className="animate-pulse h-2 w-2 bg-blue-600 rounded-full" />
                </div>
              )}
            </div>
          ))}
          
          {/* Barra de progresso */}
          <div className="mt-4 pt-4 border-t">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-1 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

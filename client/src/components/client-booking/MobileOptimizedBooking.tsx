
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar, Clock, CheckCircle } from "lucide-react";
import { BookingForm } from "./BookingForm";

interface ServicePlan {
  id: string;
  name: string;
  price: number;
  walk_count: number;
  is_recurring: boolean;
  recurrence_type: "weekly" | "monthly" | null;
  description?: string;
  walker_id: string;
  includes_playtime: boolean;
  includes_feeding: boolean;
  includes_grooming: boolean;
  includes_bath: boolean;
}

interface MobileOptimizedBookingProps {
  servicePlan: ServicePlan;
  walkerId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const MobileOptimizedBooking = ({ 
  servicePlan, 
  walkerId, 
  onSuccess, 
  onCancel 
}: MobileOptimizedBookingProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const steps = [
    { 
      number: 1, 
      title: "Selecionar Dias", 
      icon: Calendar,
      description: "Escolha os dias disponíveis"
    },
    { 
      number: 2, 
      title: "Escolher Horários", 
      icon: Clock,
      description: "Defina os horários preferidos"
    },
    { 
      number: 3, 
      title: "Confirmar", 
      icon: CheckCircle,
      description: "Revisar e finalizar"
    }
  ];

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Mobile */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold text-lg truncate mx-2">
            {servicePlan.name}
          </h1>
          <div className="text-sm text-gray-500">
            {currentStep}/{totalSteps}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps Indicator - Mobile */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex justify-between items-center">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div 
                key={step.number}
                className={`flex flex-col items-center flex-1 ${
                  isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center mb-1
                  ${isActive ? 'bg-blue-100' : isCompleted ? 'bg-green-100' : 'bg-gray-100'}
                `}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-center">{step.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <BookingForm
          servicePlan={servicePlan}
          walkerId={walkerId}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </div>

      {/* Mobile Navigation */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex justify-between items-center sticky bottom-0">
        <Button 
          variant="outline" 
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex-1 mr-2"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <Button 
          onClick={nextStep}
          disabled={currentStep === totalSteps}
          className="flex-1 ml-2"
        >
          Avançar
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

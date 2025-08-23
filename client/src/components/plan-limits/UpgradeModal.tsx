import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason: string;
}

export const UpgradeModal = ({ open, onOpenChange, reason }: UpgradeModalProps) => {
  // Determinar se é limite de clientes ou trial expirado
  const isClientLimitExceeded = reason.includes("cliente");
  const isTrialExpired = reason.includes("trial") || reason.includes("dias");
  
  // Estado para controlar o plano selecionado
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'professional'>('basic');
  
  // Planos disponíveis
  const plans = {
    basic: {
      id: 'basic',
      name: "Básico",
      price: "29",
      features: [
        "Até 15 clientes",
        "Agendamentos básicos", 
        "Suporte por email",
        "Relatórios simples"
      ]
    },
    professional: {
      id: 'professional',
      name: "Profissional", 
      price: "59",
      features: [
        "Até 50 clientes",
        "Integração Google Calendar",
        "Backup automático",
        "Suporte prioritário",
        "Relatórios avançados"
      ]
    },
  };

  // Plano recomendado baseado na situação
  const getRecommendedPlanId = () => {
    if (isClientLimitExceeded) {
      return 'basic'; // Para quem excedeu o limite gratuito
    }
    return 'basic'; // Para trial expirado também começar com básico
  };

  const recommendedPlanId = getRecommendedPlanId();
  const currentSelectedPlan = plans[selectedPlan];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            {isClientLimitExceeded ? "Limite Excedido - Upgrade Necessário" : "Upgrade para Plano Pago"}
          </DialogTitle>
          <DialogDescription>
            {reason}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Seção de Planos Selecionáveis */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-center">Escolha seu plano:</h3>
            
            {/* Plano Básico */}
            <div 
              className={cn(
                "p-4 rounded-lg border-2 cursor-pointer transition-all",
                selectedPlan === 'basic' 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => setSelectedPlan('basic')}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-primary">
                  Plano {plans.basic.name}
                </h4>
                <div className="flex items-center gap-2">
                  {recommendedPlanId === 'basic' && (
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      RECOMENDADO
                    </span>
                  )}
                  {selectedPlan === 'basic' && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </div>
              <ul className="space-y-1 mb-3">
                {plans.basic.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  R$ {plans.basic.price}<span className="text-sm font-normal text-muted-foreground">/mês</span>
                </p>
              </div>
            </div>

            {/* Plano Profissional */}
            <div 
              className={cn(
                "p-4 rounded-lg border-2 cursor-pointer transition-all",
                selectedPlan === 'professional' 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => setSelectedPlan('professional')}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-primary">
                  Plano {plans.professional.name}
                </h4>
                <div className="flex items-center gap-2">
                  {recommendedPlanId === 'professional' && (
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      RECOMENDADO
                    </span>
                  )}
                  {selectedPlan === 'professional' && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </div>
              <ul className="space-y-1 mb-3">
                {plans.professional.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  R$ {plans.professional.price}<span className="text-sm font-normal text-muted-foreground">/mês</span>
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Cancele quando quiser • Todos os planos incluem 7 dias grátis
          </p>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Depois
            </Button>
            <Button 
              className="flex-1" 
              onClick={() => window.open(`/plan-signup?plan=${selectedPlan}`, '_blank')}
            >
              <Crown className="h-4 w-4 mr-2" />
              Assinar {currentSelectedPlan.name}
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full text-sm" 
            onClick={() => window.open('/pricing', '_blank')}
          >
            Ver todos os planos e comparar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
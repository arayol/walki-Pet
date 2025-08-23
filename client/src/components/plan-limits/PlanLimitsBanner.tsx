import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Crown } from "lucide-react";

interface PlanLimitsBannerProps {
  reason: string;
  clientCount: number;
  maxClients: number;
  accountAgeDays: number;
  trialDays: number;
  onUpgrade: () => void;
}

export const PlanLimitsBanner = ({
  reason,
  clientCount,
  maxClients,
  accountAgeDays,
  trialDays,
  onUpgrade
}: PlanLimitsBannerProps) => {
  const remainingDays = Math.max(0, trialDays - accountAgeDays);
  const isClientLimitReached = clientCount > maxClients;
  
  return (
    <Alert className="border-warning bg-warning/10">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="font-medium text-warning-foreground">
            Plano Gratuito - Upgrade Necessário
          </p>
          <p className="text-sm text-muted-foreground">
            {reason}
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Clientes ativos: {clientCount}/{maxClients}</p>
            <p>• Dias restantes do trial: {remainingDays} de {trialDays}</p>
          </div>
        </div>
        <Button onClick={onUpgrade} className="ml-4">
          <Crown className="h-4 w-4 mr-2" />
          Fazer Upgrade
        </Button>
      </AlertDescription>
    </Alert>
  );
};
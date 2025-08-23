import { ReactNode, useState } from 'react';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { UpgradeModal } from './UpgradeModal';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';

interface PlanLimitsGuardProps {
  children: ReactNode;
  action: string;
  fallback?: ReactNode;
}

export const PlanLimitsGuard = ({ 
  children, 
  action, 
  fallback 
}: PlanLimitsGuardProps) => {
  const { shouldBlockActions, planLimits } = usePlanLimits();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  if (shouldBlockActions) {
    const defaultFallback = (
      <div className="p-4 border-2 border-dashed border-warning rounded-lg text-center">
        <div className="mb-3">
          <Crown className="h-8 w-8 text-warning mx-auto" />
        </div>
        <h3 className="font-medium text-warning-foreground mb-2">
          Upgrade Necessário
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          Para {action.toLowerCase()}, você precisa fazer upgrade do seu plano.
        </p>
        <Button onClick={() => setShowUpgradeModal(true)} size="sm">
          <Crown className="h-4 w-4 mr-2" />
          Fazer Upgrade
        </Button>
        
        <UpgradeModal
          open={showUpgradeModal}
          onOpenChange={setShowUpgradeModal}
          reason={planLimits?.reason || ""}
        />
      </div>
    );

    return fallback || defaultFallback;
  }

  return <>{children}</>;
};
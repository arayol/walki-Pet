
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, RefreshCw, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useServicePlansMigration } from "@/hooks/useServicePlansMigration";

interface PlanDiagnostic {
  id: string;
  name: string;
  has_regions: boolean;
  regions_count: number;
  schedules_count: number;
  status: 'complete' | 'missing_regions' | 'missing_schedules';
}

export const ServicePlansDiagnostic = () => {
  const { user } = useAuth();
  const { migratePlans, isMigrating } = useServicePlansMigration();
  const [diagnostics, setDiagnostics] = useState<PlanDiagnostic[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const runDiagnostic = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Simulate diagnostic for now - can be implemented with API later
      const results: PlanDiagnostic[] = [];

      // Simulate empty results
      const plans: any[] = [];

      for (const plan of plans || []) {
        // Simulate counts
        const regionsCount = 0;
        const schedulesCount = 0;

        let status: PlanDiagnostic['status'] = 'complete';
        if (regionsCount === 0) {
          status = 'missing_regions';
        } else if (schedulesCount === 0) {
          status = 'missing_schedules';
        }

        results.push({
          id: plan.id,
          name: plan.name,
          has_regions: regionsCount > 0,
          regions_count: regionsCount,
          schedules_count: schedulesCount,
          status
        });
      }

      setDiagnostics(results);
    } catch (error) {
      console.error('Diagnostic error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMigration = () => {
    if (user) {
      migratePlans(user.id);
    }
  };

  const getStatusBadge = (status: PlanDiagnostic['status']) => {
    switch (status) {
      case 'complete':
        return <Badge variant="default" className="bg-green-500">Completo</Badge>;
      case 'missing_regions':
        return <Badge variant="destructive">Sem Regiões</Badge>;
      case 'missing_schedules':
        return <Badge variant="secondary">Sem Horários</Badge>;
    }
  };

  return (
    <Card className="mt-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Diagnóstico dos Planos
              </CardTitle>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  onClick={runDiagnostic} 
                  disabled={loading}
                  size="sm"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Executar Diagnóstico
                </Button>
                
                <Button 
                  onClick={handleMigration}
                  disabled={isMigrating}
                  variant="outline"
                  size="sm"
                >
                  {isMigrating ? 'Migrando...' : 'Migrar Planos'}
                </Button>
              </div>

              {diagnostics.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Resultado do Diagnóstico:</h4>
                  {diagnostics.map((diagnostic) => (
                    <div key={diagnostic.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{diagnostic.name}</span>
                        <div className="text-sm text-gray-600">
                          Regiões: {diagnostic.regions_count} | Horários: {diagnostic.schedules_count}
                        </div>
                      </div>
                      {getStatusBadge(diagnostic.status)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

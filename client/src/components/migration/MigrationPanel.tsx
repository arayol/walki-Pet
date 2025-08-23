
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  AlertTriangle, 
  CheckCircle, 
  Settings,
  Play
} from "lucide-react";
import { useMigration } from "@/hooks/useMigration";

export const MigrationPanel = () => {
  const { migrateExistingPlans, loading } = useMigration();
  const [migrationResult, setMigrationResult] = useState<any>(null);

  const handleMigration = async () => {
    const result = await migrateExistingPlans();
    setMigrationResult(result);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Migração de Dados
          </CardTitle>
          <CardDescription>
            Migre planos de serviço existentes para o novo formato com regiões e horários
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Esta operação criará regiões e horários padrão para planos que ainda não possuem essa configuração.
              A operação é segura e pode ser executada múltiplas vezes.
            </AlertDescription>
          </Alert>

          <div className="flex items-center gap-4">
            <Button 
              onClick={handleMigration} 
              disabled={loading}
              className="flex items-center"
            >
              {loading ? (
                <Settings className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Executando Migração...' : 'Executar Migração'}
            </Button>

            {migrationResult && (
              <Badge variant={migrationResult.success ? "default" : "destructive"}>
                {migrationResult.success ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <AlertTriangle className="h-3 w-3 mr-1" />
                )}
                {migrationResult.success ? 'Sucesso' : 'Erro'}
              </Badge>
            )}
          </div>

          {migrationResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Resultado da Migração:</h4>
              {migrationResult.success ? (
                <div className="text-sm space-y-1">
                  <p className="text-green-600">
                    ✅ {migrationResult.migrated_plans} plano(s) migrado(s) com sucesso
                  </p>
                  <p className="text-gray-600">{migrationResult.message}</p>
                </div>
              ) : (
                <p className="text-red-600 text-sm">
                  ❌ {migrationResult.error}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Otimizações Aplicadas</CardTitle>
          <CardDescription>
            Melhorias de performance implementadas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Índices de Performance</p>
                <p className="text-sm text-gray-600">Índices criados para otimizar consultas frequentes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">View Materializada para Analytics</p>
                <p className="text-sm text-gray-600">Dados de analytics pré-calculados para consultas mais rápidas</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Funções de Relatório</p>
                <p className="text-sm text-gray-600">Funções otimizadas para geração de relatórios de performance</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

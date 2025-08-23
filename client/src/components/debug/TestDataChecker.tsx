
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, CheckCircle, XCircle } from "lucide-react";

interface TestDataReport {
  profile: any;
  walker: any;
  clients: any[];
  servicePlans: any[];
  walks: any[];
  payments: any[];
  summary: {
    profileExists: boolean;
    walkerExists: boolean;
    totalClients: number;
    totalServicePlans: number;
    totalWalks: number;
    totalPayments: number;
    stripeAccountId: string | null;
    stripeOnboardingComplete: boolean;
  };
}

export const TestDataChecker = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<TestDataReport | null>(null);
  const { toast } = useToast();

  const checkTestData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("check-test-data");
      
      if (error) throw error;
      
      setReport(data);
      toast({
        title: "Dados verificados!",
        description: "Relatório de teste gerado com sucesso.",
      });
    } catch (error: any) {
      console.error("Erro ao verificar dados:", error);
      toast({
        title: "Erro",
        description: "Não foi possível verificar os dados de teste.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Verificador de Dados de Teste
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={checkTestData} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Verificar Dados (aorayol@gmail.com)
            </>
          )}
        </Button>

        {report && (
          <div className="space-y-4">
            {/* Resumo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumo</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  {report.summary.profileExists ? 
                    <CheckCircle className="h-4 w-4 text-green-500" /> : 
                    <XCircle className="h-4 w-4 text-red-500" />
                  }
                  <span>Perfil: {report.summary.profileExists ? 'OK' : 'Não encontrado'}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {report.summary.walkerExists ? 
                    <CheckCircle className="h-4 w-4 text-green-500" /> : 
                    <XCircle className="h-4 w-4 text-red-500" />
                  }
                  <span>Walker: {report.summary.walkerExists ? 'OK' : 'Não encontrado'}</span>
                </div>

                <div>
                  <Badge variant="outline">{report.summary.totalClients} Clientes</Badge>
                </div>
                
                <div>
                  <Badge variant="outline">{report.summary.totalServicePlans} Planos</Badge>
                </div>
                
                <div>
                  <Badge variant="outline">{report.summary.totalWalks} Passeios</Badge>
                </div>
                
                <div>
                  <Badge variant="outline">{report.summary.totalPayments} Pagamentos</Badge>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <span>Stripe:</span>
                    {report.summary.stripeAccountId ? (
                      <Badge className={report.summary.stripeOnboardingComplete ? "bg-green-500" : "bg-orange-500"}>
                        {report.summary.stripeOnboardingComplete ? "Ativo" : "Pendente"}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Não configurado</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detalhes do Perfil */}
            {report.profile && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Perfil</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Nome:</strong> {report.profile.name}</p>
                    <p><strong>Email:</strong> {report.profile.email}</p>
                    <p><strong>Role:</strong> {report.profile.role}</p>
                    <p><strong>ID:</strong> {report.profile.id}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Detalhes do Walker */}
            {report.walker && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dados do Walker</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Slug:</strong> {report.walker.slug}</p>
                    <p><strong>Bio:</strong> {report.walker.bio || 'Não definida'}</p>
                    <p><strong>Localização:</strong> {report.walker.location || 'Não definida'}</p>
                    <p><strong>Telefone:</strong> {report.walker.phone || 'Não definido'}</p>
                    <p><strong>Ativo:</strong> {report.walker.is_active ? 'Sim' : 'Não'}</p>
                    <p><strong>Stripe Account ID:</strong> {report.walker.stripe_account_id || 'Não configurado'}</p>
                    <p><strong>Stripe Onboarding:</strong> {report.walker.stripe_onboarding_complete ? 'Completo' : 'Pendente'}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Clientes */}
            {report.clients.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Clientes ({report.clients.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {report.clients.map((client: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <p><strong>Nome:</strong> {client.client_name}</p>
                        <p><strong>Pet:</strong> {client.pet_name}</p>
                        <p><strong>Email:</strong> {client.profiles?.email}</p>
                        <p><strong>Ativo:</strong> {client.is_active ? 'Sim' : 'Não'}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* JSON Raw */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dados Brutos (JSON)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-96">
                  {JSON.stringify(report, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

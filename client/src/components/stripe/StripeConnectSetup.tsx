
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle, AlertCircle, ExternalLink, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StripeConnectSetupProps {
  walkerData: {
    stripe_account_id?: string;
    stripe_onboarding_complete?: boolean;
    profiles?: {
      name: string;
    };
  };
  stripeStatus?: {
    onboarding_complete: boolean;
    charges_enabled: boolean;
  };
  onStatusUpdate: () => void;
}

export const StripeConnectSetup = ({ walkerData, stripeStatus, onStatusUpdate }: StripeConnectSetupProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateAccount = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-connect-account", {
        body: {
          walkerData: {
            firstName: walkerData.profiles?.name?.split(" ")[0] || "Dog",
            lastName: walkerData.profiles?.name?.split(" ").slice(1).join(" ") || "Walker",
            phone: "",
          },
        },
      });

      if (error) throw error;

      // Redirect to Stripe onboarding
      window.open(data.onboardingUrl, "_blank");
      
      toast({
        title: "Conta Stripe Criada!",
        description: "Complete o cadastro na nova aba para receber pagamentos.",
      });

      // Refresh data after a few seconds
      setTimeout(() => {
        onStatusUpdate();
      }, 3000);
    } catch (error: any) {
      console.error("Error creating Stripe account:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a conta Stripe. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateAccount = async () => {
    if (!confirm("Tem certeza que deseja desativar a integração Stripe? Você não poderá mais receber pagamentos.")) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("deactivate-stripe-account");
      if (error) throw error;

      toast({
        title: "Conta Desativada",
        description: "A integração Stripe foi desativada com sucesso.",
      });

      onStatusUpdate();
    } catch (error: any) {
      console.error("Error deactivating Stripe account:", error);
      toast({
        title: "Erro",
        description: "Não foi possível desativar a conta Stripe. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    const isActive = walkerData.stripe_account_id && 
                    (walkerData.stripe_onboarding_complete || stripeStatus?.onboarding_complete);
    
    if (!walkerData.stripe_account_id) {
      return <Badge variant="secondary">Não Configurado</Badge>;
    }
    
    if (isActive) {
      return <Badge className="bg-green-500 hover:bg-green-600 text-white px-3 py-1">✓ Ativo</Badge>;
    }
    
    return <Badge variant="outline" className="border-orange-400 text-orange-600">Pendente</Badge>;
  };

  const isActive = walkerData.stripe_account_id && 
                  (walkerData.stripe_onboarding_complete || stripeStatus?.onboarding_complete);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="h-6 w-6 mr-2 text-blue-600" />
            Integração Stripe
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            {isActive && (
              <Badge 
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 cursor-pointer"
                onClick={handleDeactivateAccount}
              >
                <X className="h-4 w-4 mr-1" />
                Desativar
              </Badge>
            )}
          </div>
        </CardTitle>
        {isActive && (
          <p className="text-sm text-gray-600 mt-2">
            Sua conta Stripe está configurada e ativa. Você já pode receber pagamentos diretamente dos seus clientes.
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {!walkerData.stripe_account_id ? (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">
                  Configure sua conta para receber pagamentos
                </h4>
                <p className="text-sm text-blue-700 mb-4">
                  Crie sua conta Stripe Connect para receber pagamentos diretamente dos clientes.
                  É rápido, seguro e sem taxas adicionais da nossa plataforma.
                </p>
                <Button 
                  onClick={handleCreateAccount}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "Criando..." : "Criar Conta Stripe"}
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        ) : !isActive ? (
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-900 mb-2">
                  Configuração Pendente
                </h4>
                <p className="text-sm text-orange-700 mb-4">
                  Sua conta Stripe foi criada mas ainda precisa ser configurada.
                  Complete o processo de onboarding para começar a receber pagamentos.
                </p>
                <Button 
                  onClick={handleCreateAccount}
                  disabled={loading}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {loading ? "Abrindo..." : "Continuar Configuração"}
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {!isActive && (
          <div className="pt-4 border-t">
            <h5 className="font-medium mb-3">Como funciona:</h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Clientes pagam diretamente na sua conta Stripe
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Você recebe 100% do valor (menos as taxas do Stripe)
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Nossa plataforma não cobra taxas adicionais
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Suporte a cartão de crédito e PIX
              </li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

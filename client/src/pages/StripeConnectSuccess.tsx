import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, CreditCard, ArrowRight, Home } from "lucide-react";

export default function StripeConnectSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stripeStatus, setStripeStatus] = useState<any>(null);

  useEffect(() => {
    // Verificar status da conta Stripe após alguns segundos
    const timer = setTimeout(async () => {
      if (user) {
        try {
          const response = await fetch(`/api/stripe/status/${user.id}`);
          if (response.ok) {
            const data = await response.json();
            setStripeStatus(data);
          }
        } catch (error) {
          console.error("Error checking Stripe status:", error);
        }
      }
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [user]);

  const handleGoToFinancial = () => {
    navigate("/financial");
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  const isAccountActive = stripeStatus?.onboarding_complete && stripeStatus?.charges_enabled;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-600 mb-2">
            🎉 Conta Stripe Configurada!
          </CardTitle>
          <p className="text-gray-600 text-lg">
            Sua integração com o Stripe Connect foi realizada com sucesso.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {loading ? (
            <div className="text-center py-6">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-gray-600">Verificando status da conta...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {isAccountActive ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="font-semibold text-green-800">Conta Ativa</h3>
                  </div>
                  <p className="text-green-700 text-sm">
                    Sua conta está totalmente configurada e você já pode receber pagamentos dos clientes.
                  </p>
                </div>
              ) : (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <CreditCard className="w-5 h-5 text-orange-600 mr-2" />
                    <h3 className="font-semibold text-orange-800">Processando</h3>
                  </div>
                  <p className="text-orange-700 text-sm">
                    Sua conta foi criada e está sendo processada pelo Stripe. 
                    Pode levar alguns minutos para ficar totalmente ativa.
                  </p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-3">✅ O que acontece agora:</h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Clientes podem fazer pagamentos via cartão de crédito e PIX
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Você recebe {isAccountActive ? "100%" : "95%"} do valor (menos taxas do Stripe)
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    {isAccountActive ? "Transferências automáticas para sua conta" : "Transferências serão ativadas em breve"}
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Acompanhe tudo na página Financeiro
                  </li>
                </ul>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={handleGoToFinancial}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Ver Página Financeiro
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button 
              onClick={handleGoToDashboard}
              variant="outline"
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Button>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-xs text-gray-500">
              Precisa de ajuda? Entre em contato com nosso suporte.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
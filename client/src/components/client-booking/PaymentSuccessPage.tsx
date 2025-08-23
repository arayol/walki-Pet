
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, ArrowRight, Clock, User, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePaymentPolling } from "@/hooks/usePaymentPolling";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get("session_id");
  
  // Iniciar polling do status do pagamento
  const { paymentStatus, isPolling } = usePaymentPolling(sessionId, !!sessionId);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (paymentStatus.status === 'paid' && paymentStatus.processed) {
      toast({
        title: "Pagamento Confirmado! ✅",
        description: "Seu agendamento foi processado com sucesso. O dog walker entrará em contato em breve.",
        duration: 5000,
      });
    } else if (paymentStatus.status === 'error') {
      toast({
        title: "Erro na Verificação do Pagamento",
        description: paymentStatus.error || "Não foi possível verificar o status do pagamento",
        variant: "destructive",
        duration: 8000,
      });
    }
  }, [paymentStatus, toast]);

  const handleGoToDashboard = () => {
    navigate("/client-dashboard");
  };

  const handleViewBookings = () => {
    navigate("/client-bookings");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg text-center shadow-lg">
        <CardHeader className="pb-4">
          <CheckCircle className="h-16 w-16 sm:h-20 sm:w-20 text-green-500 mx-auto mb-4 animate-bounce" />
          <CardTitle className="text-xl sm:text-2xl font-bold text-green-600">
            Agendamento Confirmado!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status do Polling */}
          {isPolling && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                🔄 Verificando confirmação do pagamento... Isso pode levar alguns minutos.
              </AlertDescription>
            </Alert>
          )}
          
          {paymentStatus.status === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                ⚠️ {paymentStatus.error || "Erro ao verificar pagamento"}
              </AlertDescription>
            </Alert>
          )}

          <div className={`p-4 rounded-lg ${
            paymentStatus.status === 'paid' && paymentStatus.processed 
              ? 'bg-green-50' 
              : isPolling 
                ? 'bg-yellow-50' 
                : 'bg-blue-50'
          }`}>
            <Calendar className={`h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 ${
              paymentStatus.status === 'paid' && paymentStatus.processed 
                ? 'text-green-600' 
                : isPolling 
                  ? 'text-yellow-600' 
                  : 'text-blue-600'
            }`} />
            <p className={`font-semibold mb-2 text-sm sm:text-base ${
              paymentStatus.status === 'paid' && paymentStatus.processed 
                ? 'text-green-800' 
                : isPolling 
                  ? 'text-yellow-800' 
                  : 'text-blue-800'
            }`}>
              {paymentStatus.status === 'paid' && paymentStatus.processed
                ? "Pagamento Processado com Sucesso"
                : isPolling
                  ? "Processando Pagamento..."
                  : "Aguardando Confirmação do Pagamento"
              }
            </p>
            <p className={`text-sm ${
              paymentStatus.status === 'paid' && paymentStatus.processed 
                ? 'text-green-700' 
                : isPolling 
                  ? 'text-yellow-700' 
                  : 'text-blue-700'
            }`}>
              {paymentStatus.status === 'paid' && paymentStatus.processed
                ? "Seu agendamento foi confirmado e o pagamento foi processado diretamente para o dog walker."
                : isPolling
                  ? "Aguarde enquanto verificamos a confirmação do seu pagamento no Stripe..."
                  : "Seu agendamento será confirmado assim que o pagamento for processado."
              }
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Próximos Passos:</h3>
            <div className="text-left space-y-2 text-sm text-gray-600">
              <div className="flex items-start">
                <User className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>O dog walker receberá uma notificação sobre seu agendamento</span>
              </div>
              <div className="flex items-start">
                <ArrowRight className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Você receberá confirmação por email com todos os detalhes</span>
              </div>
              <div className="flex items-start">
                <Clock className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Acompanhe o status dos seus agendamentos na sua área</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Importante:</strong> O pagamento foi processado diretamente para o dog walker. 
              Nossa plataforma facilita a conexão sem cobrar taxas adicionais.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleViewBookings}
              variant="outline"
              className="w-full sm:flex-1"
            >
              Ver Agendamentos
            </Button>
            <Button 
              onClick={handleGoToDashboard} 
              className="w-full sm:flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              Ir para Dashboard
            </Button>
          </div>

          {sessionId && (
            <p className="text-xs text-gray-500 mt-4">
              ID da Sessão: {sessionId.substring(0, 20)}...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

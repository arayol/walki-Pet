
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, ArrowRight, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ClientBookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      toast({
        title: "Pagamento Confirmado! ✅",
        description: "Seu agendamento foi processado com sucesso. O dog walker entrará em contato em breve.",
        duration: 5000,
      });
    }
    setLoading(false);
  }, [sessionId, toast]);

  const handleGoToDashboard = () => {
    navigate("/client-dashboard");
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
          <div className="bg-green-50 p-4 rounded-lg">
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-2" />
            <p className="text-green-800 font-semibold mb-2 text-sm sm:text-base">
              Pagamento Processado com Sucesso
            </p>
            <p className="text-sm text-green-700">
              Seu agendamento foi confirmado e o pagamento foi processado diretamente para o dog walker.
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

          <Button 
            onClick={handleGoToDashboard} 
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            Ir para Dashboard
          </Button>

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

export default ClientBookingSuccess;

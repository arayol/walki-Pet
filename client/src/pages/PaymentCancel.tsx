import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, ArrowLeft, Home } from "lucide-react";

export default function PaymentCancel() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600 mb-2">
            Pagamento Cancelado
          </CardTitle>
          <p className="text-gray-600">
            Seu pagamento foi cancelado. Nenhuma cobrança foi realizada.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-orange-800 text-sm">
              Você pode tentar novamente a qualquer momento. 
              Se houve algum problema, entre em contato conosco.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button 
              onClick={handleGoBack}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
            
            <Button 
              onClick={handleGoHome}
              variant="outline"
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
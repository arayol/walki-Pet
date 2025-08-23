
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, LogIn } from "lucide-react";
import { WalkerInfo } from "@/types/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface SuccessPageProps {
  walkerInfo: WalkerInfo | null;
  onBackToHome: () => void;
}

export const SuccessPage = ({ walkerInfo }: SuccessPageProps) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Auto-redirect após 10 segundos
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/client/login', { state: { fromSignup: true } });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleLoginNow = () => {
    navigate('/client/login', { state: { fromSignup: true } });
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold text-green-600">
            Cadastro Realizado com Sucesso!
          </CardTitle>
              </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <LogIn className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-700 font-medium text-center">
             Agora você pode fazer login para selecionar planos e agendar horários.
            </p>
          </div>
          
                  <div className="space-y-3">
            <Button 
              onClick={handleLoginNow}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Fazer Login Agora
            </Button>
            
            <p className="text-center text-sm text-gray-500">
              Redirecionamento automático em {countdown} segundos...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

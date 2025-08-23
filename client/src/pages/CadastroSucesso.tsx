import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Mail, ArrowRight } from "lucide-react";

const CadastroSucesso = () => {
  const [searchParams] = useSearchParams();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto pt-20">
        {/* Success Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-6">
              <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Pagamento Confirmado!
            </CardTitle>
            <p className="text-lg text-gray-600">
              Sua conta DogWalker foi criada com sucesso
            </p>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Status Steps */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-800">Pagamento Processado</h4>
                  <p className="text-sm text-green-700">
                    Seu pagamento foi confirmado e processado com sucesso
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-800">Conta Criada</h4>
                  <p className="text-sm text-green-700">
                    Sua conta foi criada automaticamente com o plano selecionado
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                <Mail className="h-6 w-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-800">E-mail de Acesso</h4>
                  <p className="text-sm text-blue-700">
                    Você receberá um e-mail com suas credenciais de acesso em instantes
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Próximos Passos:
              </h3>
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold">
                    1
                  </span>
                  <span>Verifique seu e-mail para as credenciais de acesso</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold">
                    2
                  </span>
                  <span>Faça login na plataforma usando seu email e senha</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold">
                    3
                  </span>
                  <span>Complete seu perfil e configure seus serviços</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold">
                    4
                  </span>
                  <span>Comece a receber agendamentos dos seus clientes!</span>
                </li>
              </ol>
            </div>

            {/* Timer and Action */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>
                  E-mail será enviado em até {formatTime(timeLeft)}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link to="/auth">
                    Fazer Login Agora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="text-lg px-8">
                  <Link to="/">
                    Voltar ao Início
                  </Link>
                </Button>
              </div>
            </div>

            {/* Support Info */}
            <div className="text-center text-sm text-gray-500 border-t pt-6">
              <p>
                Não recebeu o e-mail? Verifique sua caixa de spam ou{" "}
                <Link to="/contato" className="text-primary hover:underline">
                  entre em contato conosco
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CadastroSucesso;
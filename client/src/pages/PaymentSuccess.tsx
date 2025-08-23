
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const sessionId = searchParams.get("session_id");

  // Redirecionar para o dashboard do cliente após 3 segundos
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        navigate("/client-dashboard");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  const handleGoToDashboard = () => {
    navigate("/client-dashboard");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            Pagamento Confirmado!
          </h1>
          <p className="text-gray-600">
            Seu agendamento foi processado com sucesso.
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg mb-6">
          <p className="text-green-800 text-sm">
            O dog walker entrará em contato em breve para confirmar os detalhes do seu agendamento.
          </p>
          {user && (
            <p className="text-green-700 text-sm mt-2">
              Redirecionando para seu dashboard em 3 segundos...
            </p>
          )}
        </div>

        <div className="space-y-3">
          {user ? (
            <button 
              onClick={handleGoToDashboard}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ir para Meu Dashboard
            </button>
          ) : (
            <button 
              onClick={handleGoHome}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voltar ao Início
            </button>
          )}
        </div>

        {sessionId && (
          <p className="text-xs text-gray-500 mt-4">
            Sessão: {sessionId.substring(0, 20)}...
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;

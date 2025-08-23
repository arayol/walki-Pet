
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      // Se não há usuário logado
      if (!user) {
        // Evitar loop se já estiver na página de auth
        if (location.pathname !== "/auth") {
          navigate("/auth");
        }
        return;
      }

      // Se há um papel obrigatório mas ainda não obtivemos o papel do usuário, aguardar
      if (requiredRole && userRole === null) {
        return;
      }

      // Se há um papel obrigatório e o usuário tem um papel diferente
      if (requiredRole && userRole && userRole !== requiredRole) {
        // Redirecionar baseado no papel do usuário
        if (userRole === 'client') {
          navigate("/client-dashboard");
        } else if (userRole === 'walker') {
          navigate("/dashboard");
        } else {
          navigate("/auth");
        }
        return;
      }
    }
  }, [user, loading, userRole, requiredRole, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || (requiredRole && userRole !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
};


import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { BookingForm } from "./BookingForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, User, LogIn } from "lucide-react";

interface ProtectedBookingFormProps {
  walker: {
    name: string;
    services: { name: string; duration: string; price: string }[];
  };
  onClose: () => void;
}

export const ProtectedBookingForm = ({ walker, onClose }: ProtectedBookingFormProps) => {
  const { user, loading, userRole } = useAuth();
  const navigate = useNavigate();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      // Usuário não autenticado - mostrar prompt
      setShowAuthPrompt(true);
      return;
    }

    if (!loading && user && userRole === "walker") {
      // Walker não pode fazer agendamentos para si mesmo
      setShowAuthPrompt(true);
      return;
    }
  }, [user, loading, userRole]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showAuthPrompt) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-6 w-6 mr-2 text-blue-500" />
              Login Necessário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              {!user 
                ? "Para agendar um serviço, você precisa estar logado como cliente. Se não for cliente, cadastre-se primeiro."
                : "Como dog walker, você não pode agendar serviços para si mesmo."
              }
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              {!user ? (
                <div className="flex space-x-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      // Navegar para cadastro - precisamos do slug do walker
                      const currentPath = window.location.pathname;
                      const walkerSlug = currentPath.split('/profile/')[1] || 'walker';
                      navigate(`/walker/${walkerSlug}/cadastro`);
                    }}
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Cadastrar
                  </Button>
                  <Button onClick={() => navigate("/client/login")}>
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </div>
              ) : (
                <Button onClick={onClose}>
                  Fechar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Usuário autenticado e é cliente - mostrar formulário normal
  return (
    <BookingForm
      walker={walker}
      onClose={onClose}
    />
  );
};

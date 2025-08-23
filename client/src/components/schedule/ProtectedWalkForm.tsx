
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { WalkForm } from "./WalkForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, User } from "lucide-react";

interface ProtectedWalkFormProps {
  selectedDate: Date;
  onClose: () => void;
  onSave: () => void;
}

export const ProtectedWalkForm = ({ selectedDate, onClose, onSave }: ProtectedWalkFormProps) => {
  const { user, loading, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      // Usuário não autenticado - redirecionar para login
      navigate("/auth");
      return;
    }

    if (!loading && user && userRole !== "walker") {
      // Usuário autenticado mas não é walker - redirecionar para auth
      navigate("/auth");
      return;
    }
  }, [user, loading, userRole, navigate]);

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

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-6 w-6 mr-2 text-red-500" />
              Acesso Restrito
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Você precisa estar logado como dog walker para criar agendamentos.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={() => navigate("/auth")}>
                <User className="h-4 w-4 mr-2" />
                Fazer Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userRole !== "walker") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-6 w-6 mr-2 text-red-500" />
              Acesso Negado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Apenas dog walkers podem criar agendamentos.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={() => navigate("/auth")}>
                <User className="h-4 w-4 mr-2" />
                Login de Walker
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Usuário autenticado e é walker - mostrar formulário normal
  return (
    <WalkForm
      selectedDate={selectedDate}
      onClose={onClose}
      onSave={onSave}
    />
  );
};


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const useClientLogin = () => {
  console.log("🔍 useClientLogin hook initializing...");
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  console.log("🔍 useClientLogin hook initialized successfully");

  const handleLogin = async (email: string, password: string) => {
    console.log("🔑 Starting client login process...");
    setLoading(true);
    try {
      console.log("🔑 Attempting to login via REST API...");
      
      const response = await fetch('/api/clients/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro no login');
      }

      const result = await response.json();
      console.log("✅ Login successful:", result.user.email);

      // Store session in localStorage for now
      localStorage.setItem('auth-session', JSON.stringify({
        user: result.user,
        access_token: 'temp_token' // We'll implement proper tokens later
      }));

      toast({
        title: "Login realizado!",
        description: "Redirecionando para sua área...",
      });

      // Redirecionar para o dashboard do cliente
      console.log("🔍 Redirecting to client dashboard...");
      navigate("/client-dashboard");
    } catch (error: any) {
      console.error("❌ Login error:", error);
      toast({
        title: "Erro no login",
        description: error.message || "Email ou senha incorretos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    console.log("🔍 Starting logout process...");
    try {
      // Clear localStorage session
      localStorage.removeItem('auth-session');
      
      navigate("/client-area");
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error: any) {
      console.error("❌ Logout error:", error);
      toast({
        title: "Erro no logout",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    loading,
    handleLogin,
    handleLogout,
  };
};

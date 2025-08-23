
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
      console.log("🔑 Attempting to sign in with password...");
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("❌ Login error:", error);
        throw error;
      }

      if (data.user) {
        console.log("✅ Login successful:", data.user.email);
        
        // Verificar se é um cliente
        console.log("🔍 Checking user role...");
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        console.log("🔍 User profile:", profile);

        if (profile?.role !== 'client') {
          console.log("❌ User is not a client, signing out...");
          await supabase.auth.signOut();
          throw new Error("Esta área é exclusiva para clientes");
        }

        console.log("✅ Client role confirmed");
        toast({
          title: "Login realizado!",
          description: "Redirecionando para sua área...",
        });

        // Redirecionar para o dashboard do cliente
        console.log("🔍 Redirecting to client dashboard...");
        navigate("/client-dashboard");
      }
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
      await supabase.auth.signOut();
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


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSupabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ClientFormData, WalkerInfo, RpcResponse } from "@/types/client";

export const useClientSignup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (formData: ClientFormData, walkerInfo: WalkerInfo | null) => {
    if (!walkerInfo) return;

    // Validar senhas
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log("🚀 INICIANDO CADASTRO DE CLIENTE VIA LINK");
      console.log("👤 Walker ID:", walkerInfo.walker_id);
      console.log("📝 Dados do formulário:", formData);

      // Criar usuário cliente com senha real
      const supabase = await getSupabase();
      // Configuração para o signup com email de confirmação desabilitado
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/client/confirmation`,
          data: {
            name: formData.name,
            role: 'client'
          }
        }
      });

      console.log("📧 Auth response:", { 
        user: authData.user?.id, 
        session: !!authData.session,
        emailConfirmed: authData.user?.email_confirmed_at,
        error: authError 
      });

      if (authError) {
        console.error("❌ Erro na criação do usuário:", authError);
        throw authError;
      }

      if (authData.user) {
        console.log("✅ Usuário cliente criado:", authData.user.id);
        console.log("📧 Email confirmation required:", !authData.user.email_confirmed_at);
        console.log("📋 User session:", authData.session ? "Ativo" : "Pendente confirmação");
        
        // Aguardar um pouco para garantir que o usuário foi criado na tabela profiles
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Segunda etapa: Registrar cliente usando a função RPC
        console.log("📋 Registrando cliente na tabela clients via RPC...");
        
        const { data: rpcResult, error: rpcError } = await supabase.rpc('register_client_via_invite', {
          p_walker_id: walkerInfo.walker_id,
          p_client_email: formData.email,
          p_client_name: formData.name,
          p_pet_name: formData.pet_name,
          p_pet_breed: formData.pet_breed || null,
          p_pet_age: formData.pet_age ? parseInt(formData.pet_age) : null,
          p_pet_notes: formData.pet_notes || null,
          p_emergency_contact: formData.emergency_contact || null,
          p_address: formData.address || null,
          p_preferred_days: formData.preferred_days.length > 0 ? formData.preferred_days : null,
          p_preferred_times: formData.preferred_times.length > 0 ? formData.preferred_times : null,
          p_additional_schedule_notes: formData.additional_schedule_notes || null,
        } as any);

        if (rpcError) {
          console.error("❌ Erro na função RPC:", rpcError);
          throw new Error(`Erro ao registrar cliente: ${rpcError.message}`);
        }

        const result = rpcResult as unknown as RpcResponse;

        if (result && !result.success) {
          console.error("❌ Erro retornado pela função:", result.error);
          throw new Error(result.error);
        }

        console.log("✅ Cliente cadastrado com sucesso via RPC!", result);
        
        toast({
          title: "Cadastro realizado!",
          description: "Sua conta foi criada com sucesso. Você será redirecionado para fazer login.",
        });
        
        setSuccess(true);
      }
    } catch (error: any) {
      console.error("❌ Erro no cadastro via link:", error);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Não foi possível completar o cadastro",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    success,
    handleSubmit,
    navigateHome: () => navigate("/")
  };
};

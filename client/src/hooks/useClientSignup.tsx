
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

      // Criar cliente via REST API
      const response = await fetch('/api/clients/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walker_id: walkerInfo.walker_id,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          pet_name: formData.pet_name,
          pet_breed: formData.pet_breed || null,
          pet_age: formData.pet_age ? parseInt(formData.pet_age) : null,
          pet_notes: formData.pet_notes || null,
          emergency_contact: formData.emergency_contact || null,
          address: formData.address || null,
          use_whatsapp_for_emergency: formData.use_whatsapp_for_emergency || true
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro no cadastro');
      }

      const result = await response.json();
      console.log("✅ Cliente cadastrado com sucesso!", result);
      
      toast({
        title: "Cadastro realizado!",
        description: "Sua conta foi criada com sucesso. Você será redirecionado para fazer login.",
      });
      
      setSuccess(true);
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

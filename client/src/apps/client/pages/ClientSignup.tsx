
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ClientFormData, WalkerInfo } from "@/types/client";
import { ClientSignupForm } from "@/components/client-signup/ClientSignupForm";
import { SuccessPage } from "@/components/client-signup/SuccessPage";
import { useClientSignup } from "@/hooks/useClientSignup";

interface ClientSignupProps {
  walkerSlug?: string | null;
}

const ClientSignup = ({ walkerSlug: propWalkerSlug }: ClientSignupProps = {}) => {
  const { slug: paramWalkerSlug } = useParams();
  const walkerSlug = propWalkerSlug || paramWalkerSlug;
  const { toast } = useToast();
  const [walkerInfo, setWalkerInfo] = useState<WalkerInfo | null>(null);
  const [loadingWalker, setLoadingWalker] = useState(true);
  const { loading, success, handleSubmit, navigateHome } = useClientSignup();
  
  const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pet_name: "",
    pet_breed: "",
    pet_age: "",
    pet_notes: "",
    emergency_contact: "",
    use_whatsapp_for_emergency: true,
    address: ""
  });

  useEffect(() => {
    fetchWalkerInfo();
  }, [walkerSlug]);

  const fetchWalkerInfo = async () => {
    try {
      console.log("🔍 Buscando informações do walker...");
      console.log("walkerSlug:", walkerSlug);

      if (!walkerSlug) {
        throw new Error("Slug do walker não encontrado na URL");
      }

      const response = await fetch(`/api/walkers/by-slug/${walkerSlug}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: Walker não encontrado`);
      }
      
      const data = await response.json();
      console.log("✅ Walker encontrado:", data);
      setWalkerInfo(data);
    } catch (error) {
      console.error("❌ Erro ao buscar informações do walker:", error);
      toast({
        title: "Erro",
        description: "Link inválido ou dog walker não encontrado",
        variant: "destructive",
      });
      navigateHome();
    } finally {
      setLoadingWalker(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(formData, walkerInfo);
  };

  if (loadingWalker) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (success) {
    return <SuccessPage walkerInfo={walkerInfo} onBackToHome={navigateHome} />;
  }

  return (
    <ClientSignupForm
      walkerInfo={walkerInfo}
      formData={formData}
      loading={loading}
      onFormDataChange={setFormData}
      onSubmit={onSubmit}
    />
  );
};

export default ClientSignup;

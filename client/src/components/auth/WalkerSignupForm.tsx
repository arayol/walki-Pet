import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validateCPF, formatCPF, formatPhoneBR, validatePhoneBR } from "@/utils/cpfValidator";
import { Link } from "react-router-dom";

interface WalkerSignupFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onSuccess?: () => void;
}

export const WalkerSignupForm = ({ isLoading, setIsLoading, onSuccess }: WalkerSignupFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    cpf: "",
    phone: "",
    termsAccepted: false
  });
  
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    let processedValue = value;
    
    if (field === 'cpf') {
      // Remove caracteres não numéricos e limita a 11 dígitos
      processedValue = value.replace(/[^\d]/g, '').slice(0, 11);
    } else if (field === 'phone') {
      // Remove caracteres não numéricos
      processedValue = value.replace(/[^\d]/g, '');
      if (processedValue.length > 11) {
        processedValue = processedValue.slice(0, 11);
      }
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!formData.termsAccepted) {
      toast({
        title: "Erro",
        description: "Você deve aceitar os Termos de Uso para continuar.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (!validateCPF(formData.cpf)) {
      toast({
        title: "Erro",
        description: "CPF inválido. Verifique os dados informados.",
        variant: "destructive",
      });
      return;
    }

    const formattedPhone = formatPhoneBR(formData.phone);
    if (!validatePhoneBR(formattedPhone)) {
      toast({
        title: "Erro",
        description: "Telefone inválido. Use o formato: (11) 99999-9999",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: formData.name,
            role: 'walker'
          }
        }
      });

      if (error) throw error;

      // Aguardar um pouco para o trigger criar o registro do walker
      setTimeout(async () => {
        try {
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            const { error: updateError } = await supabase
              .from('walkers')
              .update({
                cpf: formData.cpf,
                phone: formattedPhone,
                terms_accepted_at: new Date().toISOString()
              })
              .eq('walker_id', userData.user.id);

            if (updateError) {
              console.error('Erro ao atualizar dados do walker:', updateError);
            }
          }
        } catch (err) {
          console.error('Erro ao atualizar dados após cadastro:', err);
        }
      }, 2000);

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu email para confirmar a conta.",
      });

      // Redirecionar para a aba de login
      onSuccess?.();

    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-name">Nome Completo</Label>
        <Input
          id="signup-name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-cpf">CPF</Label>
        <Input
          id="signup-cpf"
          type="text"
          value={formatCPF(formData.cpf)}
          onChange={(e) => handleInputChange('cpf', e.target.value)}
          placeholder="000.000.000-00"
          maxLength={14}
          required
        />
        <p className="text-xs text-muted-foreground">
          Apenas números. Necessário para controle único de conta.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-phone">Telefone</Label>
        <Input
          id="signup-phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="(11) 99999-9999"
          maxLength={11}
          required
        />
        <p className="text-xs text-muted-foreground">
          Apenas números com DDD. Ex: 11999999999
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">Senha</Label>
        <Input
          id="signup-password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-confirm-password">Confirmar Senha</Label>
        <Input
          id="signup-confirm-password"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={formData.termsAccepted}
          onCheckedChange={(checked) => 
            setFormData(prev => ({ ...prev, termsAccepted: !!checked }))
          }
        />
        <Label htmlFor="terms" className="text-sm">
          Concordo com os{" "}
          <Link to="/terms" className="text-primary hover:underline" target="_blank">
            Termos de Uso
          </Link>
          {" "}e autorizo o tratamento dos meus dados pessoais
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Criando conta..." : "Criar conta"}
      </Button>
    </form>
  );
};
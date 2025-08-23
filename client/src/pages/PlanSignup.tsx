import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/hooks/use-toast";
import { useSecureFormValidation } from "@/hooks/useSecureFormValidation";
import { LGPDConsents } from "@/components/lgpd/LGPDConsents";
import { ArrowLeft, CreditCard, CheckCircle, Shield, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

const plans = {
  free: {
    name: "Criar sua Conta",
    monthly: 0,
    yearly: 0,
    description: "Preencha seus dados para começar a usar o DogWalker",
    features: ["Até 5 clientes ativos", "1 região de atendimento", "Suporte via e-mail"]
  },
  basic: {
    name: "Plano Básico",
    monthly: 29,
    yearly: 300,
    yearlyDiscount: 48,
    description: "Funcionalidades essenciais para organizar seu crescimento",
    features: ["Até 15 clientes ativos", "3 regiões de atendimento", "Cobrança manual via Pix"]
  },
  professional: {
    name: "Plano Profissional", 
    monthly: 59,
    yearly: 595,
    yearlyDiscount: 113,
    description: "Tudo que você precisa para automatizar sua operação",
    features: ["Clientes ilimitados", "Regiões ilimitadas", "Cobrança automática", "Integração Google Calendar"]
  }
} as const;

const PlanSignup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: form, 2: payment (if needed), 3: success
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const selectedPlan = searchParams.get("plan") || "free";
  const plan = plans[selectedPlan as keyof typeof plans] || plans.free;

  // Hook de validação segura
  const {
    formData,
    errors,
    isValid,
    updateField,
    validateAll,
    hasError
  } = useSecureFormValidation(selectedPlan as 'free' | 'basic' | 'professional');

  // Handlers para consentimentos LGPD
  const handleConsentChange = (consent: keyof typeof formData, value: boolean) => {
    updateField(consent, value);
  };

  // Helper para obter classe CSS do input com base na validação
  const getInputClassName = (fieldName: keyof typeof formData) => {
    const baseClass = "";
    if (hasError(fieldName)) {
      return baseClass + " border-red-500 focus:border-red-500";
    }
    return baseClass;
  };

  // Validação do formulário com LGPD
  const validateFormSecure = () => {
    const validation = validateAll();
    
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      toast({ 
        title: "Erro na validação", 
        description: firstError || "Verifique os campos obrigatórios", 
        variant: "destructive" 
      });
      return false;
    }
    
    return true;
  };


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFormSecure()) return;
    
    setIsLoading(true);
    
    try {
      // For free plan, create user account directly
      if (selectedPlan === 'free') {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            role: 'walker',
            plan: selectedPlan,
            cpf: formData.cpf,
            phone: formData.phone,
            planType: 'free',
            // Consentimentos LGPD
            acceptedTerms: formData.acceptedTerms,
            acceptedPrivacy: formData.acceptedPrivacy,
            acceptedDataProcessing: formData.acceptedDataProcessing,
            acceptedMarketing: formData.acceptedMarketing
          })
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Erro no cadastro');
        }

        // Save session to localStorage
        if (result.session) {
          localStorage.setItem('auth-session', JSON.stringify(result.session));
        }

        toast({
          title: "Conta criada com sucesso!",
          description: "Bem-vindo ao DogWalker!"
        });
        
        navigate('/dashboard');
      } else {
        // For paid plans, go directly to Stripe without creating user yet
        console.log("Plano pago selecionado, redirecionando para pagamento...");
        await createStripeCheckout();
      }

    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createStripeCheckout = async () => {
    try {
      setIsLoading(true);
      
      const planPrices = {
        basic: { monthly: 2900, yearly: 30000 }, // R$ 29/mês ou R$ 300/ano
        professional: { monthly: 5900, yearly: 59500 } // R$ 59/mês ou R$ 595/ano
      };
      
      const price = planPrices[selectedPlan as keyof typeof planPrices]?.[billingCycle] || 2900;
      
      const response = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceAmount: price,
          planName: plan.name,
          planType: selectedPlan,
          billingCycle: billingCycle,
          userEmail: formData.email,
          userName: formData.fullName,
          userCpf: formData.cpf,
          userPhone: formData.phone,
          userPassword: formData.password,
          // Consentimentos LGPD
          acceptedTerms: formData.acceptedTerms,
          acceptedPrivacy: formData.acceptedPrivacy,
          acceptedDataProcessing: formData.acceptedDataProcessing,
          acceptedMarketing: formData.acceptedMarketing,
          successUrl: `${window.location.origin}/auth`,
          cancelUrl: `${window.location.origin}/plan-signup?plan=${selectedPlan}`
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Erro ao criar checkout');
      }

      if (result?.url) {
        // Abrir Stripe checkout em nova aba
        window.open(result.url, '_blank');
        
        toast({
          title: "Redirecionando para pagamento",
          description: "Complete o pagamento para finalizar seu cadastro.",
        });
        
        // Mostrar mensagem de aguardo
        setStep(2);
      }
    } catch (error: any) {
      console.error('Erro ao criar checkout:', error);
      toast({
        title: "Erro ao processar pagamento",
        description: error.message || "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    navigate('/walker/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/pricing" className="flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos planos
          </Link>
        </div>

        {/* Plan Summary */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h1 className="text-3xl font-bold">{plan.name}</h1>
              {plan.monthly > 0 && (
                <Badge variant="default">
                  R$ {billingCycle === 'monthly' ? plan.monthly : plan.yearly}
                  {billingCycle === 'monthly' ? '/mês' : '/ano'}
                </Badge>
              )}
            </div>
            <p className="text-gray-600">{plan.description}</p>
            
            {/* Billing cycle toggle for paid plans */}
            {(selectedPlan === 'basic' || selectedPlan === 'professional') && (
              <div className="mt-6">
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Escolha o período de cobrança:
                </Label>
                <ToggleGroup
                  type="single"
                  value={billingCycle}
                  onValueChange={(value) => value && setBillingCycle(value as 'monthly' | 'yearly')}
                  className="justify-center"
                >
                  <ToggleGroupItem value="monthly" className="px-4 py-2">
                    Mensal - R$ {plan.monthly}/mês
                  </ToggleGroupItem>
                  <ToggleGroupItem value="yearly" className="px-4 py-2">
                    <div className="text-center">
                      <div>Anual - R$ {plan.yearly}/ano</div>
                      {'yearlyDiscount' in plan && plan.yearlyDiscount && (
                        <div className="text-xs text-green-600 font-medium">
                          Economize R$ {plan.yearlyDiscount}
                        </div>
                      )}
                    </div>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Step 1: Registration Form */}
        {step === 1 && (
          <>
            {/* Dados Pessoais */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <CardTitle>Dados Pessoais</CardTitle>
                </div>
                <CardDescription>
                  Seus dados são protegidos por criptografia e tratados conforme a LGPD
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  {/* Nome Completo */}
                  <div>
                    <Label htmlFor="fullName">Nome completo *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      className={getInputClassName("fullName")}
                      placeholder="Digite seu nome e sobrenome"
                      data-testid="input-fullname"
                      required
                    />
                    {hasError("fullName") && (
                      <p className="text-sm text-red-600 mt-1" data-testid="error-fullname">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* E-mail */}
                    <div>
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className={getInputClassName("email")}
                        placeholder="seu@email.com"
                        data-testid="input-email"
                        required
                      />
                      {hasError("email") && (
                        <p className="text-sm text-red-600 mt-1" data-testid="error-email">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* CPF */}
                    <div>
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input
                        id="cpf"
                        type="text"
                        value={formData.cpf}
                        onChange={(e) => updateField("cpf", e.target.value)}
                        className={getInputClassName("cpf")}
                        placeholder="000.000.000-00"
                        data-testid="input-cpf"
                        maxLength={14}
                        required
                      />
                      {hasError("cpf") && (
                        <p className="text-sm text-red-600 mt-1" data-testid="error-cpf">
                          {errors.cpf}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Telefone */}
                  <div>
                    <Label htmlFor="phone">Telefone/WhatsApp *</Label>
                    <Input
                      id="phone"
                      type="text"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className={getInputClassName("phone")}
                      placeholder="(11) 9 9999-9999"
                      data-testid="input-phone"
                      maxLength={17}
                      required
                    />
                    {hasError("phone") && (
                      <p className="text-sm text-red-600 mt-1" data-testid="error-phone">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Senha */}
                    <div>
                      <Label htmlFor="password">Senha *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        className={getInputClassName("password")}
                        placeholder="Mínimo 6 caracteres"
                        data-testid="input-password"
                        required
                      />
                      {hasError("password") && (
                        <p className="text-sm text-red-600 mt-1" data-testid="error-password">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Confirmar Senha */}
                    <div>
                      <Label htmlFor="confirmPassword">Confirmar senha *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateField("confirmPassword", e.target.value)}
                        className={getInputClassName("confirmPassword")}
                        placeholder="Digite a senha novamente"
                        data-testid="input-confirm-password"
                        required
                      />
                      {hasError("confirmPassword") && (
                        <p className="text-sm text-red-600 mt-1" data-testid="error-confirm-password">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Consentimentos LGPD */}
            <LGPDConsents
              consents={{
                acceptedTerms: formData.acceptedTerms,
                acceptedPrivacy: formData.acceptedPrivacy,
                acceptedDataProcessing: formData.acceptedDataProcessing,
                acceptedMarketing: formData.acceptedMarketing
              }}
              onConsentChange={handleConsentChange}
              errors={errors}
            />


            {/* Botão de Envio */}
            <Card>
              <CardContent className="pt-6">
                <Button 
                  onClick={handleSignup} 
                  className="w-full" 
                  disabled={isLoading || !isValid}
                  data-testid="button-submit"
                >
                  {isLoading ? "Criando conta..." : "Criar conta"}
                </Button>
                
                {!isValid && (
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Preencha todos os campos obrigatórios e aceite os termos para continuar
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Step 2: Payment waiting for paid plans */}
        {step === 2 && (
          <Card>
            <CardContent className="text-center py-12">
              <CreditCard className="h-16 w-16 text-blue-600 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Finalize seu pagamento</h3>
              <p className="text-gray-600 mb-6">
                Uma nova janela foi aberta para finalizar o pagamento. 
                Após a confirmação, sua conta será criada automaticamente.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Próximos passos:</strong><br />
                  1. Complete o pagamento na janela do Stripe<br />
                  2. Sua conta será criada automaticamente<br />
                  3. Você receberá um e-mail com instruções de acesso
                </p>
              </div>
              <Button 
                onClick={() => navigate('/auth')} 
                variant="outline"
                className="mr-4"
              >
                Ir para Login
              </Button>
              <Button onClick={() => setStep(1)} variant="ghost">
                Voltar ao Formulário
              </Button>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
};

export default PlanSignup;
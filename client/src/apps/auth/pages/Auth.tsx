
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/integrations/api/client";
import { ArrowLeft, User, UserPlus } from "lucide-react";
import { WalkerSignupForm } from "@/components/auth/WalkerSignupForm";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Erro no login');
      }

      // Save session to localStorage
      if (result.session) {
        const sessionData = {
          user: {
            id: result.profile.id,
            email: result.profile.email,
            name: result.profile.name,
          },
          access_token: result.session.access_token,
        };
        
        localStorage.setItem('auth-session', JSON.stringify(sessionData));
      }

      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o dashboard...",
      });

      // Force page reload to ensure auth state is refreshed
      const userRole = result.profile?.role;
      if (userRole === 'walker') {
        window.location.href = '/dashboard';
      } else if (userRole === 'client') {
        window.location.href = '/client-dashboard';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupPassword !== signupConfirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signupEmail,
          password: signupPassword,
          name: signupName,
          role: 'walker',
          planType: 'free'
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
        title: "Cadastro realizado!",
        description: "Conta criada com sucesso. Redirecionando...",
      });
      
      navigate('/dashboard');

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="text-center">
              <CardTitle className="text-2xl font-bold">Dog Walker</CardTitle>
              <CardDescription>
                Área exclusiva para profissionais
              </CardDescription>
            </div>
            <div className="w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <User className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <User className="mr-2 h-4 w-4" />
                  Entrar
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;

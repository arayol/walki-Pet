
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, ArrowLeft, CheckCircle } from "lucide-react";
import { useClientLogin } from "@/hooks/useClientLogin";

const ClientLogin = () => {
  console.log("🔍 ClientLogin component rendering...");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    console.log("🔍 ClientLogin component mounted");
    
    // Verificar se veio da página de cadastro com sucesso
    if (location.state?.fromSignup) {
      setShowSuccessMessage(true);
      // Esconder a mensagem após 5 segundos
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
    
    return () => {
      console.log("🔍 ClientLogin component unmounted");
    };
  }, [location]);

  console.log("🔍 About to call useClientLogin hook...");
  const { loading, handleLogin } = useClientLogin();
  console.log("🔍 useClientLogin hook called successfully, loading:", loading);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔍 Form submitted with email:", email);
    handleLogin(email, password);
  };

  console.log("🔍 ClientLogin rendering complete");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-2 animate-in slide-in-from-top-2">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Cadastro realizado com sucesso! Faça login para continuar.</span>
        </div>
      )}
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold text-blue-600">
            Área do Cliente
          </CardTitle>
          <CardDescription>
            Entre com seu email e senha para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Lock className="h-4 w-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Entrar
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Ainda não tem uma conta?
            </p>
            <p className="text-xs text-gray-500">
              Você precisa ser convidado por um dog walker para se cadastrar
            </p>
          </div>
          
          <div className="mt-4 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar ao início
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientLogin;

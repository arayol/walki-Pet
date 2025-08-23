
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/shared/Header";
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Star, 
  Mail, 
  Lock, 
  CheckCircle,
  ArrowRight,
  Shield
} from "lucide-react";
import { useClientLogin } from "@/hooks/useClientLogin";

const ClientLanding = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const { loading, handleLogin } = useClientLogin();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  const benefits = [
    {
      icon: Calendar,
      title: "Agenda em Tempo Real",
      description: "Visualize a disponibilidade do seu Dog Walker e agende horários."
    },
    {
      icon: MapPin,
      title: "Serviço no seu CEP",
      description: "Passeios personalizados na região do seu pet."
    },
    {
      icon: Star,
      title: "Serviços Extras",
      description: "Banho, tosa, alimentação e brincadeiras disponíveis."
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Acesso restrito apenas para clientes convidados."
    }
  ];

  const faqs = [
    {
      question: "Como recebo um convite?",
      answer: "Seu Dog Walker precisa enviar um convite para você acessar o cadastro na plataforma."
    },
    {
      question: "Posso contratar outros Dog Walkers?",
      answer: "Não. Esta plataforma é exclusiva para clientes dos profissionais cadastrados."
    },
    {
      question: "Como funciona o agendamento?",
      answer: "Após o login, você verá apenas os serviços e horários do seu Dog Walker."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      {/* Header */}
      <header className="container mx-auto px-4 py-6" style={{ display: 'none' }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">PetWalker</span>
          </div>
          {!showLogin && (
            <Button onClick={() => setShowLogin(true)} className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Área do Cliente
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Seu <span className="text-blue-600">Dog Walker Favorito</span><br />
            Já Usa Nossa Plataforma!
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Agende passeios seguros e personalizados para seu pet com total praticidade e transparência.
          </p>
          
          {!showLogin ? (
            <Button 
              size="lg" 
              onClick={() => setShowLogin(true)}
              className="text-lg px-8 py-4 flex items-center gap-2 mx-auto"
            >
              <Mail className="h-5 w-5" />
              Acessar com Convite
              <ArrowRight className="h-5 w-5" />
            </Button>
          ) : (
            <Card className="max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
                  <Lock className="h-6 w-6" />
                  Login Restrito
                </CardTitle>
                <CardDescription>
                  Você precisa de um convite do seu Dog Walker para acessar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email cadastrado</Label>
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
                    <Label htmlFor="password">Senha do convite</Label>
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
                        Entrar na Área do Cliente
                      </>
                    )}
                  </Button>
                </form>
                
                <div className="mt-4 text-center">
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowLogin(false)}
                    className="text-sm"
                  >
                    Voltar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      {!showLogin && (
        <>
          <section className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Para Clientes Convidados
              </h2>
              <p className="text-lg text-gray-600">
                Acesso exclusivo aos serviços do seu Dog Walker de confiança
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <Icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                      <CardTitle className="text-lg">{benefit.title}</CardTitle>
                      <CardDescription>{benefit.description}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* How It Works */}
          <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Como Funciona o Convite
                </h2>
                <p className="text-lg text-gray-600">
                  Processo simples e seguro para começar
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Cadastro pelo Dog Walker</h3>
                  <p className="text-gray-600">
                    Seu Dog Walker cadastra você no sistema com nome, e-mail e CEP do pet.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Receba o Convite</h3>
                  <p className="text-gray-600">
                    Você recebe um e-mail com link de ativação e senha temporária.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Acesse e Agende</h3>
                  <p className="text-gray-600">
                    Faça login e veja apenas os serviços e horários do seu Dog Walker.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Perguntas Frequentes
              </h2>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      {faq.question}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {faq.answer}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-6 w-6" />
            <span className="text-xl font-bold">PetWalker</span>
          </div>
          <p className="text-gray-400">© 2024 PetWalker. Plataforma exclusiva para clientes convidados.</p>
          <div className="mt-4">
            <Link to="/" className="text-blue-400 hover:text-blue-300">
              Área para Dog Walkers
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientLanding;

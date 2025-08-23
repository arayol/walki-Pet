import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { IntegrationSuggestionModal } from "@/components/integration/IntegrationSuggestionModal";
import { PublicFooter } from "@/components/shared/PublicFooter";
import { 
  CheckCircle, 
  Calendar, 
  MessageCircle, 
  CreditCard, 
  MapPin, 
  Zap,
  Clock,
  Star,
  Instagram,
  FileText,
  Wallet,
  Youtube,
  Bot,
  QrCode,
  Smartphone,
  Truck,
  Camera,
  Globe
} from "lucide-react";

export default function Integrations() {
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const currentIntegrations = [
    {
      name: "Google Calendar",
      description: "Sincronização completa com agenda pessoal e profissional",
      icon: Calendar,
      status: "Ativo",
      category: "Produtividade",
      benefits: ["Agenda sincronizada", "Evita conflitos de horário", "Notificações automáticas"]
    },
    {
      name: "Google Docs",
      description: "Relatórios e documentos de passeios automatizados",
      icon: FileText,
      status: "Ativo",
      category: "Documentação",
      benefits: ["Relatórios automáticos", "Compartilhamento fácil", "Backup na nuvem"]
    },
    {
      name: "GPS Tracking",
      description: "Rastreamento em tempo real dos passeios",
      icon: MapPin,
      status: "Ativo",
      category: "Segurança",
      benefits: ["Transparência total", "Segurança para pets", "Histórico de rotas"]
    },
    {
      name: "PIX",
      description: "Pagamentos instantâneos 24/7 via PIX",
      icon: Zap,
      status: "Ativo",
      category: "Pagamentos",
      benefits: ["Recebimento instantâneo", "Taxas reduzidas", "Disponível 24/7"]
    },
    {
      name: "Sistema de Avaliações",
      description: "Coleta e gestão de avaliações dos clientes",
      icon: Star,
      status: "Ativo",
      category: "Reputação",
      benefits: ["Reputação online", "Feedback estruturado", "Marketing automático"]
    },
    {
      name: "Instagram",
      description: "Integração completa com perfil profissional do Instagram",
      icon: Instagram,
      status: "Ativo",
      category: "Marketing",
      benefits: ["Posts automáticos", "Stories de passeios", "Crescimento orgânico"]
    },
    {
      name: "Zapier",
      description: "Conecte com centenas de outras ferramentas",
      icon: Zap,
      status: "Ativo",
      category: "Automação",
      benefits: ["Integrações ilimitadas", "Workflows personalizados", "Automação avançada"]
    }
  ];

  const upcomingIntegrations = [
    {
      name: "WhatsApp Business API",
      description: "Envio de mensagens e notificações via WhatsApp",
      icon: MessageCircle,
      status: "Em Desenvolvimento",
      category: "Comunicação",
      eta: "Q1 2025",
      benefits: ["Lembretes automáticos", "Confirmações de agendamento", "Comunicação direta"]
    },
    {
      name: "Carteira Digital",
      description: "Carteira digital integrada para pagamentos",
      icon: Wallet,
      status: "Planejado",
      category: "Fintech",
      eta: "Q2 2025",
      benefits: ["Saldo em tempo real", "Transferências instantâneas", "Cashback automático"]
    },
    {
      name: "YouTube Integration",
      description: "Criação automática de conteúdo para YouTube",
      icon: Youtube,
      status: "Em Desenvolvimento",
      category: "Marketing",
      eta: "Q2 2025",
      benefits: ["Vídeos automáticos", "Canal profissional", "Monetização extra"]
    },
    {
      name: "Chatbot Inteligente",
      description: "Atendimento 24/7 com IA para clientes",
      icon: Bot,
      status: "Planejado",
      category: "Atendimento",
      eta: "Q3 2025",
      benefits: ["Atendimento 24/7", "Respostas inteligentes", "Redução de chamados"]
    },
    {
      name: "QR Code Dinâmico",
      description: "QR codes para check-in/out dos passeios",
      icon: QrCode,
      status: "Em Desenvolvimento",
      category: "Operacional",
      eta: "Q3 2025",
      benefits: ["Check-in automático", "Confirmação visual", "Rastreabilidade total"]
    },
    {
      name: "SMS Gateway Premium",
      description: "Envio de SMS premium para notificações críticas",
      icon: Smartphone,
      status: "Planejado",
      category: "Comunicação",
      eta: "Q3 2025",
      benefits: ["Alcance universal", "Confirmação de entrega", "Backup de comunicação"]
    },
    {
      name: "Logística Integrada",
      description: "Sistema de entrega e coleta de pets",
      icon: Truck,
      status: "Em Pesquisa",
      category: "Logística",
      eta: "Q4 2025",
      benefits: ["Coleta e entrega", "Otimização de rotas", "Serviço premium"]
    },
    {
      name: "Pet Camera Live",
      description: "Câmeras ao vivo durante os passeios",
      icon: Camera,
      status: "Em Pesquisa",
      category: "Segurança",
      eta: "Q4 2025",
      benefits: ["Transmissão ao vivo", "Gravação automática", "Tranquilidade total"]
    },
    {
      name: "Marketplace Global",
      description: "Marketplace para venda de produtos pet",
      icon: Globe,
      status: "Planejado",
      category: "E-commerce",
      eta: "Q4 2025",
      benefits: ["Renda extra", "Produtos recomendados", "Comissões automáticas"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800";
      case "Em Desenvolvimento":
        return "bg-blue-100 text-blue-800";
      case "Planejado":
        return "bg-yellow-100 text-yellow-800";
      case "Em Pesquisa":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/landing" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">DW</span>
              </div>
              <span className="text-xl font-bold text-gray-900">DogWalker</span>
            </Link>
          </div>
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
            <Link to="/auth">Entrar</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Integrações Poderosas
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Conectamos sua plataforma DogWalker com as melhores ferramentas do mercado para automatizar seu negócio e maximizar seus resultados
          </p>
          <div className="flex items-center justify-center space-x-8 text-blue-100">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>{currentIntegrations.length} Integrações Ativas</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>{upcomingIntegrations.length} Em Desenvolvimento</span>
            </div>
          </div>
        </div>
      </section>

      {/* Current Integrations */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Integrações Ativas
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ferramentas que já estão funcionando para potencializar seu negócio
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {currentIntegrations.map((integration, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <integration.icon className="w-6 h-6 text-primary" />
                    </div>
                    <Badge className={getStatusColor(integration.status)}>
                      {integration.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {integration.name}
                  </CardTitle>
                  <p className="text-gray-600">{integration.description}</p>
                  <Badge variant="outline" className="w-fit">
                    {integration.category}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {integration.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Integrations */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Próximas Integrações
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Estamos trabalhando nas próximas integrações para tornar sua experiência ainda melhor
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingIntegrations.map((integration, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                      <integration.icon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(integration.status)}>
                        {integration.status}
                      </Badge>
                      {integration.eta && (
                        <p className="text-xs text-gray-500 mt-1">{integration.eta}</p>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {integration.name}
                  </CardTitle>
                  <p className="text-gray-600">{integration.description}</p>
                  <Badge variant="outline" className="w-fit">
                    {integration.category}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {integration.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Request Integration */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Precisa de uma integração específica?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Nossa equipe está sempre ouvindo nossos usuários. Se você precisa de uma integração que não está em nossa lista, entre em contato conosco!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => setShowSuggestionModal(true)}
              >
                Sugerir Integração
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Comece a usar nossas integrações hoje
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Todas as integrações ativas estão disponíveis gratuitamente para todos os planos
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
            <Link to="/auth">Começar Agora - Grátis</Link>
          </Button>
          <p className="text-blue-200 mt-4 text-sm">
            ✨ 30 dias grátis • Todas as integrações incluídas • Suporte completo
          </p>
        </div>
      </section>

      <PublicFooter />

      {/* Integration Suggestion Modal */}
      <IntegrationSuggestionModal 
        open={showSuggestionModal}
        onOpenChange={setShowSuggestionModal}
      />
    </div>
  );
}
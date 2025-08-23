import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Star, Clock, Shield, Users, TrendingUp, Zap, Calendar } from "lucide-react";
import ContactModal from "@/components/contact/ContactModal";
export default function TestLanding() {
  const [contactModalOpen, setContactModalOpen] = useState(false);

  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">DW</span>
            </div>
            <span className="text-xl font-bold text-gray-900">DogWalker</span>
          </div>
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
            <Link to="/auth">Entrar</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: "url('/lovable-uploads/aba0567e-a11d-4cfb-973b-deb770b5bbb3.png')"
      }}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Transforme sua
              <span className="text-primary block">Paixão por Pets</span>
              em Negócio Lucrativo
            </h1>
            <p className="text-xl mb-8 text-gray-200 leading-relaxed">
              A plataforma completa que conecta dog walkers profissionais com tutores que buscam o melhor cuidado para seus pets. Gerencie, cresça e fature mais com nossa tecnologia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">
                <Link to="/plan-signup?plan=free">Começar Agora - Grátis</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 text-foreground border-white hover:bg-white hover:text-gray-900">
                Ver Como Funciona
              </Button>
            </div>
            <div className="flex items-center mt-6 space-x-6 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Setup em 5 minutos</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Teste Grátis por 30 Dias</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 mb-8">Confiado por mais de 2.500+ Dog Walkers</p>
          <div className="flex items-center justify-center space-x-8 text-gray-400">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="font-semibold text-gray-900">4.9</span>
              <span>de 5 estrelas</span>
            </div>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <span className="font-semibold text-gray-900">R$ 2.3M+</span>
              <span className="ml-1">faturados pelos usuários</span>
            </div>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <span className="font-semibold text-gray-900">50k+</span>
              <span className="ml-1">passeios realizados</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa para profissionalizar
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Uma solução completa que cuida de todos os aspectos do seu negócio
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[{
            icon: Calendar,
            title: "Agendamento Inteligente",
            description: "Sistema automatizado que otimiza sua agenda e maximiza seus ganhos",
            features: ["Agenda sincronizada", "Notificações automáticas", "Remarcação fácil"]
          }, {
            icon: Users,
            title: "Gestão de Clientes",
            description: "Mantenha histórico completo e construa relacionamentos duradouros",
            features: ["Perfis detalhados", "Histórico de passeios", "Notas personalizadas"]
          }, {
            icon: Shield,
            title: "Pagamentos Seguros",
            description: "Receba automaticamente sem se preocupar com cobranças",
            features: ["PIX automático", "Cartão integrado", "Relatórios financeiros"]
          }, {
            icon: Zap,
            title: "Marketing Automático",
            description: "Atraia novos clientes com nossa tecnologia de marketing",
            features: ["Perfil público otimizado", "SEO local", "Avaliações gerenciadas"]
          }, {
            icon: TrendingUp,
            title: "Relatórios e Analytics",
            description: "Dados que ajudam você a tomar decisões inteligentes",
            features: ["Dashboard completo", "Métricas de performance", "Insights de crescimento"]
          }, {
            icon: Clock,
            title: "Economia de Tempo",
            description: "Automatize tarefas repetitivas e foque no que importa",
            features: ["Automação de processos", "Templates prontos", "Integração WhatsApp"]
          }].map((feature, index) => <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((item, itemIndex) => <li key={itemIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {item}
                      </li>)}
                  </ul>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Success Story */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{
        backgroundImage: "url('/lovable-uploads/ec19f0a6-d9d9-4414-a975-0fbeaefeeffd.png')"
      }}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-blue-600/90"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-8">"Ajudou a organizar e crescer meu negócio"</h2>
            <p className="text-xl mb-8 leading-relaxed">"Antes usava planilhas e WhatsApp para tudo. Com a DogWalker, automatizei pagamentos, organizei minha agenda e consegui atender mais clientes. DogWalker transformou meu negócio."</p>
            <div className="flex items-center justify-center space-x-4">
              
              <div className="text-left">
                <p className="font-semibold text-center">Roberto Silva</p>
                <p className="text-white/80 text-center">Dog Walker Profissional - São Paulo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Planos que crescem com você
            </h2>
            <p className="text-xl text-gray-600">
              Comece grátis e evolua conforme seu negócio cresce
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[{
            name: "Gratuito",
            price: "R$ 0",
            period: "/mês",
            description: "Até 5 clientes ativos ou 30 dias gratuitos",
            features: ["Até 5 clientes ativos", "1 região de atendimento", "Até 10 agendamentos semanais", "Página de agendamento básica", "Suporte por chat"],
            cta: "Começar Grátis",
            popular: false
          }, {
            name: "Básico",
            price: "R$ 29",
            period: "/mês",
            description: "Para dog walkers em crescimento",
            features: ["Até 15 clientes ativos", "Até 3 regiões de atendimento", "Agenda completa", "Cadastro de pets", "Histórico de serviços", "Cobrança manual via Pix", "Notificações por e-mail"],
            cta: "Selecionar Plano",
            popular: true
          }, {
            name: "Profissional",
            price: "R$ 59",
            period: "/mês",
            description: "Para expansão e automatização completa",
            features: ["Até 30 clientes ativos", "Regiões ilimitadas", "Cadastro completo de pets", "Histórico detalhado de serviços", "Cobrança automática (cartão e PIX)", "Notificações WhatsApp + SMS", "Relatórios avançados", "GPS tracking"],
            cta: "Selecionar Plano",
            popular: false
          }].map((plan, index) => <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-primary scale-105' : ''} hover:shadow-xl transition-all duration-300`}>
                {plan.popular && <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                    Mais Popular
                  </Badge>}
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <Button 
                    asChild 
                    className={`w-full mb-6 ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`} 
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    <Link to={`/plan-signup?plan=${plan.name === 'Gratuito' ? 'free' : plan.name === 'Básico' ? 'basic' : 'professional'}`}>
                      {plan.cta}
                    </Link>
                  </Button>
                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature, featureIndex) => <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>)}
                  </ul>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-gray-600">
              Tudo que você precisa saber para começar
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {[{
                question: "Como funciona o período gratuito?",
                answer: "Você tem 30 dias para testar todas as funcionalidades sem precisar informar cartão de crédito. Apenas crie sua conta e comece a usar."
              }, {
                question: "Posso cancelar a qualquer momento?",
                answer: "Sim, você pode cancelar seu plano a qualquer momento. Não há multas ou taxas de cancelamento."
              }, {
                question: "Como recebo os pagamentos dos clientes?",
                answer: "Os pagamentos são processados automaticamente e transferidos para a sua conta conforme regras e prazos da empresa de processamento de pagamento."
              }, {
                question: "Preciso de conhecimento técnico para usar?",
                answer: "Não! Nossa plataforma foi desenvolvida para ser intuitiva. Oferecemos treinamento gratuito e suporte completo para começar."
              }, {
                question: "Posso personalizar minha página de agendamento?",
                answer: "Sim! Você pode personalizar cores, adicionar sua logo, definir horários de funcionamento e criar mensagens personalizadas para seus clientes."
              }, {
                question: "Como funciona o sistema de notificações?",
                answer: "Enviamos lembretes automáticos por WhatsApp, SMS e e-mail para você e seus clientes sobre agendamentos, confirmações e cancelamentos."
              }, {
                question: "Há integração com outros aplicativos?",
                answer: "Sim, integramos com Google Calendar, WhatsApp Business, sistemas de pagamento PIX e principais gateways de cartão de crédito."
              }, {
                question: "Como funciona o reembolso da assinatura?",
                answer: "O reembolso do serviço pode ser efetuado até 7 dias do pagamento caso o dog walker não esteja satisfeito por qualquer que seja o motivo. Basta entrar em contato com nosso suporte."
              }].map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg bg-white shadow-sm">
                  <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-gray-50 rounded-t-lg data-[state=open]:rounded-b-none">
                    <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-2">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para transformar seu negócio?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de dog walkers que já descobriram como profissionalizar e escalar seus negócios
          </p>
          <div className="flex justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link to="/plan-signup?plan=free">Começar Teste Grátis Agora</Link>
            </Button>
          </div>
          <p className="text-blue-200 mt-4 text-sm">
            ✨ 30 dias grátis • Sem cartão de crédito • Cancelamento a qualquer momento
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DW</span>
                </div>
                <span className="text-xl font-bold text-white">DogWalker</span>
              </div>
              <p className="text-gray-400">
                A plataforma que transforma dog walkers em empresários de sucesso.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Produto</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="hover:text-white transition-colors">Funcionalidades</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Preços</Link></li>
                <li><Link to="/integrations" className="hover:text-white transition-colors">Integrações</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="hover:text-white transition-colors">Central de Ajuda</Link></li>
                <li><button onClick={() => setContactModalOpen(true)} className="hover:text-white transition-colors text-left">Contato</button></li>
                <li><Link to="#" className="hover:text-white transition-colors">WhatsApp</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-white transition-colors">Sobre</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Termos de Uso</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Política de Privacidade</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 DogWalker. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      <ContactModal 
        open={contactModalOpen} 
        onOpenChange={setContactModalOpen} 
      />
    </div>;
}
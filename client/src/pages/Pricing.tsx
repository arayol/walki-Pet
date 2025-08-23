import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { ConsultationModal } from "@/components/pricing/ConsultationModal";
import { PublicFooter } from "@/components/shared/PublicFooter";
const Pricing = () => {
  const [showConsultationModal, setShowConsultationModal] = useState(false);
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
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Escolha seu <span className="text-primary">Plano Ideal</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Soluções escaláveis para dog walkers de todos os tamanhos. Comece grátis e cresça com nossos recursos profissionais.
          </p>
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full mb-8">
            <Star className="h-4 w-4 mr-2" />
            Comece com o plano gratuito - sem cartão de crédito
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            
            {/* Plano Gratuito */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Gratuito</h3>
                <p className="text-gray-600 mb-4">
                  Ideal para começar seu negócio de passeio com cães com funcionalidades básicas.
                </p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">R$ 0</span>
                  <span className="text-gray-600">/mês</span>
                </div>
                <p className="text-sm text-gray-500 mb-6">5 clientes ativos ou 30 dias de teste</p>
              </div>

              <Button asChild className="w-full bg-primary text-white hover:bg-primary/90 mb-6" size="lg">
                <Link to="/plan-signup?plan=free">Iniciar Teste</Link>
              </Button>

              <div className="space-y-4">
                <p className="font-semibold text-gray-900 mb-4">Inclui:</p>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Até 5 clientes ativos</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">1 região de atendimento</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Até 10 agendamentos semanais</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Página de agendamento personalizada</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Suporte por chat</span>
                </div>
              </div>
            </div>

            {/* Plano Básico */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Básico</h3>
                <p className="text-gray-600 mb-4">
                  Para dog walkers que estão crescendo e precisam de mais funcionalidades para gerenciar seus clientes.
                </p>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-900">R$ 29</span>
                  <span className="text-gray-600">/mês</span>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">ou R$ 300/ano</div>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs inline-block">
                    Desconto R$ 48 no plano anual
                  </div>
                </div>
              </div>

              <Button asChild className="w-full bg-primary text-white hover:bg-primary/90 mb-6" size="lg">
                <Link to="/plan-signup?plan=basic">Comece Grátis</Link>
              </Button>

              <div className="space-y-4">
                <p className="font-semibold text-gray-900 mb-4">Plano Gratuito, mais:</p>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Até 15 clientes ativos</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Até 3 regiões de atendimento</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Cobrança manual via Pix</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Controle básico de agenda</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Relatórios básicos de passeios</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Cadastro completo de pets</span>
                </div>
              </div>
            </div>

            {/* Plano Profissional */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                
              </div>
              
              <div className="mb-6 mt-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Profissional</h3>
                <p className="text-gray-600 mb-4">
                  Para dog walkers profissionais que desejam expandir seus negócios com recursos avançados.
                </p>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-900">R$ 59</span>
                  <span className="text-gray-600">/mês</span>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">ou R$ 595/ano</div>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs inline-block">
                    Desconto R$ 113 no plano anual
                  </div>
                </div>
              </div>

              <Button asChild className="w-full bg-primary text-white hover:bg-primary/90 mb-6" size="lg">
                <Link to="/plan-signup?plan=professional">Comece Grátis</Link>
              </Button>

              <div className="space-y-4">
                <p className="font-semibold text-gray-900 mb-4">Plano Básico, mais:</p>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Clientes ilimitados</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Regiões ilimitadas</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Cobrança automática por cartão</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Notificações WhatsApp + SMS</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">GPS tracking dos passeios</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Fotos automáticas dos passeios</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Sistema de avaliações</span>
                </div>
              </div>
            </div>

            {/* Plano Studio */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Studio</h3>
                <p className="text-gray-600 mb-4">
                  Para grandes empresas de pet care que precisam de soluções personalizadas e escalabilidade.
                </p>
                <div className="mb-6">
                  <div className="text-2xl font-bold text-gray-900 mb-2">Preços</div>
                  <div className="text-2xl font-bold text-gray-900">customizados</div>
                </div>
              </div>

              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white mb-6" size="lg" onClick={() => setShowConsultationModal(true)}>
                Consultar
              </Button>

              <div className="space-y-4">
                <p className="font-semibold text-gray-900 mb-4">Todas as funcionalidades, mais:</p>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Suporte premium prioritário</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Integração com API personalizada</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Relatórios customizados</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Gerenciamento de múltiplos dog walkers</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Dashboard administrativo avançado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Compare os Planos
            </h2>
            <p className="text-xl text-gray-600">
              Encontre o plano perfeito para suas necessidades
            </p>
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-6 px-6 font-semibold text-gray-900">Recurso</th>
                  <th className="text-center py-6 px-6 font-semibold text-gray-900">Gratuito</th>
                  <th className="text-center py-6 px-6 font-semibold text-gray-900">Básico</th>
                  <th className="text-center py-6 px-6 font-semibold text-gray-900">Profissional</th>
                  <th className="text-center py-6 px-6 font-semibold text-gray-900">Studio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 px-6 font-medium">Clientes ativos</td>
                  <td className="text-center py-4 px-6">Até 5</td>
                  <td className="text-center py-4 px-6">Até 15</td>
                  <td className="text-center py-4 px-6 font-semibold text-gray-900">Ilimitado</td>
                  <td className="text-center py-4 px-6">Ilimitado</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-4 px-6 font-medium">Regiões de atendimento</td>
                  <td className="text-center py-4 px-6">1</td>
                  <td className="text-center py-4 px-6">Até 3</td>
                  <td className="text-center py-4 px-6 font-semibold text-gray-900">Ilimitadas</td>
                  <td className="text-center py-4 px-6">Ilimitadas</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">Controle de agenda</td>
                  <td className="text-center py-4 px-6">Básico</td>
                  <td className="text-center py-4 px-6">Avançado</td>
                  <td className="text-center py-4 px-6 font-semibold text-gray-900">Completo</td>
                  <td className="text-center py-4 px-6">Completo</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-4 px-6 font-medium">Notificações</td>
                  <td className="text-center py-4 px-6"><X className="h-5 w-5 text-red-500 mx-auto" /></td>
                  <td className="text-center py-4 px-6">E-mail</td>
                  <td className="text-center py-4 px-6">WhatsApp + SMS</td>
                  <td className="text-center py-4 px-6">Avançadas</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">Cobrança automática</td>
                  <td className="text-center py-4 px-6"><X className="h-5 w-5 text-red-500 mx-auto" /></td>
                  <td className="text-center py-4 px-6">Manual (Pix)</td>
                  <td className="text-center py-4 px-6"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-4 px-6 font-medium">Suporte</td>
                  <td className="text-center py-4 px-6">E-mail</td>
                  <td className="text-center py-4 px-6">E-mail</td>
                  <td className="text-center py-4 px-6">Chat</td>
                  <td className="text-center py-4 px-6">Chat</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de dog walkers que já transformaram suas vidas com nossa plataforma.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-primary">
            <Link to="/plan-signup?plan=free">Começar Grátis Agora</Link>
          </Button>
        </div>
      </section>

      <PublicFooter />

      {/* Modal de Consulta */}
      <ConsultationModal open={showConsultationModal} onOpenChange={setShowConsultationModal} />
    </div>;
};
export default Pricing;
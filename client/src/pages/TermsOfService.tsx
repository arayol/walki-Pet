import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ConsultationModal } from "@/components/pricing/ConsultationModal";
import { PublicFooter } from "@/components/shared/PublicFooter";

export default function TermsOfService() {
  const navigate = useNavigate();
  const [showConsultationModal, setShowConsultationModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button 
            onClick={() => navigate(-1)} 
            variant="ghost" 
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">DW</span>
            </div>
            <span className="text-xl font-bold text-gray-900">DogWalker</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-900">
              Termos de Uso
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none p-8">
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-sm text-gray-500">Última atualização: Janeiro de 2024</p>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Aceitação dos Termos</h2>
                <p>
                  Ao acessar e usar a plataforma DogWalker, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes termos, não deve usar nosso serviço.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Descrição do Serviço</h2>
                <p>
                  O DogWalker é uma plataforma digital que conecta dog walkers profissionais com proprietários de pets, oferecendo ferramentas de agendamento, gestão de clientes, cobrança e comunicação para facilitar a prestação de serviços de passeio e cuidado de animais.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Elegibilidade</h2>
                <p>
                  Para usar nossos serviços, você deve ter pelo menos 18 anos de idade e ter capacidade legal para celebrar contratos. Ao se registrar, você declara que todas as informações fornecidas são verdadeiras e precisas.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Contas de Usuário</h2>
                <p>
                  Você é responsável por manter a confidencialidade de sua conta e senha. Você concorda em aceitar a responsabilidade por todas as atividades que ocorrem sob sua conta.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Uso Aceitável</h2>
                <p>
                  Você concorda em usar a plataforma apenas para fins legais e de acordo com estes termos. É proibido usar o serviço para atividades fraudulentas, spam, violação de direitos autorais ou qualquer atividade que possa danificar ou sobrecarregar nossa infraestrutura.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Pagamentos e Reembolsos</h2>
                <p>
                  Os pagamentos pelos planos de assinatura são processados através de nossos parceiros de pagamento. Oferecemos reembolso integral dentro de 7 dias da data de pagamento, sem necessidade de justificativa.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Propriedade Intelectual</h2>
                <p>
                  Todo o conteúdo da plataforma, incluindo textos, gráficos, logos, ícones e software, é propriedade do DogWalker e está protegido por leis de direitos autorais e propriedade intelectual.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Limitação de Responsabilidade</h2>
                <p>
                  O DogWalker não será responsável por danos indiretos, incidentais, especiais ou consequenciais resultantes do uso ou incapacidade de usar nossos serviços.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Modificações dos Termos</h2>
                <p>
                  Reservamos o direito de modificar estes termos a qualquer momento. As alterações serão comunicadas por email e entrarão em vigor 30 dias após a notificação.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Rescisão</h2>
                <p>
                  Podemos suspender ou encerrar sua conta a qualquer momento, com ou sem motivo, mediante notificação prévia. Você pode cancelar sua conta a qualquer momento através das configurações da plataforma.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Lei Aplicável</h2>
                <p>
                  Estes termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será resolvida nos tribunais competentes do estado de São Paulo.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Contato</h2>
                <p>
                  Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através do formulário abaixo ou pelo email: legal@dogwalker.com.br
                </p>
              </section>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Dúvidas sobre os Termos de Uso?
              </h3>
              <p className="text-gray-600 mb-6">
                Nossa equipe está disponível para esclarecer qualquer ponto destes termos.
              </p>
              <Button 
                onClick={() => setShowConsultationModal(true)}
                className="bg-primary text-white hover:bg-primary/90"
              >
                Tire suas Dúvidas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <PublicFooter />

      <ConsultationModal 
        open={showConsultationModal} 
        onOpenChange={setShowConsultationModal}
        customSubject="Dúvidas sobre Termos de Uso - DogWalker"
        hideCompany={true}
        hidePhone={true}
        maxMessageLength={500}
      />
    </div>
  );
}
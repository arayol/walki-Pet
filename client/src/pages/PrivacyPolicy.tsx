import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ConsultationModal } from "@/components/pricing/ConsultationModal";
import { PublicFooter } from "@/components/shared/PublicFooter";

export default function PrivacyPolicy() {
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
              Política de Privacidade
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none p-8">
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-sm text-gray-500">Última atualização: Janeiro de 2024</p>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Informações que Coletamos</h2>
                <p>
                  Coletamos informações que você nos fornece diretamente, como nome, email, telefone, endereço e informações de pagamento quando você se cadastra ou usa nossos serviços. Também coletamos dados sobre como você usa nossa plataforma, incluindo logs de acesso, localização e dados de dispositivo.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Como Usamos suas Informações</h2>
                <p>
                  Utilizamos suas informações para fornecer, manter e melhorar nossos serviços, processar pagamentos, enviar notificações importantes, responder a solicitações de suporte e personalizar sua experiência na plataforma.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Compartilhamento de Informações</h2>
                <p>
                  Não vendemos suas informações pessoais. Podemos compartilhar dados com prestadores de serviços terceirizados que nos ajudam a operar nossa plataforma, como processadores de pagamento e serviços de email, sempre sob rigorosos acordos de confidencialidade.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Segurança dos Dados</h2>
                <p>
                  Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui criptografia de dados, controles de acesso e auditorias regulares de segurança.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Retenção de Dados</h2>
                <p>
                  Mantemos suas informações pessoais pelo tempo necessário para cumprir as finalidades descritas nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Seus Direitos</h2>
                <p>
                  Você tem o direito de acessar, corrigir, excluir ou transferir suas informações pessoais. Também pode solicitar a limitação do processamento de seus dados ou se opor ao processamento. Para exercer esses direitos, entre em contato conosco através dos canais disponibilizados.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Transferências Internacionais</h2>
                <p>
                  Seus dados podem ser transferidos e processados em países diferentes do seu país de residência. Garantimos que essas transferências sejam realizadas com as devidas proteções e salvaguardas de acordo com a legislação aplicável.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Política de Cookies</h2>
                <p>
                  Utilizamos cookies e tecnologias similares para melhorar sua experiência em nossa plataforma. Os cookies nos ajudam a lembrar suas preferências, entender como você usa nossos serviços e personalizar conteúdo.
                </p>
                <div className="ml-4 mt-3 space-y-2">
                  <p><strong>Cookies Essenciais:</strong> Necessários para o funcionamento básico da plataforma, como autenticação e segurança.</p>
                  <p><strong>Cookies de Performance:</strong> Coletam informações sobre como você usa nosso site para melhorar a performance.</p>
                  <p><strong>Cookies de Funcionalidade:</strong> Permitem que o site lembre suas escolhas e forneça recursos aprimorados.</p>
                  <p><strong>Cookies de Marketing:</strong> Usados para exibir anúncios relevantes e medir a eficácia de campanhas publicitárias.</p>
                </div>
                <p className="mt-3">
                  Você pode gerenciar suas preferências de cookies através das configurações do seu navegador. Note que desabilitar certos cookies pode afetar a funcionalidade da plataforma.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Menores de Idade</h2>
                <p>
                  Nossos serviços não são destinados a menores de 18 anos. Não coletamos intencionalmente informações pessoais de crianças. Se soubermos que coletamos dados de uma criança, tomaremos medidas para excluir essas informações.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Alterações nesta Política</h2>
                <p>
                  Podemos atualizar esta política de privacidade periodicamente. Notificaremos você sobre mudanças significativas por email ou através de aviso em nossa plataforma. O uso continuado de nossos serviços após as alterações constitui aceitação da política revisada.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Base Legal para Processamento</h2>
                <p>
                  Processamos seus dados pessoais com base em diferentes fundamentos legais, incluindo seu consentimento, execução de contrato, cumprimento de obrigações legais e nossos interesses legítimos em fornecer e melhorar nossos serviços.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Contato e Encarregado de Proteção de Dados</h2>
                <p>
                  Se você tiver dúvidas sobre esta política de privacidade ou sobre como tratamos seus dados pessoais, entre em contato com nosso Encarregado de Proteção de Dados pelo email: privacy@dogwalker.com.br ou através do formulário abaixo.
                </p>
              </section>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Dúvidas sobre nossa Política de Privacidade?
              </h3>
              <p className="text-gray-600 mb-6">
                Nossa equipe está disponível para esclarecer como protegemos suas informações.
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
        customSubject="Dúvidas sobre Política de Privacidade - DogWalker"
        hideCompany={true}
        hidePhone={true}
        maxMessageLength={500}
      />
    </div>
  );
}
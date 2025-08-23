import { useState } from "react";
import { Link } from "react-router-dom";
import ContactModal from "@/components/contact/ContactModal";
import { PublicFooter } from "@/components/shared/PublicFooter";

export default function About() {
  const [contactModalOpen, setContactModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">DogWalker</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
                Início
              </Link>
              <Link to="/pricing" className="text-gray-600 hover:text-primary transition-colors">
                Preços
              </Link>
              <Link to="/about" className="text-primary font-medium">
                Sobre
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 lg:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Quem é a Uplay?
          </h1>
          
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <p>
              A Uplay Tecnologia nasceu com um pé no código e outro na criatividade. Desde 2003, a gente desenvolve soluções digitais e distribui conteúdo de qualidade para empresas e plataformas que querem fazer diferente.
            </p>
            
            <p>
              Sim, somos tecnologia — mas nosso verdadeiro talento é transformar ideias em produtos que funcionam de verdade, sejam eles plataformas, apps, ou experiências de entretenimento que viajam pelo mundo (literalmente!).
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
              Duas frentes, um mesmo propósito
            </h2>

            <div className="grid md:grid-cols-2 gap-8 my-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Desenvolvimento de software
                </h3>
                <p>
                  Criamos sistemas, plataformas e ferramentas digitais pensadas para resolver problemas reais — com design inteligente, boa usabilidade e foco no que realmente importa: facilitar a vida de quem usa.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Licenciamento de conteúdo
                </h3>
                <p>
                  Cuidamos da curadoria e distribuição de conteúdos como podcasts, vídeos e audiobooks para companhias aéreas, apps e canais de mídia. A gente leva boas histórias para onde elas merecem chegar.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
              E agora… entramos no mundo pet
            </h2>
            
            <p>
              Com toda essa bagagem, decidimos criar algo novo — voltado para quem cuida dos pets com carinho e profissionalismo: os Dog Walkers.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              Conheça nossa nova plataforma para Dog Walkers
            </h3>
            
            <p>
              A gente sabe que ser dog walker é muito mais do que dar uma voltinha no quarteirão. É ter responsabilidade, rotina, clientes (de quatro patas e de duas) e ainda dar conta da parte chata: agenda, pagamento, fidelização…
            </p>
            
            <p>
              Por isso criamos uma plataforma que ajuda esses profissionais a gerenciar tudo isso com praticidade — como um assistente digital que não late, mas organiza sua vida.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
              Uplay: de software a passeios com cães
            </h2>
            
            <p>
              Tecnologia não precisa ser complicada. Nosso objetivo é criar soluções que sejam tão simples quanto eficazes — seja para grandes empresas ou para o dog walker do seu bairro.
            </p>
            
            <p className="mb-8">
              E o melhor? A gente faz tudo isso com o mesmo cuidado que colocamos em cada linha de código ou em cada conteúdo licenciado.
            </p>
          </div>
        </div>
      </main>

      <PublicFooter />

      <ContactModal 
        open={contactModalOpen} 
        onOpenChange={setContactModalOpen} 
      />
    </div>
  );
}

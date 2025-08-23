import { Link } from "react-router-dom";
import { useState } from "react";
import ContactModal from "@/components/contact/ContactModal";

export const PublicFooter = () => {
  const [contactModalOpen, setContactModalOpen] = useState(false);

  return (
    <>
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
                <li><Link to="/landing" className="hover:text-white transition-colors">Funcionalidades</Link></li>
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
    </>
  );
};
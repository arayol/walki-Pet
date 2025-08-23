import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Instagram } from "lucide-react";

interface InstagramHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect?: () => void;
}

export const InstagramHelpModal = ({ isOpen, onClose, onConnect }: InstagramHelpModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Instagram className="h-5 w-5 text-pink-500" />
            Como integrar seu Instagram
          </DialogTitle>
          <DialogDescription>
            Conecte sua conta do Instagram para exibir suas últimas fotos no seu perfil público
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg border">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Instagram className="h-5 w-5 text-pink-500" />
              Como funciona a integração OAuth
            </h3>
            <p className="text-gray-700 text-sm">
              Nossa integração utiliza o protocolo OAuth oficial do Instagram para conectar sua conta de forma 
              segura. Funciona tanto para contas pessoais quanto Business/Creator.
            </p>
          </div>

          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-blue-900">1. Clique em "Conectar Instagram"</h4>
              <p className="text-gray-600 text-sm mt-1">
                Uma nova janela será aberta direcionando você para o Instagram oficial para autorizar nossa aplicação.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-green-900">2. Autorize no Instagram</h4>
              <p className="text-gray-600 text-sm mt-1">
                Faça login na sua conta do Instagram e autorize nossa aplicação a acessar suas fotos públicas 
                e informações básicas do perfil.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-purple-900">3. Sincronização automática</h4>
              <p className="text-gray-600 text-sm mt-1">
                Após autorizar, suas últimas 4 fotos aparecerão automaticamente no seu perfil público. 
                A sincronização é atualizada diariamente.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-semibold text-orange-900">4. Detecção de tipo de conta</h4>
              <p className="text-gray-600 text-sm mt-1">
                Nossa API detecta automaticamente se sua conta é pessoal, business ou creator e 
                usa a melhor estratégia para obter suas fotos.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h3 className="font-semibold text-amber-900 mb-2">🔒 Segurança e Privacidade</h3>
            <ul className="text-amber-800 text-sm space-y-1">
              <li>• Usamos apenas APIs oficiais do Instagram</li>
              <li>• Não armazenamos suas credenciais de login</li>
              <li>• Apenas fotos públicas são exibidas</li>
              <li>• Você pode revogar o acesso a qualquer momento</li>
              <li>• Token de acesso é criptografado e seguro</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">✨ Benefícios da integração</h3>
            <ul className="text-green-800 text-sm space-y-1">
              <li>• Mostre seu trabalho com pets em tempo real</li>
              <li>• Aumente a confiança dos clientes</li>
              <li>• Mantenha seu perfil sempre atualizado</li>
              <li>• Funciona automaticamente sem manutenção</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={() => {
                onConnect?.();
                onClose();
              }}
            >
              <Instagram className="h-4 w-4 mr-2" />
              Conectar Instagram
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
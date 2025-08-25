
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, X } from "lucide-react";
// Removed supabase import - using REST APIs instead
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  amount: number;
  status: string;
  stripe_payment_id: string | null;
  paid_at: string | null;
  created_at: string;
  payment_method: string | null;
  clients: {
    client_name: string;
    pet_name: string;
    client_id: string;
  };
}

interface PaymentNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onSuccess: () => void;
}

export const PaymentNotificationModal = ({ 
  isOpen, 
  onClose, 
  transaction, 
  onSuccess 
}: PaymentNotificationModalProps) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [clientPhone, setClientPhone] = useState("");
  const { toast } = useToast();

  const defaultMessage = transaction ? 
    `Olá ${transaction.clients?.client_name || 'Cliente'}!

Esperamos que você e o ${transaction.clients?.pet_name || 'seu pet'} estejam bem!

Notamos que o pagamento do serviço realizado ainda está pendente no valor de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)}.

Para finalizar o pagamento, por favor acesse o link que foi enviado anteriormente ou entre em contato conosco.

Agradecemos a compreensão!

Atenciosamente,
Equipe de Pet Care` : "";

  useEffect(() => {
    if (transaction) {
      setMessage(defaultMessage);
      fetchClientPhone();
    }
  }, [transaction]);

  const fetchClientPhone = async () => {
    if (!transaction) return;

    try {
      // Buscar dados do cliente via API REST
      const response = await fetch(`/api/clients/${transaction.clients.client_id}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }
      
      const clientData = await response.json();
      
      // Usar o campo phone do cliente, ou emergency_contact se phone não existir
      setClientPhone(clientData?.phone || clientData?.emergency_contact || "");
    } catch (error) {
      console.error("Erro ao buscar telefone do cliente:", error);
    }
  };

  const handleSendWhatsApp = () => {
    if (!clientPhone.trim()) {
      toast({
        title: "Erro",
        description: "Número de telefone do cliente não encontrado.",
        variant: "destructive",
      });
      return;
    }

    // Limpar o número de telefone (remover caracteres especiais)
    const cleanPhone = clientPhone.replace(/\D/g, "");
    
    // Verificar se o número tem o código do país (assumindo Brasil +55)
    const phoneWithCountryCode = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
    
    // Codificar a mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Criar o link universal do WhatsApp
    const whatsappURL = `https://wa.me/${phoneWithCountryCode}?text=${encodedMessage}`;
    
    // Abrir o WhatsApp
    window.open(whatsappURL, "_blank");
    
    // Marcar como sucesso
    onSuccess();
    
    toast({
      title: "WhatsApp Aberto",
      description: "O WhatsApp foi aberto com a mensagem pronta para envio.",
    });
  };

  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            Enviar Lembrete de Pagamento
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Detalhes da Transação */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-semibold">{transaction.clients.client_name || 'Cliente'}</h4>
                <p className="text-sm text-gray-600">Pet: {transaction.clients.pet_name || 'Pet'}</p>
              </div>
              <Badge variant="outline" className="border-orange-400 text-orange-600">
                Pendente
              </Badge>
            </div>
            {clientPhone && (
              <p className="text-sm text-gray-600 mb-2">
                Telefone: {clientPhone}
              </p>
            )}
            <p className="text-lg font-bold text-green-600 mt-2">
              {new Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
              }).format(transaction.amount)}
            </p>
          </div>

          {/* Campo de Mensagem */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Mensagem do WhatsApp
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem personalizada..."
              className="min-h-[200px]"
            />
            <p className="text-xs text-gray-500 mt-1">
              Esta mensagem será enviada via WhatsApp para o cliente
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSendWhatsApp}
              disabled={loading || !message.trim() || !clientPhone.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Abrir WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

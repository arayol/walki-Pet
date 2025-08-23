import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ContactModal({ open, onOpenChange }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    if (field === 'message' && value.length > 500) {
      return; // Não permite mais de 500 caracteres
    }
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de campos obrigatórios
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate successful message sending for now
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

      toast({
        title: "Mensagem enviada!",
        description: "Recebemos sua mensagem e entraremos em contato em breve.",
      });

      // Reset form and close modal
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Entre em Contato</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Seu nome completo"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>
          
          <div>
            <Label htmlFor="message">Mensagem *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder="Como podemos ajudar você?"
              rows={4}
              required
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {formData.message.length}/500 caracteres
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Enviando..." : "Enviar Mensagem"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
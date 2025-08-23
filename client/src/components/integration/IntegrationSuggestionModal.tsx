import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface IntegrationSuggestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const IntegrationSuggestionModal = ({ open, onOpenChange }: IntegrationSuggestionModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    integration_name: '',
    suggestion: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.integration_name) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate successful email sending for now - can be implemented with API later
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

      toast({
        title: "Sugestão enviada!",
        description: "Nossa equipe irá analisar sua sugestão de integração.",
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        integration_name: '',
        suggestion: ''
      });
      onOpenChange(false);
    } catch (error: any) {
      console.error('Erro ao enviar sugestão:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua sugestão. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sugerir Nova Integração</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para sugerir uma nova integração para a plataforma DogWalker.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Seu nome completo"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="seu.email@exemplo.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Empresa</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder="Nome da sua empresa (opcional)"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="integration_name">Nome da Integração *</Label>
            <Input
              id="integration_name"
              value={formData.integration_name}
              onChange={(e) => handleChange('integration_name', e.target.value)}
              placeholder="Ex: Integração com PetShop X"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="suggestion">Descrição da Sugestão</Label>
            <Textarea
              id="suggestion"
              value={formData.suggestion}
              onChange={(e) => handleChange('suggestion', e.target.value)}
              placeholder="Descreva como essa integração funcionaria e quais benefícios traria..."
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.name || !formData.email || !formData.integration_name}
            >
              {isLoading ? "Enviando..." : "Enviar Sugestão"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
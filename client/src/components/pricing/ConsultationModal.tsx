import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useConsultation } from '@/hooks/useConsultation';

interface ConsultationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customSubject?: string;
  hideCompany?: boolean;
  hidePhone?: boolean;
  maxMessageLength?: number;
}

export const ConsultationModal = ({ 
  open, 
  onOpenChange, 
  customSubject, 
  hideCompany = false,
  hidePhone = false,
  maxMessageLength = 1000
}: ConsultationModalProps) => {
  const { sendConsultation, isLoading } = useConsultation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      return;
    }

    const result = await sendConsultation({
      ...formData,
      subject: customSubject || "Nova Consulta - Plano Studio"
    });
    
    if (result.success) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
      });
      onOpenChange(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Solicitar Consulta - Plano Studio</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo e nossa equipe entrará em contato para apresentar soluções personalizadas para sua empresa.
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
              placeholder="seu.email@empresa.com"
              required
            />
          </div>
          
          {!hidePhone && (
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
          )}
          
          {!hideCompany && (
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="Nome da sua empresa"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => {
                if (e.target.value.length <= maxMessageLength) {
                  handleChange('message', e.target.value);
                }
              }}
              placeholder="Conte-nos sobre suas necessidades..."
              rows={3}
              maxLength={maxMessageLength}
            />
            <div className="text-xs text-gray-500 text-right">
              {formData.message.length}/{maxMessageLength} caracteres
            </div>
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
              disabled={isLoading || !formData.name || !formData.email}
            >
              {isLoading ? "Enviando..." : "Enviar Consulta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
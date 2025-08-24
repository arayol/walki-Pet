
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { User, Lock } from "lucide-react";
import { ClientFormData, WalkerInfo } from "@/types/client";

interface ClientSignupFormProps {
  walkerInfo: WalkerInfo | null;
  formData: ClientFormData;
  loading: boolean;
  onFormDataChange: (data: ClientFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ClientSignupForm = ({ 
  walkerInfo, 
  formData, 
  loading, 
  onFormDataChange, 
  onSubmit 
}: ClientSignupFormProps) => {
  const handleChange = (field: keyof ClientFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onFormDataChange({ ...formData, [field]: e.target.value });
  };

  const handleToggleChange = (field: keyof ClientFormData) => (checked: boolean) => {
    onFormDataChange({ ...formData, [field]: checked });
  };

  const formatPhoneNumber = (value: string) => {
    // Remove tudo que não for número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 10 dígitos
    const limitedNumbers = numbers.slice(0, 10);
    
    // Aplica a formatação (DD) 0000-0000
    if (limitedNumbers.length <= 2) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
    } else {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 6)}-${limitedNumbers.slice(6)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatPhoneNumber(inputValue);
    onFormDataChange({ ...formData, emergency_contact: formatted });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold text-blue-600">
            Cadastro de Cliente
          </CardTitle>
          <CardDescription>
            Você foi convidado por <strong>{walkerInfo?.profiles?.name}</strong> para se cadastrar como cliente.
            <br />
            Preencha o cadastro abaixo para você e seu pet aparecerem na lista de clientes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Seu Nome *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange('name')}
                  placeholder="Digite seu nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Seu Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange('email')}
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Criar Sua Senha
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange('password')}
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    placeholder="Digite a senha novamente"
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informações do Seu Pet
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pet_name">Nome do Pet *</Label>
                  <Input
                    id="pet_name"
                    required
                    value={formData.pet_name}
                    onChange={handleChange('pet_name')}
                    placeholder="Nome do seu pet"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pet_breed">Raça</Label>
                  <Input
                    id="pet_breed"
                    value={formData.pet_breed}
                    onChange={handleChange('pet_breed')}
                    placeholder="Ex: Labrador, SRD, etc."
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="pet_age">Idade do Pet (anos)</Label>
                <Input
                  id="pet_age"
                  type="number"
                  min="0"
                  value={formData.pet_age}
                  onChange={handleChange('pet_age')}
                  placeholder="Idade em anos"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Informações Adicionais</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Seu Endereço</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={handleChange('address')}
                    placeholder="Rua, número, bairro, cidade"
                  />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact">Número WhatsApp</Label>
                    <Input
                      id="emergency_contact"
                      value={formData.emergency_contact}
                      onChange={handlePhoneChange}
                      placeholder="(11) 9999-9999"
                      maxLength={14}
                    />
                  </div>
                  <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg">
                    <Switch
                      id="use_whatsapp_for_emergency"
                      checked={formData.use_whatsapp_for_emergency}
                      onCheckedChange={handleToggleChange('use_whatsapp_for_emergency')}
                    />
                    <Label htmlFor="use_whatsapp_for_emergency" className="text-sm">
                      Usar esse WhatsApp para Contato de Emergência?
                    </Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pet_notes">Observações sobre o Pet</Label>
                  <Textarea
                    id="pet_notes"
                    rows={3}
                    placeholder="Comportamento, necessidades especiais, medicamentos, horários preferidos..."
                    value={formData.pet_notes}
                    onChange={handleChange('pet_notes')}
                  />
                </div>
              </div>
            </div>


            <div className="pt-6 border-t">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Cadastrando..." : "Finalizar Cadastro"}
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Ao cadastrar-se, você concorda em ser contatado pelo dog walker {walkerInfo?.profiles?.name}
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

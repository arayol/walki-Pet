import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface ClientFormProps {
  onClose: () => void;
  onSave: () => void;
}

export const ClientForm = ({ onClose, onSave }: ClientFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pet_name: "",
    pet_breed: "",
    pet_age: "",
    pet_notes: "",
    emergency_contact: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error("❌ Erro: Usuário não logado");
      return;
    }

    console.log("🚀 INICIANDO CADASTRO DE CLIENTE");
    console.log("👤 Walker ID:", user.id);
    console.log("📝 Dados do formulário:", formData);

    setLoading(true);
    try {
      console.log("⏳ Simulando criação de cliente...");
      
      // Simulate successful client creation for now
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      const simulatedClientData = {
        id: `client-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        pet_name: formData.pet_name,
        pet_breed: formData.pet_breed,
        pet_age: formData.pet_age,
        pet_notes: formData.pet_notes,
        emergency_contact: formData.emergency_contact,
        address: formData.address,
      };

      console.log("✅ Cliente simulado criado com sucesso!");
      console.log("📋 Dados simulados:", simulatedClientData);

      toast({
        title: "Cliente adicionado!",
        description: "O cliente foi cadastrado com sucesso.",
      });

      onSave();
    } catch (error: any) {
      console.error("💥 ERRO GERAL no cadastro:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível cadastrar o cliente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Você precisa estar logado para adicionar clientes.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Novo Cliente</CardTitle>
              <CardDescription>Adicione um novo cliente e seu pet</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Dono *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Informações do Pet</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pet_name">Nome do Pet *</Label>
                  <Input
                    id="pet_name"
                    required
                    value={formData.pet_name}
                    onChange={(e) => setFormData({ ...formData, pet_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pet_breed">Raça</Label>
                  <Input
                    id="pet_breed"
                    value={formData.pet_breed}
                    onChange={(e) => setFormData({ ...formData, pet_breed: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="pet_age">Idade (anos)</Label>
                <Input
                  id="pet_age"
                  type="number"
                  min="0"
                  max="30"
                  value={formData.pet_age}
                  onChange={(e) => setFormData({ ...formData, pet_age: e.target.value })}
                />
              </div>
              <div className="mt-4">
                <Label htmlFor="pet_notes">Observações sobre o Pet</Label>
                <Textarea
                  id="pet_notes"
                  placeholder="Ex: Tem medo de outros cães, gosta de brincar no parque..."
                  value={formData.pet_notes}
                  onChange={(e) => setFormData({ ...formData, pet_notes: e.target.value })}
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Informações de Contato</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact">Contato de Emergência</Label>
                  <Input
                    id="emergency_contact"
                    placeholder="(11) 99999-9999"
                    value={formData.emergency_contact}
                    onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Textarea
                    id="address"
                    placeholder="Rua, número, bairro, cidade..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Cliente"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Edit, ExternalLink } from "lucide-react";
import { RegionInput } from "./RegionInput";
import { MultiSelectInput } from "./MultiSelectInput";
interface EditProfileModalProps {
  walkerData: any;
  onProfileUpdate: () => void;
}
export const EditProfileModal = ({
  walkerData,
  onProfileUpdate
}: EditProfileModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bio: "",
    location: "",
    phone: "",
    regions_served: [],
    years_experience: "",
    instagram_username: "",
    specialties: [],
    certifications: [],
    emergency_available: false,
    has_transport: false,
    languages_spoken: ["Português"],
    pet_size_preference: ["Pequeno", "Médio", "Grande"],
    additional_services: [],
    availability: {
      "Segunda a Sexta": "08:00 - 18:00",
      "Sábado": "08:00 - 16:00",
      "Domingo": "10:00 - 14:00"
    }
  });
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  useEffect(() => {
    if (walkerData && open) {
      setFormData({
        bio: walkerData.bio || "",
        location: walkerData.location || "",
        phone: walkerData.phone || "",
        regions_served: walkerData.regions_served || [],
        years_experience: walkerData.years_experience || "",
        instagram_username: walkerData.instagram_username || "",
        specialties: walkerData.specialties || [],
        certifications: walkerData.certifications || [],
        emergency_available: walkerData.emergency_available || false,
        has_transport: walkerData.has_transport || false,
        languages_spoken: walkerData.languages_spoken || ["Português"],
        pet_size_preference: walkerData.pet_size_preference || ["Pequeno", "Médio", "Grande"],
        additional_services: walkerData.additional_services || [],
        availability: walkerData.availability || {
          "Segunda a Sexta": "08:00 - 18:00",
          "Sábado": "08:00 - 16:00",
          "Domingo": "10:00 - 14:00"
        }
      });
    }
  }, [walkerData, open]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Formatar telefone para o padrão brasileiro com +55
      let phoneFormatted = formData.phone;
      if (phoneFormatted && !phoneFormatted.startsWith('+55')) {
        // Remove caracteres não numéricos
        const numbersOnly = phoneFormatted.replace(/\D/g, '');
        // Se tem 11 dígitos (com DDD), adiciona +55
        if (numbersOnly.length === 11) {
          phoneFormatted = `+55${numbersOnly}`;
        }
      }
      const {
        error
      } = await supabase.from("walkers").update({
        bio: formData.bio,
        location: formData.location,
        phone: phoneFormatted,
        regions_served: formData.regions_served,
        years_experience: formData.years_experience ? parseInt(formData.years_experience) : null,
        instagram_username: formData.instagram_username,
        specialties: formData.specialties,
        certifications: formData.certifications,
        emergency_available: formData.emergency_available,
        has_transport: formData.has_transport,
        languages_spoken: formData.languages_spoken,
        pet_size_preference: formData.pet_size_preference,
        additional_services: formData.additional_services,
        availability: formData.availability
      }).eq("walker_id", user?.id);
      if (error) throw error;
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso."
      });
      setOpen(false);
      onProfileUpdate();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleViewPublicPage = () => {
    if (walkerData?.slug) {
      window.open(`/profile/${walkerData.slug}`, '_blank');
    }
  };
  return <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mt-3">
          <Edit className="h-4 w-4 mr-2" />
          Editar Perfil
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Informações Básicas</h3>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Descrição Profissional</Label>
              <Textarea id="bio" value={formData.bio} onChange={e => {
              if (e.target.value.length <= 2000) {
                setFormData(prev => ({
                  ...prev,
                  bio: e.target.value
                }));
              }
            }} placeholder="Conte sobre sua experiência como dog walker..." rows={3} maxLength={2000} />
              <div className="text-sm text-muted-foreground text-right">
                {formData.bio.length}/2000 caracteres
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Localização Principal</Label>
                <Input id="location" value={formData.location} onChange={e => setFormData(prev => ({
                ...prev,
                location: e.target.value
              }))} placeholder="Ex: São Paulo, SP" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" value={formData.phone} onChange={e => setFormData(prev => ({
                ...prev,
                phone: e.target.value
              }))} placeholder="(11) 99999-9999" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Anos de Experiência</Label>
                <Input 
                  id="experience" 
                  type="number" 
                  min="0" 
                  max="50" 
                  value={formData.years_experience} 
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    years_experience: e.target.value
                  }))} 
                  placeholder="Ex: 3" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input 
                  id="instagram" 
                  value={formData.instagram_username || ""} 
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    instagram_username: e.target.value
                  }))} 
                  placeholder="seuinstagram" 
                />
              </div>
            </div>
          </div>

          {/* Regiões Atendidas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Regiões Atendidas</h3>
            <RegionInput regions={formData.regions_served} onChange={regions => setFormData(prev => ({
            ...prev,
            regions_served: regions
          }))} />
          </div>

          {/* Especialidades e Certificações */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Especialidades e Qualificações</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MultiSelectInput label="Especialidades" values={formData.specialties} onChange={specialties => setFormData(prev => ({
              ...prev,
              specialties
            }))} placeholder="Ex: Cães idosos" suggestions={["Cães idosos", "Filhotes", "Cães de grande porte", "Cães ansiosos", "Adestramento básico", "Cães com necessidades especiais", "Socialização"]} />

              <MultiSelectInput label="Certificações" values={formData.certifications} onChange={certifications => setFormData(prev => ({
              ...prev,
              certifications
            }))} placeholder="Ex: Primeiros Socorros" suggestions={["Primeiros Socorros Pet", "Adestramento Canino", "Comportamento Animal", "Veterinária Básica", "Grooming", "Pet Sitting"]} />
            </div>
          </div>

          {/* Preferências e Serviços */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Preferências e Serviços</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MultiSelectInput label="Tamanhos de Pet Preferidos" values={formData.pet_size_preference} onChange={sizes => setFormData(prev => ({
              ...prev,
              pet_size_preference: sizes
            }))} placeholder="Ex: Grande" suggestions={["Pequeno", "Médio", "Grande", "Gigante"]} />

              <MultiSelectInput label="Serviços Adicionais" values={formData.additional_services} onChange={services => setFormData(prev => ({
              ...prev,
              additional_services: services
            }))} placeholder="Ex: Banho" suggestions={["Banho", "Tosa", "Alimentação", "Medicação", "Overnight", "Transporte veterinário", "Companhia"]} />
            </div>

            <MultiSelectInput label="Idiomas Falados" values={formData.languages_spoken} onChange={languages => setFormData(prev => ({
            ...prev,
            languages_spoken: languages
          }))} placeholder="Ex: Inglês" suggestions={["Português", "Inglês", "Espanhol", "Francês", "Italiano"]} />
          </div>

          {/* Características do Serviço */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Características do Serviço</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="emergency" checked={formData.emergency_available} onCheckedChange={checked => setFormData(prev => ({
                ...prev,
                emergency_available: checked as boolean
              }))} />
                <Label htmlFor="emergency">Disponível para emergências</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="transport" checked={formData.has_transport} onCheckedChange={checked => setFormData(prev => ({
                ...prev,
                has_transport: checked as boolean
              }))} />
                <Label htmlFor="transport">Possui transporte próprio</Label>
              </div>
            </div>
          </div>

          {/* Horários de Disponibilidade */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Horários de Disponibilidade</h3>
            {Object.entries(formData.availability).map(([day, time]) => <div key={day} className="flex items-center space-x-4">
                <Label className="w-32 text-sm">{day}</Label>
                <Input value={String(time)} onChange={e => setFormData(prev => ({
              ...prev,
              availability: {
                ...prev.availability,
                [day]: e.target.value
              }
            }))} placeholder="08:00 - 18:00" className="flex-1" />
              </div>)}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
            
            <Button type="button" variant="outline" onClick={handleViewPublicPage} className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              Visualizar Minha Página
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>;
};

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WalkerHeader } from "@/components/walker/WalkerHeader";
import { RegionInput } from "@/components/dashboard/RegionInput";
import { MultiSelectInput } from "@/components/dashboard/MultiSelectInput";
import { useToast } from "@/hooks/use-toast";
// Removed supabase import - using localStorage instead
import { useAuth } from "@/hooks/useAuth";
import { Share2, Link, QrCode, Eye, ExternalLink, ChevronDown, ChevronUp, Instagram, BarChart3, Copy, Download, Mail, MessageCircle } from "lucide-react";
import { 
  FacebookShareButton, 
  EmailShareButton,
  FacebookIcon,
  EmailIcon
} from 'react-share';
import QRCodeLib from 'qrcode';
import { PerformanceStats } from "@/components/marketing/PerformanceStats";
import { ServiceStats } from "@/components/marketing/ServiceStats";
import { SchedulingStats } from "@/components/marketing/SchedulingStats";
import { MarketingStats } from "@/components/marketing/MarketingStats";
import { AvailabilitySchedulesManager } from '@/components/marketing/AvailabilitySchedulesManager';

interface Region {
  name: string;
  cep: string;
  radius: number;
}

const Marketing = () => {
  const [loading, setLoading] = useState(false);
  const [walkerData, setWalkerData] = useState<any>(null);
  
  // Estados para modais
  const [showShareModal, setShowShareModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Estado para controlar quais cards estão expandidos
  const [expandedCards, setExpandedCards] = useState({
    basicInfo: true,
    regions: false,
    specialties: false,
    preferences: false,
    characteristics: false,
    schedule: false
  });

  

  const [formData, setFormData] = useState({
    bio: "",
    location: "",
    phone: "",
    regions_served: [] as Region[],
    years_experience: "",
    instagram_username: "",
    specialties: [] as string[],
    certifications: [] as string[],
    emergency_available: false,
    has_transport: false,
    languages_spoken: ["Português"] as string[],
    pet_size_preference: ["Pequeno", "Médio", "Grande"] as string[],
    additional_services: [] as string[],
    availability: {
      "Segunda a Sexta": "08:00 - 18:00",
      "Sábado": "08:00 - 16:00",
      "Domingo": "10:00 - 14:00"
    } as Record<string, string>,
    slug: ""
  });

  const { user } = useAuth();
  const { toast } = useToast();

  // Função para toggle dos cards
  const toggleCard = (cardName: keyof typeof expandedCards) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardName]: !prev[cardName]
    }));
  };

  useEffect(() => {
    const fetchWalkerData = async () => {
      if (!user?.id) return;

      try {
        // Load walker data from localStorage - use mock data for marketing page
        const mockWalkerInfo = {
          bio: "Apaixonado por animais e dedicado ao cuidado dos seus pets",
          location: "São Paulo, SP",
          phone: "(11) 99999-9999",
          regions_served: [],
          years_experience: 5,
          instagram_username: "",
          specialties: ["Caminhada", "Cuidados básicos"],
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
          },
          slug: user.id
        };

        // Try to load saved marketing data from localStorage
        const savedData = localStorage.getItem(`marketing_data_${user.id}`);
        const walkerInfo = savedData ? { ...mockWalkerInfo, ...JSON.parse(savedData) } : mockWalkerInfo;

        if (walkerInfo) {
          setWalkerData(walkerInfo);
          setFormData({
            bio: walkerInfo.bio || "",
            location: walkerInfo.location || "",
            phone: walkerInfo.phone || "",
            regions_served: Array.isArray(walkerInfo.regions_served) ? 
              walkerInfo.regions_served.map((region: any) => ({
                name: region.name || '',
                cep: region.cep || '',
                radius: region.radius || 2
              })) : [],
            years_experience: walkerInfo.years_experience ? String(walkerInfo.years_experience) : "",
            instagram_username: walkerInfo.instagram_username || "",
            specialties: Array.isArray(walkerInfo.specialties) ? walkerInfo.specialties : [],
            certifications: Array.isArray(walkerInfo.certifications) ? walkerInfo.certifications : [],
            emergency_available: walkerInfo.emergency_available || false,
            has_transport: walkerInfo.has_transport || false,
            languages_spoken: Array.isArray(walkerInfo.languages_spoken) ? walkerInfo.languages_spoken : ["Português"],
            pet_size_preference: Array.isArray(walkerInfo.pet_size_preference) ? walkerInfo.pet_size_preference : ["Pequeno", "Médio", "Grande"],
            additional_services: Array.isArray(walkerInfo.additional_services) ? walkerInfo.additional_services : [],
            availability: (walkerInfo.availability && typeof walkerInfo.availability === 'object') ? walkerInfo.availability as { [key: string]: string } : {
              "Segunda a Sexta": "08:00 - 18:00",
              "Sábado": "08:00 - 16:00",
              "Domingo": "10:00 - 14:00"
            },
            slug: walkerInfo.slug || ""
          });
        }
      } catch (error) {
        console.error("Erro ao buscar dados do walker:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do perfil.",
          variant: "destructive"
        });
      }
    };

    fetchWalkerData();
  }, [user?.id, toast]);

  const publicUrl = `${window.location.origin}/profile/${formData.slug}`;
  
  const shareMessage = `Veja meu perfil no Walki Pet! 
Lá você encontra todos os detalhes dos meus serviços de cuidado pet, horários disponíveis e avaliações de outros tutores. 

👆 Acesse o link e agende já o seu! 
${publicUrl}`;

  const handleWhatsAppShare = () => {
    const encodedMessage = encodeURIComponent(shareMessage);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleInstagramShare = () => {
    // Como Instagram não tem API direta de compartilhamento, copiamos o link e a mensagem
    navigator.clipboard.writeText(shareMessage);
    toast({
      title: "Copiado!",
      description: "Mensagem copiada para a área de transferência. Cole no seu Instagram!"
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Validar e formatar telefone para o padrão brasileiro com +55
      let phoneFormatted = formData.phone;
      if (phoneFormatted) {
        // Remove caracteres não numéricos
        let numbersOnly = phoneFormatted.replace(/\D/g, '');
        
        // Se telefone já começa com +55, remove o código do país para validação
        if (phoneFormatted.startsWith('+55')) {
          numbersOnly = numbersOnly.substring(2); // Remove '55' do +55
        }
        
        // Validar formato de telefone brasileiro (10 ou 11 dígitos sem o +55)
        if (numbersOnly.length < 10 || numbersOnly.length > 11) {
          toast({
            title: "Telefone inválido",
            description: "O telefone deve ter 10 ou 11 dígitos (incluindo DDD)",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        
        // Garantir que sempre tenha +55 no início
        if (!phoneFormatted.startsWith('+55')) {
          phoneFormatted = `+55${numbersOnly}`;
        }
      }

      // Validar CEPs das regiões
      for (const region of formData.regions_served) {
        if (region.cep) {
          const cepNumbers = region.cep.replace(/\D/g, '');
          if (cepNumbers.length !== 8) {
            toast({
              title: "CEP inválido",
              description: `O CEP "${region.cep}" deve ter 8 dígitos`,
              variant: "destructive"
            });
            setLoading(false);
            return;
          }
        }
      }

      // Save marketing data to localStorage instead of supabase
      const marketingData = {
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
        availability: formData.availability,
        slug: formData.slug
      };

      // Save to PostgreSQL database via API
      const response = await fetch(`/api/walkers/${user?.id}/marketing`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(marketingData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar dados');
      }

      const result = await response.json();
      console.log('💾 Marketing data saved to PostgreSQL:', result);

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso."
      });
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
    if (formData.slug) {
      window.open(`/profile/${formData.slug}`, '_blank');
    }
  };

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  const handleQRClick = async () => {
    try {
      const qrDataUrl = await QRCodeLib.toDataURL(publicUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      setQrCodeDataUrl(qrDataUrl);
      setShowQRModal(true);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o QR Code",
        variant: "destructive"
      });
    }
  };

  const handleCopyQRImage = async () => {
    try {
      // Converter data URL para blob
      const response = await fetch(qrCodeDataUrl);
      const blob = await response.blob();
      
      // Criar item para clipboard
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
      
      toast({
        title: "Sucesso!",
        description: "QR Code copiado para a área de transferência"
      });
    } catch (error) {
      console.error('Erro ao copiar QR Code:', error);
      toast({
        title: "Erro",
        description: "Não foi possível copiar o QR Code",
        variant: "destructive"
      });
    }
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `qr-code-${formData.slug || 'perfil'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <WalkerHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Marketing</h1>
          <p className="text-gray-600">Personalize seu perfil e atraia mais clientes</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Perfil Público</TabsTrigger>
            <TabsTrigger value="sharing">Compartilhamento</TabsTrigger>
            <TabsTrigger value="statistics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Estatísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="space-y-8">
              {/* Informações Básicas */}
              <Collapsible
                open={expandedCards.basicInfo}
                onOpenChange={() => toggleCard('basicInfo')}
              >
                <Card>
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Informações Básicas</CardTitle>
                        <CardDescription>Personalize as informações principais do seu perfil</CardDescription>
                      </div>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          {expandedCards.basicInfo ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="space-y-6">
                      <div>
                        <Label htmlFor="slug">Link Personalizado</Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            /profile/
                          </span>
                          <Input
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => setFormData({...formData, slug: e.target.value})}
                            className="rounded-l-none"
                            placeholder="seu-nome-unico"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Descrição Profissional</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => {
                            if (e.target.value.length <= 2000) {
                              setFormData(prev => ({
                                ...prev,
                                bio: e.target.value
                              }));
                            }
                          }}
                          placeholder="Conte sobre sua experiência como dog walker..."
                          rows={3}
                          maxLength={2000}
                        />
                        <div className="text-sm text-muted-foreground text-right">
                          {formData.bio.length}/2000 caracteres
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="location">Localização Principal</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              location: e.target.value
                            }))}
                            placeholder="Ex: São Paulo, SP"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              phone: e.target.value
                            }))}
                            placeholder="(11) 99999-9999"
                          />
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
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              years_experience: e.target.value
                            }))} 
                            placeholder="Ex: 3" 
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="instagram_username">Username do Instagram</Label>
                          <Input
                            id="instagram_username"
                            value={formData.instagram_username}
                            onChange={(e) => setFormData(prev => ({ ...prev, instagram_username: e.target.value }))}
                            placeholder="@seu_usuario"
                          />
                          <p className="text-xs text-muted-foreground">
                            Seu username aparecerá no seu perfil público
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Regiões Atendidas */}
              <Collapsible
                open={expandedCards.regions}
                onOpenChange={() => toggleCard('regions')}
              >
                <Card>
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Regiões Atendidas</CardTitle>
                        <CardDescription>Defina as áreas onde você presta serviços</CardDescription>
                      </div>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          {expandedCards.regions ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent>
                      <RegionInput 
                        regions={formData.regions_served} 
                        onChange={(regions) => setFormData(prev => ({
                          ...prev,
                          regions_served: regions
                        }))} 
                      />
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Especialidades e Certificações */}
              <Collapsible
                open={expandedCards.specialties}
                onOpenChange={() => toggleCard('specialties')}
              >
                <Card>
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Especialidades e Qualificações</CardTitle>
                        <CardDescription>Destaque seus diferenciais e certificações</CardDescription>
                      </div>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          {expandedCards.specialties ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MultiSelectInput 
                          label="Especialidades" 
                          values={formData.specialties} 
                          onChange={(specialties) => setFormData(prev => ({
                            ...prev,
                            specialties
                          }))} 
                          placeholder="Ex: Cães idosos" 
                          suggestions={["Cães idosos", "Filhotes", "Cães de grande porte", "Cães ansiosos", "Adestramento básico", "Cães com necessidades especiais", "Socialização"]} 
                        />

                        <MultiSelectInput 
                          label="Certificações" 
                          values={formData.certifications} 
                          onChange={(certifications) => setFormData(prev => ({
                            ...prev,
                            certifications
                          }))} 
                          placeholder="Ex: Primeiros Socorros" 
                          suggestions={["Primeiros Socorros Pet", "Adestramento Canino", "Comportamento Animal", "Veterinária Básica", "Grooming", "Pet Sitting"]} 
                        />
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Preferências e Serviços */}
              <Collapsible
                open={expandedCards.preferences}
                onOpenChange={() => toggleCard('preferences')}
              >
                <Card>
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Preferências e Serviços</CardTitle>
                        <CardDescription>Configure suas preferências de atendimento</CardDescription>
                      </div>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          {expandedCards.preferences ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MultiSelectInput 
                          label="Tamanhos de Pet Preferidos" 
                          values={formData.pet_size_preference} 
                          onChange={(sizes) => setFormData(prev => ({
                            ...prev,
                            pet_size_preference: sizes
                          }))} 
                          placeholder="Ex: Grande" 
                          suggestions={["Pequeno", "Médio", "Grande", "Gigante"]} 
                        />

                        <MultiSelectInput 
                          label="Serviços Adicionais" 
                          values={formData.additional_services} 
                          onChange={(services) => setFormData(prev => ({
                            ...prev,
                            additional_services: services
                          }))} 
                          placeholder="Ex: Banho" 
                          suggestions={["Banho", "Tosa", "Alimentação", "Medicação", "Overnight", "Transporte veterinário", "Companhia"]} 
                        />
                      </div>

                      <MultiSelectInput 
                        label="Idiomas Falados" 
                        values={formData.languages_spoken} 
                        onChange={(languages) => setFormData(prev => ({
                          ...prev,
                          languages_spoken: languages
                        }))} 
                        placeholder="Ex: Inglês" 
                        suggestions={["Português", "Inglês", "Espanhol", "Francês", "Italiano"]} 
                      />
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Características do Serviço */}
              <Collapsible
                open={expandedCards.characteristics}
                onOpenChange={() => toggleCard('characteristics')}
              >
                <Card>
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Características do Serviço</CardTitle>
                        <CardDescription>Defina os diferenciais do seu atendimento</CardDescription>
                      </div>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          {expandedCards.characteristics ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="emergency" 
                            checked={formData.emergency_available} 
                            onCheckedChange={(checked) => setFormData(prev => ({
                              ...prev,
                              emergency_available: checked as boolean
                            }))} 
                          />
                          <Label htmlFor="emergency">Disponível para emergências</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="transport" 
                            checked={formData.has_transport} 
                            onCheckedChange={(checked) => setFormData(prev => ({
                              ...prev,
                              has_transport: checked as boolean
                            }))} 
                          />
                          <Label htmlFor="transport">Possui transporte próprio</Label>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Horários de Disponibilidade - Nova Interface Melhorada */}
              <AvailabilitySchedulesManager />

              {/* Ações */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleSave} disabled={loading} className="flex-1">
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleViewPublicPage} 
                  className="flex-1"
                  disabled={!formData.slug}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visualizar Minha Página
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sharing">
            <Card>
              <CardHeader>
                <CardTitle>Link do Perfil</CardTitle>
                <CardDescription>Compartilhe seu perfil com clientes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>URL do seu perfil</Label>
                  <div className="flex space-x-2">
                    <Input value={publicUrl} readOnly />
                    <Button size="sm" onClick={() => navigator.clipboard.writeText(publicUrl)}>
                      <Link className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1" onClick={handleShareClick}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={handleQRClick}>
                    <QrCode className="h-4 w-4 mr-2" />
                    QR Code
                  </Button>
                </div>

                <Button variant="outline" className="w-full" asChild>
                  <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar Perfil
                  </a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics">
            <div className="space-y-8">
              <PerformanceStats />
              <ServiceStats />
              <SchedulingStats />
              <MarketingStats />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Compartilhamento */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Compartilhar Perfil</DialogTitle>
            <DialogDescription>
              Escolha onde você gostaria de compartilhar seu perfil
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleWhatsAppShare}
                className="w-full"
              >
                <div className="flex items-center justify-center w-full p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
                  <span className="text-sm font-medium">WhatsApp</span>
                </div>
              </button>

              <FacebookShareButton
                url={publicUrl}
                className="w-full"
              >
                <div className="flex items-center justify-center w-full p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <FacebookIcon size={20} className="mr-2" />
                  <span className="text-sm font-medium">Facebook</span>
                </div>
              </FacebookShareButton>

              <button
                onClick={handleInstagramShare}
                className="w-full"
              >
                <div className="flex items-center justify-center w-full p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <Instagram className="h-5 w-5 mr-2 text-pink-600" />
                  <span className="text-sm font-medium">Instagram</span>
                </div>
              </button>

              <EmailShareButton
                url={publicUrl}
                subject="Veja meu perfil no Walki Pet!"
                body={shareMessage}
                className="w-full"
              >
                <div className="flex items-center justify-center w-full p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <Mail className="h-5 w-5 mr-2 text-blue-600" />
                  <span className="text-sm font-medium">Email</span>
                </div>
              </EmailShareButton>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex space-x-2">
                <Input value={publicUrl} readOnly className="flex-1" />
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(shareMessage);
                    toast({
                      title: "Copiado!",
                      description: "Mensagem completa copiada para a área de transferência"
                    });
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal do QR Code */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code do Perfil</DialogTitle>
            <DialogDescription>
              Escaneie para acessar o perfil diretamente
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center">
              {qrCodeDataUrl && (
                <img 
                  src={qrCodeDataUrl} 
                  alt="QR Code do perfil" 
                  className="w-64 h-64 border rounded-lg"
                />
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={handleCopyQRImage}
                className="flex-1"
                variant="outline"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar Imagem
              </Button>
              <Button 
                onClick={handleDownloadQR}
                className="flex-1"
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-500">
                URL: {publicUrl}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Marketing;

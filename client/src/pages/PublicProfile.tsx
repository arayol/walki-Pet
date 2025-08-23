
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServicePlansSection } from "@/components/public-profile/ServicePlansSection";
import { useToast } from "@/hooks/use-toast";
import { WalkerPublicProfileService } from "@/services/WalkerPublicProfileService";
import { Header } from "@/components/shared/Header";
import {
  MapPin,
  Phone,
  Star,
  Calendar,
  Clock,
  Heart,
  User,
  LogIn,
  Award,
  Car,
  Shield,
  Globe,
  Users,
  Instagram
} from "lucide-react";
import { ProtectedBookingForm } from "@/components/booking/ProtectedBookingForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Walker {
  walker_id: string;
  slug: string;
  location?: string;
  phone?: string;
  bio?: string;
  services?: any[];
  availability?: any;
  branding?: any;
  rating?: number;
  total_reviews?: number;
  regions_served?: any[];
  years_experience?: number;
  specialties?: string[];
  certifications?: string[];
  emergency_available?: boolean;
  has_transport?: boolean;
  languages_spoken?: string[];
  instagram_username?: string;
  pet_size_preference?: string[];
  additional_services?: string[];
  profiles: {
    name: string;
    email: string;
    avatar_url?: string;
  };
}

interface ServicePlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration?: string;
  includes_playtime: boolean;
  includes_feeding: boolean;
  includes_grooming: boolean;
  includes_bath: boolean;
  walk_count: number;
  is_recurring: boolean;
  recurrence_type?: string;
  preferred_days?: string[];
  image_url?: string;
}

const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      times.push(timeString);
    }
  }
  return times;
};

const PublicProfile = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [walker, setWalker] = useState<Walker | null>(null);
  const [servicePlans, setServicePlans] = useState<ServicePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchWalkerData();
    }
  }, [slug]);

  const fetchWalkerData = async () => {
    try {
      const profileService = new WalkerPublicProfileService();
      
      if (!slug) {
        throw new Error("Slug do walker não fornecido");
      }

      const walkerData = await profileService.fetchWalkerBySlug(slug);
      
      // Converter os dados do Supabase para o tipo Walker
      const walkerConverted: Walker = {
        walker_id: walkerData.walker_id,
        slug: walkerData.slug,
        location: walkerData.location,
        phone: walkerData.phone,
        bio: walkerData.bio,
        services: Array.isArray(walkerData.services) ? walkerData.services : [],
        availability: walkerData.availability,
        branding: walkerData.branding,
        rating: walkerData.rating,
        total_reviews: walkerData.total_reviews,
        years_experience: walkerData.years_experience,
        instagram_username: walkerData.instagram_username,
        specialties: Array.isArray(walkerData.specialties) ? walkerData.specialties : [],
        certifications: Array.isArray(walkerData.certifications) ? walkerData.certifications : [],
        pet_size_preference: Array.isArray(walkerData.pet_size_preference) ? walkerData.pet_size_preference : [],
        additional_services: Array.isArray(walkerData.additional_services) ? walkerData.additional_services : [],
        has_transport: walkerData.has_transport,
        emergency_available: walkerData.emergency_available,
        languages_spoken: Array.isArray(walkerData.languages_spoken) ? walkerData.languages_spoken : [],
        regions_served: Array.isArray(walkerData.regions_served) ? walkerData.regions_served : [],
        profiles: walkerData.profiles
      };
      
      setWalker(walkerConverted);

      const plansData = await profileService.fetchServicePlans(walkerData.walker_id);
      setServicePlans(plansData);
    } catch (error: any) {
      console.error("Error fetching walker data:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do dog walker",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!walker) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Dog Walker não encontrado</h1>
          <Button onClick={() => navigate("/")}>
            Voltar ao início
          </Button>
        </div>
      </div>
    );
  }

  const legacyServices = walker.services || [
    { name: "Passeio Simples", duration: "30 min", price: "R$ 25,00" },
    { name: "Passeio Longo", duration: "60 min", price: "R$ 45,00" },
    { name: "Cuidados Especiais", duration: "45 min", price: "R$ 35,00" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <Avatar className="w-24 h-24 flex-shrink-0">
                    <AvatarImage src={walker.profiles?.avatar_url} alt={walker.profiles?.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                      {walker.profiles?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'DW'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {walker.profiles?.name || 'Dog Walker'}
                    </h1>
                    <div className="flex items-center mb-4">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="ml-1 text-lg font-semibold">
                        {walker.rating || '5.0'}
                      </span>
                      <span className="ml-2 text-gray-600">
                        ({walker.total_reviews || 0} avaliações)
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {walker.location && (
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-5 w-5 mr-2" />
                          <span>{walker.location}</span>
                        </div>
                      )}
                      {walker.phone && (
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-5 w-5 mr-2" />
                          <span>{walker.phone}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Instagram e Anos de Experiência no topo */}
                    {(walker.instagram_username || walker.years_experience) && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {walker.instagram_username && (
                            <div className="flex items-center text-gray-600">
                              <Instagram className="h-5 w-5 mr-2 text-pink-600" />
                              <a 
                                href={`https://instagram.com/${walker.instagram_username}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-blue-600 transition-colors"
                              >
                                @{walker.instagram_username}
                              </a>
                            </div>
                          )}
                          {walker.years_experience && (
                            <div className="flex items-center text-gray-600">
                              <Award className="h-5 w-5 mr-2 text-blue-600" />
                              <span>{walker.years_experience} anos de experiência</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {walker.bio && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-lg font-semibold mb-2">Sobre mim</h3>
                    <p className="text-gray-600 leading-relaxed">{walker.bio}</p>
                  </div>
                )}

                {/* Especialidades, Certificações, Preferências e Serviços */}
                {(walker.specialties?.length > 0 || walker.certifications?.length > 0 || walker.pet_size_preference?.length > 0 || walker.additional_services?.length > 0 || walker.has_transport || walker.emergency_available) && (
                  <div className="mt-6 pt-6 border-t space-y-4">
                    {/* Especialidades */}
                    {walker.specialties?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <Award className="h-4 w-4 mr-2 text-purple-600" />
                          Especialidades
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {walker.specialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Certificações */}
                    {walker.certifications?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <Award className="h-4 w-4 mr-2 text-blue-600" />
                          Certificações
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {walker.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Preferências e Serviços */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {walker.pet_size_preference?.length > 0 && (
                        <div>
                          <span className="font-medium">Tamanhos de pets: </span>
                          <span className="text-gray-600">
                            {walker.pet_size_preference.join(", ")}
                          </span>
                        </div>
                      )}
                      
                      {walker.additional_services?.length > 0 && (
                        <div>
                          <span className="font-medium">Serviços extras: </span>
                          <span className="text-gray-600">
                            {walker.additional_services.join(", ")}
                          </span>
                        </div>
                      )}
                      
                      {walker.has_transport && (
                        <div className="flex items-center text-gray-600">
                          <Car className="h-5 w-5 mr-2 text-green-600" />
                          <span>Possui transporte próprio</span>
                        </div>
                      )}
                      
                      {walker.emergency_available && (
                        <div className="flex items-center text-gray-600">
                          <Shield className="h-5 w-5 mr-2 text-red-600" />
                          <span>Disponível para emergências</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>


            {/* Regiões Atendidas */}
            {walker.regions_served?.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-6 w-6 mr-2 text-green-600" />
                    Regiões Atendidas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {walker.regions_served.map((region, index) => (
                      <div key={index} className="border rounded-lg p-3 bg-gray-50">
                        <div className="font-semibold">{region.name}</div>
                        <div className="text-sm text-gray-600">
                          CEP: {region.cep} • Raio: {region.radius}km
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Service Plans Section */}
            <ServicePlansSection 
              servicePlans={servicePlans}
              onSelectPlan={() => setShowBookingForm(true)}
            />

            {/* Legacy Services (fallback) */}
            {servicePlans.length === 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-6 w-6 mr-2 text-red-500" />
                    Serviços Disponíveis
                  </CardTitle>
                  <CardDescription>
                    Escolha o serviço ideal para seu pet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {legacyServices.map((service, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{service.name}</h4>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{service.duration}</span>
                            </div>
                          </div>
                          <span className="text-xl font-bold text-green-600">{service.price}</span>
                        </div>
                        <Button 
                          className="w-full" 
                          onClick={() => setShowBookingForm(true)}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Agendar
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Login Card */}
            <Card className="shadow-lg border-2 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center">
                  <User className="h-6 w-6 mr-2" />
                  Já é cliente?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Acesse sua área para ver agendamentos e informações do seu pet.
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={() => navigate("/client/login")}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login do Cliente
                  </Button>
                  <Button 
                    onClick={() => navigate(`/walker/${walker.slug}/cadastro`)}
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Cadastrar-se
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Idiomas e Serviços Adicionais */}
            {(walker.languages_spoken?.length > 0 || walker.additional_services?.length > 0 || walker.pet_size_preference?.length > 0) && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-6 w-6 mr-2 text-blue-600" />
                    Informações Adicionais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {walker.languages_spoken?.length > 0 && (
                    <div>
                      <div className="flex items-center mb-2">
                        <Globe className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium">Idiomas falados</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {walker.languages_spoken.map((language, index) => (
                          <Badge key={index} variant="outline">
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {walker.pet_size_preference?.length > 0 && (
                    <div>
                      <span className="font-medium">Tamanhos de pets atendidos: </span>
                      <span className="text-gray-600">
                        {walker.pet_size_preference.join(", ")}
                      </span>
                    </div>
                  )}
                  
                  {walker.additional_services?.length > 0 && (
                    <div>
                      <span className="font-medium">Serviços adicionais: </span>
                      <span className="text-gray-600">
                        {walker.additional_services.join(", ")}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Contact */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Contato Rápido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {walker.phone && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open(`tel:${walker.phone}`)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Ligar
                  </Button>
                )}
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(`mailto:${walker.profiles?.email}`)}
                >
                  Enviar Email
                </Button>
              </CardContent>
            </Card>

            {/* Availability */}
            {walker.availability && Object.keys(walker.availability).length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Disponibilidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(walker.availability).map(([day, times]: [string, any]) => (
                      <div key={day} className="flex justify-between">
                        <span className="font-medium capitalize">{day}</span>
                        <span className="text-sm text-gray-600">
                          {Array.isArray(times) ? times.join(', ') : 'Disponível'}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Protected Booking Form Modal */}
      {showBookingForm && (
        <ProtectedBookingForm
          walker={{
            name: walker.profiles?.name || 'Dog Walker',
            services: legacyServices
          }}
          onClose={() => setShowBookingForm(false)}
        />
      )}
    </div>
  );
};

export default PublicProfile;

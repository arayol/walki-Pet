
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface ServicePlanWithAvailability {
  id: string;
  name: string;
  description?: string;
  price: number;
  walk_count: number;
  is_recurring: boolean;
  recurrence_type?: string;
  includes_bath: boolean;
  includes_grooming: boolean;
  includes_feeding: boolean;
  includes_playtime: boolean;
  duration?: string;
  available_regions: Array<{
    region_id: string;
    cep: string;
    raio_km: number;
    available_slots: number;
  }>;
}

interface WalkerData {
  walker_id: string;
  slug: string;
  phone?: string;
  location?: string;
  rating?: number;
  profiles: {
    name: string;
    email: string;
  };
}

export const useClientServices = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [walker, setWalker] = useState<WalkerData | null>(null);
  const [services, setServices] = useState<ServicePlanWithAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('🔍 ClientServices Hook: Current route params:', { slug });
  console.log('🔍 ClientServices Hook: Current path:', window.location.pathname);

  useEffect(() => {
    console.log('🔍 ClientServices: useEffect triggered', { 
      slug, 
      authLoading, 
      hasUser: !!user,
      userId: user?.id 
    });
    
    if (!slug) {
      console.log('🔍 ClientServices: No slug found, redirecting to dashboard');
      navigate('/client-dashboard');
      return;
    }

    if (authLoading) {
      console.log('🔍 ClientServices: Auth still loading, waiting...');
      return;
    }

    fetchWalkerAndServices();
  }, [slug, authLoading]);

  const fetchWalkerAndServices = async () => {
    if (!slug) {
      console.log('🔍 ClientServices: No slug available for fetch');
      return;
    }

    console.log('🔍 ClientServices: fetchWalkerAndServices started for slug:', slug);
    
    try {
      setLoading(true);
      setError(null);

      // Primeiro tenta buscar por slug
      console.log('🔍 ClientServices: Fetching walker by slug:', slug);
      let walkerResponse = await fetch(`/api/walkers/by-slug/${slug}`);
      
      let walkerData = null;
      if (walkerResponse.ok) {
        walkerData = await walkerResponse.json();
        console.log('🔍 ClientServices: Walker query by slug result:', { walkerData });
      } else {
        console.log('🔍 ClientServices: Walker not found by slug, trying by walker_id');
        // Se não encontrou por slug, tenta buscar diretamente por walker_id
        const walkerByIdResponse = await fetch(`/api/walkers/${slug}`);
        if (walkerByIdResponse.ok) {
          const walkerByIdData = await walkerByIdResponse.json();
          // Adaptar formato para o esperado pelo componente
          walkerData = {
            walker_id: walkerByIdData.walker_id,
            slug: walkerByIdData.slug,
            phone: walkerByIdData.phone,
            location: walkerByIdData.location,
            rating: walkerByIdData.rating,
            profiles: {
              name: walkerByIdData.name || 'Walker',
              email: walkerByIdData.email || ''
            }
          };
          console.log('🔍 ClientServices: Walker query by walker_id result:', { walkerData });
        }
      }

      if (!walkerData) {
        console.error('🔍 ClientServices: Walker not found for slug:', slug);
        setError("Dog walker não encontrado");
        return;
      }

      console.log('🔍 ClientServices: Walker data fetched:', walkerData);
      setWalker(walkerData);

      // Buscar serviços ativos do walker
      console.log('🔍 ClientServices: Fetching services for walker_id:', walkerData.walker_id);
      const servicesResponse = await fetch(`/api/walkers/${walkerData.walker_id}/service-plans`);
      
      if (!servicesResponse.ok) {
        throw new Error(`Failed to fetch services: ${servicesResponse.status}`);
      }

      const servicePlans = await servicesResponse.json();
      console.log('🔍 ClientServices: Service plans query result:', { servicePlans });

      // Transformar em formato esperado pelo componente
      const servicesWithAvailability: ServicePlanWithAvailability[] = (servicePlans || []).map(plan => ({
        ...plan,
        available_regions: [{
          region_id: 'default',
          cep: '01000-000',
          raio_km: 10,
          available_slots: 5 // Slots padrão
        }]
      }));

      console.log('🔍 ClientServices: Services with availability:', servicesWithAvailability);
      setServices(servicesWithAvailability);

    } catch (error: any) {
      console.error('🔍 ClientServices: Error in fetchWalkerAndServices:', error);
      setError(error.message || "Erro ao carregar informações");
      toast({
        title: "Erro",
        description: "Não foi possível carregar as informações do dog walker",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (service: ServicePlanWithAvailability) => {
    console.log('🔍 ClientServices: Service selected:', service.name);
    
    if (!user) {
      console.log('🔍 ClientServices: User not logged in, redirecting to login');
      navigate('/client/login');
      return;
    }

    // Navegar para a página de booking com o walker_id e service_id
    navigate(`/client-booking/${walker?.walker_id}/${service.id}`, {
      state: { 
        selectedService: service,
        walkerData: walker 
      }
    });
  };

  const handleGoBack = () => {
    if (user) {
      navigate('/client-dashboard');
    } else {
      navigate('/');
    }
  };

  return {
    walker,
    services,
    loading,
    error,
    handleServiceSelect,
    handleGoBack
  };
};

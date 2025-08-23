
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSupabase } from "@/integrations/supabase/client";
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
      let { data: walkerData, error: walkerError } = await supabase
        .from("walkers")
        .select(`
          walker_id,
          slug,
          phone,
          location,
          rating,
          profiles!walkers_walker_id_fkey (
            name,
            email
          )
        `)
        .eq("slug", slug)
        .single();

      console.log('🔍 ClientServices: Walker query by slug result:', { walkerData, walkerError });

      // Se não encontrou por slug, tenta por walker_id
      if (walkerError && walkerError.code === 'PGRST116') {
        console.log('🔍 ClientServices: Trying to find walker by walker_id');
        const { data: walkerByIdData, error: walkerByIdError } = await supabase
          .from("walkers")
          .select(`
            walker_id,
            slug,
            phone,
            location,
            rating,
            profiles!walkers_walker_id_fkey (
              name,
              email
            )
          `)
          .eq("walker_id", slug)
          .single();

        console.log('🔍 ClientServices: Walker query by walker_id result:', { walkerByIdData, walkerByIdError });
        
        if (!walkerByIdError) {
          walkerData = walkerByIdData;
          walkerError = null;
        } else {
          walkerError = walkerByIdError;
        }
      }

      if (walkerError) {
        console.error('🔍 ClientServices: Error fetching walker:', walkerError);
        throw walkerError;
      }

      if (!walkerData) {
        console.error('🔍 ClientServices: Walker not found for slug:', slug);
        setError("Dog walker não encontrado");
        return;
      }

      console.log('🔍 ClientServices: Walker data fetched:', walkerData);
      setWalker(walkerData);

      // Buscar serviços ativos do walker diretamente
      console.log('🔍 ClientServices: Fetching services for walker_id:', walkerData.walker_id);
      
      const { data: servicePlans, error: servicesError } = await supabase
        .from('service_plans')
        .select(`
          id,
          name,
          description,
          price,
          walk_count,
          is_recurring,
          recurrence_type,
          includes_bath,
          includes_grooming,
          includes_feeding,
          includes_playtime
        `)
        .eq('walker_id', walkerData.walker_id)
        .eq('is_active', true);

      console.log('🔍 ClientServices: Service plans query result:', { servicePlans, servicesError });

      if (servicesError) {
        console.error('🔍 ClientServices: Error fetching services:', servicesError);
        throw servicesError;
      }

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

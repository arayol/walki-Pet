
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { BookingForm } from "@/components/client-booking/BookingForm";
import { MobileOptimizedBooking } from "@/components/client-booking/MobileOptimizedBooking";
import { Card, CardContent } from "@/components/ui/card";

interface ServicePlan {
  id: string;
  name: string;
  price: number;
  walk_count: number;
  is_recurring: boolean;
  recurrence_type: "weekly" | "monthly" | null;
  description?: string;
  walker_id: string;
  includes_playtime: boolean;
  includes_feeding: boolean;
  includes_grooming: boolean;
  includes_bath: boolean;
}

const ClientBooking = () => {
  const { walkerId, servicePlanId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [servicePlan, setServicePlan] = useState<ServicePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar dispositivo móvel
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    console.log('🔍 ClientBooking: Component mounted with params:', { walkerId, servicePlanId });
    
    if (!walkerId || !servicePlanId) {
      console.log('❌ ClientBooking: Missing required params');
      setError('Parâmetros inválidos');
      setLoading(false);
      return;
    }

    fetchServicePlan();
  }, [walkerId, servicePlanId]);

  const fetchServicePlan = async () => {
    if (!servicePlanId) {
      setError('ID do plano de serviço não encontrado');
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 ClientBooking: Fetching service plan:', servicePlanId);
      
      const { data, error: fetchError } = await supabase
        .from('service_plans')
        .select('*')
        .eq('id', servicePlanId)
        .single();

      if (fetchError) {
        console.error('❌ ClientBooking: Error fetching service plan:', fetchError);
        throw fetchError;
      }
      
      if (!data) {
        throw new Error('Plano de serviço não encontrado');
      }

      console.log('✅ ClientBooking: Service plan fetched:', data);
      
      const mappedData: ServicePlan = {
        id: data.id,
        name: data.name,
        price: data.price,
        walk_count: data.walk_count,
        is_recurring: data.is_recurring,
        recurrence_type: data.recurrence_type as "weekly" | "monthly" | null,
        description: data.description,
        walker_id: data.walker_id,
        includes_playtime: data.includes_playtime || false,
        includes_feeding: data.includes_feeding || false,
        includes_grooming: data.includes_grooming || false,
        includes_bath: data.includes_bath || false,
      };
      
      setServicePlan(mappedData);
      setError(null);
    } catch (error: any) {
      console.error('❌ ClientBooking: Error in fetchServicePlan:', error);
      setError(error.message || 'Erro ao carregar plano de serviço');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSuccess = () => {
    console.log('✅ ClientBooking: Booking successful, navigating to success page');
    navigate('/payment-success', { 
      state: { message: 'Agendamento realizado com sucesso!' } 
    });
  };

  const handleCancel = () => {
    console.log('🔍 ClientBooking: Booking cancelled, going back');
    navigate(`/client-services/${walkerId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-center mt-4 text-sm sm:text-base">Carregando...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardContent className="p-6 sm:p-8">
            <p className="text-center text-red-600 text-sm sm:text-base">{error}</p>
            <button 
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mx-auto block text-sm sm:text-base"
            >
              Voltar
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!servicePlan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardContent className="p-6 sm:p-8">
            <p className="text-center text-sm sm:text-base">Serviço não encontrado.</p>
            <button 
              onClick={handleCancel}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mx-auto block text-sm sm:text-base"
            >
              Voltar
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Renderizar versão mobile ou desktop
  if (isMobile) {
    return (
      <MobileOptimizedBooking
        servicePlan={servicePlan}
        walkerId={servicePlan.walker_id}
        onSuccess={handleBookingSuccess}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
        <BookingForm
          servicePlan={servicePlan}
          walkerId={servicePlan.walker_id}
          onSuccess={handleBookingSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default ClientBooking;

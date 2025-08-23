
import { useState } from 'react';
import { useServicePlansMigration } from './useServicePlansMigration';
import { useCepHandler } from './useCepHandler';
import { fetchServicesForLocation, ServicePlanWithAvailability } from '@/services/serviceLocationService';
import { useToast } from '@/hooks/use-toast';

export const useLocationFilter = (walkerId?: string) => {
  const [filteredServices, setFilteredServices] = useState<ServicePlanWithAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const { isMigrating } = useServicePlansMigration();
  const { toast } = useToast();
  
  const {
    clientCep,
    setClientCep,
    cepValidated,
    validateCep,
    hasLocation
  } = useCepHandler();

  const fetchServices = async (cep: string) => {
    if (!walkerId || !cep || cep.length < 8) return;

    setLoading(true);
    
    try {
      const services = await fetchServicesForLocation(cep, walkerId);
      setFilteredServices(services);
    } catch (error: any) {
      console.error('💥 Error fetching services for location:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível carregar os serviços para sua localização",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateAndFetchServices = async () => {
    const isValid = await validateCep();
    if (isValid) {
      const cleanCep = clientCep.replace(/\D/g, '');
      console.log('✅ CEP is valid, fetching services...');
      await fetchServices(cleanCep);
    }
  };

  return {
    clientCep,
    setClientCep,
    filteredServices,
    loading: loading || isMigrating,
    cepValidated,
    validateAndFetchServices,
    hasLocation
  };
};

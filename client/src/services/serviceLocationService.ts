
import { supabase } from '@/integrations/supabase/client';
import { calculateDistance } from '@/utils/cepDistance';

export interface ServicePlanWithAvailability {
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
  available_regions: {
    id: string;
    cep: string;
    raio_km: number;
    available_slots: number;
  }[];
}

export const fetchServicesForLocation = async (
  cep: string,
  walkerId: string
): Promise<ServicePlanWithAvailability[]> => {
  if (!walkerId || !cep || cep.length < 8) return [];

  console.log('🔍 Fetching services for CEP:', cep, 'Walker ID:', walkerId);
  
  // Primeiro, verificar se o walker existe
  const { data: walkerData, error: walkerError } = await supabase
    .from('walkers')
    .select('walker_id, slug')
    .eq('walker_id', walkerId)
    .single();

  if (walkerError || !walkerData) {
    console.error('❌ Walker not found:', walkerError);
    throw new Error('Walker não encontrado');
  }

  console.log('✅ Walker found:', walkerData);

  // Buscar todos os planos de serviço do walker
  const { data: servicePlans, error: plansError } = await supabase
    .from('service_plans')
    .select('*')
    .eq('walker_id', walkerId)
    .eq('is_active', true);

  if (plansError) throw plansError;

  console.log('📋 Service plans found:', servicePlans?.length || 0, servicePlans);

  if (!servicePlans || servicePlans.length === 0) {
    console.log('❌ No service plans found for this walker');
    return [];
  }

  // Buscar regiões para cada plano
  const servicesWithAvailability: ServicePlanWithAvailability[] = [];

  for (const plan of servicePlans) {
    console.log(`🔍 Checking regions for plan: ${plan.name} (ID: ${plan.id})`);
    
    const { data: regions, error: regionsError } = await supabase
      .from('service_regions')
      .select('*')
      .eq('service_plan_id', plan.id)
      .eq('is_active', true);

    if (regionsError) {
      console.error('❌ Error fetching regions for plan:', plan.id, regionsError);
      continue;
    }

    console.log(`📍 Regions found for plan ${plan.name}:`, regions?.length || 0, regions);

    if (!regions || regions.length === 0) {
      console.log(`⚠️ No regions configured for plan: ${plan.name}, creating default availability`);
      // Se não há regiões configuradas, assumir disponibilidade padrão
      servicesWithAvailability.push({
        ...plan,
        available_regions: [{
          id: `default-${plan.id}`,
          cep: cep,
          raio_km: 10,
          available_slots: 3 // Capacidade padrão
        }]
      });
      continue;
    }

    const availableRegions = [];

    for (const region of regions) {
      const distance = calculateDistance(cep, region.cep);
      console.log(`📏 Distance from ${cep} to ${region.cep}: ${distance}km (max allowed: ${region.raio_km}km)`);
      
      if (distance <= region.raio_km) {
        console.log(`✅ Region ${region.cep} covers the requested CEP (distance: ${distance}km <= ${region.raio_km}km)`);
        
        // Buscar horários disponíveis para esta região
        const { data: schedules, error: schedulesError } = await supabase
          .from('service_schedules')
          .select('id, capacidade_maxima')
          .eq('service_plan_id', plan.id)
          .eq('service_region_id', region.id)
          .eq('is_active', true);

        if (schedulesError) {
          console.error('❌ Error fetching schedules:', schedulesError);
          continue;
        }

        console.log(`⏰ Schedules found for region ${region.cep}:`, schedules?.length || 0, schedules);

        // CORREÇÃO: Sempre assumir pelo menos 3 vagas se não há schedules
        let totalSlots = 3; // Valor padrão
        
        if (schedules && schedules.length > 0) {
          // Se há schedules configurados, somar as capacidades
          totalSlots = 0;
          for (const schedule of schedules) {
            totalSlots += schedule.capacidade_maxima || 0;
          }
          console.log(`📊 Total slots calculated from schedules for region ${region.cep}: ${totalSlots}`);
        } else {
          // Se não há schedules, usar capacidade padrão
          console.log(`⚠️ No schedules found for region ${region.cep}, using default capacity: ${totalSlots}`);
        }

        availableRegions.push({
          id: region.id,
          cep: region.cep,
          raio_km: region.raio_km,
          available_slots: totalSlots
        });
      } else {
        console.log(`❌ Region ${region.cep} does NOT cover the requested CEP (distance: ${distance}km > ${region.raio_km}km)`);
      }
    }

    if (availableRegions.length > 0) {
      console.log(`✅ Plan ${plan.name} has ${availableRegions.length} available region(s):`, availableRegions);
      servicesWithAvailability.push({
        ...plan,
        available_regions: availableRegions
      });
    } else {
      console.log(`❌ Plan ${plan.name} has no available regions for CEP ${cep}`);
    }
  }

  console.log('🎯 Final services with availability:', servicesWithAvailability.length, servicesWithAvailability);
  return servicesWithAvailability;
};

// Service para consulta de perfil público do walker (Regra 7: Entidades pequenas)

export class WalkerPublicProfileService {
  public async fetchWalkerBySlug(slug: string) {
    console.log("🔍 Buscando walker por slug no banco:", slug);
    
    try {
      const response = await fetch(`/api/walkers/public/${slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log("🔍 Walker não encontrado no banco, retornando mock data");
          return this.getMockWalkerData(slug);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("🔍 Dados do walker retornados do banco:", data.walker);
      return data.walker;
    } catch (error) {
      console.error("🔍 Erro ao buscar walker do banco:", error);
      console.log("🔍 Fallback para mock data");
      return this.getMockWalkerData(slug);
    }
  }

  private getMockWalkerData(slug: string) {
    const walkerData = {
      walker_id: slug,
      slug: slug,
      bio: "Profissional dedicado ao cuidado dos seus pets",
      location: "São Paulo, SP",
      phone: "(11) 99999-9999",
      years_experience: 3,
      specialties: ["Caminhada", "Cuidados básicos"],
      certifications: [],
      emergency_available: false,
      has_transport: false,
      languages_spoken: ["Português"],
      pet_size_preference: ["Pequeno", "Médio", "Grande"],
      additional_services: [],
      availability: {
        "Segunda a Sexta": "08:00 - 18:00",
        "Sábado": "08:00 - 16:00"
      },
      profile: {
        name: slug.charAt(0).toUpperCase() + slug.slice(1),
        email: `${slug}@example.com`,
        avatar_url: null
      }
    };
    
    console.log("🔍 Dados mock do walker retornados:", walkerData);
    return walkerData;
  }

  public async fetchServicePlans(walkerId: string) {
    console.log("🔍 Buscando planos de serviço para walker:", walkerId);
    
    try {
      // Usar o walkerId correto para buscar os planos
      const response = await fetch(`/api/walkers/${walkerId}/service-plans`);
      
      if (!response.ok) {
        console.log("🔍 Erro ao buscar planos do banco, usando localStorage");
        return this.getLocalStoragePlans(walkerId);
      }
      
      const data = await response.json();
      console.log("🔍 Planos de serviço retornados do banco:", data);
      return data || [];
    } catch (error) {
      console.error("🔍 Erro ao buscar planos do banco:", error);
      return this.getLocalStoragePlans(walkerId);
    }
  }

  private getLocalStoragePlans(walkerId: string) {
    const plansData = localStorage.getItem('dogwalker_service_plans');
    if (!plansData) {
      console.log("🔍 Nenhum plano encontrado no localStorage");
      return [];
    }

    const allPlansData = JSON.parse(plansData);
    const userPlans = allPlansData[walkerId] || [];
    const activePlans = userPlans.filter((plan: any) => plan.is_active);

    console.log("🔍 Planos de serviço retornados do localStorage:", activePlans);
    return activePlans;
  }
}

import { useEffect, useCallback } from "react";

type PreloadableComponent = () => Promise<{ default: React.ComponentType<any> }>;

interface PreloadConfig {
  [key: string]: PreloadableComponent;
}

export const useLazyPreload = () => {
  // Componentes que podem ser pré-carregados
  const preloadableComponents: PreloadConfig = {
    dashboard: () => import("@/apps/walker/pages/Dashboard"),
    analytics: () => import("@/apps/walker/pages/Analytics"),
    servicePlans: () => import("@/apps/walker/pages/ServicePlans"),
    clientServices: () => import("@/apps/client/pages/ClientServices"),
    clientLogin: () => import("@/apps/client/pages/ClientLogin"),
  };

  // Função para pré-carregar um componente específico
  const preloadComponent = useCallback((componentKey: string) => {
    const component = preloadableComponents[componentKey];
    if (component) {
      console.log(`🚀 Preloading component: ${componentKey}`);
      component().catch(error => {
        console.warn(`❌ Failed to preload ${componentKey}:`, error);
      });
    }
  }, []);

  // Função para pré-carregar múltiplos componentes
  const preloadComponents = useCallback((componentKeys: string[]) => {
    componentKeys.forEach(key => preloadComponent(key));
  }, [preloadComponent]);

  // Pré-carregamento inteligente baseado no papel do usuário
  const preloadByUserRole = useCallback((userRole: string | null) => {
    if (userRole === 'walker') {
      // Pré-carrega as páginas mais usadas pelos walkers
      preloadComponents(['dashboard', 'servicePlans']);
    } else if (userRole === 'client') {
      // Pré-carrega as páginas mais usadas pelos clientes
      preloadComponents(['clientServices']);
    }
  }, [preloadComponents]);

  // Pré-carregamento no hover (para links importantes)
  const preloadOnHover = useCallback((componentKey: string) => {
    return {
      onMouseEnter: () => preloadComponent(componentKey),
    };
  }, [preloadComponent]);

  return {
    preloadComponent,
    preloadComponents,
    preloadByUserRole,
    preloadOnHover,
  };
};


import { useClientServices } from "@/apps/client/hooks/useClientServices";
import { ClientServicesHeader } from "@/apps/client/components/ClientServicesHeader";
import { WalkerInfoCard } from "@/apps/client/components/WalkerInfoCard";
import { ServicesSection } from "@/apps/client/components/ServicesSection";
import { LoadingState } from "@/apps/client/components/LoadingState";
import { ErrorState } from "@/apps/client/components/ErrorState";
import { WalkerNotFound } from "@/apps/client/components/WalkerNotFound";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

const ClientServices = () => {
  const location = useLocation();
  const params = useParams();
  
  useEffect(() => {
    console.log('🔍 ClientServices: Component mounted');
    console.log('🔍 ClientServices: Location:', location);
    console.log('🔍 ClientServices: Params:', params);
    console.log('🔍 ClientServices: Window location:', window.location.href);
    console.log('🔍 ClientServices: Full pathname:', location.pathname);
    console.log('🔍 ClientServices: Slug param:', params.slug);
  }, [location, params]);

  const {
    walker,
    services,
    loading,
    error,
    handleServiceSelect,
    handleGoBack
  } = useClientServices();

  console.log('🔍 ClientServices: Component state:', { 
    hasWalker: !!walker, 
    servicesCount: services.length, 
    loading, 
    error,
    params
  });

  console.log('🔍 ClientServices: About to render, current state:', {
    loading,
    error: !!error,
    hasWalker: !!walker,
    pathname: location.pathname
  });

  if (loading) {
    console.log('🔍 ClientServices: Showing loading state');
    return <LoadingState />;
  }

  if (error) {
    console.log('🔍 ClientServices: Showing error state:', error);
    return <ErrorState error={error} onGoBack={handleGoBack} />;
  }

  if (!walker) {
    console.log('🔍 ClientServices: Walker not found, showing not found state');
    return <WalkerNotFound onGoBack={handleGoBack} />;
  }

  console.log('🔍 ClientServices: Rendering main content with walker:', walker.profiles?.name);

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientServicesHeader onGoBack={handleGoBack} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WalkerInfoCard walker={walker} />
        <ServicesSection 
          services={services} 
          onServiceSelect={handleServiceSelect} 
        />
      </main>
    </div>
  );
};

export default ClientServices;

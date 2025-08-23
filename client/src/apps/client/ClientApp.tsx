
import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

// Lazy load client pages
const ClientSignup = lazy(() => import("./pages/ClientSignup"));
const ClientLogin = lazy(() => import("./pages/ClientLogin"));
const ClientServices = lazy(() => import("./pages/ClientServices"));
const ClientConfirmation = lazy(() => import("./pages/ClientConfirmation"));

// Loading fallback específico para o app Client
const ClientLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      <p className="text-sm text-gray-600">Carregando área do cliente...</p>
    </div>
  </div>
);

export const ClientApp = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log('🔍 ClientApp: Location changed to:', location.pathname, location);
    console.log('🔍 ClientApp: Current path segments:', location.pathname.split('/'));
  }, [location]);

  console.log('🔍 ClientApp: Rendering with location:', location.pathname);
  
  // Extract slug from the URL path for cadastro routes
  const extractSlugFromPath = () => {
    const pathSegments = location.pathname.split('/');
    // For /walker/:slug/cadastro -> segments = ['', 'walker', 'slug', 'cadastro']
    if (pathSegments.length >= 3 && pathSegments[1] === 'walker' && pathSegments[3] === 'cadastro') {
      return pathSegments[2];
    }
    return null;
  };

  const walkerSlug = extractSlugFromPath();
  console.log('🔍 ClientApp: Extracted walker slug:', walkerSlug);
  
  return (
    <Suspense fallback={<ClientLoadingFallback />}>
      <Routes>
        <Route path="/signup/:slug" element={<ClientSignup />} />
        <Route path="/" element={<ClientSignup walkerSlug={walkerSlug} />} />
        <Route path="/login" element={<ClientLogin />} />
        <Route path="/:slug" element={<ClientServices />} />
        <Route path="/confirmation" element={<ClientConfirmation />} />
      </Routes>
    </Suspense>
  );
};

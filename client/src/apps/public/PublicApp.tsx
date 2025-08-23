
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy load public pages
const Index = lazy(() => import("./pages/Index"));
const TestLanding = lazy(() => import("./pages/TestLanding"));

// Loading fallback específico para o app Public
const PublicLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      <p className="text-sm text-gray-600">Carregando página...</p>
    </div>
  </div>
);

export const PublicApp = () => {
  return (
    <Suspense fallback={<PublicLoadingFallback />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/landing" element={<TestLanding />} />
      </Routes>
    </Suspense>
  );
};

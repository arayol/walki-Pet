
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy load walker pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Analytics = lazy(() => import("./pages/Analytics"));
const ServicePlans = lazy(() => import("./pages/ServicePlans"));
const Schedule = lazy(() => import("../../pages/Schedule"));
const Clients = lazy(() => import("../../pages/Clients"));
const Financial = lazy(() => import("../../pages/Financial"));
const Marketing = lazy(() => import("../../pages/Marketing"));

// Loading fallback específico para o app Walker
const WalkerLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p className="text-sm text-gray-600">Carregando painel do dog walker...</p>
    </div>
  </div>
);

export const WalkerApp = () => {
  return (
    <Suspense fallback={<WalkerLoadingFallback />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/service-plans" element={<ServicePlans />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/financial" element={<Financial />} />
        <Route path="/marketing" element={<Marketing />} />
      </Routes>
    </Suspense>
  );
};


import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy load auth pages
const Auth = lazy(() => import("./pages/Auth"));

// Loading fallback específico para o app Auth
const AuthLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <p className="text-sm text-gray-600">Carregando autenticação...</p>
    </div>
  </div>
);

export const AuthApp = () => {
  return (
    <Suspense fallback={<AuthLoadingFallback />}>
      <Routes>
        <Route path="/" element={<Auth />} />
      </Routes>
    </Suspense>
  );
};

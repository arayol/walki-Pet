import { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Auth from "@/apps/auth/pages/Auth";
import Index from "@/apps/public/pages/Index";
import TestLanding from "@/apps/public/pages/TestLanding";
import Dashboard from "@/apps/walker/pages/Dashboard";
import Clients from "@/pages/Clients";
import Schedule from "@/pages/Schedule";
import ServicePlans from "@/apps/walker/pages/ServicePlans";
import Analytics from "@/apps/walker/pages/Analytics";
import Financial from "@/pages/Financial";
import Marketing from "@/pages/Marketing";
import ClientDashboard from "@/pages/ClientDashboard";
import PublicProfile from "@/pages/PublicProfile";
import NotFound from "@/pages/NotFound";
import ClientLanding from "@/pages/ClientLanding";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ClientApp } from "@/apps/client/ClientApp";
import { PaymentMethodProvider } from "@/components/payments/PaymentMethodProvider";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentDiagnostic from "@/pages/PaymentDiagnostic";
import StripePaymentVerification from "@/pages/StripePaymentVerification";
import StripeDiagnostic from "@/pages/StripeDiagnostic";
import ClientServices from "@/apps/client/pages/ClientServices";
import ClientBooking from "@/pages/ClientBooking";
import ClientBookingSuccess from "@/pages/ClientBookingSuccess";
import WebhookBuilder from "@/pages/WebhookBuilder";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import About from "@/pages/About";
import Pricing from "@/pages/Pricing";
import PlanSignup from "@/pages/PlanSignup";
import CadastroSucesso from "@/pages/CadastroSucesso";
import Integrations from "@/pages/Integrations";
import ClientLogin from "@/apps/client/pages/ClientLogin";
import StripeConnectSuccess from "@/pages/StripeConnectSuccess";

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Separate component for routes that need useLocation
function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    console.log('Current route:', location.pathname);
  }, [location]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/landing" element={<TestLanding />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/client-landing" element={<ClientLanding />} />
      
      {/* Walker routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute requiredRole="walker">
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/clients" element={
        <ProtectedRoute requiredRole="walker">
          <Clients />
        </ProtectedRoute>
      } />
      <Route path="/schedule" element={
        <ProtectedRoute requiredRole="walker">
          <Schedule />
        </ProtectedRoute>
      } />
      <Route path="/service-plans" element={
        <ProtectedRoute requiredRole="walker">
          <ServicePlans />
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute requiredRole="walker">
          <Analytics />
        </ProtectedRoute>
      } />
      <Route path="/financial" element={
        <ProtectedRoute requiredRole="walker">
          <Financial />
        </ProtectedRoute>
      } />
      <Route path="/marketing" element={
        <ProtectedRoute requiredRole="walker">
          <Marketing />
        </ProtectedRoute>
      } />
      <Route path="/webhook-builder" element={
        <ProtectedRoute requiredRole="walker">
          <WebhookBuilder />
        </ProtectedRoute>
      } />

      {/* Client routes */}
      <Route path="/client-area" element={<ClientLogin />} />
      <Route path="/client-dashboard" element={
        <ProtectedRoute requiredRole="client">
          <ClientDashboard />
        </ProtectedRoute>
      } />
      
      {/* Client booking route - fixed parameter names */}
      <Route path="/client-booking/:walkerId/:servicePlanId" element={<ClientBooking />} />
      <Route path="/client-booking/success" element={<ClientBookingSuccess />} />
      
      {/* Public profile and client services */}
      <Route path="/profile/:slug" element={<PublicProfile />} />
      <Route path="/walker/:slug/cadastro/*" element={<ClientApp />} />
      <Route path="/client-services/:slug" element={<ClientServices />} />
      
      {/* Client-specific routes */}
      <Route path="/client/*" element={<ClientApp />} />
      
      {/* Payment routes */}
      <Route path="/payment-success" element={<PaymentSuccess />} />
      
      {/* Stripe Connect routes for walkers */}
      <Route path="/walker/payments/success" element={
        <ProtectedRoute requiredRole="walker">
          <StripeConnectSuccess />
        </ProtectedRoute>
      } />
      <Route path="/walker/payments/refresh" element={
        <ProtectedRoute requiredRole="walker">
          <StripeConnectSuccess />
        </ProtectedRoute>
      } />
      
      {/* Legal routes */}
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/integrations" element={<Integrations />} />
      <Route path="/plan-signup" element={<PlanSignup />} />
      <Route path="/cadastro-sucesso" element={<CadastroSucesso />} />
      
      {/* Debug routes */}
      <Route path="/payment-diagnostic" element={<PaymentDiagnostic />} />
      <Route path="/stripe-payment-verification" element={<StripePaymentVerification />} />
      <Route path="/stripe-diagnostic" element={<StripeDiagnostic />} />
      
      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <PaymentMethodProvider>
            <div className="min-h-screen bg-background font-sans antialiased">
              <Toaster />
              <AppRoutes />
            </div>
          </PaymentMethodProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

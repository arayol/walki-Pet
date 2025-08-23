import { WebhookBuilder } from "@/components/admin/WebhookBuilder";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { WalkerHeader } from "@/components/walker/WalkerHeader";

const WebhookBuilderPage = () => {
  return (
    <ProtectedRoute requiredRole="walker">
      <div className="min-h-screen bg-background">
        <WalkerHeader />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Webhook Builder</h1>
            <p className="text-muted-foreground mt-2">
              Configure e teste webhooks do Stripe de forma interativa
            </p>
          </div>
          <WebhookBuilder />
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default WebhookBuilderPage;
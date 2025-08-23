
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { WalkerHeader } from "@/components/walker/WalkerHeader";
import { AnalyticsOverview } from "@/components/analytics/AnalyticsOverview";
import { PerformanceReport } from "@/components/analytics/PerformanceReport";
import { MigrationPanel } from "@/components/migration/MigrationPanel";

const Analytics = () => {
  return (
    <ProtectedRoute requiredRole="walker">
      <div className="min-h-screen bg-gray-50">
        <WalkerHeader />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
              <TabsTrigger value="migration">Migração & Config</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <AnalyticsOverview />
            </TabsContent>

            <TabsContent value="reports">
              <PerformanceReport />
            </TabsContent>

            <TabsContent value="migration">
              <MigrationPanel />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Analytics;

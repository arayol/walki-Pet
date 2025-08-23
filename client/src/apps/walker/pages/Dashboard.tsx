
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { WalkerLayout } from "@/components/layout/WalkerLayout";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ProfileSummary } from "@/components/dashboard/ProfileSummary";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentBookings } from "@/components/walker/RecentBookings";
import { RecurringBookingsCard } from "@/components/walker/RecurringBookingsCard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { ProcessPendingWalksButton } from "@/components/debug/ProcessPendingWalksButton";
import { usePlanLimits } from "@/hooks/usePlanLimits";
import { PlanLimitsBanner } from "@/components/plan-limits/PlanLimitsBanner";
import { UpgradeModal } from "@/components/plan-limits/UpgradeModal";
import { useState } from "react";

const Dashboard = () => {
  const { stats, walkerData, loading, refetch } = useDashboardData();
  const { planLimits, shouldBlockActions } = usePlanLimits();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  if (loading) {
    return (
      <ProtectedRoute requiredRole="walker">
        <WalkerLayout>
          <div className="flex items-center justify-center min-h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </WalkerLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="walker">
      <WalkerLayout>
        <div className="space-y-6">
          {/* Header com título e perfil - Layout horizontal otimizado */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mb-3">Bem-vindo ao seu painel de controle</p>
              <ProcessPendingWalksButton />
            </div>
            
            {/* Meu Perfil - mais largo */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <ProfileSummary walkerData={walkerData} onProfileUpdate={refetch} />
            </div>
          </div>

          {/* Banner de limites do plano */}
          {shouldBlockActions && planLimits && (
            <PlanLimitsBanner
              reason={planLimits.reason}
              clientCount={planLimits.client_count}
              maxClients={planLimits.max_clients}
              accountAgeDays={planLimits.account_age_days}
              trialDays={planLimits.trial_days}
              onUpgrade={() => setShowUpgradeModal(true)}
            />
          )}

          {/* Stats Cards */}
          <DashboardStats stats={stats} />

          {/* Ações Rápidas */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
            <p className="text-gray-600 mb-6">Acesse suas funcionalidades</p>
            <QuickActions />
          </div>

          {/* Grid de conteúdo principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Novos Agendamentos</h2>
              <p className="text-gray-600 mb-6">Seus agendamentos dos últimos 10 dias</p>
              <RecentBookings />
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Agendamentos Recorrentes</h2>
              <p className="text-gray-600 mb-6">Seus clientes com agendamentos recorrentes ativos</p>
              <RecurringBookingsCard />
            </div>
          </div>
        </div>

        {/* Modal de upgrade */}
        <UpgradeModal
          open={showUpgradeModal}
          onOpenChange={setShowUpgradeModal}
          reason={planLimits?.reason || ""}
        />
      </WalkerLayout>
    </ProtectedRoute>
  );
};

export default Dashboard;

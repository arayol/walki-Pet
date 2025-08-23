
import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { WalkerHeader } from "@/components/walker/WalkerHeader";
import { ServicePlansHeader } from "@/components/service-plans/ServicePlansHeader";
import { ServicePlansList } from "@/components/service-plans/ServicePlansList";
import { ServicePlanForm } from "@/components/service-plans/ServicePlanForm";
import { ServicePlansDiagnostic } from "@/components/debug/ServicePlansDiagnostic";
import { useServicePlans } from "@/hooks/useServicePlans";

export type ServicePlan = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price: number;
  is_recurring: boolean;
  recurrence_type: string | null;
  walk_count: number;
  includes_bath: boolean;
  includes_grooming: boolean;
  includes_feeding: boolean;
  includes_playtime: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

const ServicePlans = () => {
  const [activeTab, setActiveTab] = useState<'walks' | 'extras'>('walks');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ServicePlan | null>(null);
  
  const { data: plans = [], isLoading, refetch } = useServicePlans();

  const handleNewPlan = () => {
    setEditingPlan(null);
    setIsFormOpen(true);
  };

  const handleEditPlan = (plan: ServicePlan) => {
    setEditingPlan(plan);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingPlan(null);
  };

  const handleFormSave = () => {
    setIsFormOpen(false);
    setEditingPlan(null);
    refetch();
  };

  // Separar planos por tipo - lógica atualizada
  const walkPlans = plans.filter(plan => {
    // Um plano é considerado de "passeios" se tem walk_count > 0 E não tem nenhum serviço extra
    return plan.walk_count > 0 && !plan.includes_bath && !plan.includes_grooming && !plan.includes_feeding && !plan.includes_playtime;
  });
  
  const extraPlans = plans.filter(plan => {
    // Um plano é considerado de "serviços extras" se tem pelo menos um serviço extra
    return plan.includes_bath || plan.includes_grooming || plan.includes_feeding || plan.includes_playtime;
  });

  const currentPlans = activeTab === 'walks' ? walkPlans : extraPlans;

  return (
    <ProtectedRoute requiredRole="walker">
      <div className="min-h-screen bg-gray-50">
        <WalkerHeader />
        <ServicePlansHeader 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onNewPlan={handleNewPlan}
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ServicePlansList 
            plans={currentPlans}
            isLoading={isLoading}
            onEditPlan={handleEditPlan}
            onRefetch={refetch}
          />
          
          <ServicePlansDiagnostic />
        </main>

        {isFormOpen && (
          <ServicePlanForm
            plan={editingPlan}
            planType={activeTab}
            onClose={handleFormClose}
            onSave={handleFormSave}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default ServicePlans;

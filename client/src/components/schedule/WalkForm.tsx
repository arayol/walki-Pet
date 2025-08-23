
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useWalkForm } from "./walk-form/useWalkForm";
import { ClientSelect } from "./walk-form/ClientSelect";
import { ServicePlanSelect } from "./walk-form/ServicePlanSelect";
import { PlanInfoDisplay } from "./walk-form/PlanInfoDisplay";
import { WalkSlotSelector } from "./walk-form/WalkSlotSelector";
import { NotesField } from "./walk-form/NotesField";
import { PaymentMethodSelect } from "./walk-form/PaymentMethodSelect";
import { FormActions } from "./walk-form/FormActions";
import { WalkFormProps } from "./walk-form/types";

export const WalkForm = ({ selectedDate, onClose, onSave }: WalkFormProps) => {
  const { 
    formData, 
    setFormData, 
    clients, 
    servicePlans, 
    selectedPlan, 
    loading, 
    handleSubmit, 
    handlePlanSelect 
  } = useWalkForm(selectedDate, onSave);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Novo Agendamento</CardTitle>
              <CardDescription>Agende um novo passeio</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <ClientSelect
              clients={clients}
              value={formData.client_id}
              onChange={(value) => setFormData({ ...formData, client_id: value })}
            />

            <ServicePlanSelect
              servicePlans={servicePlans}
              value={formData.service_plan_id}
              onChange={(value) => setFormData({ ...formData, service_plan_id: value })}
              onPlanSelect={handlePlanSelect}
            />

            {formData.client_id && (
              <PaymentMethodSelect
                value={formData.payment_method}
                onChange={(value) => setFormData({ ...formData, payment_method: value })}
              />
            )}

            <PlanInfoDisplay plan={selectedPlan} />

            {selectedPlan && (
              <WalkSlotSelector
                selectedSlots={formData.selected_slots}
                onSlotsChange={(slots) => setFormData({ ...formData, selected_slots: slots })}
                maxSlots={selectedPlan.walk_count}
              />
            )}

            <NotesField
              value={formData.notes}
              onChange={(notes) => setFormData({ ...formData, notes })}
            />

            <FormActions onCancel={onClose} loading={loading} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

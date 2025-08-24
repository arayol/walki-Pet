
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { DaySelector } from "./DaySelector";
import { BookingSummaryPanel } from "./BookingSummaryPanel";
import { ValidationFeedback } from "./ValidationFeedback";
import { BookingProgress } from "./BookingProgress";
import { ConfirmationModal } from "./ConfirmationModal";
import { BookingHeader } from "./BookingHeader";
import { BookingActions } from "./BookingActions";
import { useIntegratedBookingPayment } from "@/hooks/useIntegratedBookingPayment";
import { useRealTimeValidation } from "@/hooks/useRealTimeValidation";

interface SelectedSlot {
  date: string;
  time: string;
  dayOfWeek: number;
}

interface ServicePlan {
  id: string;
  name: string;
  price: number;
  walk_count: number;
  is_recurring: boolean;
  recurrence_type: "weekly" | "monthly" | null;
  description?: string;
  walker_id: string;
  includes_playtime: boolean;
  includes_feeding: boolean;
  includes_grooming: boolean;
  includes_bath: boolean;
}

interface BookingFormProps {
  servicePlan: ServicePlan;
  walkerId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const BookingForm = ({ servicePlan, walkerId, onSuccess, onCancel }: BookingFormProps) => {
  const { user } = useAuth();
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [walkerData, setWalkerData] = useState<any>(null);

  const { processBookingWithPayment } = useIntegratedBookingPayment(servicePlan, walkerId);

  const realTimeValidation = useRealTimeValidation(
    servicePlan.id,
    selectedSlots,
    selectedSlots.length > 0
  );

  const isComplete = selectedSlots.length === servicePlan.walk_count && realTimeValidation.isValid;

  const fetchWalkerData = async () => {
    try {
      console.log('🔍 Buscando dados do walker:', walkerId);
      
      const response = await fetch(`/api/walkers/${walkerId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch walker data');
      }
      
      const walkerData = await response.json();
      console.log('✅ Dados do walker encontrados:', walkerData);
      
      setWalkerData({
        walker_id: walkerData.walker_id,
        location: walkerData.location || '',
        phone: walkerData.phone || '',
        profiles: {
          name: walkerData.profile?.name || 'Walker',
          email: walkerData.profile?.email || ''
        }
      });
    } catch (error) {
      console.error('❌ Erro ao buscar dados do walker:', error);
      console.log('🔄 Supabase....a partir daqui iremos para o pagamento no Stripe');
    }
  };

  const handleConfirmBooking = async () => {
    if (!walkerData) {
      await fetchWalkerData();
    }
    setShowConfirmation(true);
  };

  const handleProcessPayment = async () => {
    if (!user || selectedSlots.length === 0) {
      return;
    }

    setLoading(true);
    
    try {
      const success = await processBookingWithPayment(selectedSlots, notes, 'marketplace');
      if (success) {
        setShowConfirmation(false);
        onSuccess();
      }
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStep = () => {
    if (selectedSlots.length === 0) return 1;
    if (selectedSlots.length < servicePlan.walk_count) return 2;
    return 3;
  };

  const getStepStatus = () => {
    const step1 = selectedSlots.length > 0 ? 'completed' : 'current';
    const step2 = selectedSlots.length === servicePlan.walk_count ? 'completed' : 
                 selectedSlots.length > 0 ? 'current' : 'pending';
    const step3 = isComplete ? 'current' : 'pending';
    
    return [step1, step2, step3];
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <BookingProgress
        currentStep={getCurrentStep()}
        totalSteps={3}
        stepLabels={[
          'Selecionar horários',
          'Completar seleção',
          'Confirmar agendamento'
        ]}
        stepStatus={getStepStatus() as any}
      />

      <BookingHeader servicePlan={servicePlan} />

      <ValidationFeedback
        isValid={realTimeValidation.isValid}
        errors={realTimeValidation.errors}
        warnings={realTimeValidation.warnings}
        loading={realTimeValidation.loading}
        selectedCount={selectedSlots.length}
        requiredCount={servicePlan.walk_count}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DaySelector
            servicePlanId={servicePlan.id}
            selectedSlots={selectedSlots}
            onSlotsChange={setSelectedSlots}
            maxSlots={servicePlan.walk_count}
            planType={servicePlan.is_recurring ? 'recurring' : 'single'}
          />
        </div>

        <div className="lg:col-span-1">
          <BookingSummaryPanel
            servicePlan={servicePlan}
            selectedSlots={selectedSlots}
            notes={notes}
            isComplete={isComplete}
          />
        </div>
      </div>

      <BookingActions
        notes={notes}
        onNotesChange={setNotes}
        onCancel={onCancel}
        onConfirm={handleConfirmBooking}
        isValidSelection={isComplete}
        loading={loading}
      />

      {showConfirmation && walkerData && selectedSlots.length > 0 && (
        <ConfirmationModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleProcessPayment}
          walker={walkerData}
          service={servicePlan}
          selectedDate={new Date(selectedSlots[0].date)}
          selectedTime={selectedSlots[0].time}
          isConfirming={loading}
        />
      )}
    </div>
  );
};

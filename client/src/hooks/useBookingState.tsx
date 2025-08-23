
import { useState } from "react";
import { PlanAvailabilitySlot } from "./usePlanAvailability";

export interface SelectedDay {
  date: string;
  dayOfWeek: number;
  availableSlots: PlanAvailabilitySlot[];
}

export interface SelectedSlot {
  date: string;
  time: string;
  dayOfWeek: number;
}

export const useBookingState = () => {
  const [selectedDays, setSelectedDays] = useState<SelectedDay[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [walkerData, setWalkerData] = useState<any>(null);

  const handleDaysChange = (days: SelectedDay[]) => {
    console.log('🔍 useBookingState: Days changed:', days.length);
    setSelectedDays(days);
    
    const validSlots = selectedSlots.filter(slot => 
      days.some(day => day.date === slot.date)
    );
    
    if (validSlots.length !== selectedSlots.length) {
      setSelectedSlots(validSlots);
    }
  };

  const handleSlotsChange = (slots: SelectedSlot[]) => {
    console.log('🔍 useBookingState: Slots changed:', slots.length);
    setSelectedSlots(slots);
  };

  return {
    selectedDays,
    selectedSlots,
    notes,
    loading,
    showConfirmation,
    walkerData,
    setNotes,
    setLoading,
    setShowConfirmation,
    setWalkerData,
    handleDaysChange,
    handleSlotsChange,
  };
};

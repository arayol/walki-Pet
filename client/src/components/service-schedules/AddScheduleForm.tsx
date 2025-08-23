
import React from 'react';
import { DayTimeSelector } from './DayTimeSelector';
import { useServiceSchedules, CreateServiceScheduleData } from '@/hooks/useServiceSchedules';

interface DayTimeSlot {
  days: number[];
  hora_inicio: string;
  hora_fim: string;
  capacidade_maxima: number;
}

interface AddScheduleFormProps {
  servicePlanId: string;
  serviceRegionId: string;
  onClose: () => void;
}

export const AddScheduleForm = ({ servicePlanId, serviceRegionId, onClose }: AddScheduleFormProps) => {
  const { createSchedule } = useServiceSchedules(servicePlanId, serviceRegionId);

  const handleSave = (slots: DayTimeSlot[]) => {
    // Expandir cada slot para criar um horário para cada dia selecionado
    const schedules: CreateServiceScheduleData[] = [];
    
    slots.forEach(slot => {
      slot.days.forEach(day => {
        schedules.push({
          service_plan_id: servicePlanId,
          service_region_id: serviceRegionId,
          dia_semana: day,
          hora_inicio: slot.hora_inicio,
          hora_fim: slot.hora_fim,
          capacidade_maxima: slot.capacidade_maxima,
        });
      });
    });

    // Criar todos os horários
    schedules.forEach(schedule => {
      createSchedule(schedule);
    });

    onClose();
  };

  return (
    <DayTimeSelector 
      onSave={handleSave}
      onCancel={onClose}
    />
  );
};

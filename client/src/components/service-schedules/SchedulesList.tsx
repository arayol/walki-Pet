
import React from 'react';
import { ServiceSchedule } from '@/hooks/useServiceSchedules';
import { ScheduleCard } from './ScheduleCard';
import { Skeleton } from '@/components/ui/skeleton';

interface SchedulesListProps {
  schedules: ServiceSchedule[];
  isLoading: boolean;
  servicePlanId: string;
  serviceRegionId: string;
}

const DIAS_SEMANA = {
  1: 'Segunda-feira',
  2: 'Terça-feira', 
  3: 'Quarta-feira',
  4: 'Quinta-feira',
  5: 'Sexta-feira',
  6: 'Sábado',
  7: 'Domingo'
};

export const SchedulesList = ({ 
  schedules, 
  isLoading, 
  servicePlanId, 
  serviceRegionId 
}: SchedulesListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhum horário configurado ainda.</p>
        <p className="text-sm">Clique em "Novo Horário" para começar.</p>
      </div>
    );
  }

  // Agrupar por dia da semana
  const schedulesByDay = schedules.reduce((acc, schedule) => {
    const day = schedule.dia_semana;
    if (!acc[day]) acc[day] = [];
    acc[day].push(schedule);
    return acc;
  }, {} as Record<number, ServiceSchedule[]>);

  return (
    <div className="space-y-4">
      {Object.entries(schedulesByDay)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([day, daySchedules]) => (
          <div key={day}>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">
              {DIAS_SEMANA[Number(day) as keyof typeof DIAS_SEMANA]}
            </h4>
            <div className="space-y-2">
              {daySchedules.map((schedule) => (
                <ScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  servicePlanId={servicePlanId}
                  serviceRegionId={serviceRegionId}
                />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

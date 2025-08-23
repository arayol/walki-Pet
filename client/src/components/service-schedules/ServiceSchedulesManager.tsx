
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useServiceSchedules } from '@/hooks/useServiceSchedules';
import { SchedulesList } from './SchedulesList';
import { AddScheduleForm } from './AddScheduleForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ServiceSchedulesManagerProps {
  servicePlanId: string;
  serviceRegionId: string;
  servicePlanName: string;
  regionCep: string;
}

export const ServiceSchedulesManager = ({ 
  servicePlanId, 
  serviceRegionId, 
  servicePlanName,
  regionCep 
}: ServiceSchedulesManagerProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { schedules, isLoading } = useServiceSchedules(servicePlanId, serviceRegionId);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Horários de Atendimento</CardTitle>
            <p className="text-sm text-muted-foreground">
              {servicePlanName} - CEP: {regionCep}
            </p>
          </div>
          <Button onClick={() => setShowAddForm(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Horário
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <SchedulesList
          schedules={schedules}
          isLoading={isLoading}
          servicePlanId={servicePlanId}
          serviceRegionId={serviceRegionId}
        />
      </CardContent>

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-md" aria-describedby="schedule-dialog-description">
          <DialogHeader>
            <DialogTitle>Novo Horário</DialogTitle>
            <div id="schedule-dialog-description" className="text-sm text-muted-foreground">
              Configure um novo horário de atendimento
            </div>
          </DialogHeader>
          <AddScheduleForm
            servicePlanId={servicePlanId}
            serviceRegionId={serviceRegionId}
            onClose={() => setShowAddForm(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

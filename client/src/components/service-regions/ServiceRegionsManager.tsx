
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RegionsList } from './RegionsList';
import { AddRegionForm } from './AddRegionForm';

interface ServiceRegionsManagerProps {
  servicePlanId: string;
  servicePlanName: string;
}

export const ServiceRegionsManager = ({ 
  servicePlanId, 
  servicePlanName 
}: ServiceRegionsManagerProps) => {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Regiões de Atendimento</h2>
        <p className="text-muted-foreground">
          Configure as regiões e horários onde você oferece o serviço: <strong>{servicePlanName}</strong>
        </p>
      </div>

      <RegionsList
        servicePlanId={servicePlanId}
        servicePlanName={servicePlanName}
        onAddRegion={() => setShowAddForm(true)}
      />

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-md" aria-describedby="dialog-description">
          <DialogHeader>
            <DialogTitle>Nova Região</DialogTitle>
            <div id="dialog-description" className="text-sm text-muted-foreground">
              Configure uma nova região de atendimento
            </div>
          </DialogHeader>
          <AddRegionForm
            servicePlanId={servicePlanId}
            onClose={() => setShowAddForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

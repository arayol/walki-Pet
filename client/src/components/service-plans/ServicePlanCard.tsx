import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, MapPin, Settings } from "lucide-react";
import { PriceDisplay } from "./PriceDisplay";
import { DeletePlanModal } from "./DeletePlanModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ServiceRegionsManager } from "@/components/service-regions/ServiceRegionsManager";
import { ServicePlan } from "@/apps/walker/pages/ServicePlans";

interface ServicePlanCardProps {
  plan: ServicePlan;
  onEdit: (plan: ServicePlan) => void;
  onRefetch: () => void;
}

export const ServicePlanCard = ({ plan, onEdit, onRefetch }: ServicePlanCardProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRegionsModal, setShowRegionsModal] = useState(false);

  const getRecurrenceText = () => {
    if (!plan.is_recurring) return "Avulso";
    
    switch (plan.recurrence_type) {
      case "weekly":
        return "Semanal";
      case "monthly":
        return "Mensal";
      default:
        return "Recorrente";
    }
  };

  const getIncludedServices = () => {
    const services = [];
    if (plan.includes_bath) services.push("Banho");
    if (plan.includes_feeding) services.push("Alimentação");
    if (plan.includes_grooming) services.push("Tosa");
    if (plan.includes_playtime) services.push("Brincadeiras");
    
    return services;
  };

  const handleDelete = () => {
    onRefetch();
    setShowDeleteModal(false);
  };

  return (
    <>
      <Card className={`transition-all duration-200 hover:shadow-md ${!plan.is_active ? 'opacity-60' : ''}`}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <Badge variant={plan.is_active ? "default" : "secondary"}>
                  {plan.is_active ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              {plan.description && (
                <CardDescription className="mb-3">
                  {plan.description}
                </CardDescription>
              )}
            </div>
            {plan.image_url && (
              <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 ml-4">
                <img 
                  src={plan.image_url} 
                  alt={plan.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <div>
              <p className="text-muted-foreground">Preço</p>
              <PriceDisplay 
                price={plan.price}
                isRecurring={plan.is_recurring || false}
                recurrenceType={plan.recurrence_type}
              />
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">Passeios</p>
              <p className="font-medium text-lg">{plan.walk_count}x</p>
            </div>
          </div>

          {getIncludedServices().length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Serviços inclusos:</p>
              <div className="flex flex-wrap gap-1">
                {getIncludedServices().map((service) => (
                  <Badge key={service} variant="outline" className="text-xs">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(plan)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowRegionsModal(true)}
              className="text-blue-600 hover:text-blue-800"
            >
              <MapPin className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <DeletePlanModal
        plan={plan}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
      />

      <Dialog open={showRegionsModal} onOpenChange={setShowRegionsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerenciar Regiões - {plan.name}</DialogTitle>
          </DialogHeader>
          <ServiceRegionsManager
            servicePlanId={plan.id}
            servicePlanName={plan.name}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

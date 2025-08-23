
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { User, MapPin, Phone, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Client } from "@/types/client";
import { ClientScheduleDisplay } from "./ClientScheduleDisplay";
import { BookingForm } from "@/components/booking/BookingForm";
import { useClientToggle } from "@/hooks/useClientToggle";

interface ClientCardProps {
  client: Client;
  onStatusChange: (clientId: string, newStatus: boolean) => void;
}

export const ClientCard = ({ client, onStatusChange }: ClientCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isActive, setIsActive] = useState(client.is_active ?? true);
  const { toggleClientStatus, loading } = useClientToggle();

  // Dados do walker mockados para o formulário de agendamento
  const mockWalker = {
    name: "Dog Walker",
    services: [
      { name: "Passeio Básico", duration: "30 min", price: "R$ 25,00" },
      { name: "Passeio Longo", duration: "60 min", price: "R$ 40,00" },
      { name: "Recreação", duration: "45 min", price: "R$ 35,00" }
    ]
  };

  const handleToggleStatus = async () => {
    const newStatus = await toggleClientStatus(client.client_id, isActive);
    setIsActive(newStatus);
    onStatusChange(client.client_id, newStatus);
  };

  return (
    <>
      <Card className={`hover:shadow-lg transition-shadow duration-200 ${
        !isActive ? 'opacity-70 border-l-4 border-l-gray-400' : ''
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-center space-y-2">
                <Switch
                  checked={isActive}
                  onCheckedChange={handleToggleStatus}
                  disabled={loading}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
              <div>
                <CardTitle className="text-lg">{client.pet_name}</CardTitle>
                <p className="text-sm text-gray-600">{client.client_name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {client.pet_breed || "SRD"}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {/* Conteúdo sempre visível */}
          <div className="pt-3 border-t">
            <Button 
              className="w-full" 
              size="sm"
              onClick={() => setShowBookingForm(true)}
              disabled={!isActive}
            >
              Agendar Passeio
            </Button>
          </div>

          {/* Conteúdo colapsável */}
          {isExpanded && (
            <div className="space-y-3 pt-3 border-t">
              {client.pet_age && (
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {client.pet_age} {client.pet_age === 1 ? "ano" : "anos"}
                </div>
              )}
              
              {client.profiles?.email && (
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  {client.profiles.email}
                </div>
              )}
              
              {client.address && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {client.address}
                </div>
              )}
              
              {client.emergency_contact && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {client.emergency_contact}
                </div>
              )}
              
              {client.pet_notes && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">{client.pet_notes}</p>
                </div>
              )}

              <ClientScheduleDisplay 
                preferredDays={client.preferred_days}
                preferredTimes={client.preferred_times}
                additionalNotes={client.additional_schedule_notes}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {showBookingForm && (
        <BookingForm
          walker={mockWalker}
          onClose={() => setShowBookingForm(false)}
        />
      )}
    </>
  );
};

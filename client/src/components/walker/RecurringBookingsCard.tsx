
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar, Clock, MapPin, Repeat, Eye, ChevronDown, ChevronUp, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfWeek, endOfWeek, addWeeks, isWithinInterval, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Walk {
  id: string;
  scheduled_at: string;
  service_type: string;
  status: string;
  clients: {
    pet_name: string;
    address?: string;
    created_at?: string;
    profiles?: {
      name: string;
    } | null;
  };
}

interface WeekGroup {
  currentWeek: Walk[];
  nextWeek: Walk[];
}

export const RecurringBookingsCard = () => {
  const { user } = useAuth();
  const [weekGroups, setWeekGroups] = useState<WeekGroup>({ currentWeek: [], nextWeek: [] });
  const [loading, setLoading] = useState(true);
  const [currentWeekOpen, setCurrentWeekOpen] = useState(true);
  const [nextWeekOpen, setNextWeekOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRecurringBookings();
    }
  }, [user]);

  const fetchRecurringBookings = async () => {
    try {
      console.log("🔄 Buscando agendamentos recorrentes para walker:", user?.id);

      // Return empty data for now - can be implemented later
      const data: any[] = [];
      const error = null;

      const now = new Date();
      const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });
      const currentWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
      const nextWeekStart = addWeeks(currentWeekStart, 1);
      const nextWeekEnd = addWeeks(currentWeekEnd, 1);

      const currentWeek: Walk[] = [];
      const nextWeek: Walk[] = [];

      data?.forEach((walk: any) => {
        const walkDate = new Date(walk.scheduled_at);
        
        if (isWithinInterval(walkDate, { start: currentWeekStart, end: currentWeekEnd })) {
          currentWeek.push(walk);
        } else if (isWithinInterval(walkDate, { start: nextWeekStart, end: nextWeekEnd })) {
          nextWeek.push(walk);
        }
      });

      setWeekGroups({ currentWeek, nextWeek });
    } catch (error) {
      console.error("Error fetching recurring bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const isNewClient = (clientCreatedAt?: string) => {
    if (!clientCreatedAt) return false;
    const createdDate = new Date(clientCreatedAt);
    const daysSinceCreated = differenceInDays(new Date(), createdDate);
    return daysSinceCreated <= 15;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";  
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Agendado";
      case "confirmed":
        return "Confirmado";
      case "in_progress":
        return "Em andamento";
      case "completed":
        return "Concluído";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Repeat className="h-5 w-5" />
            Agendamentos Recorrentes
          </CardTitle>
          <CardDescription>Carregando...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Repeat className="h-5 w-5" />
          Agendamentos Recorrentes
        </CardTitle>
        <CardDescription>Seus clientes com agendamentos recorrentes ativos</CardDescription>
      </CardHeader>
      <CardContent>
        {weekGroups.currentWeek.length === 0 && weekGroups.nextWeek.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Repeat className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Nenhum agendamento recorrente ativo.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Semana Atual */}
            <Collapsible open={currentWeekOpen} onOpenChange={setCurrentWeekOpen}>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Semana Atual</span>
                    <Badge variant="secondary" className="ml-2">
                      {weekGroups.currentWeek.length}
                    </Badge>
                  </div>
                  {currentWeekOpen ? (
                    <ChevronUp className="h-4 w-4 text-blue-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-blue-600" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="space-y-2">
                  {weekGroups.currentWeek.map((walk) => (
                    <div key={walk.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {walk.clients.profiles?.name || "Cliente"} • {walk.clients.pet_name}
                          </h4>
                          {isNewClient(walk.clients.created_at) && (
                            <Badge variant="outline" className="text-xs flex items-center gap-1 text-orange-600 border-orange-200">
                              <Star className="h-3 w-3" />
                              Novo
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{format(new Date(walk.scheduled_at), "EEEE, dd/MM - HH:mm", { locale: ptBR })}</span>
                          </div>
                          {walk.clients.address && (
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="truncate">{walk.clients.address}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                          {walk.service_type}
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(walk.status)} text-xs px-2 py-1 ml-2 flex-shrink-0`}>
                        {getStatusText(walk.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Próxima Semana */}
            <Collapsible open={nextWeekOpen} onOpenChange={setNextWeekOpen}>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Próxima Semana</span>
                    <Badge variant="secondary" className="ml-2">
                      {weekGroups.nextWeek.length}
                    </Badge>
                  </div>
                  {nextWeekOpen ? (
                    <ChevronUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-green-600" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="space-y-2">
                  {weekGroups.nextWeek.map((walk) => (
                    <div key={walk.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {walk.clients.profiles?.name || "Cliente"} • {walk.clients.pet_name}
                          </h4>
                          {isNewClient(walk.clients.created_at) && (
                            <Badge variant="outline" className="text-xs flex items-center gap-1 text-orange-600 border-orange-200">
                              <Star className="h-3 w-3" />
                              Novo
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{format(new Date(walk.scheduled_at), "EEEE, dd/MM - HH:mm", { locale: ptBR })}</span>
                          </div>
                          {walk.clients.address && (
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="truncate">{walk.clients.address}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                          {walk.service_type}
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(walk.status)} text-xs px-2 py-1 ml-2 flex-shrink-0`}>
                        {getStatusText(walk.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

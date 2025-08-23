import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useRecentBookings } from "./recent-bookings/useRecentBookings";
import { BookingsList } from "./recent-bookings/BookingsList";
import { useState } from "react";
import { ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { startOfWeek, endOfWeek, addWeeks, isWithinInterval } from "date-fns";
interface WeekGroup {
  currentWeek: any[];
  nextWeek: any[];
}
export const RecentBookings = () => {
  const {
    bookings,
    loading
  } = useRecentBookings();
  const [currentWeekOpen, setCurrentWeekOpen] = useState(false);
  const [previousWeekOpen, setPreviousWeekOpen] = useState(false);

  // Agrupar transações por semana
  const groupBookingsByWeek = (): WeekGroup => {
    const now = new Date();
    const currentWeekStart = startOfWeek(now, {
      weekStartsOn: 1
    });
    const currentWeekEnd = endOfWeek(now, {
      weekStartsOn: 1
    });
    const previousWeekStart = addWeeks(currentWeekStart, -1);
    const previousWeekEnd = addWeeks(currentWeekEnd, -1);
    const currentWeek: any[] = [];
    const previousWeek: any[] = [];
    bookings.forEach((booking: any) => {
      const bookingDate = new Date(booking.scheduled_at || booking.data_hora_inicio);
      if (isWithinInterval(bookingDate, {
        start: currentWeekStart,
        end: currentWeekEnd
      })) {
        currentWeek.push(booking);
      } else if (isWithinInterval(bookingDate, {
        start: previousWeekStart,
        end: previousWeekEnd
      })) {
        previousWeek.push(booking);
      }
    });
    return {
      currentWeek,
      nextWeek: previousWeek
    };
  };
  const weekGroups = groupBookingsByWeek();
  if (loading) {
    return <Card>
        <CardHeader>
          <CardTitle>Novos Agendamentos</CardTitle>
          <CardDescription>Carregando...</CardDescription>
        </CardHeader>
      </Card>;
  }
  return <Card>
      <CardHeader>
        <CardTitle>Novas Transações</CardTitle>
        <CardDescription>Suas transações dos últimos 14 dias</CardDescription>
      </CardHeader>
      <CardContent>
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
                {currentWeekOpen ? <ChevronUp className="h-4 w-4 text-blue-600" /> : <ChevronDown className="h-4 w-4 text-blue-600" />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              {weekGroups.currentWeek.length > 0 ? (
                <BookingsList bookings={weekGroups.currentWeek} />
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">Nenhuma transação nesta semana.</p>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Semana Anterior */}
          <Collapsible open={previousWeekOpen} onOpenChange={setPreviousWeekOpen}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-gray-800">Semana Anterior</span>
                  <Badge variant="secondary" className="ml-2">
                    {weekGroups.nextWeek.length}
                  </Badge>
                </div>
                {previousWeekOpen ? <ChevronUp className="h-4 w-4 text-gray-600" /> : <ChevronDown className="h-4 w-4 text-gray-600" />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              {weekGroups.nextWeek.length > 0 ? (
                <BookingsList bookings={weekGroups.nextWeek} />
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">Nenhuma transação na semana anterior.</p>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>;
};
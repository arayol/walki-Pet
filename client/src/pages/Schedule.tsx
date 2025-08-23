import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Plus, Clock, User, MapPin, Dog, Phone, AlertCircle, CheckCircle, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { WalkerLayout } from "@/components/layout/WalkerLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
// Removed supabase import - using REST APIs instead
import { useToast } from "@/hooks/use-toast";
import { format, startOfDay, endOfDay, addDays, startOfWeek, addWeeks, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ProtectedWalkForm } from "@/components/schedule/ProtectedWalkForm";
import { GoogleCalendarSync } from "@/components/calendar/GoogleCalendarSync";

interface Walk {
  id: string;
  scheduled_at: string;
  duration: number;
  service_type: string;
  status: string;
  price: number;
  notes?: string;
  clients: {
    pet_name: string;
    address?: string;
    client_name?: string;
    profiles: {
      name: string;
    };
  };
}

interface DayData {
  date: string;
  walks: Walk[];
}

interface WeekData {
  weekOf: string;
  days: DayData[];
}

const Schedule = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentWeek, setCurrentWeek] = useState(0);
  const [viewMode, setViewMode] = useState('day');
  const [selectedDay, setSelectedDay] = useState(0);
  const [collapsedDays, setCollapsedDays] = useState<{[key: number]: boolean}>({});
  const [weekData, setWeekData] = useState<WeekData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    if (user) {
      fetchWeeksData();
    }
  }, [user, currentWeek]);

  const getWeekDates = (weekOffset: number) => {
    const today = new Date();
    const weekStart = startOfWeek(addWeeks(today, weekOffset), { weekStartsOn: 1 });
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(weekStart, i));
    }
    return dates;
  };

  const fetchWeeksData = async () => {
    try {
      setLoading(true);
      const weekDates = getWeekDates(currentWeek);
      const startDate = startOfDay(weekDates[0]);
      const endDate = endOfDay(weekDates[6]);

      // Query para walks via API REST
      const walksResponse = await fetch(`/api/walkers/${user?.id}/walks?start=${startDate.toISOString()}&end=${endDate.toISOString()}`);
      
      let walksData = [];
      if (walksResponse.ok) {
        walksData = await walksResponse.json();
      } else {
        console.warn("Walks API not available, using empty data");
      }

      // Query para service_bookings via API REST (mock data for now)
      let serviceBookingsData: any[] = [];
      try {
        const serviceBookingsResponse = await fetch(`/api/walkers/${user?.id}/service-bookings?start=${startDate.toISOString()}&end=${endDate.toISOString()}`);
        if (serviceBookingsResponse.ok) {
          serviceBookingsData = await serviceBookingsResponse.json();
        }
      } catch (error) {
        console.warn("Service bookings API not available, using empty data");
      }

      // Processar dados por dia
      const daysData: DayData[] = weekDates.map((date, index) => {
        const dayWalks = (walksData || []).filter((walk: any) => 
          isWithinInterval(new Date(walk.scheduled_at), {
            start: startOfDay(date),
            end: endOfDay(date)
          })
        ).map((walk: any) => ({
          ...walk,
          clients: {
            ...walk.clients,
            profiles: walk.clients?.profiles || { name: walk.clients?.client_name || 'Cliente' }
          }
        }));

        // Filter service bookings for this specific date
        const dayServiceBookings = (serviceBookingsData || [])
          .filter((booking: any) => {
            const bookingDate = new Date(booking.data_agendamento || booking.scheduled_at);
            return bookingDate.toDateString() === date.toDateString();
          })
          .map((booking: any) => ({
            id: `sb_${booking.id}`,
            scheduled_at: booking.data_hora_inicio || booking.scheduled_at,
            duration: booking.data_hora_fim ? 
              Math.round((new Date(booking.data_hora_fim).getTime() - new Date(booking.data_hora_inicio).getTime()) / 60000) : 
              60,
            service_type: "Serviço Agendado",
            status: booking.status === 'confirmado' ? 'confirmed' : (booking.status || 'scheduled'),
            price: booking.price || 0,
            notes: booking.observacoes || booking.notes,
            clients: {
              pet_name: booking.clients?.pet_name || booking.pet_name || 'Pet',
              address: booking.clients?.address || booking.address,
              client_name: booking.clients?.client_name || booking.client_name || 'Cliente',
              profiles: booking.clients?.profiles || { name: booking.clients?.client_name || booking.client_name || 'Cliente' }
            }
          }));

        const allDayWalks = [...dayWalks, ...dayServiceBookings];
        allDayWalks.sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());

        return {
          date: format(date, "EEEE, dd MMM", { locale: ptBR }),
          walks: allDayWalks
        };
      });

      const weekOfString = `${format(weekDates[0], "dd MMM", { locale: ptBR })} - ${format(weekDates[6], "dd MMM yyyy", { locale: ptBR })}`;

      setWeekData({
        weekOf: weekOfString,
        days: daysData
      });

      // Definir o primeiro dia como selecionado se ainda não houver seleção
      if (selectedDay >= daysData.length) {
        setSelectedDay(0);
      }

    } catch (error) {
      console.error("Error fetching weeks data:", error);
      toast({
        title: "Aviso",
        description: "Alguns dados podem não estar disponíveis. Funcionalidade em desenvolvimento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "in_progress":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  const toggleDayCollapse = (dayIndex: number) => {
    setCollapsedDays(prev => ({
      ...prev,
      [dayIndex]: !prev[dayIndex]
    }));
  };

  const WeekView = () => {
    if (!weekData) return null;
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {weekData.days.map((day, dayIndex) => (
          <div key={dayIndex} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <Collapsible 
              open={!collapsedDays[dayIndex]} 
              onOpenChange={() => toggleDayCollapse(dayIndex)}
            >
              <CollapsibleTrigger className="w-full p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b hover:from-indigo-100 hover:to-purple-100 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h3 className="font-bold text-sm text-gray-800">{day.date.split(', ')[0]}</h3>
                    <p className="text-xs text-gray-600">{day.date.split(', ')[1]}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
                      {day.walks.length}
                    </span>
                    {collapsedDays[dayIndex] ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="p-2 space-y-2 max-h-64 overflow-y-auto">
                {day.walks.map((walk, walkIndex) => (
                  <div key={walkIndex} className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-2 border border-blue-100 hover:from-blue-100 hover:to-cyan-100 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-blue-800">
                        {format(new Date(walk.scheduled_at), "HH:mm")}
                      </span>
                      <span className="text-xs text-gray-600">{walk.duration}min</span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-xs text-gray-800 truncate">
                        {walk.clients.profiles?.name || walk.clients.client_name}
                      </p>
                      <div className="flex items-center gap-1">
                        <Dog className="w-3 h-3 text-gray-500 flex-shrink-0" />
                        <span className="text-xs text-gray-600 truncate">{walk.clients.pet_name}</span>
                      </div>
                      {walk.clients.address && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-500 flex-shrink-0" />
                          <span className="text-xs text-gray-600 truncate">{walk.clients.address}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center mt-1">
                        <span className={`px-1.5 py-0.5 rounded text-xs border ${getStatusColor(walk.status)}`}>
                          {walk.status === 'confirmed' ? 'OK' : walk.status === 'scheduled' ? 'Agend.' : 'Pend.'}
                        </span>
                        {walk.price > 0 ? (
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        ))}
      </div>
    );
  };

  const DayView = () => {
    if (!weekData || !weekData.days[selectedDay]) return null;
    
    const day = weekData.days[selectedDay];
    return (
      <div className="space-y-3">
        {day.walks.map((walk, walkIndex) => (
          <div key={walkIndex} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-lg">
                    <Clock className="w-4 h-4 inline mr-1" />
                    <span className="font-bold text-sm">
                      {format(new Date(walk.scheduled_at), "HH:mm")}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">{walk.duration}min</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-lg text-xs border font-medium ${getStatusColor(walk.status)}`}>
                    {getStatusText(walk.status)}
                  </span>
                  {walk.price > 0 ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">
                    {walk.clients.profiles?.name || walk.clients.client_name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{walk.service_type}</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Dog className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Cachorro:</span>
                  </div>
                  <p className="text-sm text-gray-600">{walk.clients.pet_name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                {walk.clients.address && (
                  <>
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{walk.clients.address}</span>
                  </>
                )}
                <span className="ml-auto text-sm font-medium text-gray-700">
                  Valor: <span className={walk.price > 0 ? 'text-emerald-600' : 'text-amber-600'}>
                    {walk.price > 0 ? `R$ ${walk.price.toFixed(2)}` : 'A definir'}
                  </span>
                </span>
              </div>

              {walk.notes && (
                <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                  <span className="text-xs font-medium text-gray-700">Observações:</span>
                  <p className="text-xs text-gray-600 mt-1">{walk.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="walker">
        <WalkerLayout>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-3 sm:p-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          </div>
        </WalkerLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="walker">
      <WalkerLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-3 sm:p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Agenda Dog Walker
          </h1>
              <p className="text-gray-600 text-sm sm:text-base">Gerencie seus passeios de forma elegante</p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold text-gray-700 text-sm sm:text-base">
                      {weekData?.weekOf || 'Carregando...'}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setCurrentWeek(currentWeek - 1)}
                      className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all text-sm font-medium"
                    >
                      ← Anterior
                    </button>
                    <button 
                      onClick={() => setCurrentWeek(currentWeek + 1)}
                      className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all text-sm font-medium"
                    >
                      Próxima →
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* View Mode Tabs */}
                  <div className="flex bg-gray-100 rounded-xl p-1">
                     <button 
                       onClick={() => setViewMode('day')}
                       className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                         viewMode === 'day' 
                           ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md transform scale-105' 
                           : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                       }`}
                     >
                       Diário
                     </button>
                     <button 
                       onClick={() => setViewMode('week')}
                       className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                         viewMode === 'week' 
                           ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md transform scale-105' 
                           : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                       }`}
                     >
                       Semanal
                     </button>
                  </div>

                  {/* Add Button */}
                  <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo
                  </Button>
                </div>
              </div>

              {viewMode === 'day' && weekData && (
                <div className="mt-4 flex gap-2 flex-wrap">
                  {weekData.days.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDay(index)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                        selectedDay === index
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-500 shadow-lg transform scale-105'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                      }`}
                    >
                      {day.date.split(', ')[0]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="mb-6">
              {viewMode === 'week' ? <WeekView /> : <DayView />}
            </div>

            {/* Footer com legenda compacta */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-100 border border-emerald-200 rounded-full"></div>
                  <span className="text-gray-600">Confirmado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded-full"></div>
                  <span className="text-gray-600">Agendado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-100 border border-amber-200 rounded-full"></div>
                  <span className="text-gray-600">Em andamento</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-gray-600">Com valor</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-gray-600">A definir</span>
                </div>
              </div>
            </div>

            {/* Google Calendar Sync Card */}
            <div className="mt-6">
              <GoogleCalendarSync onSyncComplete={fetchWeeksData} />
            </div>
          </div>

          {/* Protected Walk Form Modal */}
          {showForm && (
            <ProtectedWalkForm
              selectedDate={selectedDate}
              onClose={() => setShowForm(false)}
              onSave={() => {
                setShowForm(false);
                fetchWeeksData();
              }}
            />
          )}
        </div>
      </WalkerLayout>
    </ProtectedRoute>
  );
};

export default Schedule;
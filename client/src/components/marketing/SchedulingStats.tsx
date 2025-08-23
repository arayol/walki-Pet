import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
// Removed supabase import - using mock data instead
import { useAuth } from "@/hooks/useAuth";

export const SchedulingStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    fillRate: 0,
    popularTimes: [],
    popularDays: [],
    confirmations: 0,
    cancellations: 0,
    recurringVsSingle: { recurring: 0, single: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;
      
      try {
        // Use mock data instead of supabase
        const mockStats = {
          fillRate: 68,
          popularTimes: [
            { time: '9:00', count: 12 },
            { time: '15:00', count: 8 },
            { time: '17:00', count: 6 }
          ],
          popularDays: [
            { day: 'Sábado', count: 15 },
            { day: 'Domingo', count: 12 },
            { day: 'Quinta', count: 8 }
          ],
          confirmations: 42,
          cancellations: 3,
          recurringVsSingle: {
            recurring: 25,
            single: 17
          }
        };

        setStats(mockStats);
        console.log('📊 Scheduling stats loaded:', mockStats);
      } catch (error) {
        console.error('Erro ao buscar estatísticas de agendamento:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  const statCards = [
    {
      title: "Taxa de Preenchimento",
      value: `${stats.fillRate}%`,
      subtitle: "Da agenda total",
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "Confirmações",
      value: stats.confirmations.toString(),
      subtitle: `${stats.cancellations} cancelamentos`,
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Agendamentos Recorrentes",
      value: stats.recurringVsSingle.recurring.toString(),
      subtitle: `${stats.recurringVsSingle.single} únicos`,
      icon: Clock,
      color: "text-purple-600"
    },
    {
      title: "Taxa de Cancelamento",
      value: `${Math.round((stats.cancellations / Math.max(stats.confirmations + stats.cancellations, 1)) * 100)}%`,
      subtitle: "Do total de agendamentos",
      icon: XCircle,
      color: "text-red-600"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Estatísticas de Agendamento</h3>
        <p className="text-muted-foreground">Analise o comportamento da sua agenda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.popularTimes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Horários Mais Procurados</CardTitle>
              <CardDescription>Horários com mais agendamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.popularTimes.map((time, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{time.time}</span>
                    <span className="text-sm text-muted-foreground">{time.count} agendamentos</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {stats.popularDays.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Dias Mais Movimentados</CardTitle>
              <CardDescription>Dias da semana com mais agendamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.popularDays.map((day, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{day.day}</span>
                    <span className="text-sm text-muted-foreground">{day.count} agendamentos</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, TrendingUp, Users, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
// Removed supabase import - using mock data instead
import { useAuth } from "@/hooks/useAuth";

export const PerformanceStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    profileViews: { thisMonth: 0, total: 0 },
    conversionRate: 0,
    publicBookings: 0,
    totalActiveClients: 0,
    newClientsThisMonth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;
      
      try {
        // Use mock data instead of supabase
        const mockStats = {
          profileViews: { thisMonth: 45, total: 120 },
          conversionRate: 15,
          publicBookings: 8,
          totalActiveClients: 12,
          newClientsThisMonth: 3
        };

        setStats(mockStats);
        console.log('📊 Performance stats loaded:', mockStats);
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  const statCards = [
    {
      title: "Visualizações do Perfil",
      value: stats.profileViews.total.toString(),
      subtitle: `${stats.profileViews.thisMonth} este mês`,
      icon: Eye,
      color: "text-blue-600"
    },
    {
      title: "Taxa de Conversão",
      value: `${stats.conversionRate}%`,
      subtitle: "Visitantes → Agendamentos",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Total de Clientes",
      value: stats.totalActiveClients.toString(),
      subtitle: "Clientes ativos",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Novos Clientes",
      value: stats.newClientsThisMonth.toString(),
      subtitle: "Este mês",
      icon: UserPlus,
      color: "text-orange-600"
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
        <h3 className="text-lg font-semibold mb-2">Estatísticas de Performance</h3>
        <p className="text-muted-foreground">Acompanhe o desempenho do seu perfil público</p>
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
    </div>
  );
};
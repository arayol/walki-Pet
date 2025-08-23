import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Star, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
// Removed supabase import - using mock data instead
import { useAuth } from "@/hooks/useAuth";

export const ServiceStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalWalks: 0,
    walksThisMonth: 0,
    walksThisWeek: 0,
    averageDuration: 0,
    popularServices: [],
    occupancyRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;
      
      try {
        // Use mock data instead of supabase
        const mockStats = {
          totalWalks: 85,
          walksThisMonth: 22,
          walksThisWeek: 6,
          averageDuration: 45,
          popularServices: [
            { service: 'Caminhada Básica', count: 15 },
            { service: 'Passeio + Brincadeira', count: 8 },
            { service: 'Cuidados Especiais', count: 5 }
          ],
          occupancyRate: 75
        };

        setStats(mockStats);
        console.log('📊 Service stats loaded:', mockStats);
      } catch (error) {
        console.error('Erro ao buscar estatísticas de serviços:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  const statCards = [
    {
      title: "Total de Passeios",
      value: stats.totalWalks.toString(),
      subtitle: "Passeios realizados",
      icon: MapPin,
      color: "text-blue-600"
    },
    {
      title: "Este Mês",
      value: stats.walksThisMonth.toString(),
      subtitle: `${stats.walksThisWeek} esta semana`,
      icon: Calendar,
      color: "text-green-600"
    },
    {
      title: "Duração Média",
      value: `${stats.averageDuration}min`,
      subtitle: "Por passeio",
      icon: Clock,
      color: "text-purple-600"
    },
    {
      title: "Taxa de Ocupação",
      value: `${stats.occupancyRate}%`,
      subtitle: "Horários preenchidos",
      icon: Star,
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
        <h3 className="text-lg font-semibold mb-2">Estatísticas de Serviços</h3>
        <p className="text-muted-foreground">Acompanhe o desempenho dos seus serviços</p>
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

      {stats.popularServices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Serviços Mais Populares</CardTitle>
            <CardDescription>Tipos de serviço mais solicitados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.popularServices.map((service, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{service.service}</span>
                  <span className="text-sm text-muted-foreground">{service.count} passeios</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
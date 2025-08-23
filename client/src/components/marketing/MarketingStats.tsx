import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Share, Users, MousePointer, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
// Removed supabase import - using mock data instead
import { useAuth } from "@/hooks/useAuth";

export const MarketingStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    clientOrigins: [],
    profileShares: 0,
    linkClicks: 0,
    referralClients: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;
      
      try {
        // Use mock data instead of supabase
        const mockStats = {
          clientOrigins: [
            { source: 'Perfil Público', count: 12 },
            { source: 'Agendamento Direto', count: 8 },
            { source: 'Indicação/Outros', count: 5 }
          ],
          profileShares: 3,
          linkClicks: 25,
          referralClients: 5
        };

        setStats(mockStats);
        console.log('📊 Marketing stats loaded:', mockStats);
      } catch (error) {
        console.error('Erro ao buscar estatísticas de marketing:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  const statCards = [
    {
      title: "Compartilhamentos",
      value: stats.profileShares.toString(),
      subtitle: "Do perfil público",
      icon: Share,
      color: "text-blue-600"
    },
    {
      title: "Cliques no Link",
      value: stats.linkClicks.toString(),
      subtitle: "Visitantes únicos",
      icon: MousePointer,
      color: "text-green-600"
    },
    {
      title: "Clientes por Indicação",
      value: stats.referralClients.toString(),
      subtitle: "Via recomendação",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Taxa de Crescimento",
      value: "0%",
      subtitle: "Novos clientes vs mês anterior",
      icon: TrendingUp,
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
        <h3 className="text-lg font-semibold mb-2">Estatísticas de Marketing</h3>
        <p className="text-muted-foreground">Analise a origem e engajamento dos seus clientes</p>
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

      {stats.clientOrigins.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Origem dos Clientes</CardTitle>
            <CardDescription>Como seus clientes te encontraram</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.clientOrigins.map((origin, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{origin.source}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{origin.count} clientes</span>
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-primary rounded-full" 
                        style={{ 
                          width: `${(origin.count / Math.max(...stats.clientOrigins.map(o => o.count), 1)) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Star, 
  RefreshCw,
  TrendingUp,
  Activity
} from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

export const AnalyticsOverview = () => {
  const { analytics, loading, refreshAnalytics } = useAnalytics();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  if (loading && !analytics) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum dado disponível
          </h3>
          <p className="text-gray-600 mb-4">
            Não há dados de analytics para exibir no momento.
          </p>
          <Button onClick={refreshAnalytics} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar Dados
          </Button>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      title: "Total de Clientes",
      value: analytics.total_clients,
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "Planos de Serviço",
      value: analytics.total_service_plans,
      icon: Calendar,
      color: "bg-green-500"
    },
    {
      title: "Regiões Atendidas",
      value: analytics.total_regions,
      icon: MapPin,
      color: "bg-purple-500"
    },
    {
      title: "Receita Total",
      value: formatCurrency(analytics.total_revenue),
      icon: DollarSign,
      color: "bg-yellow-500"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Relatórios</h2>
          <p className="text-gray-600">Visão geral da performance do seu negócio</p>
        </div>
        <Button onClick={refreshAnalytics} disabled={loading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 ${stat.color} rounded-full flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Business Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Performance Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Agendamentos Totais</span>
                <Badge variant="secondary">{analytics.total_bookings}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Horários Cadastrados</span>
                <Badge variant="secondary">{analytics.total_schedules}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avaliação Média</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                  <span className="text-sm font-medium">{analytics.rating?.toFixed(1) || '0.0'}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total de Avaliações</span>
                <Badge variant="outline">{analytics.total_reviews}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Nome do Walker</label>
                <p className="font-medium">{analytics.walker_name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Slug Público</label>
                <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {analytics.slug}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Membro desde</label>
                <p className="text-sm">
                  {new Date(analytics.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { WalkerLayout } from "@/components/layout/WalkerLayout";
import { StripeConnectCard } from "@/components/dashboard/StripeConnectCard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { TransactionHistory } from "@/components/financial/TransactionHistory";
import FinancialReports from "@/components/financial/FinancialReports";
import { DollarSign, TrendingUp, Calendar, CreditCard } from "lucide-react";
import { useFinancialStats } from "@/hooks/useFinancialStats";

const Financial = () => {
  const { stats } = useFinancialStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const statsData = [
    { 
      title: "Receita Mensal", 
      value: formatCurrency(stats.monthlyRevenue), 
      icon: DollarSign, 
      change: "+12%",
      loading: stats.loading
    },
    { 
      title: "Passeios Agendados", 
      value: stats.scheduledWalks.toString(), 
      icon: Calendar, 
      change: "+8%",
      loading: stats.loading
    },
    { 
      title: "Valor Médio", 
      value: formatCurrency(stats.averageValue), 
      icon: TrendingUp, 
      change: "+5%",
      loading: stats.loading
    },
    { 
      title: "Pendente", 
      value: formatCurrency(stats.pendingAmount), 
      icon: CreditCard, 
      change: "-2%",
      loading: stats.loading
    }
  ];

  return (
    <ProtectedRoute requiredRole="walker">
      <WalkerLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
            <p className="text-gray-600">Acompanhe suas receitas e pagamentos</p>
          </div>

          {/* Stripe Connect Card */}
          <StripeConnectCard />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      {stat.loading ? (
                        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mt-2" />
                      ) : (
                        <p className="text-2xl font-bold">{stat.value}</p>
                      )}
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <stat.icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Badge variant={stat.change.startsWith('+') ? 'default' : 'destructive'}>
                      {stat.change}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="transactions" className="space-y-6">
            <TabsList>
              <TabsTrigger value="transactions">Transações</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions">
              <TransactionHistory />
            </TabsContent>

            <TabsContent value="reports">
              <FinancialReports />
            </TabsContent>
          </Tabs>
        </div>
      </WalkerLayout>
    </ProtectedRoute>
  );
};

export default Financial;

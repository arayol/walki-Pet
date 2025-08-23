import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Lock, TrendingUp, CreditCard, BarChart3, PieChart, Receipt, DollarSign } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PeriodOption {
  value: string;
  label: string;
  startDate: Date;
  endDate: Date;
}

interface ReportData {
  revenue: number;
  transactions: number;
  avgValue: number;
  stripeFeesTotal: number;
  paymentMethods: { [key: string]: number };
  servicePlansRevenue: { [key: string]: number };
  cancellations: number;
  refunds: number;
  monthlyComparison: { month: string; revenue: number }[];
}

const FinancialReports = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("mes-atual");
  const [walkerPlan, setWalkerPlan] = useState<string>("free");
  const [reportData, setReportData] = useState<ReportData>({
    revenue: 0,
    transactions: 0,
    avgValue: 0,
    stripeFeesTotal: 0,
    paymentMethods: {},
    servicePlansRevenue: {},
    cancellations: 0,
    refunds: 0,
    monthlyComparison: []
  });
  const [loading, setLoading] = useState(true);

  const getPeriodOptions = (): PeriodOption[] => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return [
      {
        value: "30-dias",
        label: "30 dias",
        startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        endDate: now
      },
      {
        value: "mes-atual",
        label: "Mês atual",
        startDate: new Date(currentYear, currentMonth, 1),
        endDate: now
      },
      {
        value: "ano-atual",
        label: "Ano atual",
        startDate: new Date(currentYear, 0, 1),
        endDate: now
      },
      {
        value: "12-meses",
        label: "12 meses",
        startDate: new Date(currentYear - 1, currentMonth, 1),
        endDate: now
      },
      {
        value: "mes-anterior",
        label: "Mês anterior",
        startDate: new Date(currentYear, currentMonth - 1, 1),
        endDate: new Date(currentYear, currentMonth, 0)
      },
      {
        value: "ano-anterior",
        label: "Ano anterior",
        startDate: new Date(currentYear - 1, 0, 1),
        endDate: new Date(currentYear - 1, 11, 31)
      }
    ];
  };

  useEffect(() => {
    fetchWalkerPlan();
  }, [user]);

  useEffect(() => {
    if (walkerPlan === 'professional') {
      fetchReportData();
    }
  }, [selectedPeriod, walkerPlan]);

  const fetchWalkerPlan = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('walkers')
        .select('plan_type')
        .eq('walker_id', user.id)
        .single();

      if (error) throw error;
      setWalkerPlan(data?.plan_type || 'free');
    } catch (error) {
      console.error('Erro ao buscar plano do walker:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReportData = async () => {
    if (!user || walkerPlan !== 'professional') return;

    setLoading(true);
    try {
      const periodOption = getPeriodOptions().find(p => p.value === selectedPeriod);
      if (!periodOption) return;

      // Buscar dados de pagamentos
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('walker_id', user.id)
        .gte('created_at', periodOption.startDate.toISOString())
        .lte('created_at', periodOption.endDate.toISOString());

      if (paymentsError) throw paymentsError;

      // Buscar dados de planos de serviço
      const { data: servicePlans, error: plansError } = await supabase
        .from('service_plans')
        .select('id, name, price')
        .eq('walker_id', user.id);

      if (plansError) throw plansError;

      // Processar dados
      const paidPayments = payments?.filter(p => p.status === 'paid') || [];
      const cancelledPayments = payments?.filter(p => p.status === 'cancelled') || [];
      const refundedPayments = payments?.filter(p => p.status === 'refunded') || [];

      const revenue = paidPayments.reduce((sum, p) => sum + Number(p.amount), 0);
      const stripeFeesTotal = paidPayments.reduce((sum, p) => {
        // Calcular taxa do Stripe (aproximadamente 3.4% + R$ 0.60)
        const feePercentage = Number(p.amount) * 0.034;
        const fixedFee = 0.60;
        return sum + feePercentage + fixedFee;
      }, 0);

      // Agrupar por método de pagamento
      const paymentMethods: { [key: string]: number } = {};
      paidPayments.forEach(p => {
        const method = p.payment_method || 'Cartão';
        paymentMethods[method] = (paymentMethods[method] || 0) + Number(p.amount);
      });

      // Agrupar por plano de serviço
      const servicePlansRevenue: { [key: string]: number } = {};
      paidPayments.forEach(p => {
        if (p.metadata && typeof p.metadata === 'object' && 'service_plan_id' in p.metadata) {
          const planId = (p.metadata as any).service_plan_id;
          const plan = servicePlans?.find(sp => sp.id === planId);
          const planName = plan?.name || 'Plano não identificado';
          servicePlansRevenue[planName] = (servicePlansRevenue[planName] || 0) + Number(p.amount);
        }
      });

      setReportData({
        revenue,
        transactions: paidPayments.length,
        avgValue: paidPayments.length > 0 ? revenue / paidPayments.length : 0,
        stripeFeesTotal,
        paymentMethods,
        servicePlansRevenue,
        cancellations: cancelledPayments.length,
        refunds: refundedPayments.length,
        monthlyComparison: [] // Implementar se necessário
      });

    } catch (error) {
      console.error('Erro ao buscar dados dos relatórios:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados dos relatórios.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isProfessionalPlan = walkerPlan === 'professional';

  const ReportSection = ({ 
    id, 
    title, 
    icon: Icon, 
    children, 
    description 
  }: { 
    id: string; 
    title: string; 
    icon: any; 
    children: React.ReactNode;
    description: string;
  }) => {
    const isExpanded = expandedSections.includes(id);

    return (
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription className="text-sm">{description}</CardDescription>
              </div>
              {!isProfessionalPlan && (
                <Badge variant="secondary" className="ml-2">
                  <Lock className="h-3 w-3 mr-1" />
                  Pro
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection(id)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent className="pt-0">
            {isProfessionalPlan ? children : (
              <div className="text-center py-8">
                <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Este relatório está disponível apenas para o Plano Profissional
                </p>
                <Button variant="outline" className="mt-3" size="sm">
                  Fazer Upgrade
                </Button>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Seletor de Período */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Relatórios Financeiros
          </CardTitle>
          <CardDescription>
            Análise detalhada das suas receitas e performance financeira
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Período:</label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getPeriodOptions().map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Relatórios */}
      <div className="space-y-4">
        {/* 1. Faturamento por Período */}
        <ReportSection
          id="faturamento-periodo"
          title="Faturamento por Período"
          icon={TrendingUp}
          description="Análise detalhada da receita no período selecionado"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Receita Total</p>
              <p className="text-2xl font-bold text-green-600">
                {loading ? "Carregando..." : formatCurrency(reportData.revenue)}
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Transações</p>
              <p className="text-2xl font-bold">
                {loading ? "..." : reportData.transactions}
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Valor Médio</p>
              <p className="text-2xl font-bold">
                {loading ? "..." : formatCurrency(reportData.avgValue)}
              </p>
            </div>
          </div>
        </ReportSection>

        {/* 2. Receita por Tipo de Pagamento */}
        <ReportSection
          id="receita-pagamento"
          title="Receita por Tipo de Pagamento"
          icon={CreditCard}
          description="Distribuição da receita por método de pagamento"
        >
          <div className="space-y-3">
            {Object.entries(reportData.paymentMethods).map(([method, amount]) => (
              <div key={method} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">{method}</span>
                <span className="text-lg font-bold">{formatCurrency(amount)}</span>
              </div>
            ))}
            {Object.keys(reportData.paymentMethods).length === 0 && !loading && (
              <p className="text-muted-foreground text-center py-4">
                Nenhum dado encontrado para o período selecionado
              </p>
            )}
          </div>
        </ReportSection>

        {/* 3. Receita por Tipo de Plano de Serviço */}
        <ReportSection
          id="receita-planos"
          title="Receita por Tipo de Plano de Serviço"
          icon={PieChart}
          description="Performance financeira por plano de serviço oferecido"
        >
          <div className="space-y-3">
            {Object.entries(reportData.servicePlansRevenue).map(([planName, amount]) => (
              <div key={planName} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">{planName}</span>
                <span className="text-lg font-bold text-green-600">{formatCurrency(amount)}</span>
              </div>
            ))}
            {Object.keys(reportData.servicePlansRevenue).length === 0 && !loading && (
              <p className="text-muted-foreground text-center py-4">
                Nenhum dado encontrado para o período selecionado
              </p>
            )}
          </div>
        </ReportSection>

        {/* 4. Análise de Cancelamentos e Reembolsos */}
        <ReportSection
          id="cancelamentos-reembolsos"
          title="Análise de Cancelamentos e Reembolsos"
          icon={Receipt}
          description="Monitoramento de cancelamentos e valores reembolsados"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-700">Cancelamentos</p>
              <p className="text-2xl font-bold text-red-600">
                {loading ? "..." : reportData.cancellations}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-orange-700">Reembolsos</p>
              <p className="text-2xl font-bold text-orange-600">
                {loading ? "..." : reportData.refunds}
              </p>
            </div>
          </div>
        </ReportSection>

        {/* 5. Taxas do Stripe */}
        <ReportSection
          id="taxas-stripe"
          title="Taxas do Stripe e Processadores"
          icon={DollarSign}
          description="Custos com processamento de pagamentos"
        >
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total de Taxas (Stripe)</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Calculado com base em 3,4% + R$ 0,60 por transação
                </p>
              </div>
              <p className="text-2xl font-bold text-red-600">
                {loading ? "..." : formatCurrency(reportData.stripeFeesTotal)}
              </p>
            </div>
          </div>
        </ReportSection>

        {/* 6. Comparativo de Performance Mensal */}
        <ReportSection
          id="performance-mensal"
          title="Comparativo de Performance Mensal"
          icon={BarChart3}
          description="Evolução mensal da receita e performance"
        >
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Gráfico comparativo em desenvolvimento...
            </p>
          </div>
        </ReportSection>
      </div>
    </div>
  );
};

export default FinancialReports;

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Calendar, Filter, Download, Bell, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TransactionCard } from "./TransactionCard";
import { PaymentNotificationModal } from "./PaymentNotificationModal";
import { useAuth } from "@/hooks/useAuth";

interface Transaction {
  id: string;
  amount: number;
  status: string;
  stripe_payment_id: string | null;
  paid_at: string | null;
  created_at: string;
  payment_method: string | null;
  service_plan_name: string;
  scheduled_by: string;
  payment_method_label: string;
  clients: {
    client_name: string;
    pet_name: string;
    client_id: string;
  };
}

export const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [walkerPlan, setWalkerPlan] = useState<string>("free");
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchTransactions();
    fetchWalkerPlan();
  }, [user]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, statusFilter, searchTerm]);

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Buscar transações dos últimos 2 meses
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

      // Buscar apenas pagamentos com informações completas
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          *,
          clients (
            client_name,
            pet_name,
            client_id
          )
        `)
        .eq('walker_id', user.id)
        .gte('created_at', twoMonthsAgo.toISOString())
        .order('created_at', { ascending: false });

      if (paymentsError) throw paymentsError;

      // Processar pagamentos com informações completas
      const payments = (paymentsData || []).map(payment => {
        const metadata = payment.metadata as any || {};
        const scheduledBy = metadata.scheduled_by === 'dogwalker' ? 'DogWalker' : 'Cliente';
        const paymentMethodLabel = getPaymentMethodLabel(payment.payment_method, payment.stripe_payment_id);
        
        return {
          id: payment.id,
          amount: Number(payment.amount),
          status: payment.status,
          stripe_payment_id: payment.stripe_payment_id,
          paid_at: payment.paid_at,
          created_at: payment.created_at,
          payment_method: payment.payment_method,
          clients: payment.clients,
          service_plan_name: metadata.service_plan_name || 'Serviço',
          scheduled_by: scheduledBy,
          payment_method_label: paymentMethodLabel,
        };
      });

      setTransactions(payments);
    } catch (error: any) {
      console.error('Erro ao buscar transações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o histórico de transações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  const getPaymentMethodLabel = (method: string | null, stripePaymentId: string | null) => {
    if (stripePaymentId) return 'Stripe';
    if (method === 'cartao') return 'Cartão';
    if (method === 'pix') return 'PIX';
    if (method === 'dinheiro') return 'Dinheiro';
    return 'Manual';
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    // Filtro por busca (nome do cliente ou pet)
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.clients?.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.clients?.pet_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  };

  const handleNotifyClient = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowNotificationModal(true);
  };

  const handleMarkAsPaid = async (transaction: Transaction) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: 'paid',
          paid_at: new Date().toISOString(),
          payment_method: 'manual'
        })
        .eq('id', transaction.id);

      if (error) throw error;

      // Atualizar a lista local
      await fetchTransactions();
      
      toast({
        title: "Sucesso",
        description: "Pagamento marcado como pago!",
      });
    } catch (error: any) {
      console.error('Erro ao marcar como pago:', error);
      toast({
        title: "Erro",
        description: "Não foi possível marcar o pagamento como pago.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteDialog(true);
  };

  const confirmDeleteTransaction = async () => {
    if (!transactionToDelete) return;

    try {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', transactionToDelete.id);

      if (error) throw error;

      // Atualizar a lista local
      await fetchTransactions();
      
      toast({
        title: "Sucesso",
        description: "Transação deletada com sucesso!",
      });
    } catch (error: any) {
      console.error('Erro ao deletar transação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível deletar a transação.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setTransactionToDelete(null);
    }
  };

  const exportToExcel = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('export-transactions', {
        body: {
          transactions: filteredTransactions,
          period: '2_months'
        }
      });

      if (error) throw error;

      // Criar e baixar o arquivo
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transacoes_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Sucesso",
        description: "Relatório exportado com sucesso!",
      });
    } catch (error: any) {
      console.error('Erro ao exportar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível exportar o relatório.",
        variant: "destructive",
      });
    }
  };

  const handleExportToExcel = () => {
    if (walkerPlan !== 'professional') {
      toast({
        title: "Recurso Premium",
        description: "A exportação para Excel está disponível apenas no Plano Profissional.",
        variant: "destructive",
      });
      return;
    }
    exportToExcel();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500 text-white">Pago</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-orange-400 text-orange-600">Pendente</Badge>;
      case 'failed':
        return <Badge variant="destructive">Falhou</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const pendingCount = transactions.filter(t => t.status === 'pending').length;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Histórico de Transações
                {pendingCount > 0 && (
                  <Badge variant="outline" className="border-orange-400 text-orange-600">
                    {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Últimos 2 meses • {filteredTransactions.length} transação{filteredTransactions.length !== 1 ? 'ões' : ''}
              </p>
            </div>
            <Button 
              onClick={handleExportToExcel}
              className="bg-green-600 hover:bg-green-700"
              disabled={filteredTransactions.length === 0}
              variant={walkerPlan !== 'professional' ? 'outline' : 'default'}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar Excel
              {walkerPlan !== 'professional' && (
                <span className="ml-1 text-xs">(Pro)</span>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por cliente ou pet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="paid">Pagos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="failed">Falharam</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lista de Transações */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {transactions.length === 0 
                  ? "Nenhuma transação encontrada nos últimos 2 meses."
                  : "Nenhuma transação corresponde aos filtros aplicados."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onNotifyClient={handleNotifyClient}
                  onMarkAsPaid={handleMarkAsPaid}
                  onDelete={handleDeleteTransaction}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Notificação */}
      <PaymentNotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        transaction={selectedTransaction}
        onSuccess={() => {
          setShowNotificationModal(false);
          toast({
            title: "Notificação Enviada",
            description: "Lembrete de pagamento enviado via WhatsApp!",
          });
        }}
      />

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar esta transação? Esta ação não pode ser desfeita.
              <br />
              <br />
              <strong>Cliente:</strong> {transactionToDelete?.clients?.client_name}
              <br />
              <strong>Valor:</strong> {transactionToDelete ? new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(transactionToDelete.amount) : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTransaction} className="bg-red-600 hover:bg-red-700">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

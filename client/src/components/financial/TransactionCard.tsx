
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, CreditCard, Check, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

interface TransactionCardProps {
  transaction: Transaction;
  onNotifyClient: (transaction: Transaction) => void;
  onMarkAsPaid?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

export const TransactionCard = ({ transaction, onNotifyClient, onMarkAsPaid, onDelete }: TransactionCardProps) => {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
          <CreditCard className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">
            {transaction.clients?.client_name || 'Cliente não identificado'}
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-1">
            <div>
              <span className="font-medium">Pet:</span> {transaction.clients?.pet_name || 'Pet'}
            </div>
            <div>
              <span className="font-medium">Agendado:</span> {transaction.scheduled_by}
            </div>
            <div>
              <span className="font-medium">Pagamento:</span> {transaction.payment_method_label}
            </div>
            <div>
              <span className="font-medium">Plano:</span> {transaction.service_plan_name}
            </div>
          </div>
          <div className="flex items-center text-xs text-gray-500 mt-2">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(transaction.created_at)}
            {transaction.paid_at && transaction.status === 'paid' && (
              <span className="ml-2">
                • Pago em {formatDate(transaction.paid_at)}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="font-bold text-lg text-gray-900">
            {formatCurrency(transaction.amount)}
          </p>
          <div className="flex items-center justify-end space-x-2">
            {getStatusBadge(transaction.status)}
            {transaction.status === 'pending' && (
              <div className="flex space-x-2">
                {/* Botão Notificar para todos os pagamentos pendentes */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onNotifyClient(transaction)}
                  className="text-orange-600 border-orange-200 hover:bg-orange-50"
                >
                  <Bell className="h-3 w-3 mr-1" />
                  Notificar
                </Button>
                {/* Botão Marcar como Pago para agendamentos manuais */}
                {!transaction.stripe_payment_id && onMarkAsPaid && (
                  <Button
                    size="sm"
                    onClick={() => onMarkAsPaid(transaction)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Pago
                  </Button>
                )}
              </div>
            )}
            {/* Botão Deletar sempre visível */}
            {onDelete && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(transaction)}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

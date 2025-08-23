
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";
import { formatDate, formatPrice, getStatusColor, getStatusText } from "../utils/formatters";

interface PaymentRecord {
  id: string;
  walker_id: string;
  client_id: string;
  amount: number;
  status: string;
  stripe_payment_id?: string;
  paid_at?: string;
  created_at: string;
}

interface PaymentsListProps {
  payments: PaymentRecord[];
}

export const PaymentsList = ({ payments }: PaymentsListProps) => {
  if (payments.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-6 w-6 mr-2" />
          Pagamentos Encontrados ({payments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(payment.status)}>
                    {getStatusText(payment.status)}
                  </Badge>
                  <span className="font-semibold">{formatPrice(payment.amount)}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(payment.created_at)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                <div>
                  <span className="font-medium">ID:</span>
                  <p className="font-mono text-xs">{payment.id}</p>
                </div>
                <div>
                  <span className="font-medium">Stripe ID:</span>
                  <p className="font-mono text-xs">{payment.stripe_payment_id || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium">Pago em:</span>
                  <p>{payment.paid_at ? formatDate(payment.paid_at) : 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium">Walker ID:</span>
                  <p className="font-mono text-xs">{payment.walker_id}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

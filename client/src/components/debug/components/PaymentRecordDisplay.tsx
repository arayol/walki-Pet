
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { PaymentRecord } from "../types/stripe-verification";

interface PaymentRecordDisplayProps {
  paymentRecord: PaymentRecord;
  formatCurrency: (amount: number) => string;
  formatDateTime: (dateString: string) => string;
}

export const PaymentRecordDisplay = ({ 
  paymentRecord, 
  formatCurrency, 
  formatDateTime 
}: PaymentRecordDisplayProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>💳 Registro de Pagamento Encontrado</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>ID:</strong> {paymentRecord.id}</p>
              <p><strong>Valor:</strong> {formatCurrency(Number(paymentRecord.amount))}</p>
              <p><strong>Status:</strong> <Badge variant="default">{paymentRecord.status}</Badge></p>
            </div>
            <div>
              <p><strong>Stripe ID:</strong> {paymentRecord.stripe_payment_id}</p>
              <p><strong>Pago em:</strong> {paymentRecord.paid_at ? formatDateTime(paymentRecord.paid_at) : 'N/A'}</p>
              <p><strong>Criado em:</strong> {formatDateTime(paymentRecord.created_at)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

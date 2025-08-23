
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { SearchResult } from "../types/stripe-verification";

interface VerificationResultsProps {
  result: SearchResult;
  formatCurrency: (amount: number) => string;
}

export const VerificationResults = ({ result, formatCurrency }: VerificationResultsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Resultado da Verificação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            {result.databaseRecords.payments > 0 ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span>Pagamentos: {result.databaseRecords.payments}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {result.databaseRecords.walks > 0 ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span>Agendamentos: {result.databaseRecords.walks}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {result.databaseRecords.serviceBookings > 0 ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
            <span>Service Bookings: {result.databaseRecords.serviceBookings}</span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Dados do Stripe:</h4>
          <div className="text-sm space-y-1">
            <p><strong>Session ID:</strong> {result.stripeData.sessionId}</p>
            <p><strong>Payment Intent:</strong> {result.stripeData.paymentIntentId}</p>
            <p><strong>Valor:</strong> {formatCurrency(result.stripeData.amount / 100)}</p>
            <p><strong>Email:</strong> {result.stripeData.clientEmail}</p>
            <p><strong>Status:</strong> <Badge variant="default">{result.stripeData.status}</Badge></p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

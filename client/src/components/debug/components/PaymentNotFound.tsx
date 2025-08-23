
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";

export const PaymentNotFound = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-red-600">
          <XCircle className="h-5 w-5" />
          <span>❌ Pagamento Não Registrado</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-red-700">
            O pagamento foi processado com sucesso no Stripe, mas não foi encontrado registro 
            correspondente na tabela 'payments' do banco de dados. Isso pode indicar que:
          </p>
          <ul className="list-disc list-inside mt-2 text-sm text-red-700 space-y-1">
            <li>O webhook do Stripe não foi executado</li>
            <li>Houve erro no processamento do webhook</li>
            <li>O ID do pagamento foi registrado de forma diferente</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

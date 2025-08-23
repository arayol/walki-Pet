
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-react";

interface StripeInputFormProps {
  stripeSessionId: string;
  paymentIntentId: string;
  loading: boolean;
  onSessionIdChange: (value: string) => void;
  onPaymentIntentChange: (value: string) => void;
  onVerify: () => void;
}

export const StripeInputForm = ({
  stripeSessionId,
  paymentIntentId,
  loading,
  onSessionIdChange,
  onPaymentIntentChange,
  onVerify
}: StripeInputFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>🔍 Verificação de Pagamento Stripe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Stripe Session ID</label>
          <Input
            value={stripeSessionId}
            onChange={(e) => onSessionIdChange(e.target.value)}
            placeholder="cs_test_..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Payment Intent ID</label>
          <Input
            value={paymentIntentId}
            onChange={(e) => onPaymentIntentChange(e.target.value)}
            placeholder="pi_..."
          />
        </div>

        <Button 
          onClick={onVerify}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            "Verificar e Processar Pagamento"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

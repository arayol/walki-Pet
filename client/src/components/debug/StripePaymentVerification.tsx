
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { StripeInputForm } from "./components/StripeInputForm";
import { WebhookLogs } from "./components/WebhookLogs";
import { VerificationResults } from "./components/VerificationResults";
import { PaymentRecordDisplay } from "./components/PaymentRecordDisplay";
import { WalkRecordsDisplay } from "./components/WalkRecordsDisplay";
import { PaymentNotFound } from "./components/PaymentNotFound";
import { processPaymentVerification, formatCurrency, formatDateTime } from "./utils/stripe-verification";
import { PaymentRecord, WalkRecord, SearchResult } from "./types/stripe-verification";

export const StripePaymentVerification = () => {
  const [stripeSessionId, setStripeSessionId] = useState("cs_test_a1zXP9bRu1s08ChBWTDelPjZj4MTHB9RVdsen1lNlXgMOpCCSkN5b4kymQ");
  const [paymentIntentId, setPaymentIntentId] = useState("pi_3RifNVQ5F3TEMoAK2dgnpVmZ");
  const [loading, setLoading] = useState(false);
  const [paymentRecord, setPaymentRecord] = useState<PaymentRecord | null>(null);
  const [walkRecords, setWalkRecords] = useState<WalkRecord[]>([]);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [webhookLogs, setWebhookLogs] = useState<string[]>([]);
  const { toast } = useToast();

  const verifyPaymentRegistration = async () => {
    setLoading(true);
    setWebhookLogs([]);
    
    try {
      const result = await processPaymentVerification(stripeSessionId, paymentIntentId);
      
      setPaymentRecord(result.paymentRecord);
      setWalkRecords(result.walkRecords);
      setSearchResult(result.searchResult);
      setWebhookLogs(result.webhookLogs);

      const hasPayment = result.searchResult.databaseRecords.payments > 0;
      const hasWalks = result.searchResult.databaseRecords.walks > 0;
      const paymentStatus = result.paymentRecord?.status;

      if (hasPayment && hasWalks && paymentStatus === 'paid') {
        toast({
          title: "✅ Pagamento Processado Completamente",
          description: `Pagamento confirmado e ${hasWalks} agendamento(s) criado(s) com sucesso!`,
        });
      } else if (hasPayment && paymentStatus === 'paid') {
        toast({
          title: "✅ Pagamento Confirmado",
          description: "Pagamento processado com sucesso! Agendamentos podem estar sendo criados...",
        });
      } else if (hasPayment && paymentStatus === 'pending') {
        toast({
          title: "⏳ Pagamento Pendente",
          description: "Pagamento ainda está sendo processado pelo Stripe.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "❌ Falha no Processamento",
          description: "Não foi possível processar o pagamento automaticamente.",
          variant: "destructive"
        });
      }

    } catch (error: any) {
      console.error('❌ Erro na verificação:', error);
      toast({
        title: "Erro na verificação",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <StripeInputForm
        stripeSessionId={stripeSessionId}
        paymentIntentId={paymentIntentId}
        loading={loading}
        onSessionIdChange={setStripeSessionId}
        onPaymentIntentChange={setPaymentIntentId}
        onVerify={verifyPaymentRegistration}
      />

      <WebhookLogs logs={webhookLogs} />

      {searchResult && (
        <VerificationResults 
          result={searchResult} 
          formatCurrency={formatCurrency}
        />
      )}

      {paymentRecord && (
        <PaymentRecordDisplay
          paymentRecord={paymentRecord}
          formatCurrency={formatCurrency}
          formatDateTime={formatDateTime}
        />
      )}

      {walkRecords.length > 0 && (
        <WalkRecordsDisplay
          walkRecords={walkRecords}
          formatCurrency={formatCurrency}
          formatDateTime={formatDateTime}
        />
      )}

      {!paymentRecord && searchResult && (
        <PaymentNotFound />
      )}
    </div>
  );
};

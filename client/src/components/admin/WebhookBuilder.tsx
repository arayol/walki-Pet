import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, Copy, Play, Settings, CreditCard, DollarSign, Loader2 } from "lucide-react";
import { ManualProcessPaymentsButton } from "@/components/debug/ManualProcessPaymentsButton";
import { ProcessPendingWalksButton } from "@/components/debug/ProcessPendingWalksButton";
import { ClearTestDataButton } from "@/components/debug/ClearTestDataButton";
import { supabase } from "@/integrations/supabase/client";

export const WebhookBuilder = () => {
  const [webhookUrl, setWebhookUrl] = useState("https://bfjknmnamitnwedglnmm.supabase.co/functions/v1/stripe-webhook");
  const [selectedEvents, setSelectedEvents] = useState([
    "account.updated",
    "checkout.session.completed", 
    "payment_intent.payment_failed",
    "payment_intent.succeeded"
  ]);
  const [testPayload, setTestPayload] = useState(`{
  "id": "evt_test_webhook",
  "object": "event",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_b37966e5cb40412c937",
      "payment_status": "paid",
      "status": "complete",
      "amount_total": 400,
      "currency": "brl",
      "customer_details": {
        "email": "cliente@teste.com",
        "name": "Cliente Teste"
      },
      "payment_method_types": ["card"],
      "payment_intent": "pi_test_intent_123",
      "metadata": {
        "client_id": "b37966e5-cb40-412c-9371-7309ea7e44d3",
        "walker_id": "your-walker-id-here",
        "service_id": "service-plan-id-here",
        "selected_slots": "[{\\"date\\": \\"2025-01-08\\", \\"time\\": \\"09:00\\"}]",
        "notes": "Teste de agendamento via webhook"
      }
    }
  }
}`);

  const [stripePaymentIntentPayload, setStripePaymentIntentPayload] = useState(`{
  "id": "evt_test_payment_intent",
  "object": "event", 
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_test_intent_123",
      "amount": 400,
      "currency": "brl",
      "status": "succeeded",
      "metadata": {
        "client_id": "b37966e5-cb40-412c-9371-7309ea7e44d3",
        "walker_id": "your-walker-id-here"
      }
    }
  }
}`);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  // Stripe Module Test States
  const [stripeTestAmount, setStripeTestAmount] = useState("2500"); // R$ 25,00 em centavos
  const [stripeTestWalkerId, setStripeTestWalkerId] = useState("");
  const [stripeTestClientId, setStripeTestClientId] = useState("");
  const [stripeTestLoading, setStripeTestLoading] = useState(false);
  const [stripeTestResults, setStripeTestResults] = useState<string>("");

  const availableEvents = [
    "account.updated",
    "checkout.session.completed",
    "checkout.session.expired", 
    "payment_intent.succeeded",
    "payment_intent.payment_failed",
    "payment_intent.requires_action",
    "payment_method.attached",
    "customer.created",
    "customer.updated",
    "invoice.payment_succeeded",
    "invoice.payment_failed"
  ];

  const copyWebhookUrl = async () => {
    await navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "URL copiada!",
      description: "URL do webhook copiada para o clipboard",
    });
  };

  const testWebhook = async () => {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: testPayload
      });

      if (response.ok) {
        toast({
          title: "✅ Webhook testado com sucesso!",
          description: "O webhook respondeu corretamente",
        });
      } else {
        toast({
          title: "❌ Erro no webhook",
          description: `Status: ${response.status}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Erro de conexão",
        description: "Não foi possível conectar ao webhook",
        variant: "destructive",
      });
    }
  };

  const toggleEvent = (event: string) => {
    setSelectedEvents(prev => 
      prev.includes(event) 
        ? prev.filter(e => e !== event)
        : [...prev, event]
    );
  };

  const testStripeDirectPayment = async () => {
    setStripeTestLoading(true);
    setStripeTestResults("");
    
    try {
      const { data, error } = await supabase.functions.invoke('create-direct-payment', {
        body: {
          amount: parseInt(stripeTestAmount),
          currency: 'brl',
          walker_id: stripeTestWalkerId || undefined,
          client_id: stripeTestClientId || undefined,
          description: 'Teste de pagamento direto via WebhookBuilder'
        }
      });

      if (error) {
        throw error;
      }

      setStripeTestResults(JSON.stringify(data, null, 2));
      toast({
        title: "✅ Pagamento direto criado!",
        description: "Verifique o resultado abaixo",
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
      setStripeTestResults(`Erro: ${errorMsg}`);
      toast({
        title: "❌ Erro no pagamento direto",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setStripeTestLoading(false);
    }
  };

  const testStripeMarketplacePayment = async () => {
    setStripeTestLoading(true);
    setStripeTestResults("");
    
    try {
      const { data, error } = await supabase.functions.invoke('create-marketplace-payment', {
        body: {
          amount: parseInt(stripeTestAmount),
          currency: 'brl',
          sellerId: stripeTestWalkerId,
          platform_fee_percent: 10,
          client_id: stripeTestClientId || undefined,
          description: 'Teste de pagamento marketplace via WebhookBuilder'
        }
      });

      if (error) {
        throw error;
      }

      setStripeTestResults(JSON.stringify(data, null, 2));
      toast({
        title: "✅ Pagamento marketplace criado!",
        description: "Verifique o resultado abaixo",
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
      setStripeTestResults(`Erro: ${errorMsg}`);
      toast({
        title: "❌ Erro no pagamento marketplace",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setStripeTestLoading(false);
    }
  };

  const checkConnectAccountStatus = async () => {
    setStripeTestLoading(true);
    setStripeTestResults("");
    
    try {
      const { data, error } = await supabase.functions.invoke('check-connect-account-status', {
        body: {
          accountId: 'acct_1RoAVjLtdysglHjE'
        }
      });

      if (error) {
        throw error;
      }

      setStripeTestResults(`📊 Status da Conta Connect:\n${JSON.stringify(data.account, null, 2)}`);
      toast({
        title: "✅ Status verificado!",
        description: "Verifique o resultado abaixo",
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
      setStripeTestResults(`Erro: ${errorMsg}`);
      toast({
        title: "❌ Erro ao verificar status",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setStripeTestLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Webhook Configuration Builder
          </CardTitle>
          <CardDescription>
            Configure e teste webhooks do Stripe interativamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Webhook URL */}
          <div className="space-y-2">
            <Label htmlFor="webhook-url">URL do Webhook</Label>
            <div className="flex gap-2">
              <Input
                id="webhook-url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-project.supabase.co/functions/v1/stripe-webhook"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyWebhookUrl}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Event Selection */}
          <div className="space-y-3">
            <Label>Eventos para Escutar</Label>
            <div className="grid grid-cols-2 gap-2">
              {availableEvents.map((event) => (
                <div
                  key={event}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedEvents.includes(event)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => toggleEvent(event)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{event}</span>
                    {selectedEvents.includes(event) && (
                      <Badge variant="secondary" className="ml-2">
                        ✓
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Configuration Summary */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Configuração Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <strong>URL:</strong> {webhookUrl}
                </div>
                <div>
                  <strong>Eventos ({selectedEvents.length}):</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedEvents.map((event) => (
                      <Badge key={event} variant="outline" className="text-xs">
                        {event}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Test Webhook */}
      <Card>
        <CardHeader>
          <CardTitle>Testar Webhook</CardTitle>
          <CardDescription>
            Envie um payload de teste para verificar se o webhook está funcionando
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test-payload">Payload de Teste (JSON)</Label>
            <Textarea
              id="test-payload"
              value={testPayload}
              onChange={(e) => setTestPayload(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Button 
              onClick={() => {
                setTestPayload(`{
  "id": "evt_test_checkout_completed",
  "object": "event",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_${Date.now()}",
      "payment_status": "paid",
      "status": "complete",
      "amount_total": 400,
      "currency": "brl",
      "customer_details": {
        "email": "cliente@teste.com",
        "name": "Cliente Teste"
      },
      "payment_method_types": ["card"],
      "payment_intent": "pi_test_${Date.now()}",
      "metadata": {
        "client_id": "b37966e5-cb40-412c-9371-7309ea7e44d3",
        "walker_id": "your-walker-id-here",
        "service_id": "service-plan-id-here",
        "selected_slots": "[{\\"date\\": \\"2025-01-08\\", \\"time\\": \\"09:00\\"}]",
        "notes": "Teste de agendamento"
      }
    }
  }
}`);
                testWebhook();
              }}
              className="flex-1"
            >
              🛒 Checkout Completo
            </Button>
            
            <Button 
              onClick={() => {
                setTestPayload(`{
  "id": "evt_test_payment_intent",
  "object": "event",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_test_${Date.now()}",
      "amount": 400,
      "currency": "brl",
      "status": "succeeded",
      "metadata": {
        "client_id": "b37966e5-cb40-412c-9371-7309ea7e44d3",
        "walker_id": "your-walker-id-here"
      }
    }
  }
}`);
                testWebhook();
              }}
              variant="outline"
              className="flex-1"
            >
              💳 Pagamento OK
            </Button>
            
            <Button 
              onClick={() => {
                setTestPayload(`{
  "id": "evt_test_account_updated",
  "object": "event",
  "type": "account.updated",
  "data": {
    "object": {
      "id": "acct_test_${Date.now()}",
      "details_submitted": true,
      "charges_enabled": true
    }
  }
}`);
                testWebhook();
              }}
              variant="outline"
              className="flex-1"
            >
              🏦 Conta Atualizada
            </Button>
          </div>
          
          <Button onClick={testWebhook} className="w-full" variant="secondary">
            <Play className="h-4 w-4 mr-2" />
            Testar Payload Personalizado
          </Button>

          <div className="flex gap-2 pt-4 border-t">
            <ManualProcessPaymentsButton />
            <ProcessPendingWalksButton />
            <ClearTestDataButton />
          </div>
        </CardContent>
      </Card>

      {/* Stripe Module Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Teste do Módulo Stripe
          </CardTitle>
          <CardDescription>
            Teste os pagamentos diretos e marketplace de forma amigável
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="test-amount">Valor (centavos)</Label>
              <Input
                id="test-amount"
                value={stripeTestAmount}
                onChange={(e) => setStripeTestAmount(e.target.value)}
                placeholder="2500"
                type="number"
              />
              <p className="text-xs text-muted-foreground">
                Ex: 2500 = R$ 25,00
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="test-walker-id">Walker ID (opcional)</Label>
              <Input
                id="test-walker-id"
                value={stripeTestWalkerId}
                onChange={(e) => setStripeTestWalkerId(e.target.value)}
                placeholder="UUID do walker"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="test-client-id">Client ID (opcional)</Label>
              <Input
                id="test-client-id"
                value={stripeTestClientId}
                onChange={(e) => setStripeTestClientId(e.target.value)}
                placeholder="UUID do cliente"
              />
            </div>
          </div>

          {/* Test Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={testStripeDirectPayment}
              disabled={stripeTestLoading}
              className="h-12"
            >
              {stripeTestLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <DollarSign className="h-4 w-4 mr-2" />
              )}
              Testar Pagamento Direto
            </Button>
            
            <Button 
              onClick={testStripeMarketplacePayment}
              disabled={stripeTestLoading || !stripeTestWalkerId}
              variant="outline"
              className="h-12"
            >
              {stripeTestLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4 mr-2" />
              )}
              Testar Pagamento Marketplace
            </Button>
            
            <Button 
              onClick={checkConnectAccountStatus}
              disabled={stripeTestLoading}
              variant="secondary"
              className="h-12"
            >
              {stripeTestLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Settings className="h-4 w-4 mr-2" />
              )}
              Verificar Status Connect
            </Button>
          </div>

          {!stripeTestWalkerId && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                ⚠️ Walker ID é obrigatório para testes de marketplace
              </p>
            </div>
          )}

          {/* Results */}
          {stripeTestResults && (
            <div className="space-y-2">
              <Label>Resultado do Teste</Label>
              <Textarea
                value={stripeTestResults}
                readOnly
                rows={10}
                className="font-mono text-sm bg-muted"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stripe Configuration Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instruções de Configuração no Stripe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">1. Acesse o Dashboard do Stripe</h4>
              <p className="text-sm text-muted-foreground">
                Vá para Developers → Webhooks → Add endpoint
              </p>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">2. Configure a URL</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Cole esta URL no campo "Endpoint URL":
              </p>
              <code className="bg-background p-2 rounded text-xs block">
                {webhookUrl}
              </code>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">3. Selecione os Eventos</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Selecione estes eventos no Stripe:
              </p>
              <div className="grid grid-cols-2 gap-1">
                {selectedEvents.map((event) => (
                  <code key={event} className="bg-background p-1 rounded text-xs">
                    {event}
                  </code>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
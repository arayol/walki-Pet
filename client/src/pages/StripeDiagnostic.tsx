import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const StripeDiagnostic = () => {
  const [sessionId, setSessionId] = useState("cs_test_a1TKutFi50o9PQ1jejnstESdKnzq2o3V66nrtV2Kucq9qdxA9VgfQZiEOH");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runDiagnostic = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('stripe-payment-diagnostic', {
        body: { sessionId }
      });

      if (error) throw error;
      setResult(data);
    } catch (error) {
      console.error('Diagnostic error:', error);
      setResult({
        success: false,
        error: error.message
      });
    }
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
      case 'complete':
      case 'succeeded':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'complete':
      case 'succeeded':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔍 Diagnóstico Stripe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="Session ID (cs_test_...)"
              className="flex-1"
            />
            <Button 
              onClick={runDiagnostic} 
              disabled={loading || !sessionId}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Executando...
                </>
              ) : (
                "Executar Diagnóstico"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>📋 Recomendações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {result.recommendations?.map((rec: string, index: number) => (
                  <Alert key={index} className="py-2">
                    <AlertDescription>{rec}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Session Info */}
          <Card>
            <CardHeader>
              <CardTitle>🔗 Informações da Sessão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium">Session ID:</span>
                  <p className="font-mono text-xs">{result.diagnostic.session_id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Status da Sessão:</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.diagnostic.session_status)}
                    <Badge className={getStatusColor(result.diagnostic.session_status)}>
                      {result.diagnostic.session_status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">Status do Pagamento:</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.diagnostic.payment_status)}
                    <Badge className={getStatusColor(result.diagnostic.payment_status)}>
                      {result.diagnostic.payment_status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">Valor Total:</span>
                  <p>R$ {(result.diagnostic.amount_total / 100).toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Email do Cliente:</span>
                  <p>{result.diagnostic.customer_email}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Criado em:</span>
                  <p>{new Date(result.diagnostic.created).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Intent Details */}
          {result.diagnostic.payment_intent_details && (
            <Card>
              <CardHeader>
                <CardTitle>⚡ Detalhes do Payment Intent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium">Status:</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.diagnostic.payment_intent_details.status)}
                      <Badge className={getStatusColor(result.diagnostic.payment_intent_details.status)}>
                        {result.diagnostic.payment_intent_details.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Valor Recebido:</span>
                    <p>R$ {(result.diagnostic.payment_intent_details.amount_received / 100).toFixed(2)}</p>
                  </div>
                </div>
                
                {result.diagnostic.payment_intent_details.charges.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Charges:</h4>
                    <div className="space-y-2">
                      {result.diagnostic.payment_intent_details.charges.map((charge: any, index: number) => (
                        <div key={index} className="border p-3 rounded">
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-sm">{charge.id}</span>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(charge.status)}
                              <Badge className={getStatusColor(charge.status)}>
                                {charge.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            Valor: R$ {(charge.amount / 100).toFixed(2)} | 
                            Pago: {charge.paid ? 'Sim' : 'Não'} | 
                            Capturado: {charge.captured ? 'Sim' : 'Não'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Related Events */}
          <Card>
            <CardHeader>
              <CardTitle>📨 Eventos Relacionados ({result.diagnostic.related_events.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {result.diagnostic.related_events.length === 0 ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Nenhum evento encontrado. Isso pode indicar que o webhook não foi enviado ou processado.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  {result.diagnostic.related_events.map((event: any, index: number) => (
                    <div key={index} className="border p-3 rounded">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{event.type}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            {new Date(event.created).toLocaleString()}
                          </span>
                        </div>
                        <Badge variant={event.livemode ? "default" : "secondary"}>
                          {event.livemode ? "Live" : "Test"}
                        </Badge>
                      </div>
                      <div className="text-sm font-mono text-gray-600">{event.id}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Supabase Payment Record */}
          <Card>
            <CardHeader>
              <CardTitle>💾 Registro de Pagamento no Supabase</CardTitle>
            </CardHeader>
            <CardContent>
              {result.diagnostic.supabase_payment_record ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium">ID:</span>
                      <p className="font-mono text-xs">{result.diagnostic.supabase_payment_record.id}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Status:</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.diagnostic.supabase_payment_record.status)}
                        <Badge className={getStatusColor(result.diagnostic.supabase_payment_record.status)}>
                          {result.diagnostic.supabase_payment_record.status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Valor:</span>
                      <p>R$ {result.diagnostic.supabase_payment_record.amount}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Tipo:</span>
                      <p>{result.diagnostic.supabase_payment_record.payment_type}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Cliente:</span>
                      <p className="font-mono text-xs">{result.diagnostic.supabase_payment_record.client_id}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Walker:</span>
                      <p className="font-mono text-xs">{result.diagnostic.supabase_payment_record.walker_id}</p>
                    </div>
                  </div>
                  
                  {result.diagnostic.supabase_payment_record.metadata && (
                    <div>
                      <span className="text-sm font-medium">Metadata:</span>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                        {JSON.stringify(result.diagnostic.supabase_payment_record.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <Alert>
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    Nenhum registro de pagamento encontrado no Supabase. O webhook pode não ter sido processado.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Walks Created */}
          <Card>
            <CardHeader>
              <CardTitle>🚶 Walks Criados ({result.diagnostic.supabase_walks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {result.diagnostic.supabase_walks.length === 0 ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Nenhum walk encontrado. Isso pode indicar que o processamento do webhook não criou os agendamentos.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  {result.diagnostic.supabase_walks.map((walk: any, index: number) => (
                    <div key={index} className="border p-3 rounded">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{walk.service_type}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            {new Date(walk.scheduled_at).toLocaleString()}
                          </span>
                        </div>
                        <Badge className={getStatusColor(walk.status)}>
                          {walk.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        Preço: R$ {walk.price} | Duração: {walk.duration}min
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StripeDiagnostic;
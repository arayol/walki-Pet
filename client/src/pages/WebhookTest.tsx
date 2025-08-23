import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WebhookTest = () => {
  const [sessionId, setSessionId] = useState("cs_test_a1TKutFi50o9PQ1jejnstESdKnzq2o3V66nrtV2Kucq9qdxA9VgfQZiEOH");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testWebhook = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://bfjknmnamitnwedglnmm.supabase.co/functions/v1/test-payment-processing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>🔧 Teste de Webhook</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            placeholder="Session ID"
          />
          <Button onClick={testWebhook} disabled={loading}>
            {loading ? "Testando..." : "Testar Processamento"}
          </Button>
          
          {result && (
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookTest;
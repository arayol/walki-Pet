
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WebhookLogsProps {
  logs: string[];
}

export const WebhookLogs = ({ logs }: WebhookLogsProps) => {
  if (logs.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔧 Log de Processamento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="font-mono text-sm space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="text-gray-700">
                {log}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { WalkRecord } from "../types/stripe-verification";

interface WalkRecordsDisplayProps {
  walkRecords: WalkRecord[];
  formatCurrency: (amount: number) => string;
  formatDateTime: (dateString: string) => string;
}

export const WalkRecordsDisplay = ({ 
  walkRecords, 
  formatCurrency, 
  formatDateTime 
}: WalkRecordsDisplayProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>🚶 Agendamentos Encontrados ({walkRecords.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {walkRecords.map((walk) => (
            <div key={walk.id} className="bg-blue-50 p-3 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <p><strong>Serviço:</strong> {walk.service_type}</p>
                  <p><strong>Data:</strong> {formatDateTime(walk.scheduled_at)}</p>
                </div>
                <div>
                  <p><strong>Preço:</strong> {formatCurrency(Number(walk.price))}</p>
                  <p><strong>Status:</strong> <Badge variant="secondary">{walk.status}</Badge></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

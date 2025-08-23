
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { formatDate, formatPrice, getStatusColor, getStatusText } from "../utils/formatters";

interface WalkRecord {
  id: string;
  walker_id: string;
  client_id: string;
  scheduled_at: string;
  service_type: string;
  price: number;
  status: string;
  notes?: string;
  created_at: string;
}

interface WalksListProps {
  walks: WalkRecord[];
}

export const WalksList = ({ walks }: WalksListProps) => {
  if (walks.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-6 w-6 mr-2" />
          Walks Encontrados ({walks.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {walks.map((walk) => (
            <div key={walk.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(walk.status)}>
                    {getStatusText(walk.status)}
                  </Badge>
                  <span className="font-semibold">{walk.service_type}</span>
                  <span className="font-semibold">{formatPrice(walk.price)}</span>
                </div>
                <span className="text-sm text-gray-500">
                  Agendado: {formatDate(walk.scheduled_at)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="font-medium">ID:</span>
                  <p className="font-mono text-xs">{walk.id}</p>
                </div>
                <div>
                  <span className="font-medium">Walker ID:</span>
                  <p className="font-mono text-xs">{walk.walker_id}</p>
                </div>
                <div>
                  <span className="font-medium">Criado em:</span>
                  <p>{formatDate(walk.created_at)}</p>
                </div>
              </div>
              
              {walk.notes && (
                <div className="mt-2">
                  <span className="font-medium">Observações:</span>
                  <p className="text-sm bg-gray-50 p-2 rounded mt-1">{walk.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

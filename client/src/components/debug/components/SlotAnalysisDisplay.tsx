
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, AlertCircle } from "lucide-react";

interface SlotAnalysis {
  total_schedules: number;
  total_capacity: number;
  booked_walks: number;
  booked_service_bookings: number;
  available_slots: number;
  utilization_rate: number;
  paid_bookings: number;
  pending_payments: number;
}

interface SlotAnalysisDisplayProps {
  slotAnalysis: SlotAnalysis;
}

export const SlotAnalysisDisplay = ({ slotAnalysis }: SlotAnalysisDisplayProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-6 w-6 mr-2" />
          Análise de Slots e Pagamentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{slotAnalysis.total_capacity}</div>
            <div className="text-sm text-blue-800">Capacidade Total</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{slotAnalysis.available_slots}</div>
            <div className="text-sm text-green-800">Slots Disponíveis</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{slotAnalysis.utilization_rate.toFixed(1)}%</div>
            <div className="text-sm text-orange-800">Taxa de Ocupação</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{slotAnalysis.paid_bookings}</div>
            <div className="text-sm text-purple-800">Pagamentos Confirmados</div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3">Detalhamento:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Horários Cadastrados:</span>
              <p>{slotAnalysis.total_schedules}</p>
            </div>
            <div>
              <span className="font-medium">Agendamentos (Walks):</span>
              <p>{slotAnalysis.booked_walks}</p>
            </div>
            <div>
              <span className="font-medium">Reservas (Service Bookings):</span>
              <p>{slotAnalysis.booked_service_bookings}</p>
            </div>
            <div>
              <span className="font-medium">Pagamentos Pendentes:</span>
              <p>{slotAnalysis.pending_payments}</p>
            </div>
          </div>
        </div>

        {slotAnalysis.pending_payments > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="font-medium text-yellow-800">
                Atenção: {slotAnalysis.pending_payments} pagamento(s) pendente(s)
              </span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              Verifique se os webhooks do Stripe estão funcionando corretamente.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

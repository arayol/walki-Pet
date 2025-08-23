
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { formatDate, getStatusColor, getStatusText } from "../utils/formatters";

interface ServiceBookingRecord {
  id: string;
  walker_id: string;
  client_id: string;
  service_schedule_id: string;
  data_agendamento: string;
  status: string;
  created_at: string;
}

interface ServiceBookingsListProps {
  serviceBookings: ServiceBookingRecord[];
}

export const ServiceBookingsList = ({ serviceBookings }: ServiceBookingsListProps) => {
  if (serviceBookings.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-6 w-6 mr-2" />
          Service Bookings Encontrados ({serviceBookings.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {serviceBookings.map((booking) => (
            <div key={booking.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(booking.status)}>
                    {getStatusText(booking.status)}
                  </Badge>
                </div>
                <span className="text-sm text-gray-500">
                  Data: {booking.data_agendamento}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="font-medium">ID:</span>
                  <p className="font-mono text-xs">{booking.id}</p>
                </div>
                <div>
                  <span className="font-medium">Schedule ID:</span>
                  <p className="font-mono text-xs">{booking.service_schedule_id}</p>
                </div>
                <div>
                  <span className="font-medium">Criado em:</span>
                  <p>{formatDate(booking.created_at)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

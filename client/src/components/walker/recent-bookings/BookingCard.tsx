
import { Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { Booking } from "./types";

interface BookingCardProps {
  booking: Booking;
}

export const BookingCard = ({ booking }: BookingCardProps) => {
  const getDateLabel = (date: string) => {
    const bookingDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (bookingDate.toDateString() === today.toDateString()) {
      return "Hoje";
    } else if (bookingDate.toDateString() === tomorrow.toDateString()) {
      return "Amanhã";
    } else {
      return format(bookingDate, "dd/MM", { locale: ptBR });
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-900">
            {booking.clients?.profiles?.name || "Cliente"}
          </h4>
          <BookingStatusBadge status={booking.status} />
        </div>
        <p className="text-sm text-gray-600 mb-1">
          {booking.clients?.pet_name || "Pet"}
        </p>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {getDateLabel(booking.scheduled_at)} • {format(new Date(booking.scheduled_at), "HH:mm")} ({booking.duration}min)
          </div>
          {booking.clients?.address && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {booking.clients.address}
            </div>
          )}
        </div>
        <div className="mt-2 text-sm font-medium text-green-600">
          R$ {booking.price.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

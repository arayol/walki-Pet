
import { Clock, MapPin, DollarSign, CreditCard, AlertCircle } from "lucide-react";
import { Booking } from "./types";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BookingsListProps {
  bookings: Booking[];
}

export const BookingsList = ({ bookings }: BookingsListProps) => {
  console.log("🔍 BookingsList: Renderizando", bookings.length, "agendamentos dos últimos 10 dias");

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum agendamento nos últimos 10 dias
        </h3>
        <p className="text-gray-600">
          Quando houver novos agendamentos, eles aparecerão aqui
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        console.log("🔍 Renderizando agendamento:", booking);
        
        // Determinar se é pagamento pendente
        const isPaymentPending = booking.payment_info?.includes("Pendente") || booking.status === "pending";
        const isPaymentPaid = booking.payment_info?.includes("Pago:");
        
        return (
          <div
            key={booking.id}
            className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors ${
              isPaymentPending 
                ? 'bg-yellow-50 border-yellow-200' 
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className={`font-semibold text-lg ${
                  isPaymentPending ? 'text-yellow-900' : 'text-blue-900'
                }`}>
                  {booking.petName || booking.clients?.pet_name || 'Pet não identificado'}
                </h4>
                <p className={isPaymentPending ? 'text-yellow-700' : 'text-blue-700'}>
                  {booking.clientName || 
                   booking.clients?.profiles?.name || 
                   booking.clients?.client_name || 
                   'Cliente não identificado'}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <BookingStatusBadge status={booking.status} />
                {isPaymentPending && (
                  <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    <AlertCircle className="h-3 w-3" />
                    Pagamento Pendente
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className={`h-4 w-4 ${isPaymentPending ? 'text-yellow-400' : 'text-blue-400'}`} />
                <span className={isPaymentPending ? 'text-yellow-700' : 'text-blue-700'}>
                  {format(new Date(booking.scheduled_at), "dd/MM 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`font-medium ${isPaymentPending ? 'text-yellow-600' : 'text-blue-600'}`}>
                  {booking.service_type}
                </span>
              </div>
              
              {booking.price > 0 && (
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-400" />
                  <span className="font-semibold text-green-600">
                    R$ {Number(booking.price).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Endereço do cliente via ViaCEP */}
            {booking.locationAddress && (
              <div className="flex items-start space-x-2 mt-3 text-sm">
                <MapPin className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                  isPaymentPending ? 'text-yellow-400' : 'text-blue-400'
                }`} />
                <span className={`font-medium ${
                  isPaymentPending ? 'text-yellow-600' : 'text-blue-600'
                }`}>
                  Local: {booking.locationAddress}
                </span>
              </div>
            )}

            {/* Informação de pagamento - Consolidada para evitar duplicação */}
            {booking.payment_info && booking.payment_info !== "Sem info de pagamento" && (
              <div className="flex items-center space-x-2 mt-3 text-sm">
                <CreditCard className={`h-4 w-4 ${
                  isPaymentPaid ? 'text-green-400' : 
                  isPaymentPending ? 'text-yellow-400' : 'text-gray-400'
                }`} />
                <span className={`font-semibold ${
                  isPaymentPaid ? 'text-green-600' : 
                  isPaymentPending ? 'text-yellow-600' : 'text-gray-600'
                }`}>
                  {booking.payment_info}
                </span>
              </div>
            )}

            {/* Observações limpas - Só mostrar se houver conteúdo válido */}
            {booking.notes && (
              <div className="mt-3 text-sm">
                <span className={`font-medium ${
                  isPaymentPending ? 'text-yellow-700' : 'text-blue-700'
                }`}>
                  Observações:
                </span>
                <p className={`mt-1 ${
                  isPaymentPending ? 'text-yellow-600' : 'text-blue-600'
                }`}>
                  {booking.notes}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

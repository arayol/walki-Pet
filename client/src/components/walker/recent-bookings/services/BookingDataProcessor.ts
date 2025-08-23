
import { Booking } from "../types";
import { PaymentService } from "./PaymentService";

export class BookingDataProcessor {
  static async processWalks(walksData: any[]): Promise<Booking[]> {
    console.log("🔍 [BookingDataProcessor] Processando", walksData.length, "walks");
    const processedBookings: Booking[] = [];

    for (const walk of walksData) {
      console.log("🔍 [BookingDataProcessor] Processando walk:", {
        id: walk.id,
        scheduled_at: walk.scheduled_at,
        status: walk.status,
        client_data: walk.clients
      });

      const paymentInfo = await PaymentService.getPaymentInfo(walk.id, walk.client_id);

      processedBookings.push({
        id: walk.id,
        scheduled_at: walk.scheduled_at,
        duration: walk.duration || 60,
        service_type: walk.service_type || "Passeio",
        status: walk.status,
        price: Number(walk.price) || 0,
        notes: PaymentService.cleanNotes(walk.notes),
        petName: walk.clients?.pet_name || "Pet não identificado",
        clientName: walk.clients?.client_name || walk.clients?.profiles?.name || "Cliente não identificado",
        locationAddress: walk.clients?.address || null,
        clients: walk.clients ? {
          client_id: walk.clients.client_id,
          pet_name: walk.clients.pet_name,
          address: walk.clients.address,
          client_name: walk.clients.client_name,
          profiles: walk.clients.profiles ? {
            id: walk.clients.profiles.id || '',
            name: walk.clients.profiles.name,
            email: walk.clients.profiles.email || ''
          } : undefined
        } : undefined,
        payment_info: paymentInfo || "Sem info de pagamento"
      });
    }

    console.log("🔍 [BookingDataProcessor] Walks processados:", processedBookings.length);
    return processedBookings;
  }

  static processServiceBookings(serviceBookingsData: any[]): Booking[] {
    console.log("🔍 [BookingDataProcessor] Processando", serviceBookingsData.length, "service bookings");
    const processedBookings: Booking[] = [];

    for (const booking of serviceBookingsData) {
      processedBookings.push({
        id: booking.id,
        scheduled_at: booking.data_hora_inicio,
        duration: 60,
        service_type: "Serviço Agendado",
        status: booking.status === "confirmado" ? "confirmed" : "scheduled",
        price: 0,
        notes: PaymentService.cleanNotes(booking.observacoes),
        petName: booking.clients?.pet_name || "Pet não identificado",
        clientName: booking.clients?.client_name || booking.clients?.profiles?.name || "Cliente não identificado",
        locationAddress: booking.clients?.address || null,
        clients: booking.clients ? {
          client_id: booking.clients.client_id,
          pet_name: booking.clients.pet_name,
          address: booking.clients.address,
          client_name: booking.clients.client_name,
          profiles: booking.clients.profiles ? {
            id: booking.clients.profiles.id || '',
            name: booking.clients.profiles.name,
            email: booking.clients.profiles.email || ''
          } : undefined
        } : undefined,
        payment_info: "Sem info de pagamento"
      });
    }

    console.log("🔍 [BookingDataProcessor] Service bookings processados:", processedBookings.length);
    return processedBookings;
  }

  static processPayments(paymentsData: any[]): Booking[] {
    console.log("🔍 [BookingDataProcessor] Processando", paymentsData.length, "payments");
    const processedBookings: Booking[] = [];

    for (const payment of paymentsData) {
      // Determinar texto do pagamento baseado no status e método
      let paymentText = "Sem info de pagamento";
      if (payment.status === "paid") {
        const method = payment.payment_method?.includes("pix") ? "Pix" : "Cartão";
        paymentText = `Pago: Stripe ${method}`;
      } else if (payment.status === "pending") {
        paymentText = "Pagamento Pendente";
      } else if (payment.status === "failed") {
        paymentText = "Pagamento Failed";
      }

      processedBookings.push({
        id: payment.id,
        scheduled_at: payment.created_at,
        duration: 60,
        service_type: "Transação",
        status: payment.status === "paid" ? "confirmed" : "pending",
        price: Number(payment.amount) || 0,
        notes: null,
        petName: payment.clients?.pet_name || "Pet não identificado",
        clientName: payment.clients?.client_name || payment.clients?.profiles?.name || "Cliente não identificado",
        locationAddress: payment.clients?.address || null,
        clients: payment.clients ? {
          client_id: payment.clients.client_id,
          pet_name: payment.clients.pet_name,
          address: payment.clients.address,
          client_name: payment.clients.client_name,
          profiles: payment.clients.profiles ? {
            id: payment.clients.profiles.id || '',
            name: payment.clients.profiles.name,
            email: payment.clients.profiles.email || ''
          } : undefined
        } : undefined,
        payment_info: paymentText
      });
    }

    console.log("🔍 [BookingDataProcessor] Payments processados:", processedBookings.length);
    return processedBookings;
  }

  static sortBookings(bookings: Booking[]): Booking[] {
    return bookings.sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime());
  }
}

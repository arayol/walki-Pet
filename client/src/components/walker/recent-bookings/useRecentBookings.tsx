
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Booking } from "./types";
import { BookingQueries } from "./services/BookingQueries";
import { BookingDataProcessor } from "./services/BookingDataProcessor";

export const useRecentBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!user) return;

    try {
      console.log("🔍 [useRecentBookings] Iniciando busca de dados para walker:", user.id);
      
      const now = new Date();
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - 14); // Últimos 14 dias
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);

      console.log("🔍 [useRecentBookings] Buscando dados dos últimos 14 dias:", {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      });

      // Buscar walks, service_bookings e payments em paralelo
      const [walksResult, serviceBookingsResult, paymentsResult] = await Promise.all([
        BookingQueries.fetchWalks(user.id, startDate, endDate),
        BookingQueries.fetchServiceBookings(user.id, startDate, endDate),
        BookingQueries.fetchPayments(user.id, startDate, endDate)
      ]);

      const processedBookings: Booking[] = [];

      // Processar walks
      if (walksResult.data && !walksResult.error) {
        const walksBookings = await BookingDataProcessor.processWalks(walksResult.data);
        processedBookings.push(...walksBookings);
        console.log("✅ [useRecentBookings] Walks processados:", walksBookings.length);
      } else if (walksResult.error) {
        console.error("❌ [useRecentBookings] Erro ao buscar walks:", walksResult.error);
      }

      // Processar service_bookings
      if (serviceBookingsResult.data && !serviceBookingsResult.error) {
        const serviceBookings = BookingDataProcessor.processServiceBookings(serviceBookingsResult.data);
        processedBookings.push(...serviceBookings);
        console.log("✅ [useRecentBookings] Service bookings processados:", serviceBookings.length);
      } else if (serviceBookingsResult.error) {
        console.error("❌ [useRecentBookings] Erro ao buscar service bookings:", serviceBookingsResult.error);
      }

      // Processar payments
      if (paymentsResult.data && !paymentsResult.error) {
        const paymentsBookings = BookingDataProcessor.processPayments(paymentsResult.data);
        processedBookings.push(...paymentsBookings);
        console.log("✅ [useRecentBookings] Payments processados:", paymentsBookings.length);
      } else if (paymentsResult.error) {
        console.error("❌ [useRecentBookings] Erro ao buscar payments:", paymentsResult.error);
      }

      // Ordenar por data (mais recentes primeiro)
      const sortedBookings = BookingDataProcessor.sortBookings(processedBookings);

      console.log("🎉 [useRecentBookings] Total de itens processados:", sortedBookings.length);
      console.log("🔍 [useRecentBookings] Dados finais:", sortedBookings.map(b => ({
        id: b.id,
        type: b.service_type,
        scheduled_at: b.scheduled_at,
        client: b.clientName,
        pet: b.petName,
        status: b.status,
        payment_info: b.payment_info,
        price: b.price
      })));

      setBookings(sortedBookings);
    } catch (error) {
      console.error("💥 [useRecentBookings] Erro geral:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  return { bookings, loading, refetch: fetchBookings };
};

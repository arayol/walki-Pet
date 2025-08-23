
import { supabase } from "@/integrations/supabase/client";

export class PaymentService {
  static async getPaymentInfo(walkId: string, clientId: string): Promise<string | null> {
    console.log("🔍 [PaymentService] Buscando pagamento para walk:", walkId, "client:", clientId);
    
    try {
      const { data: payment, error } = await supabase
        .from("payments")
        .select("*")
        .or(`walk_id.eq.${walkId},client_id.eq.${clientId}`)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("❌ [PaymentService] Erro ao buscar pagamento:", error);
        return null;
      }

      if (!payment) {
        console.log("ℹ️ [PaymentService] Nenhum pagamento encontrado");
        return null;
      }

      // Determinar texto do pagamento baseado no status e tipo usando novos campos
      let paymentText = "Sem info de pagamento";
      if (payment.status === "paid") {
        // Usar o campo payment_type se disponível
        let method = payment.payment_type || "Cartão";
        
        // Fallback para payment_method_types se payment_type não existir
        if (!payment.payment_type && payment.payment_method_types && payment.payment_method_types.length > 0) {
          const methodType = payment.payment_method_types[0];
          method = methodType === "pix" ? "PIX" : methodType === "card" ? "Cartão" : "Cartão";
        } else if (!payment.payment_type && payment.payment_method?.includes("pix")) {
          method = "PIX";
        } else if (!payment.payment_type && payment.payment_method?.includes("card")) {
          method = "Cartão";
        }
        
        paymentText = `Pago: ${method}`;
        
        // Adicionar informações extras se disponíveis
        if (payment.customer_email) {
          paymentText += ` (${payment.customer_email})`;
        }
      } else if (payment.status === "pending") {
        paymentText = "Pagamento Pendente";
        if (payment.customer_email) {
          paymentText += ` (${payment.customer_email})`;
        }
      } else if (payment.status === "failed") {
        paymentText = "Pagamento Falhou";
      }

      console.log("✅ [PaymentService] Pagamento encontrado:", {
        id: payment.id,
        status: payment.status,
        method: payment.payment_method,
        methodTypes: payment.payment_method_types,
        paymentType: payment.payment_type, // Novo campo
        customerEmail: payment.customer_email,
        customerName: payment.customer_name,
        currency: payment.currency,
        paymentIntentId: payment.payment_intent_id,
        text: paymentText
      });

      return paymentText;
    } catch (error) {
      console.error("💥 [PaymentService] Erro exception:", error);
      return null;
    }
  }

  static cleanNotes(notes: string | null | undefined): string | null {
    if (!notes) return null;
    
    // Remover IDs do Stripe e texto de processamento
    let cleanedNotes = notes
      .replace(/cs_test_[a-zA-Z0-9]+/g, '')
      .replace(/cs_live_[a-zA-Z0-9]+/g, '')
      .replace(/pi_[a-zA-Z0-9]+/g, '') // Remover Payment Intent IDs
      .replace(/Pagamento processado via Stripe:\s*/g, '')
      .replace(/Pagamento Stripe:\s*/g, '')
      .replace(/^\s*,\s*/, '')
      .trim();
    
    return cleanedNotes || null;
  }

  // Novo método para buscar detalhes completos do pagamento
  static async getPaymentDetails(paymentId: string) {
    try {
      const { data: payment, error } = await supabase
        .from("payments")
        .select("*")
        .eq("id", paymentId)
        .single();

      if (error) {
        console.error("❌ [PaymentService] Erro ao buscar detalhes do pagamento:", error);
        return null;
      }

      // Safely parse metadata if it exists
      let parsedMetadata = null;
      if (payment.metadata) {
        try {
          parsedMetadata = typeof payment.metadata === 'string' 
            ? JSON.parse(payment.metadata) 
            : payment.metadata;
        } catch (e) {
          console.warn("⚠️ [PaymentService] Erro ao fazer parse dos metadados:", e);
          parsedMetadata = null;
        }
      }

      return {
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
        currency: payment.currency || 'BRL',
        paymentMethod: payment.payment_method,
        paymentMethodTypes: payment.payment_method_types,
        customerEmail: payment.customer_email,
        customerName: payment.customer_name,
        stripePaymentId: payment.stripe_payment_id,
        paymentIntentId: payment.payment_intent_id,
        stripeCustomerId: payment.stripe_customer_id,
        metadata: parsedMetadata,
        paidAt: payment.paid_at,
        createdAt: payment.created_at,
        updatedAt: payment.updated_at
      };
    } catch (error) {
      console.error("💥 [PaymentService] Erro ao buscar detalhes:", error);
      return null;
    }
  }
}

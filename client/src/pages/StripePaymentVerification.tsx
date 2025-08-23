
import { StripePaymentVerification } from "@/components/debug/StripePaymentVerification";

const StripePaymentVerificationPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Verificação de Pagamento Stripe</h1>
        <StripePaymentVerification />
      </div>
    </div>
  );
};

export default StripePaymentVerificationPage;

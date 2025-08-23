
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { StripeConnectSetup } from "@/components/stripe/StripeConnectSetup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export const StripeConnectCard = () => {
  const { user } = useAuth();
  const [walkerData, setWalkerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stripeStatus, setStripeStatus] = useState<any>(null);

  const fetchWalkerData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/walkers/${user.id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setWalkerData(null);
          setLoading(false);
          return;
        }
        throw new Error(`Erro ${response.status}`);
      }

      const data = await response.json();
      setWalkerData(data);
      
      // Check Stripe status if account exists
      if (data?.stripe_account_id) {
        checkStripeStatus();
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Erro ao carregar dados do walker");
    } finally {
      setLoading(false);
    }
  };

  const checkStripeStatus = async () => {
    try {
      const response = await fetch(`/api/stripe/status/${user?.id}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }
      
      const data = await response.json();
      setStripeStatus(data);
    } catch (error) {
      console.error("Error checking Stripe status:", error);
      // Se não conseguir verificar status, apenas ignora (não crítico)
      setStripeStatus(null);
    }
  };

  useEffect(() => {
    fetchWalkerData();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-6 w-6 mr-2 text-blue-600" />
            Integração Stripe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-6 w-6 mr-2 text-blue-600" />
            Integração Stripe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 text-sm">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!walkerData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-6 w-6 mr-2 text-blue-600" />
            Integração Stripe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-sm">Dados do walker não encontrados</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <StripeConnectSetup 
      walkerData={walkerData}
      stripeStatus={stripeStatus}
      onStatusUpdate={fetchWalkerData}
    />
  );
};

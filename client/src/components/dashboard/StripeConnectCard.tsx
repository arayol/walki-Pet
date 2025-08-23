
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
      const { data, error } = await supabase
        .from("walkers")
        .select(`
          stripe_account_id,
          stripe_onboarding_complete,
          profiles!walkers_walker_id_fkey (
            name
          )
        `)
        .eq("walker_id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching walker data:", error);
        setError("Erro ao carregar dados do walker");
      } else {
        setWalkerData(data);
        
        // Check Stripe status if account exists
        if (data?.stripe_account_id) {
          checkStripeStatus();
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  const checkStripeStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("check-stripe-status");
      if (error) throw error;
      setStripeStatus(data);
    } catch (error) {
      console.error("Error checking Stripe status:", error);
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

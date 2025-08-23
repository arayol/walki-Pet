
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ClientConfirmation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [walkerName, setWalkerName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWalkerInfo();
  }, []);

  const fetchWalkerInfo = async () => {
    try {
      // Buscar informações do cliente logado para encontrar o walker associado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: clientData, error } = await supabase
          .from("clients")
          .select(`
            walkers!clients_walker_id_fkey (
              profiles!walkers_walker_id_fkey (
                name
              )
            )
          `)
          .eq("client_id", user.id)
          .single();

        if (error) {
          console.error("Erro ao buscar informações do walker:", error);
        } else if (clientData?.walkers?.profiles?.name) {
          setWalkerName(clientData.walkers.profiles.name);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar informações:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate("/client-dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold text-green-600">
            Cadastro Confirmado!
          </CardTitle>
          <CardDescription className="text-lg">
            Seu cadastro foi realizado com sucesso.
            {walkerName && (
              <>
                <br />
                <span className="font-semibold text-blue-600">
                  {walkerName}
                </span> entrará em contato em breve.
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <User className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-700">
              Você receberá informações sobre os passeios e cuidados do seu pet diretamente do seu dog walker.
            </p>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Enquanto isso, você pode acessar sua área do cliente para ver dog walkers disponíveis.
            </p>
            
            <Button onClick={handleGoToDashboard} className="w-full">
              Ir para Minha Área
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientConfirmation;

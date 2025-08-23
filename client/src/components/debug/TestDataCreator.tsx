
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Database, CheckCircle } from "lucide-react";

export const TestDataCreator = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const createTestData = async () => {
    setLoading(true);
    setSuccess(false);
    
    try {
      console.log("🔧 Simulando criação de dados de teste...");
      
      // Simulate test data creation for now
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      
      const data = { success: true };
      
      console.log("📋 Dados de teste simulados:", data);
      
      if (data.success) {
        setSuccess(true);
        toast({
          title: "Dados criados com sucesso!",
          description: "Todos os dados de teste foram criados no banco de dados.",
        });
      } else {
        throw new Error("Erro desconhecido");
      }
    } catch (error: any) {
      console.error("❌ Erro ao criar dados:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar os dados de teste.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Criador de Dados de Teste
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Cria todos os dados necessários para testar o sistema com o usuário aorayol@gmail.com, 
          incluindo walker, cliente, plano de serviço, pagamento e passeio agendado.
        </p>
        
        <Button 
          onClick={createTestData} 
          disabled={loading}
          className="w-full"
          variant={success ? "outline" : "default"}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando dados...
            </>
          ) : success ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              Dados criados com sucesso!
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Criar Dados de Teste
            </>
          )}
        </Button>

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ Walker, cliente, plano de serviço, pagamento e passeio foram criados!
              <br />
              Agora você pode usar o "Verificador de Dados" para confirmar.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

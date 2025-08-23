
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Search } from "lucide-react";

interface EmptyStatesProps {
  clientInfo: any;
  hasData: boolean;
  loading: boolean;
}

export const EmptyStates = ({ clientInfo, hasData, loading }: EmptyStatesProps) => {
  if (clientInfo && !hasData && !loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum Dado Encontrado</h3>
            <p className="text-gray-600">
              O usuário foi encontrado, mas não há pagamentos, agendamentos ou reservas registrados.
              Isso pode indicar que o webhook não está funcionando corretamente ou que há inconsistências no sistema.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!clientInfo && !loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Digite um email para começar</h3>
            <p className="text-gray-600">
              Insira o email do usuário para verificar os dados de pagamentos, agendamentos e disponibilidade de slots.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};

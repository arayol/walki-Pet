
import { ClientCard } from "./ClientCard";
import { Client } from "@/types/client";

interface ClientsGridProps {
  clients: Client[];
  onClientStatusChange: (clientId: string, newStatus: boolean) => void;
}

export const ClientsGrid = ({ clients, onClientStatusChange }: ClientsGridProps) => {
  // Ordenar clientes: ativos primeiro, depois inativos
  const sortedClients = [...clients].sort((a, b) => {
    const aActive = a.is_active ?? true;
    const bActive = b.is_active ?? true;
    
    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;
    return 0;
  });

  const activeClients = sortedClients.filter(client => client.is_active ?? true);
  const inactiveClients = sortedClients.filter(client => !(client.is_active ?? true));

  return (
    <div className="space-y-8">
      {/* Clientes Ativos */}
      {activeClients.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Clientes Ativos ({activeClients.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeClients.map((client) => (
              <ClientCard 
                key={client.client_id} 
                client={client} 
                onStatusChange={onClientStatusChange}
              />
            ))}
          </div>
        </div>
      )}

      {/* Divisor e Clientes Inativos */}
      {inactiveClients.length > 0 && (
        <div>
          {activeClients.length > 0 && (
            <div className="border-t border-gray-300 my-8"></div>
          )}
          <h3 className="text-lg font-semibold text-gray-500 mb-4">
            Clientes Inativos ({inactiveClients.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inactiveClients.map((client) => (
              <ClientCard 
                key={client.client_id} 
                client={client} 
                onStatusChange={onClientStatusChange}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

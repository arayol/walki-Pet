
import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PlanLimitsGuard } from "@/components/plan-limits/PlanLimitsGuard";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ClientForm } from "@/components/clients/ClientForm";
import { ClientInviteLink } from "@/components/clients/ClientInviteLink";
import { ClientsLoading } from "@/components/clients/ClientsLoading";
import { ClientsHeader } from "@/components/clients/ClientsHeader";
import { ClientsSearch } from "@/components/clients/ClientsSearch";
import { ClientsGrid } from "@/components/clients/ClientsGrid";
import { ClientsEmptyState } from "@/components/clients/ClientsEmptyState";
import { WalkerLayout } from "@/components/layout/WalkerLayout";
import { Client } from "@/types/client";
import { ClientDataTransformer } from "@/transformers/ClientDataTransformer";
import { UserIdGuard } from "@/guards/UserIdGuard";

const Clients = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [walkerSlug, setWalkerSlug] = useState<string>("");

  useEffect(() => {
    if (user) {
      fetchClients();
      fetchWalkerSlug();
    }
  }, [user]);

  const fetchWalkerSlug = async () => {
    try {
      if (!user?.id) return;
      
      const response = await fetch(`/api/walkers/${user.id}`);
      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }
      
      const walkerData = await response.json();
      setWalkerSlug(walkerData.slug || "");
    } catch (error) {
      console.error("Error fetching walker slug:", error);
      setWalkerSlug(""); // Set empty if error
    }
  };

  const fetchClients = async () => {
    try {
      const userIdGuard = new UserIdGuard(user?.id);
      console.log("Buscando clientes para walker:", userIdGuard.getValue());
      
      // Return empty clients list for now - can be implemented with API later
      const data: any[] = [];
      
      console.log("Dados retornados:", data);
      
      const transformer = new ClientDataTransformer();
      const transformedClients = transformer.transformSupabaseData(data || []);
      setClients(transformedClients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClientStatusChange = (clientId: string, newStatus: boolean) => {
    setClients(prevClients => 
      prevClients.map(client => 
        client.client_id === clientId 
          ? { ...client, is_active: newStatus }
          : client
      )
    );
  };

  const filteredClients = clients.filter(client =>
    client.pet_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.client_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);
  const handleSaveClient = () => {
    setShowForm(false);
    fetchClients();
  };

  if (loading) {
    return <ClientsLoading />;
  }

  return (
    <ProtectedRoute requiredRole="walker">
      <WalkerLayout>
        <div className="space-y-6">
          <ClientsHeader onAddClient={handleAddClient} />

          {walkerSlug && <ClientInviteLink walkerSlug={walkerSlug} />}

          <ClientsSearch 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />

          {filteredClients.length === 0 ? (
            <ClientsEmptyState 
              searchTerm={searchTerm} 
              onAddClient={handleAddClient} 
            />
          ) : (
            <ClientsGrid 
              clients={filteredClients} 
              onClientStatusChange={handleClientStatusChange}
            />
          )}
        </div>

        {showForm && (
          <ClientForm
            onClose={handleCloseForm}
            onSave={handleSaveClient}
          />
        )}
      </WalkerLayout>
    </ProtectedRoute>
  );
};

export default Clients;

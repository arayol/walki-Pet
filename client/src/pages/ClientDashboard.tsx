import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Calendar, MapPin, Phone, Star, LogOut, User, Heart, Clock, CreditCard, CalendarCheck, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const ClientDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clientData, setClientData] = useState<any>(null);
  const [walkerData, setWalkerData] = useState<any>(null);
  const [walks, setWalks] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientData();
  }, [user]);

  const getAddressFromCEP = async (cep: string) => {
    if (!cep) return null;
    
    try {
      const cleanCEP = cep.replace(/\D/g, '');
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      
      if (!response.ok) return null;
      
      const data = await response.json();
      
      if (data.erro) return null;
      
      return `${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}`;
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      return null;
    }
  };

  const fetchClientData = async () => {
    if (!user) return;

    try {
      console.log("🔍 [ClientDashboard] Iniciando busca de dados para cliente:", user.id);

      // Buscar dados do cliente
      const { data: client, error: clientError } = await supabase
        .from("clients")
        .select(`
          *,
          profiles (
            email,
            name
          )
        `)
        .eq("client_id", user.id)
        .single();

      if (clientError) {
        console.error("Error fetching client data:", clientError);
        return;
      }

      console.log("✅ [ClientDashboard] Dados do cliente encontrados:", client);
      setClientData(client);

      // Buscar dados do walker
      if (client?.walker_id) {
        const { data: walker, error: walkerError } = await supabase
          .from("walkers")
          .select(`
            *,
            profiles (
              name,
              email
            )
          `)
          .eq("walker_id", client.walker_id)
          .single();

        if (!walkerError && walker) {
          console.log("✅ [ClientDashboard] Dados do walker encontrados:", walker);
          setWalkerData(walker);
        }
      }

      // Definir período de busca - últimos 30 dias até próximos 30 dias
      const now = new Date();
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(now);
      endDate.setDate(now.getDate() + 30);
      endDate.setHours(23, 59, 59, 999);

      console.log("🔍 [ClientDashboard] Período de busca:", {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      });

      // Buscar agendamentos (walks) - TODOS os status relevantes
      const { data: walksData, error: walksError } = await supabase
        .from("walks")
        .select("*")
        .eq("client_id", user.id)
        .gte("scheduled_at", startDate.toISOString())
        .lte("scheduled_at", endDate.toISOString())
        .in("status", ["scheduled", "confirmed", "pending", "completed"])
        .order("scheduled_at", { ascending: false });

      console.log("🔍 [ClientDashboard] Resultado walks:", {
        error: walksError,
        count: walksData?.length || 0,
        data: walksData
      });

      // Buscar service_bookings também
      const { data: serviceBookingsData, error: serviceBookingsError } = await supabase
        .from("service_bookings")
        .select("*")
        .eq("client_id", user.id)
        .gte("data_agendamento", startDate.toISOString().split('T')[0])
        .lte("data_agendamento", endDate.toISOString().split('T')[0])
        .in("status", ["confirmado", "agendado"])
        .order("data_agendamento", { ascending: false });

      console.log("🔍 [ClientDashboard] Resultado service_bookings:", {
        error: serviceBookingsError,
        count: serviceBookingsData?.length || 0,
        data: serviceBookingsData
      });

      if (!walksError || !serviceBookingsError) {
        // Processar walks com endereço via ViaCEP e limpar observações
        const processedWalks = await Promise.all((walksData || []).map(async (walk) => {
          let locationAddress = null;
          if (client?.address) {
            const cepMatch = client.address.match(/\d{5}-?\d{3}/);
            if (cepMatch) {
              locationAddress = await getAddressFromCEP(cepMatch[0]);
            }
          }

          // Filtrar observações para remover IDs do Stripe
          let cleanNotes = walk.notes;
          if (cleanNotes) {
            cleanNotes = cleanNotes.replace(/cs_test_[a-zA-Z0-9]+/g, '').trim();
            cleanNotes = cleanNotes.replace(/cs_live_[a-zA-Z0-9]+/g, '').trim();
            cleanNotes = cleanNotes.replace(/Pagamento processado via Stripe:\s*/g, '').trim();
            cleanNotes = cleanNotes.replace(/^\s*,\s*/, '').trim();
            if (!cleanNotes) cleanNotes = null;
          }

          // Buscar informações de pagamento para este walk específico
          const { data: paymentData } = await supabase
            .from("payments")
            .select("status, payment_method, stripe_payment_id")
            .eq("walk_id", walk.id)
            .maybeSingle();

          // Se não encontrar pagamento por walk_id, buscar por metadata da sessão do Stripe
          let fallbackPaymentData = null;
          if (!paymentData && walk.notes && walk.notes.includes('cs_test_')) {
            const stripeSessionMatch = walk.notes.match(/cs_test_[a-zA-Z0-9]+/);
            if (stripeSessionMatch) {
              const { data: stripePayment } = await supabase
                .from("payments")
                .select("status, payment_method, stripe_payment_id")
                .eq("stripe_payment_id", stripeSessionMatch[0])
                .eq("client_id", user.id)
                .maybeSingle();
              fallbackPaymentData = stripePayment;
            }
          }

          const finalPaymentData = paymentData || fallbackPaymentData;

          return {
            ...walk,
            locationAddress,
            notes: cleanNotes,
            paymentStatus: finalPaymentData?.status || "unknown",
            paymentMethod: finalPaymentData?.payment_method || null
          };
        }));

        // Processar service_bookings
        const processedServiceBookings = await Promise.all((serviceBookingsData || []).map(async (sb) => {
          let locationAddress = null;
          if (client?.address) {
            const cepMatch = client.address.match(/\d{5}-?\d{3}/);
            if (cepMatch) {
              locationAddress = await getAddressFromCEP(cepMatch[0]);
            }
          }

          // Filtrar observações
          let cleanNotes = sb.observacoes;
          if (cleanNotes) {
            cleanNotes = cleanNotes.replace(/cs_test_[a-zA-Z0-9]+/g, '').trim();
            cleanNotes = cleanNotes.replace(/cs_live_[a-zA-Z0-9]+/g, '').trim();
            cleanNotes = cleanNotes.replace(/Pagamento processado via Stripe:\s*/g, '').trim();
            cleanNotes = cleanNotes.replace(/^\s*,\s*/, '').trim();
            if (!cleanNotes) cleanNotes = null;
          }

          return {
            ...sb,
            scheduled_at: sb.data_hora_inicio,
            service_type: "Serviço Agendado",
            price: 0,
            locationAddress,
            notes: cleanNotes,
            paymentStatus: "confirmed",
            paymentMethod: null
          };
        }));
        
        // Combinar walks e service_bookings
        const combinedBookings = [
          ...processedWalks,
          ...processedServiceBookings
        ];
        
        // Ordenar por data (mais recentes primeiro)
        combinedBookings.sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime());
        
        console.log("🔍 [ClientDashboard] Agendamentos processados:", combinedBookings.length);
        console.log("🔍 [ClientDashboard] Dados finais:", combinedBookings.map(b => ({
          id: b.id,
          scheduled_at: b.scheduled_at,
          service_type: b.service_type,
          status: b.status,
          price: b.price
        })));
        
        setWalks(combinedBookings);
      }

      // Buscar todos os pagamentos do cliente
      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payments")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      console.log("🔍 [ClientDashboard] Resultado payments:", {
        error: paymentsError,
        count: paymentsData?.length || 0,
        data: paymentsData
      });

      if (!paymentsError && paymentsData) {
        setPayments(paymentsData);
      }

    } catch (error) {
      console.error("💥 [ClientDashboard] Erro geral:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'confirmado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Agendado';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      case 'paid':
        return 'Pago';
      case 'pending':
        return 'Pendente';
      case 'confirmed':
        return 'Confirmado';
      case 'confirmado':
        return 'Confirmado';
      default:
        return status;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      
      // Sempre redirecionar para client-landing (área do cliente)
      navigate("/client-landing");
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Erro",
        description: "Erro ao fazer logout",
        variant: "destructive",
      });
    }
  };

  const handleViewWalker = () => {
    console.log('🔍 ClientDashboard: handleViewWalker called');
    console.log('🔍 ClientDashboard: walkerData:', walkerData);
    
    if (walkerData?.walker_id) {
      const targetPath = `/client-services/${walkerData.walker_id}`;
      console.log('🔍 ClientDashboard: Navigating to:', targetPath);
      navigate(targetPath);
    } else if (walkerData?.slug) {
      const targetPath = `/client-services/${walkerData.slug}`;
      console.log('🔍 ClientDashboard: Navigating to (using slug):', targetPath);
      navigate(targetPath);
    } else {
      console.log('🔍 ClientDashboard: No walker_id or slug available');
      toast({
        title: "Erro",
        description: "Informações do dog walker não encontradas",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="client">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-blue-600">PetWalker</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Olá, {clientData?.client_name || user?.email}</span>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Área do Cliente</h1>
            <p className="text-gray-600 mt-2">Gerencie seus agendamentos e informações</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Client Info Card */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-6 w-6 mr-2 text-blue-600" />
                    Minhas Informações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-700">Nome</h4>
                      <p className="text-gray-600">{clientData?.client_name || 'Não informado'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700">Email</h4>
                      <p className="text-gray-600">{clientData?.profiles?.email || user?.email}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700">Endereço</h4>
                      <p className="text-gray-600">{clientData?.address || 'Não informado'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700">Contato</h4>
                      <p className="text-gray-600">{clientData?.emergency_contact || 'Não informado'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Walks - Mostrando TODOS os agendamentos */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarCheck className="h-6 w-6 mr-2 text-green-600" />
                    Serviços Agendados
                  </CardTitle>
                  <CardDescription>
                    Todos os seus agendamentos (últimos 30 dias e próximos 30 dias) - Total: {walks.length}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {walks.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhum agendamento encontrado
                      </h3>
                      <p className="text-gray-600">
                        Quando houver novos agendamentos, eles aparecerão aqui
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {walks.map((walk) => {
                        const isPaymentPending = walk.paymentStatus === "pending";
                        
                        return (
                          <div 
                            key={walk.id} 
                            className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 ${
                              isPaymentPending 
                                ? 'bg-yellow-50 border-yellow-200' 
                                : 'bg-blue-50 border-blue-200'
                            }`}
                          >
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className={`font-semibold ${
                                  isPaymentPending ? 'text-yellow-900' : 'text-blue-900'
                                }`}>
                                  {walk.service_type}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <Badge className={getStatusColor(walk.status)}>
                                    {getStatusText(walk.status)}
                                  </Badge>
                                  {isPaymentPending && (
                                    <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                      <AlertCircle className="h-3 w-3" />
                                      Aguardando Pagamento
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className={`flex items-center space-x-4 text-sm ${
                                isPaymentPending ? 'text-yellow-600' : 'text-blue-600'
                              }`}>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {format(new Date(walk.scheduled_at), "dd/MM 'às' HH:mm", { locale: ptBR })}
                                </div>
                              </div>
                              {walk.locationAddress && (
                                <div className={`flex items-center space-x-2 mt-2 text-sm ${
                                  isPaymentPending ? 'text-yellow-600' : 'text-blue-600'
                                }`}>
                                  <MapPin className="h-4 w-4" />
                                  <span>{walk.locationAddress}</span>
                                </div>
                              )}
                              {walk.notes && (
                                <p className={`text-sm mt-2 ${
                                  isPaymentPending ? 'text-yellow-600' : 'text-blue-600'
                                }`}>
                                  {walk.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Payments */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-6 w-6 mr-2 text-purple-600" />
                    Histórico de Pagamentos
                  </CardTitle>
                  <CardDescription>Seus pagamentos realizados - Total: {payments.length}</CardDescription>
                </CardHeader>
                <CardContent>
                  {payments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Nenhum pagamento encontrado</p>
                  ) : (
                    <div className="space-y-4">
                      {payments.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">
                                Pagamento {payment.stripe_payment_id ? `#${payment.stripe_payment_id.slice(-6)}` : `#${payment.id.slice(-6)}`}
                              </h4>
                              <Badge className={getStatusColor(payment.status)}>
                                {getStatusText(payment.status)}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatDate(payment.created_at)}
                              </div>
                              <div className="flex items-center font-semibold">
                                <CreditCard className="h-4 w-4 mr-1" />
                                {formatPrice(Number(payment.amount))}
                              </div>
                              {payment.paid_at && (
                                <div className="text-green-600">
                                  Pago em {formatDate(payment.paid_at)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pet Info Card */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-6 w-6 mr-2 text-red-500" />
                    Informações do Pet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-700">Nome do Pet</h4>
                      <p className="text-gray-600">{clientData?.pet_name || 'Não informado'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700">Raça</h4>
                      <p className="text-gray-600">{clientData?.pet_breed || 'Não informado'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700">Idade</h4>
                      <p className="text-gray-600">{clientData?.pet_age ? `${clientData.pet_age} anos` : 'Não informado'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <h4 className="font-semibold text-gray-700">Observações</h4>
                      <p className="text-gray-600">{clientData?.pet_notes || 'Nenhuma observação'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Schedule Preferences */}
              {(clientData?.preferred_days?.length > 0 || clientData?.preferred_times?.length > 0) && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-6 w-6 mr-2 text-purple-600" />
                      Preferências de Horário
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {clientData?.preferred_days?.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-700">Dias Preferidos</h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {clientData.preferred_days.map((day: string, index: number) => (
                              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                {day}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {clientData?.preferred_times?.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-700">Horários Preferidos</h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {clientData.preferred_times.map((time: string, index: number) => (
                              <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                {time}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {clientData?.additional_schedule_notes && (
                        <div>
                          <h4 className="font-semibold text-gray-700">Observações sobre Horários</h4>
                          <p className="text-gray-600 mt-1">{clientData.additional_schedule_notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Walker Info Card */}
              {walkerData && (
                <Card className="shadow-lg border-2 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-800">Meu Dog Walker</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl font-bold text-white">
                          {walkerData.profiles?.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2) || 'DW'}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg">{walkerData.profiles?.name || 'Dog Walker'}</h3>
                      <div className="flex items-center justify-center mt-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                        <span className="text-sm text-gray-600">{walkerData.rating || '5.0'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {walkerData.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{walkerData.location}</span>
                        </div>
                      )}
                      {walkerData.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{walkerData.phone}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      onClick={handleViewWalker}
                      className="w-full mt-4"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Tabela de Serviços
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {walkerData && (
                    <Button 
                      onClick={handleViewWalker}
                      variant="outline" 
                      className="w-full"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Agendar Novo Serviço
                    </Button>
                  )}
                  <Button 
                    onClick={handleSignOut}
                    variant="outline"
                    className="w-full text-gray-600 hover:text-gray-800"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair da Conta
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default ClientDashboard;

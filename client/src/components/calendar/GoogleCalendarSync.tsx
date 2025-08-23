import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Calendar, RefreshCw, Link, Unlink, AlertCircle, CheckCircle, RotateCcw, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
interface GoogleCalendarSyncProps {
  onSyncComplete?: () => void;
}
export const GoogleCalendarSync = ({
  onSyncComplete
}: GoogleCalendarSyncProps) => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [walkerPlan, setWalkerPlan] = useState<string>('free');

  useEffect(() => {
    checkConnectionStatus();
    
    // Check for OAuth callback parameters
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get('google_auth');
    const errorMessage = urlParams.get('message');
    
    if (authStatus === 'success') {
      setIsConnected(true);
      toast({
        title: "Sucesso!",
        description: "Google Calendar conectado com sucesso!"
      });
      onSyncComplete?.();
      checkConnectionStatus();
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (authStatus === 'error') {
      toast({
        title: "Erro na autenticação",
        description: `Erro: ${errorMessage || 'Erro desconhecido'}`,
        variant: "destructive"
      });
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [user, onSyncComplete]);
  const checkConnectionStatus = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/walkers/${user.id}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }
      
      const data = await response.json();
      setIsConnected(data?.google_calendar_connected || false);
      setLastSyncTime(data?.google_last_sync);
      setWalkerPlan(data?.plan_type || 'free');
    } catch (error) {
      console.error('Erro ao verificar status da conexão:', error);
      // Use defaults for development
      setIsConnected(false);
      setLastSyncTime(null);
      setWalkerPlan('free');
    }
  };
  const handleConnect = async () => {
    setLoading(true);
    try {
      // Mock implementation - just show development message
      toast({
        title: "Em Desenvolvimento",
        description: "A integração com Google Calendar será implementada em breve!",
        variant: "default"
      });
      
      // Don't actually redirect, just simulate the flow
      setLoading(false);
    } catch (error: any) {
      console.error('Erro ao conectar Google Calendar:', error);
      toast({
        title: "Aviso", 
        description: "Funcionalidade do Google Calendar em desenvolvimento.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const response = await fetch(`/api/walkers/${user?.id}/google-calendar`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }

      setIsConnected(false);
      setLastSyncTime(null);
      setShowDisconnectDialog(false);
      toast({
        title: "Desconectado",
        description: "Google Calendar desconectado com sucesso."
      });
    } catch (error: any) {
      console.error('Erro ao desconectar Google Calendar:', error);
      toast({
        title: "Aviso",
        description: "Funcionalidade do Google Calendar em desenvolvimento.",
        variant: "destructive"
      });
    }
  };
  const handleSync = async () => {
    setSyncing(true);
    try {
      const response = await fetch(`/api/walkers/${user?.id}/google-calendar/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }

      const data = await response.json();
      
      setLastSyncTime(new Date().toISOString());
      toast({
        title: "Sincronização Concluída",
        description: data.message || "Agendamentos sincronizados com sucesso!"
      });
      onSyncComplete?.();
    } catch (error: any) {
      console.error('Erro ao sincronizar:', error);
      toast({
        title: "Aviso",
        description: "Funcionalidade do Google Calendar em desenvolvimento.",
        variant: "destructive"
      });
    } finally {
      setSyncing(false);
    }
  };
  const formatLastSync = (syncTime: string | null) => {
    if (!syncTime) return "Nunca";
    const date = new Date(syncTime);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Verificar se o plano permite integração com Google Calendar
  const hasCalendarAccess = walkerPlan === 'basic' || walkerPlan === 'professional';
  return <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${hasCalendarAccess ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Calendar className={`h-5 w-5 ${hasCalendarAccess ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Google Calendar
                  {!hasCalendarAccess && <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>}
                  {hasCalendarAccess && isConnected ? <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Conectado
                    </Badge> : hasCalendarAccess ? <Badge variant="outline">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Desconectado
                    </Badge> : null}
                </CardTitle>
                <CardDescription>
                  {!hasCalendarAccess ? "Integração disponível nos planos Básico e Profissional" : isConnected ? "Sincronize seus agendamentos com o Google Calendar" : "Conecte sua conta do Google para sincronizar agendamentos"}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasCalendarAccess ? <div className="space-y-4">
              <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-4 w-4 text-amber-600" />
                  <h4 className="text-sm font-medium text-amber-800">Disponível Plano Básico</h4>
                </div>
                <p className="text-sm text-amber-700 mb-3">
                  A integração com Google Calendar está disponível nos planos Básico e Profissional.
                </p>
                <ul className="text-sm text-amber-700 space-y-1 mb-4">
                  <li>• Visualize agendamentos em qualquer dispositivo</li>
                  <li>• Receba notificações do Google Calendar</li>
                  <li>• Evite conflitos de horário</li>
                  <li>• Sincronização automática com agenda pessoal</li>
                </ul>
              </div>

              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  window.open('/pricing', '_blank');
                }} 
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                <Crown className="h-4 w-4 mr-2" />
                Fazer Upgrade do Plano
              </Button>
            </div> : isConnected ? <>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Última sincronização
                  </p>
                  <p className="text-sm text-green-600">
                    {formatLastSync(lastSyncTime)}
                  </p>
                </div>
                <Button onClick={handleSync} disabled={syncing} size="sm" className="bg-green-600 hover:bg-green-700">
                  {syncing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RotateCcw className="h-4 w-4 mr-2" />}
                  {syncing ? "Sincronizando..." : "Sincronizar Agora"}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowDisconnectDialog(true)} size="sm">
                  <Unlink className="h-4 w-4 mr-2" />
                  Desconectar
                </Button>
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Agendamentos são sincronizados automaticamente</p>
                <p>• Apenas agendamentos dos próximos 30 dias são incluídos</p>
                <p>• Alterações no Google Calendar não afetam seus agendamentos aqui</p>
              </div>
            </> : <div className="space-y-4">
              <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  Benefícios da sincronização:
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Visualize agendamentos em qualquer dispositivo</li>
                  <li>• Receba notificações do Google Calendar</li>
                  <li>• Evite conflitos de horário</li>
                  <li>• Sincronização automática com agenda pessoal</li>
                </ul>
              </div>

              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  handleConnect();
                }} 
                disabled={loading} 
                className="w-full"
              >
                {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Link className="h-4 w-4 mr-2" />}
                {loading ? "Conectando..." : "Conectar Google Calendar"}
              </Button>
            </div>}
        </CardContent>
      </Card>

      {/* Modal de Confirmação de Desconexão */}
      <AlertDialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desconectar Google Calendar</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja desconectar sua conta do Google Calendar?
              Seus agendamentos não serão mais sincronizados automaticamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDisconnect} className="bg-red-600 hover:bg-red-700">
              Desconectar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>;
};
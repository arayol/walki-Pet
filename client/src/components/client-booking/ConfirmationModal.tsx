
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar, Clock, User, MapPin, CreditCard, Loader2 } from "lucide-react";

interface Walker {
  walker_id: string;
  location?: string;
  phone?: string;
  profiles: {
    name: string;
    email: string;
  };
}

interface ServicePlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration?: string;
  includes_playtime: boolean;
  includes_feeding: boolean;
  includes_grooming: boolean;
  includes_bath: boolean;
  walk_count: number;
  is_recurring: boolean;
  recurrence_type?: string;
}

interface SelectedSlot {
  date: string;
  time: string;
  dayOfWeek: number;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  walker: Walker;
  service: ServicePlan;
  selectedSlots: SelectedSlot[];
  isConfirming?: boolean;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  walker,
  service,
  selectedSlots,
  isConfirming = false
}: ConfirmationModalProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // Remove seconds
  };

  const getDayOfWeekName = (dayOfWeek: number) => {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    return days[dayOfWeek];
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);

  const getIncludedServices = () => {
    const included = [];
    if (service.includes_playtime) included.push("Brincadeiras");
    if (service.includes_feeding) included.push("Alimentação");
    if (service.includes_grooming) included.push("Cuidados básicos");
    if (service.includes_bath) included.push("Banho");
    return included;
  };

  const includedServices = getIncludedServices();

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center text-green-600">
            <CheckCircle className="h-6 w-6 mr-2" />
            Confirmar Agendamento
          </AlertDialogTitle>
          <AlertDialogDescription>
            Revise os detalhes do seu agendamento antes de confirmar
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-6">
          {/* Resumo do Serviço */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg text-blue-800 mb-2">{service.name}</h3>
            <p className="text-blue-700 text-sm mb-3">{service.description}</p>
            
            <div className="text-center">
              <div>
                <span className="text-blue-600 font-medium">Passeios inclusos:</span>
                <p className="font-semibold text-lg">{service.walk_count} passeios por mês</p>
              </div>
            </div>

            {includedServices.length > 0 && (
              <div className="mt-3">
                <span className="text-blue-600 font-medium text-sm">Serviços inclusos:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {includedServices.map((service, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Horários Selecionados */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Horários Selecionados ({selectedSlots.length}/{service.walk_count})
            </h4>
            
            <div className="grid grid-cols-1 gap-3">
              {selectedSlots.map((slot, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-800">{formatDate(slot.date)}</p>
                      <p className="text-sm text-gray-500">{getDayOfWeekName(slot.dayOfWeek)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-800">{formatTime(slot.time)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Informações do Walker */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Seu Dog Walker
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-bold text-lg">{walker.profiles?.name}</p>
              {walker.location && (
                <p className="text-gray-600 flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {walker.location}
                </p>
              )}
              {walker.phone && (
                <p className="text-gray-600 mt-1">
                  Contato: {walker.phone}
                </p>
              )}
            </div>
          </div>

          {/* Plano Recorrente Info */}
          {service.is_recurring && service.recurrence_type === 'monthly' && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">📅 Plano Mensal Recorrente</h4>
              <p className="text-sm text-blue-700 mb-3">
                <strong>Os dias da semana selecionados serão reservados nas próximas semanas!</strong>
              </p>
              
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Dias da semana escolhidos:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  {selectedSlots.map((slot, index) => (
                    <li key={index}>
                      <strong>{getDayOfWeekName(slot.dayOfWeek)}</strong> às <strong>{formatTime(slot.time)}</strong>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-3 p-3 bg-blue-100 rounded-md">
                  <p className="font-medium">📍 Como funciona:</p>
                  <p className="mt-1">
                    Todos os <strong>{selectedSlots.map(s => getDayOfWeekName(s.dayOfWeek)).join(', ')}</strong> nos 
                    horários selecionados estarão automaticamente reservados para você durante todo o mês.
                  </p>
                </div>
              </div>
            </div>
          )}

          {service.is_recurring && service.recurrence_type === 'weekly' && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Plano Semanal Recorrente</h4>
              <p className="text-sm text-yellow-700">
                Este agendamento faz parte de um plano semanal. 
                Os próximos {service.walk_count} passeios serão automaticamente agendados 
                nos mesmos dias e horários das próximas semanas.
              </p>
            </div>
          )}

          {/* Plano selecionado */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="text-center">
              <span className="text-lg font-semibold text-blue-800">Plano Selecionado</span>
              <p className="text-blue-600 mt-1">Pagamento do plano completo será processado</p>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="flex flex-col sm:flex-row gap-3">
          <AlertDialogCancel 
            onClick={onClose}
            disabled={isConfirming}
            className="w-full sm:w-auto"
          >
            Revisar Detalhes
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isConfirming}
            className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            {isConfirming ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Confirmando...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Confirmar e Pagar
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

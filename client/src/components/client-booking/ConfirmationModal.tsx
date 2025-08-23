
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

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  walker: Walker;
  service: ServicePlan;
  selectedDate: Date;
  selectedTime: string;
  isConfirming?: boolean;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  walker,
  service,
  selectedDate,
  selectedTime,
  isConfirming = false
}: ConfirmationModalProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
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

          {/* Data e Horário */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-800">Data</p>
                <p className="text-sm text-gray-600">{formatDate(selectedDate)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-800">Horário</p>
                <p className="text-sm text-gray-600">{selectedTime}h</p>
              </div>
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
          {service.is_recurring && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Plano Recorrente</h4>
              <p className="text-sm text-yellow-700">
                Este agendamento faz parte de um plano {service.recurrence_type === 'weekly' ? 'semanal' : 'mensal'}. 
                Os próximos {service.walk_count} passeios serão automaticamente agendados 
                nos mesmos dias e horários das próximas {service.recurrence_type === 'weekly' ? 'semanas' : 'meses'}.
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

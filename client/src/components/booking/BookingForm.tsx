
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Calendar, Clock, DollarSign } from "lucide-react";

interface BookingFormProps {
  walker: {
    name: string;
    services: { name: string; duration: string; price: string }[];
  };
  onClose: () => void;
}

// Generate time options in 15-minute intervals
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      times.push(timeString);
    }
  }
  return times;
};

export const BookingForm = ({ walker, onClose }: BookingFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: "",
    date: "",
    time: "",
    petName: "",
    petBreed: "",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    notes: ""
  });

  const timeOptions = generateTimeOptions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Here we would submit to Supabase
      console.log("Booking submitted:", formData);
      alert("Agendamento solicitado com sucesso! Aguarde confirmação.");
      onClose();
    }
  };

  const selectedService = walker.services.find(s => s.name === formData.service);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {step === 1 && "Escolha o Serviço"}
            {step === 2 && "Data e Horário"}
            {step === 3 && "Dados do Pet e Cliente"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Selecione um serviço:</h3>
                {walker.services.map((service, index) => (
                  <div 
                    key={index}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.service === service.name 
                        ? "border-blue-500 bg-blue-50" 
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setFormData({...formData, service: service.name})}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{service.name}</h4>
                        <p className="text-sm text-gray-600">{service.duration}</p>
                      </div>
                      <span className="text-lg font-bold text-green-600">{service.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="time">Horário</Label>
                  <Select
                    value={formData.time}
                    onValueChange={(value) => setFormData({...formData, time: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o horário" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedService && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Resumo:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Serviço: {selectedService.name}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Duração: {selectedService.duration}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Preço: {selectedService.price}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-4">
                  <h3 className="font-semibold">Dados do Pet:</h3>
                  <div>
                    <Label htmlFor="petName">Nome do Pet</Label>
                    <Input
                      id="petName"
                      value={formData.petName}
                      onChange={(e) => setFormData({...formData, petName: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="petBreed">Raça</Label>
                    <Input
                      id="petBreed"
                      value={formData.petBreed}
                      onChange={(e) => setFormData({...formData, petBreed: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Seus Dados:</h3>
                  <div>
                    <Label htmlFor="clientName">Seu Nome</Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="clientPhone">Telefone</Label>
                    <Input
                      id="clientPhone"
                      type="tel"
                      value={formData.clientPhone}
                      onChange={(e) => setFormData({...formData, clientPhone: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="clientEmail">E-mail</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Observações (opcional)</Label>
                    <Input
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Informações especiais sobre seu pet..."
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                  Voltar
                </Button>
              )}
              <Button 
                type="submit" 
                className="ml-auto"
                disabled={
                  (step === 1 && !formData.service) ||
                  (step === 2 && (!formData.date || !formData.time)) ||
                  (step === 3 && (!formData.petName || !formData.clientName || !formData.clientPhone || !formData.clientEmail))
                }
              >
                {step === 3 ? "Confirmar Agendamento" : "Próximo"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

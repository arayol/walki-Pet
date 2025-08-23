
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock } from "lucide-react";
import { ClientFormData } from "@/types/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface SchedulePreferencesProps {
  formData: ClientFormData;
  onFormDataChange: (data: ClientFormData) => void;
}

const DAYS_OF_WEEK = [
  { id: 'monday', label: 'Segunda-feira' },
  { id: 'tuesday', label: 'Terça-feira' },
  { id: 'wednesday', label: 'Quarta-feira' },
  { id: 'thursday', label: 'Quinta-feira' },
  { id: 'friday', label: 'Sexta-feira' },
  { id: 'saturday', label: 'Sábado' },
  { id: 'sunday', label: 'Domingo' },
];

const TIME_SLOTS = [
  { id: 'morning', label: 'Manhã (6h - 12h)' },
  { id: 'afternoon', label: 'Tarde (12h - 18h)' },
  { id: 'evening', label: 'Noite (18h - 22h)' },
];

export const SchedulePreferences = ({ formData, onFormDataChange }: SchedulePreferencesProps) => {
  const handleDaySelect = (dayId: string) => {
    const isSelected = formData.preferred_days.includes(dayId);
    const updatedDays = isSelected
      ? formData.preferred_days.filter(day => day !== dayId)
      : [...formData.preferred_days, dayId];
    
    onFormDataChange({
      ...formData,
      preferred_days: updatedDays
    });
  };

  const handleTimeSelect = (timeId: string) => {
    const isSelected = formData.preferred_times.includes(timeId);
    const updatedTimes = isSelected
      ? formData.preferred_times.filter(time => time !== timeId)
      : [...formData.preferred_times, timeId];
    
    onFormDataChange({
      ...formData,
      preferred_times: updatedTimes
    });
  };

  const removeDayTag = (dayId: string) => {
    const updatedDays = formData.preferred_days.filter(day => day !== dayId);
    onFormDataChange({
      ...formData,
      preferred_days: updatedDays
    });
  };

  const removeTimeTag = (timeId: string) => {
    const updatedTimes = formData.preferred_times.filter(time => time !== timeId);
    onFormDataChange({
      ...formData,
      preferred_times: updatedTimes
    });
  };

  const handleNotesChange = (value: string) => {
    onFormDataChange({
      ...formData,
      additional_schedule_notes: value
    });
  };

  const getDayLabel = (dayId: string) => {
    return DAYS_OF_WEEK.find(day => day.id === dayId)?.label || dayId;
  };

  const getTimeLabel = (timeId: string) => {
    return TIME_SLOTS.find(time => time.id === timeId)?.label || timeId;
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
          Preferências de Horário
        </CardTitle>
        <p className="text-sm text-gray-600">
          Selecione os dias e horários que mais se adequam à sua rotina
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-base font-medium">
              Dias da semana preferidos
            </Label>
            <Select onValueChange={handleDaySelect}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione os dias" />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((day) => (
                  <SelectItem 
                    key={day.id} 
                    value={day.id}
                    disabled={formData.preferred_days.includes(day.id)}
                  >
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2">
              {formData.preferred_days.map((dayId) => (
                <Badge key={dayId} variant="secondary" className="flex items-center gap-1">
                  {getDayLabel(dayId)}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-red-500" 
                    onClick={() => removeDayTag(dayId)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Horários preferidos
            </Label>
            <Select onValueChange={handleTimeSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione os horários" />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((time) => (
                  <SelectItem 
                    key={time.id} 
                    value={time.id}
                    disabled={formData.preferred_times.includes(time.id)}
                  >
                    {time.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2">
              {formData.preferred_times.map((timeId) => (
                <Badge key={timeId} variant="secondary" className="flex items-center gap-1">
                  {getTimeLabel(timeId)}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-red-500" 
                    onClick={() => removeTimeTag(timeId)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="additional_schedule_notes" className="text-base font-medium">
            Observações sobre horários
          </Label>
          <Textarea
            id="additional_schedule_notes"
            rows={3}
            placeholder="Ex: Prefiro passeios pela manhã nos fins de semana, posso ser flexível com horários em emergências..."
            value={formData.additional_schedule_notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};

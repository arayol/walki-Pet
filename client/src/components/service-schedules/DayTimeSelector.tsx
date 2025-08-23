
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface DayTimeSlot {
  days: number[];
  hora_inicio: string;
  hora_fim: string;
  capacidade_maxima: number;
}

interface DayTimeSelectorProps {
  onSave: (slots: DayTimeSlot[]) => void;
  onCancel: () => void;
}

const DIAS_SEMANA = [
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
  { value: 7, label: 'Domingo' },
];

export const DayTimeSelector = ({ onSave, onCancel }: DayTimeSelectorProps) => {
  const [slots, setSlots] = useState<DayTimeSlot[]>([
    {
      days: [],
      hora_inicio: '09:00',
      hora_fim: '17:00',
      capacidade_maxima: 1
    }
  ]);

  const addSlot = () => {
    setSlots([...slots, {
      days: [],
      hora_inicio: '09:00',
      hora_fim: '17:00',
      capacidade_maxima: 1
    }]);
  };

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const updateSlot = (index: number, field: keyof DayTimeSlot, value: any) => {
    const newSlots = [...slots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setSlots(newSlots);
  };

  const toggleDay = (slotIndex: number, day: number) => {
    const newSlots = [...slots];
    const currentDays = newSlots[slotIndex].days;
    
    if (currentDays.includes(day)) {
      newSlots[slotIndex].days = currentDays.filter(d => d !== day);
    } else {
      newSlots[slotIndex].days = [...currentDays, day].sort();
    }
    
    setSlots(newSlots);
  };

  const handleSave = () => {
    // Validar se todos os slots têm pelo menos um dia selecionado
    const validSlots = slots.filter(slot => 
      slot.days.length > 0 && 
      slot.hora_inicio < slot.hora_fim &&
      slot.capacidade_maxima > 0
    );
    
    if (validSlots.length === 0) {
      alert('Por favor, configure pelo menos um horário válido.');
      return;
    }
    
    onSave(validSlots);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Configurar Horários</h3>
        <Button onClick={addSlot} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Horário
        </Button>
      </div>

      {slots.map((slot, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Horário {index + 1}</CardTitle>
              {slots.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSlot(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Seleção de dias */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Selecione os dias da semana *
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {DIAS_SEMANA.map((dia) => (
                  <div key={dia.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${index}-${dia.value}`}
                      checked={slot.days.includes(dia.value)}
                      onCheckedChange={() => toggleDay(index, dia.value)}
                    />
                    <Label 
                      htmlFor={`day-${index}-${dia.value}`} 
                      className="text-sm cursor-pointer"
                    >
                      {dia.label}
                    </Label>
                  </div>
                ))}
              </div>
              {slot.days.length === 0 && (
                <p className="text-sm text-red-600 mt-1">
                  Selecione pelo menos um dia da semana
                </p>
              )}
            </div>

            {/* Horários */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`inicio-${index}`}>Hora de Início</Label>
                <Input
                  id={`inicio-${index}`}
                  type="time"
                  value={slot.hora_inicio}
                  onChange={(e) => updateSlot(index, 'hora_inicio', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`fim-${index}`}>Hora de Fim</Label>
                <Input
                  id={`fim-${index}`}
                  type="time"
                  value={slot.hora_fim}
                  onChange={(e) => updateSlot(index, 'hora_fim', e.target.value)}
                />
              </div>
            </div>

            {/* Capacidade */}
            <div>
              <Label htmlFor={`capacidade-${index}`}>Capacidade Máxima</Label>
              <Input
                id={`capacidade-${index}`}
                type="number"
                min="1"
                value={slot.capacidade_maxima}
                onChange={(e) => updateSlot(index, 'capacidade_maxima', parseInt(e.target.value) || 1)}
                className="max-w-xs"
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex gap-2 pt-4">
        <Button onClick={handleSave} className="flex-1">
          Salvar Horários
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};

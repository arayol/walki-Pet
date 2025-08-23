import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WalkSlot {
  date: string;
  time: string;
}

interface WalkSlotSelectorProps {
  selectedSlots: WalkSlot[];
  onSlotsChange: (slots: WalkSlot[]) => void;
  maxSlots: number;
}

export const WalkSlotSelector = ({ selectedSlots, onSlotsChange, maxSlots }: WalkSlotSelectorProps) => {
  const [newSlot, setNewSlot] = useState<WalkSlot>({ date: "", time: "" });

  // Generate time options in 30-minute intervals
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 6; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const addSlot = () => {
    if (newSlot.date && newSlot.time && selectedSlots.length < maxSlots) {
      const slotExists = selectedSlots.some(
        slot => slot.date === newSlot.date && slot.time === newSlot.time
      );
      
      if (!slotExists) {
        onSlotsChange([...selectedSlots, newSlot]);
        setNewSlot({ date: "", time: "" });
      }
    }
  };

  const removeSlot = (index: number) => {
    const updatedSlots = selectedSlots.filter((_, i) => i !== index);
    onSlotsChange(updatedSlots);
  };

  return (
    <div className="space-y-4">
      <Label>Datas e Horários dos Passeios *</Label>
      
      {/* Add new slot */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Horário ({selectedSlots.length}/{maxSlots})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-date">Data</Label>
              <Input
                id="new-date"
                type="date"
                value={newSlot.date}
                onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-time">Horário</Label>
              <Select 
                value={newSlot.time} 
                onValueChange={(time) => setNewSlot({ ...newSlot, time })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {timeOptions.map((timeOption) => (
                    <SelectItem key={timeOption} value={timeOption}>
                      {timeOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                type="button"
                onClick={addSlot}
                disabled={!newSlot.date || !newSlot.time || selectedSlots.length >= maxSlots}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected slots */}
      {selectedSlots.length > 0 && (
        <div className="space-y-2">
          <Label>Horários Selecionados:</Label>
          <div className="space-y-2">
            {selectedSlots.map((slot, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(slot.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{slot.time}</span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSlot(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
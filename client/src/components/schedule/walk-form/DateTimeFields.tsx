
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DateTimeFieldsProps {
  date: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
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

export const DateTimeFields = ({ date, time, onDateChange, onTimeChange }: DateTimeFieldsProps) => {
  const timeOptions = generateTimeOptions();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="date">Data *</Label>
        <Input
          id="date"
          type="date"
          required
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="time">Horário *</Label>
        <Select value={time} onValueChange={onTimeChange} required>
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
    </div>
  );
};

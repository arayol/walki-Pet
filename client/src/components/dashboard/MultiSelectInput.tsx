import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

interface MultiSelectInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}

export const MultiSelectInput = ({ 
  label, 
  values, 
  onChange, 
  placeholder = "Digite para adicionar...",
  suggestions = []
}: MultiSelectInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const addValue = (value: string = inputValue) => {
    const trimmedValue = value.trim();
    if (trimmedValue && !values.includes(trimmedValue)) {
      onChange([...values, trimmedValue]);
      setInputValue("");
    }
  };

  const removeValue = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addValue();
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>
      
      {/* Tags existentes */}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((value, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {value}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeValue(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input para adicionar */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addValue()}
          disabled={!inputValue.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Sugestões */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Label className="text-xs text-gray-600">Sugestões:</Label>
          {suggestions
            .filter(suggestion => !values.includes(suggestion))
            .map((suggestion, index) => (
              <Button
                key={index}
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => addValue(suggestion)}
              >
                + {suggestion}
              </Button>
            ))}
        </div>
      )}
    </div>
  );
};
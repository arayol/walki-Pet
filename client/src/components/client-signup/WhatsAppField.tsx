
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WhatsAppFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const WhatsAppField = ({ value, onChange, error }: WhatsAppFieldProps) => {
  const [inputValue, setInputValue] = useState(value.replace('+55', ''));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove todos os caracteres não numéricos
    const numbers = e.target.value.replace(/\D/g, '');
    
    // Limita a 10 dígitos (DDD + número)
    const limitedNumbers = numbers.substring(0, 10);
    
    setInputValue(limitedNumbers);
    onChange('+55' + limitedNumbers);
  };

  const formatDisplay = (numbers: string) => {
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.substring(0, 2)}) ${numbers.substring(2)}`;
    return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7)}`;
  };

  const isValid = inputValue.length === 10;

  return (
    <div className="space-y-2">
      <Label htmlFor="emergency_contact">
        Contato de Emergência (WhatsApp) *
      </Label>
      <div className="flex">
        <div className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-sm text-gray-600">
          +55
        </div>
        <Input
          id="emergency_contact"
          type="text"
          value={formatDisplay(inputValue)}
          onChange={handleInputChange}
          placeholder="(11) 98765-4321"
          className={`rounded-l-none ${!isValid && inputValue.length > 0 ? 'border-red-500' : ''}`}
          maxLength={15} // Formatado: (11) 98765-4321
        />
      </div>
      {!isValid && inputValue.length > 0 && (
        <p className="text-sm text-red-500">
          Número incompleto! Digite 10 dígitos (DDD + número)
        </p>
      )}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

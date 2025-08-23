
interface PriceDisplayProps {
  price: number;
  isRecurring: boolean;
  recurrenceType: string | null;
}

export const PriceDisplay = ({ price, isRecurring, recurrenceType }: PriceDisplayProps) => {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getRecurrenceText = () => {
    if (!isRecurring) return '';
    return recurrenceType === 'weekly' ? '/semana' : '/mês';
  };

  return (
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-bold text-green-600">
        {formatPrice(price)}
      </span>
      {isRecurring && (
        <span className="text-sm text-gray-500">
          {getRecurrenceText()}
        </span>
      )}
    </div>
  );
};

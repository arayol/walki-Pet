
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('pt-BR');
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'paid':
    case 'completed':
    case 'confirmado':
      return 'bg-green-100 text-green-800';
    case 'scheduled':
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'scheduled':
      return 'Agendado';
    case 'in_progress':
      return 'Em andamento';
    case 'completed':
      return 'Concluído';
    case 'cancelled':
      return 'Cancelado';
    case 'confirmado':
      return 'Confirmado';
    case 'paid':
      return 'Pago';
    case 'pending':
      return 'Pendente';
    case 'failed':
      return 'Falhado';
    default:
      return status;
  }
};

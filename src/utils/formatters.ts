// Formatting utilities

export const formatCPF = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  return value;
};

export const formatZipCode = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
};

export const formatPrice = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatCardNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
};

export const maskCardNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length < 4) return value;
  
  const lastFour = numbers.slice(-4);
  return `**** **** **** ${lastFour}`;
};

export const formatWeight = (grams: number): string => {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(1)} kg`;
  }
  return `${grams} g`;
};

export const formatDimensions = (dimensions: { height: number; width: number; depth: number }): string => {
  return `${dimensions.height} x ${dimensions.width} x ${dimensions.depth} cm`;
};

export const formatOrderStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'EM_PROCESSAMENTO': 'Em Processamento',
    'APROVADO': 'Aprovado',
    'EM_TRANSITO': 'Em Trânsito',
    'ENTREGUE': 'Entregue',
    'CANCELADO': 'Cancelado'
  };
  
  return statusMap[status] || status;
};

export const formatAddressType = (type: string): string => {
  const typeMap: Record<string, string> = {
    'ENTREGA': 'Entrega',
    'COBRANCA': 'Cobrança',
    'AMBOS': 'Entrega e Cobrança'
  };
  
  return typeMap[type] || type;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const removeAccents = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const generateOrderCode = (id: string): string => {
  return `PED${id.padStart(6, '0')}`;
};

export const generateCustomerCode = (id: string): string => {
  return `CLI${id.padStart(3, '0')}`;
};
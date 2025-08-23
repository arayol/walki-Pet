// ===== VALIDAÇÃO DE CPF COM ALGORITMO OFICIAL BRASILEIRO =====
export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  if (cleanCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Algoritmo de validação dos dígitos verificadores
  let sum = 0, remainder;
  for (let i = 1; i <= 9; i++) sum += parseInt(cleanCPF.substring(i-1, i)) * (11 - i);
  remainder = (sum * 10) % 11;
  if ((remainder === 10) || (remainder === 11)) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;
  
  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cleanCPF.substring(i-1, i)) * (12 - i);
  remainder = (sum * 10) % 11;
  if ((remainder === 10) || (remainder === 11)) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;
  
  return true;
};

export const formatCPF = (cpf: string): string => {
  const cleanValue = cpf.replace(/\D/g, '');
  return cleanValue
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

// ===== VALIDAÇÃO E FORMATAÇÃO DE TELEFONE BRASILEIRO =====
export const formatPhoneBR = (phone: string): string => {
  const cleanValue = phone.replace(/\D/g, '');
  
  if (cleanValue.length <= 2) {
    return `(${cleanValue}`;
  } else if (cleanValue.length <= 3) {
    return `(${cleanValue.substring(0, 2)}) ${cleanValue.substring(2)}`;
  } else if (cleanValue.length <= 7) {
    return `(${cleanValue.substring(0, 2)}) ${cleanValue.substring(2, 3)} ${cleanValue.substring(3)}`;
  } else {
    return `(${cleanValue.substring(0, 2)}) ${cleanValue.substring(2, 3)} ${cleanValue.substring(3, 7)}-${cleanValue.substring(7, 11)}`;
  }
};

export const validatePhoneBR = (phone: string): boolean => {
  // Remove todos os caracteres não numéricos
  const cleanPhone = phone.replace(/[^\d]/g, '');
  
  // Verifica se tem 10 ou 11 dígitos (com DDD)
  if (cleanPhone.length < 10 || cleanPhone.length > 11) return false;
  
  // Verifica se o DDD é válido (11 a 99)
  const ddd = parseInt(cleanPhone.substring(0, 2));
  const validDDDs = [11,12,13,14,15,16,17,18,19,21,22,24,27,28,31,32,33,34,35,37,38,41,42,43,44,45,46,47,48,49,51,53,54,55,61,62,63,64,65,66,67,68,69,71,73,74,75,77,79,81,82,83,84,85,86,87,88,89,91,92,93,94,95,96,97,98,99];
  if (!validDDDs.includes(ddd)) return false;
  
  // Se tem 11 dígitos, o primeiro dígito do número deve ser 9 (celular)
  if (cleanPhone.length === 11 && cleanPhone.charAt(2) !== '9') return false;
  
  return true;
};

// ===== VALIDAÇÕES ADICIONAIS PARA LGPD =====
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.includes('@') && email.length >= 5;
};

export const validateFullName = (fullName: string): { isValid: boolean, message: string } => {
  const trimmedName = fullName.trim();
  
  if (trimmedName.length < 2) {
    return { isValid: false, message: 'Nome deve ter pelo menos 2 caracteres' };
  }
  
  const nameParts = trimmedName.split(' ').filter(part => part.length > 0);
  
  if (nameParts.length < 2) {
    return { isValid: false, message: 'Digite nome e sobrenome completos' };
  }
  
  if (nameParts.some(part => part.length < 2)) {
    return { isValid: false, message: 'Nome e sobrenome devem ter pelo menos 2 caracteres cada' };
  }
  
  if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(trimmedName)) {
    return { isValid: false, message: 'Nome deve conter apenas letras' };
  }
  
  return { isValid: true, message: '' };
};

export const validatePassword = (password: string): { isValid: boolean, message: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'Senha deve ter pelo menos 6 caracteres' };
  }
  
  if (password.length > 128) {
    return { isValid: false, message: 'Senha muito longa (máximo 128 caracteres)' };
  }
  
  return { isValid: true, message: '' };
};

export const validatePasswordMatch = (password: string, confirmPassword: string): { isValid: boolean, message: string } => {
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Senhas não coincidem' };
  }
  return { isValid: true, message: '' };
};

// ===== FORMATAÇÃO DE TELEFONE PARA EXIBIÇÃO =====
export const formatPhoneDisplay = (phone: string): string => {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  if (cleanPhone.length === 10) {
    return `+55 (${cleanPhone.substring(0, 2)}) ${cleanPhone.substring(2, 6)}-${cleanPhone.substring(6)}`;
  } else if (cleanPhone.length === 11) {
    return `+55 (${cleanPhone.substring(0, 2)}) ${cleanPhone.substring(2, 3)} ${cleanPhone.substring(3, 7)}-${cleanPhone.substring(7)}`;
  }
  return phone;
};
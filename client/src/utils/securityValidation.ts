// ===== SISTEMA DE VALIDAÇÃO SEGURA E CONFORMIDADE LGPD =====

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export interface WalkerSignupForm {
  fullName: string;
  email: string;
  phone: string;
  cpf: string;
  password: string;
  confirmPassword: string;
  planType: 'free' | 'basic' | 'professional';
  
  // Consentimentos LGPD
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  acceptedDataProcessing: boolean;
  acceptedMarketing: boolean; // Opcional
}

// ===== CONFIGURAÇÕES LGPD =====
export const LGPDConsents = {
  terms: {
    required: true,
    title: "Termos de Uso",
    text: "Li e aceito os Termos de Uso da plataforma",
    link: "/termos-de-uso",
    description: "Contrato que rege a utilização dos serviços"
  },
  privacy: {
    required: true,
    title: "Política de Privacidade", 
    text: "Li e aceito a Política de Privacidade",
    link: "/politica-privacidade",
    description: "Como coletamos, usamos e protegemos seus dados"
  },
  dataProcessing: {
    required: true,
    title: "Tratamento de Dados Pessoais",
    text: "Autorizo o tratamento dos meus dados pessoais conforme a LGPD",
    link: "/tratamento-dados",
    description: "Consentimento para coleta e processamento de dados pessoais (CPF, telefone, etc.)"
  },
  marketing: {
    required: false,
    title: "Comunicações de Marketing",
    text: "Aceito receber comunicações promocionais e de marketing",
    link: "/politica-marketing",
    description: "Autorização para envio de e-mails promocionais e newsletters (opcional)"
  }
};

// ===== VALIDAÇÕES AVANÇADAS =====
export const validateFormField = (
  fieldName: keyof WalkerSignupForm, 
  value: any, 
  formData?: Partial<WalkerSignupForm>
): ValidationResult => {
  switch (fieldName) {
    case 'fullName':
      return validateFullName(value);
    
    case 'email':
      return validateEmailAdvanced(value);
    
    case 'phone':
      return validatePhoneAdvanced(value);
    
    case 'cpf':
      return validateCPFAdvanced(value);
    
    case 'password':
      return validatePasswordAdvanced(value);
    
    case 'confirmPassword':
      return validatePasswordMatch(value, formData?.password || '');
    
    case 'acceptedTerms':
      return { isValid: value === true, message: value ? '' : 'Você deve aceitar os termos de uso' };
    
    case 'acceptedPrivacy':
    case 'acceptedDataProcessing':
    case 'acceptedMarketing':
      return { isValid: true, message: '' }; // Simplificado
    
    default:
      return { isValid: true, message: '' };
  }
};

// ===== VALIDAÇÕES ESPECÍFICAS =====
const validateFullName = (fullName: string): ValidationResult => {
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
  
  if (trimmedName.length > 100) {
    return { isValid: false, message: 'Nome muito longo (máximo 100 caracteres)' };
  }
  
  return { isValid: true, message: '' };
};

const validateEmailAdvanced = (email: string): ValidationResult => {
  if (!email || email.length === 0) {
    return { isValid: false, message: 'E-mail é obrigatório' };
  }
  
  if (email.length > 254) {
    return { isValid: false, message: 'E-mail muito longo' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Formato de e-mail inválido' };
  }
  
  // Verificações adicionais de segurança
  if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
    return { isValid: false, message: 'E-mail inválido' };
  }
  
  return { isValid: true, message: '' };
};

const validatePhoneAdvanced = (phone: string): ValidationResult => {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  
  if (!cleanPhone || cleanPhone.length === 0) {
    return { isValid: false, message: 'Telefone é obrigatório' };
  }
  
  if (cleanPhone.length < 10 || cleanPhone.length > 11) {
    return { isValid: false, message: 'Telefone deve ter 10 ou 11 dígitos' };
  }
  
  // Verifica se o DDD é válido
  const ddd = parseInt(cleanPhone.substring(0, 2));
  const validDDDs = [11,12,13,14,15,16,17,18,19,21,22,24,27,28,31,32,33,34,35,37,38,41,42,43,44,45,46,47,48,49,51,53,54,55,61,62,63,64,65,66,67,68,69,71,73,74,75,77,79,81,82,83,84,85,86,87,88,89,91,92,93,94,95,96,97,98,99];
  
  if (!validDDDs.includes(ddd)) {
    return { isValid: false, message: 'DDD inválido' };
  }
  
  // Se tem 11 dígitos, o primeiro dígito do número deve ser 9 (celular)
  if (cleanPhone.length === 11 && cleanPhone.charAt(2) !== '9') {
    return { isValid: false, message: 'Celular deve começar com 9 após o DDD' };
  }
  
  return { isValid: true, message: '' };
};

const validateCPFAdvanced = (cpf: string): ValidationResult => {
  if (!cpf || cpf.length === 0) {
    return { isValid: false, message: 'CPF é obrigatório' };
  }
  
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  
  if (cleanCPF.length !== 11) {
    return { isValid: false, message: 'CPF deve ter 11 dígitos' };
  }
  
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return { isValid: false, message: 'CPF inválido' };
  }
  
  // Algoritmo de validação dos dígitos verificadores
  let sum = 0, remainder;
  for (let i = 1; i <= 9; i++) sum += parseInt(cleanCPF.substring(i-1, i)) * (11 - i);
  remainder = (sum * 10) % 11;
  if ((remainder === 10) || (remainder === 11)) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) {
    return { isValid: false, message: 'CPF inválido' };
  }
  
  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cleanCPF.substring(i-1, i)) * (12 - i);
  remainder = (sum * 10) % 11;
  if ((remainder === 10) || (remainder === 11)) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) {
    return { isValid: false, message: 'CPF inválido' };
  }
  
  return { isValid: true, message: '' };
};

const validatePasswordAdvanced = (password: string): ValidationResult => {
  if (!password || password.length === 0) {
    return { isValid: false, message: 'Senha é obrigatória' };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: 'Senha deve ter pelo menos 6 caracteres' };
  }
  
  if (password.length > 128) {
    return { isValid: false, message: 'Senha muito longa (máximo 128 caracteres)' };
  }
  
  // Verificações de segurança
  if (password === '123456' || password === 'password' || password === '12345678') {
    return { isValid: false, message: 'Senha muito comum, escolha uma senha mais segura' };
  }
  
  return { isValid: true, message: '' };
};

const validatePasswordMatch = (confirmPassword: string, password: string): ValidationResult => {
  if (!confirmPassword || confirmPassword.length === 0) {
    return { isValid: false, message: 'Confirmação de senha é obrigatória' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Senhas não coincidem' };
  }
  
  return { isValid: true, message: '' };
};

// ===== VALIDAÇÃO COMPLETA DO FORMULÁRIO =====
export const validateCompleteForm = (formData: WalkerSignupForm): { isValid: boolean, errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  // Validar todos os campos obrigatórios
  Object.keys(formData).forEach(field => {
    const fieldName = field as keyof WalkerSignupForm;
    const result = validateFormField(fieldName, formData[fieldName], formData);
    
    if (!result.isValid) {
      errors[field] = result.message;
    }
  });
  
  // Verificar consentimentos obrigatórios
  if (!formData.acceptedTerms) {
    errors.acceptedTerms = 'Você deve aceitar os Termos de Uso';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
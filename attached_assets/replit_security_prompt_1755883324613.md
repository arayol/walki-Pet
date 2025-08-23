# 🔐 PROMPT PARA REPLIT: Sistema de Cadastro Seguro com Conformidade LGPD

## 📋 OBJETIVO
Implementar um sistema de cadastro seguro na rota `/plan-signup` para DogWalkers com validações robustas e conformidade total com a LGPD (Lei nº 13.709/2018) para proteção de dados pessoais sensíveis, incluindo CPF, telefone e informações pessoais.

## 🛡️ REQUISITOS DE SEGURANÇA E VALIDAÇÃO

### **1. VALIDAÇÃO E CRIPTOGRAFIA DE CPF (Conformidade LGPD)**

Implementar sistema completo de proteção para CPF com algoritmo oficial brasileiro:

```typescript
// Validação de CPF com algoritmo oficial
function validateCPF(cpf: string): boolean {
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
}

// Criptografia AES-256-GCM para CPF (conformidade LGPD)
import crypto from 'crypto';

function encryptCPF(cpf: string): { encrypted: string, hash: string } {
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  const key = crypto.pbkdf2Sync(process.env.ENCRYPTION_SECRET!, 'salt', 10000, 32, 'sha256');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher('aes-256-gcm', key);
  
  let encrypted = cipher.update(cleanCPF, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted: iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted,
    hash: crypto.createHash('sha256').update(cleanCPF).digest('hex') // Para consultas sem descriptografia
  };
}

// Função para descriptografar (apenas quando necessário)
function decryptCPF(encryptedData: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
  const key = crypto.pbkdf2Sync(process.env.ENCRYPTION_SECRET!, 'salt', 10000, 32, 'sha256');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipher('aes-256-gcm', key);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

### **2. VALIDAÇÃO DE TELEFONE BRASILEIRO (+55 AUTOMÁTICO)**

```typescript
function validateBrazilianPhone(phone: string): boolean {
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
}

function formatPhoneNumber(phone: string): string {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  if (cleanPhone.length === 10) {
    return `+55 (${cleanPhone.substring(0, 2)}) ${cleanPhone.substring(2, 6)}-${cleanPhone.substring(6)}`;
  } else if (cleanPhone.length === 11) {
    return `+55 (${cleanPhone.substring(0, 2)}) ${cleanPhone.substring(2, 3)} ${cleanPhone.substring(3, 7)}-${cleanPhone.substring(7)}`;
  }
  return phone;
}

// Máscara para input em tempo real
function applyPhoneMask(value: string): string {
  const cleanValue = value.replace(/\D/g, '');
  
  if (cleanValue.length <= 2) {
    return `(${cleanValue}`;
  } else if (cleanValue.length <= 3) {
    return `(${cleanValue.substring(0, 2)}) ${cleanValue.substring(2)}`;
  } else if (cleanValue.length <= 7) {
    return `(${cleanValue.substring(0, 2)}) ${cleanValue.substring(2, 3)} ${cleanValue.substring(3)}`;
  } else {
    return `(${cleanValue.substring(0, 2)}) ${cleanValue.substring(2, 3)} ${cleanValue.substring(3, 7)}-${cleanValue.substring(7, 11)}`;
  }
}
```

### **3. VALIDAÇÃO DE EMAIL, NOME E SENHA**

```typescript
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.includes('@') && email.length >= 5;
}

function validateName(name: string): { isValid: boolean, message: string } {
  const trimmedName = name.trim();
  
  if (trimmedName.length < 2) {
    return { isValid: false, message: 'Nome deve ter pelo menos 2 caracteres' };
  }
  
  if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(trimmedName)) {
    return { isValid: false, message: 'Nome deve conter apenas letras' };
  }
  
  return { isValid: true, message: '' };
}

function validateFullName(fullName: string): { isValid: boolean, message: string } {
  const nameParts = fullName.trim().split(' ').filter(part => part.length > 0);
  
  if (nameParts.length < 2) {
    return { isValid: false, message: 'Digite nome e sobrenome' };
  }
  
  if (nameParts.some(part => part.length < 2)) {
    return { isValid: false, message: 'Nome e sobrenome devem ter pelo menos 2 caracteres cada' };
  }
  
  if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(fullName)) {
    return { isValid: false, message: 'Nome deve conter apenas letras' };
  }
  
  return { isValid: true, message: '' };
}

function validatePassword(password: string): { isValid: boolean, message: string } {
  if (password.length < 6) {
    return { isValid: false, message: 'Senha deve ter pelo menos 6 caracteres' };
  }
  
  // Opcional: validações mais rigorosas
  // if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
  //   return { isValid: false, message: 'Senha deve conter ao menos: 1 letra minúscula, 1 maiúscula e 1 número' };
  // }
  
  return { isValid: true, message: '' };
}

function validatePasswordMatch(password: string, confirmPassword: string): { isValid: boolean, message: string } {
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Senhas não coincidem' };
  }
  return { isValid: true, message: '' };
}
```

## 🗄️ ESTRUTURA DE BANCO SEGURA (LGPD)

```sql
-- Tabela principal com dados criptografados
CREATE TABLE walkers (
  walker_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name_encrypted TEXT NOT NULL,           -- Nome criptografado
  phone_encrypted TEXT NOT NULL,          -- Telefone criptografado
  cpf_encrypted TEXT NOT NULL,            -- CPF criptografado (AES-256)
  cpf_hash TEXT UNIQUE NOT NULL,          -- Hash do CPF para consultas
  password_hash TEXT NOT NULL,            -- Senha hasheada
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'premium')),
  slug TEXT UNIQUE,                       -- URL personalizada
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Conformidade LGPD
  consent_terms BOOLEAN DEFAULT false,
  consent_privacy BOOLEAN DEFAULT false,
  consent_data_processing BOOLEAN DEFAULT false,
  consent_marketing BOOLEAN DEFAULT false,
  consent_date TIMESTAMPTZ,
  data_retention_until DATE DEFAULT (CURRENT_DATE + INTERVAL '5 years'),
  
  -- Auditoria LGPD
  last_access TIMESTAMPTZ,
  access_count INTEGER DEFAULT 0
);

-- Tabela de auditoria LGPD
CREATE TABLE data_access_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES walkers(walker_id),
  action TEXT NOT NULL, -- 'CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN'
  data_type TEXT NOT NULL, -- 'CPF', 'PHONE', 'EMAIL', 'PROFILE'
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance sem exposição de dados
CREATE INDEX idx_walkers_cpf_hash ON walkers(cpf_hash);
CREATE INDEX idx_walkers_email ON walkers(email);
CREATE INDEX idx_walkers_slug ON walkers(slug);
CREATE INDEX idx_audit_logs_user_date ON data_access_logs(user_id, timestamp);

-- RLS para proteção adicional
ALTER TABLE walkers ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_access_logs ENABLE ROW LEVEL SECURITY;

-- Policies de segurança
CREATE POLICY "Usuarios podem ver apenas seus dados" ON walkers
  FOR SELECT USING (walker_id = current_user_id());

CREATE POLICY "Usuarios podem atualizar apenas seus dados" ON walkers
  FOR UPDATE USING (walker_id = current_user_id());

-- Trigger para auditoria automática
CREATE OR REPLACE FUNCTION log_data_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO data_access_logs (user_id, action, data_type, timestamp)
  VALUES (NEW.walker_id, TG_OP, 'PROFILE', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER walker_audit_trigger
  AFTER INSERT OR UPDATE ON walkers
  FOR EACH ROW EXECUTE FUNCTION log_data_access();
```

## 📝 FORMULÁRIO COM VALIDAÇÕES EM TEMPO REAL

```typescript
interface WalkerSignupForm {
  fullName: string;
  email: string;
  phone: string;
  cpf: string;
  password: string;
  confirmPassword: string;
  planType: 'free' | 'pro' | 'premium';
  
  // Consentimentos LGPD
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  acceptedDataProcessing: boolean;
  acceptedMarketing: boolean; // Opcional
}

// Configuração de validações
const validationConfig = {
  fullName: {
    required: true,
    validator: validateFullName,
    realTime: true
  },
  email: {
    required: true,
    validator: validateEmail,
    realTime: true
  },
  phone: {
    required: true,
    validator: validateBrazilianPhone,
    mask: applyPhoneMask,
    realTime: true
  },
  cpf: {
    required: true,
    validator: validateCPF,
    mask: applyCPFMask,
    realTime: true
  },
  password: {
    required: true,
    validator: validatePassword,
    realTime: true
  },
  confirmPassword: {
    required: true,
    validator: (value: string, formData: WalkerSignupForm) => 
      validatePasswordMatch(formData.password, value),
    realTime: true
  }
};

// Máscaras para inputs
function applyCPFMask(value: string): string {
  const cleanValue = value.replace(/\D/g, '');
  return cleanValue
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
}

// Hook customizado para validação em tempo real
function useFormValidation(initialData: WalkerSignupForm) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  const validateField = (fieldName: keyof WalkerSignupForm, value: any) => {
    const config = validationConfig[fieldName];
    if (config && config.validator) {
      const result = config.validator(value, formData);
      const fieldError = typeof result === 'boolean' 
        ? (result ? '' : `${fieldName} inválido`) 
        : (result.isValid ? '' : result.message);
      
      setErrors(prev => ({
        ...prev,
        [fieldName]: fieldError
      }));
    }
  };

  const updateField = (fieldName: keyof WalkerSignupForm, value: any) => {
    // Aplicar máscara se existir
    const config = validationConfig[fieldName];
    const maskedValue = config?.mask ? config.mask(value) : value;
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: maskedValue
    }));

    // Validação em tempo real
    if (config?.realTime) {
      validateField(fieldName, maskedValue);
    }
  };

  return { formData, errors, isValid, updateField, validateField };
}
```

## 🔒 IMPLEMENTAÇÃO DE CONFORMIDADE LGPD

### **Consentimentos Obrigatórios e Opcionais:**

```typescript
const LGPDConsents = {
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
    description: "Seus dados serão utilizados exclusivamente para prestação dos serviços contratados, incluindo:",
    details: [
      "Criação e manuten
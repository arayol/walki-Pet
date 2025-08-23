import { useState, useCallback } from 'react';
import { 
  WalkerSignupForm, 
  ValidationResult, 
  validateFormField, 
  validateCompleteForm 
} from '@/utils/securityValidation';
import { formatCPF, formatPhoneBR } from '@/utils/cpfValidator';

interface FormErrors {
  [key: string]: string;
}

interface UseSecureFormValidationReturn {
  formData: WalkerSignupForm;
  errors: FormErrors;
  isValid: boolean;
  isFieldValid: (fieldName: keyof WalkerSignupForm) => boolean;
  updateField: (fieldName: keyof WalkerSignupForm, value: any) => void;
  validateField: (fieldName: keyof WalkerSignupForm) => ValidationResult;
  validateAll: () => { isValid: boolean; errors: FormErrors };
  resetForm: () => void;
  hasError: (fieldName: keyof WalkerSignupForm) => boolean;
}

const initialFormData: WalkerSignupForm = {
  fullName: '',
  email: '',
  phone: '',
  cpf: '',
  password: '',
  confirmPassword: '',
  planType: 'free',
  acceptedTerms: false,
  acceptedPrivacy: false,
  acceptedDataProcessing: false,
  acceptedMarketing: false,
};

export const useSecureFormValidation = (
  planType: 'free' | 'basic' | 'professional' = 'free'
): UseSecureFormValidationReturn => {
  const [formData, setFormData] = useState<WalkerSignupForm>({
    ...initialFormData,
    planType
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Aplicar máscaras nos campos
  const applyMask = useCallback((fieldName: keyof WalkerSignupForm, value: string): string => {
    switch (fieldName) {
      case 'cpf':
        return formatCPF(value);
      case 'phone':
        return formatPhoneBR(value);
      case 'fullName':
        // Capitalizar primeira letra de cada palavra
        return value.replace(/\b\w/g, l => l.toUpperCase());
      case 'email':
        // Converter para minúsculas
        return value.toLowerCase();
      default:
        return value;
    }
  }, []);

  // Atualizar campo com validação em tempo real
  const updateField = useCallback((fieldName: keyof WalkerSignupForm, value: any) => {
    let processedValue = value;
    
    // Aplicar máscara se for string
    if (typeof value === 'string') {
      processedValue = applyMask(fieldName, value);
    }

    setFormData(prev => ({
      ...prev,
      [fieldName]: processedValue
    }));

    // Marcar campo como tocado
    setTouchedFields(prev => new Set(prev).add(fieldName));

    // Validar em tempo real apenas se o campo já foi tocado
    if (touchedFields.has(fieldName) || value !== '') {
      const result = validateFormField(fieldName, processedValue, {
        ...formData,
        [fieldName]: processedValue
      });

      setErrors(prev => ({
        ...prev,
        [fieldName]: result.isValid ? '' : result.message
      }));

      // Validação especial para confirmação de senha
      if (fieldName === 'password' && formData.confirmPassword) {
        const confirmResult = validateFormField('confirmPassword', formData.confirmPassword, {
          ...formData,
          password: processedValue
        });
        setErrors(prev => ({
          ...prev,
          confirmPassword: confirmResult.isValid ? '' : confirmResult.message
        }));
      }
    }
  }, [formData, touchedFields, applyMask]);

  // Validar campo específico
  const validateField = useCallback((fieldName: keyof WalkerSignupForm): ValidationResult => {
    const result = validateFormField(fieldName, formData[fieldName], formData);
    
    setErrors(prev => ({
      ...prev,
      [fieldName]: result.isValid ? '' : result.message
    }));

    return result;
  }, [formData]);

  // Validar todos os campos
  const validateAll = useCallback((): { isValid: boolean; errors: FormErrors } => {
    const result = validateCompleteForm(formData);
    setErrors(result.errors);
    
    // Marcar todos os campos como tocados
    setTouchedFields(new Set(Object.keys(formData)));
    
    return result;
  }, [formData]);

  // Verificar se campo específico é válido
  const isFieldValid = useCallback((fieldName: keyof WalkerSignupForm): boolean => {
    return !errors[fieldName] && touchedFields.has(fieldName);
  }, [errors, touchedFields]);

  // Verificar se tem erro em campo específico
  const hasError = useCallback((fieldName: keyof WalkerSignupForm): boolean => {
    return !!errors[fieldName] && touchedFields.has(fieldName);
  }, [errors, touchedFields]);

  // Resetar formulário
  const resetForm = useCallback(() => {
    setFormData({ ...initialFormData, planType: formData.planType });
    setErrors({});
    setTouchedFields(new Set());
  }, [formData.planType]);

  // Verificar se formulário está válido
  const isValid = Object.values(errors).every(error => !error) && 
                  touchedFields.size > 0 &&
                  formData.acceptedTerms;

  return {
    formData,
    errors,
    isValid,
    isFieldValid,
    updateField,
    validateField,
    validateAll,
    resetForm,
    hasError
  };
};
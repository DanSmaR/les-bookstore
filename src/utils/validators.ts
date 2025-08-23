// Validation utilities

export const validateCPF = (cpf: string): boolean => {
  // Remove formatting
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  
  if (cleanCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanCPF)) {
    return false;
  }

  // Validate first digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;

  // Validate second digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;

  return true;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Senha deve ter pelo menos 8 caracteres');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Senha deve conter pelo menos um número');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Senha deve conter pelo menos um caractere especial');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateZipCode = (zipCode: string): boolean => {
  const cleanZip = zipCode.replace(/[^\d]/g, '');
  return cleanZip.length === 8;
};

export const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  return cleanPhone.length === 10 || cleanPhone.length === 11;
};

export const validateRequired = (value: string | undefined | null): boolean => {
  return value !== undefined && value !== null && value.trim().length > 0;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

export const validateAge = (birthDate: string): boolean => {
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= 13;
  }
  
  return age >= 13;
};

// Form validation schemas
export const loginValidation = {
  email: (value: string) => {
    if (!validateRequired(value)) return 'Email é obrigatório';
    if (!validateEmail(value)) return 'Email inválido';
    return null;
  },
  password: (value: string) => {
    if (!validateRequired(value)) return 'Senha é obrigatória';
    return null;
  }
};

export const registerValidation = {
  name: (value: string) => {
    if (!validateRequired(value)) return 'Nome é obrigatório';
    if (!validateMinLength(value, 2)) return 'Nome deve ter pelo menos 2 caracteres';
    if (!validateMaxLength(value, 100)) return 'Nome deve ter no máximo 100 caracteres';
    return null;
  },
  cpf: (value: string) => {
    if (!validateRequired(value)) return 'CPF é obrigatório';
    if (!validateCPF(value)) return 'CPF inválido';
    return null;
  },
  email: (value: string) => {
    if (!validateRequired(value)) return 'Email é obrigatório';
    if (!validateEmail(value)) return 'Email inválido';
    return null;
  },
  password: (value: string) => {
    if (!validateRequired(value)) return 'Senha é obrigatória';
    const validation = validatePassword(value);
    if (!validation.isValid) return validation.errors[0];
    return null;
  },
  confirmPassword: (value: string, password: string) => {
    if (!validateRequired(value)) return 'Confirmação de senha é obrigatória';
    if (value !== password) return 'Senhas não coincidem';
    return null;
  },
  birthDate: (value: string) => {
    if (!validateRequired(value)) return 'Data de nascimento é obrigatória';
    if (!validateAge(value)) return 'Idade mínima é 13 anos';
    return null;
  },
  phone: (value: string) => {
    if (!validateRequired(value)) return 'Telefone é obrigatório';
    if (!validatePhone(value)) return 'Telefone inválido';
    return null;
  },
  zipCode: (value: string) => {
    if (!validateRequired(value)) return 'CEP é obrigatório';
    if (!validateZipCode(value)) return 'CEP inválido';
    return null;
  },
  street: (value: string) => {
    if (!validateRequired(value)) return 'Logradouro é obrigatório';
    return null;
  },
  number: (value: string) => {
    if (!validateRequired(value)) return 'Número é obrigatório';
    return null;
  },
  neighborhood: (value: string) => {
    if (!validateRequired(value)) return 'Bairro é obrigatório';
    return null;
  },
  city: (value: string) => {
    if (!validateRequired(value)) return 'Cidade é obrigatória';
    return null;
  },
  state: (value: string) => {
    if (!validateRequired(value)) return 'Estado é obrigatório';
    return null;
  }
};

export const addressValidation = {
  identifier: (value: string) => {
    if (!validateRequired(value)) return 'Nome identificador é obrigatório';
    if (!validateMinLength(value, 2)) return 'Nome deve ter pelo menos 2 caracteres';
    if (!validateMaxLength(value, 50)) return 'Nome deve ter no máximo 50 caracteres';
    return null;
  },
  type: (value: string) => {
    if (!validateRequired(value)) return 'Tipo de endereço é obrigatório';
    if (!['ENTREGA', 'COBRANCA', 'AMBOS'].includes(value)) return 'Tipo inválido';
    return null;
  },
  ...registerValidation // Reutiliza validações básicas de endereço
};
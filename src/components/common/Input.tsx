import React, { useState } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  mask?: 'cpf' | 'phone' | 'zipCode' | 'cardNumber';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  mask,
  leftIcon,
  rightIcon,
  className,
  value,
  onChange,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(value || '');

  const applyMask = (value: string, maskType: string): string => {
    const numbers = value.replace(/\D/g, '');
    
    switch (maskType) {
      case 'cpf':
        return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      case 'phone':
        if (numbers.length === 10) {
          return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else if (numbers.length === 11) {
          return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        return numbers;
      case 'zipCode':
        return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
      case 'cardNumber':
        return numbers.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
      default:
        return value;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    if (mask) {
      newValue = applyMask(newValue, mask);
    }
    
    setInternalValue(newValue);
    
    if (onChange) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: newValue
        }
      };
      onChange(syntheticEvent);
    }
  };

  const inputClasses = cn(
    'input-base',
    leftIcon && 'pl-10',
    rightIcon && 'pr-10',
    error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        
        <input
          className={inputClasses}
          value={value !== undefined ? value : internalValue}
          onChange={handleChange}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
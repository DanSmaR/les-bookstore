import React, { useState } from 'react';
import { cn } from '../../lib/utils';

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  mask?: 'cpf' | 'phone' | 'zipCode' | 'cardNumber';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const MaskedInput: React.FC<MaskedInputProps> = ({
  label,
  error,
  mask,
  leftIcon,
  rightIcon,
  className,
  value: propValue,
  onChange,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(propValue?.toString() || '');
  
  const applyMask = (text: string, maskType: string): string => {
    const numbers = text.replace(/\D/g, '');
    
    switch (maskType) {
      case 'cpf':
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 6) return numbers.replace(/(\d{3})(\d+)/, '$1.$2');
        if (numbers.length <= 9) return numbers.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
        return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      case 'phone':
        if (numbers.length <= 2) return numbers;
        if (numbers.length <= 6) {
          return numbers.replace(/(\d{2})(\d+)/, '($1) $2');
        } else if (numbers.length <= 10) {
          return numbers.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
        } else {
          return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
      case 'zipCode':
        if (numbers.length <= 5) return numbers;
        return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
      case 'cardNumber':
        if (numbers.length <= 4) return numbers;
        if (numbers.length <= 8) return numbers.replace(/(\d{4})(\d+)/, '$1 $2');
        if (numbers.length <= 12) return numbers.replace(/(\d{4})(\d{4})(\d+)/, '$1 $2 $3');
        return numbers.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
      default:
        return text;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = mask ? applyMask(e.target.value, mask) : e.target.value;
    
    // Update internal state
    setInputValue(newValue);
    
    // Call external onChange if provided
    if (onChange) {
      const syntheticEvent = Object.create(e);
      syntheticEvent.target = { ...e.target, value: newValue };
      onChange(syntheticEvent);
    }
  };

  // When propValue changes externally, update local state
  React.useEffect(() => {
    if (propValue !== undefined && propValue !== null) {
      setInputValue(propValue.toString());
    }
  }, [propValue]);

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          className={cn(
            "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm",
            "text-gray-900 placeholder-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            className
          )}
          value={inputValue}
          onChange={handleChange}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

// Export both as default and named export
export { MaskedInput };
export default MaskedInput;
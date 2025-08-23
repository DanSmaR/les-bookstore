import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { registerValidation } from '../../utils/validators';
import { brazilianStates, residenceTypes } from '../../utils/mock-data';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Card from '../../components/common/Card';

const Register: React.FC = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '' as 'M' | 'F' | 'O' | '',
    birthDate: '',
    phone: '',
    // Address
    addressIdentifier: 'Casa Principal',
    residenceType: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    observations: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Personal data validation
    const nameError = registerValidation.name(formData.name);
    if (nameError) newErrors.name = nameError;
    
    const cpfError = registerValidation.cpf(formData.cpf);
    if (cpfError) newErrors.cpf = cpfError;
    
    const emailError = registerValidation.email(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = registerValidation.password(formData.password);
    if (passwordError) newErrors.password = passwordError;
    
    const confirmPasswordError = registerValidation.confirmPassword(formData.confirmPassword, formData.password);
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
    
    const birthDateError = registerValidation.birthDate(formData.birthDate);
    if (birthDateError) newErrors.birthDate = birthDateError;
    
    const phoneError = registerValidation.phone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;
    
    // Address validation
    const zipCodeError = registerValidation.zipCode(formData.zipCode);
    if (zipCodeError) newErrors.zipCode = zipCodeError;
    
    const streetError = registerValidation.street(formData.street);
    if (streetError) newErrors.street = streetError;
    
    const numberError = registerValidation.number(formData.number);
    if (numberError) newErrors.number = numberError;
    
    const neighborhoodError = registerValidation.neighborhood(formData.neighborhood);
    if (neighborhoodError) newErrors.neighborhood = neighborhoodError;
    
    const cityError = registerValidation.city(formData.city);
    if (cityError) newErrors.city = cityError;
    
    const stateError = registerValidation.state(formData.state);
    if (stateError) newErrors.state = stateError;
    
    // Required fields
    if (!formData.gender) newErrors.gender = 'Gênero é obrigatório';
    if (!formData.residenceType) newErrors.residenceType = 'Tipo de residência é obrigatório';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) return;
    
    try {
      const result = await register({
        ...formData,
        gender: formData.gender as 'M' | 'F' | 'O'
      });
      
      if (result.success) {
        navigate('/');
      } else {
        setSubmitError(result.message);
      }
    } catch (error) {
      setSubmitError('Erro interno do servidor');
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">📚</span>
            </div>
            <span className="text-2xl font-bold text-foreground">BookStore</span>
          </Link>
          <h1 className="text-3xl font-bold mt-6 mb-2">Criar Conta</h1>
          <p className="text-muted-foreground">
            Preencha seus dados para começar a comprar
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {submitError && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm">{submitError}</p>
              </div>
            )}

            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Dados Pessoais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome Completo"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  placeholder="Seu nome completo"
                />

                <Input
                  label="CPF"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  error={errors.cpf}
                  mask="cpf"
                  placeholder="000.000.000-00"
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="seu@email.com"
                />

                <Input
                  label="Telefone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  mask="phone"
                  placeholder="(11) 99999-9999"
                />

                <Select
                  label="Gênero"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  error={errors.gender}
                  placeholder="Selecione"
                  options={[
                    { value: 'M', label: 'Masculino' },
                    { value: 'F', label: 'Feminino' },
                    { value: 'O', label: 'Outro' }
                  ]}
                />

                <Input
                  label="Data de Nascimento"
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  error={errors.birthDate}
                />

                <Input
                  label="Senha"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="••••••••"
                />

                <Input
                  label="Confirmar Senha"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Endereço Principal</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome do Endereço"
                  name="addressIdentifier"
                  value={formData.addressIdentifier}
                  onChange={handleChange}
                  error={errors.addressIdentifier}
                  placeholder="Ex: Casa Principal"
                />

                <Select
                  label="Tipo de Residência"
                  name="residenceType"
                  value={formData.residenceType}
                  onChange={handleChange}
                  error={errors.residenceType}
                  placeholder="Selecione"
                  options={residenceTypes.map(type => ({ value: type, label: type }))}
                />

                <Input
                  label="CEP"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  error={errors.zipCode}
                  mask="zipCode"
                  placeholder="00000-000"
                />

                <Input
                  label="Logradouro"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  error={errors.street}
                  placeholder="Rua, Avenida, etc."
                />

                <Input
                  label="Número"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  error={errors.number}
                  placeholder="123"
                />

                <Input
                  label="Complemento"
                  name="complement"
                  value={formData.complement}
                  onChange={handleChange}
                  error={errors.complement}
                  placeholder="Apto, Bloco, etc. (opcional)"
                />

                <Input
                  label="Bairro"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleChange}
                  error={errors.neighborhood}
                  placeholder="Nome do bairro"
                />

                <Input
                  label="Cidade"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={errors.city}
                  placeholder="Nome da cidade"
                />

                <Select
                  label="Estado"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  error={errors.state}
                  placeholder="Selecione o estado"
                  options={brazilianStates.map(state => ({ value: state.code, label: state.name }))}
                />

                <div className="md:col-span-2">
                  <Input
                    label="Observações"
                    name="observations"
                    value={formData.observations}
                    onChange={handleChange}
                    error={errors.observations}
                    placeholder="Informações adicionais (opcional)"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </form>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary hover:text-primary/80 font-medium">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
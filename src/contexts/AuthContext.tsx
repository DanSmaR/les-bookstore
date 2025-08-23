import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Customer, LoginForm, RegisterForm } from '../types';
import { mockCustomers } from '../utils/mock-data';
import { generateCustomerCode } from '../utils/formatters';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginForm) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterForm) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginForm): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check admin credentials
      if (credentials.email === 'admin@bookstore.com' && credentials.password === 'admin123') {
        const adminUser: User = {
          id: 'admin',
          email: credentials.email,
          role: 'admin'
        };
        
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        
        return { success: true, message: 'Login realizado com sucesso!' };
      }
      
      // Check customer credentials
      const customer = mockCustomers.find(c => 
        c.email === credentials.email && c.status === 'active'
      );
      
      if (!customer) {
        return { success: false, message: 'Email não encontrado ou conta inativa' };
      }
      
      // In a real app, you'd verify the hashed password
      if (credentials.password !== 'senha123') {
        return { success: false, message: 'Senha incorreta' };
      }
      
      const customerUser: User = {
        id: customer.id,
        email: customer.email,
        role: 'customer',
        customer
      };
      
      setUser(customerUser);
      localStorage.setItem('user', JSON.stringify(customerUser));
      
      return { success: true, message: 'Login realizado com sucesso!' };
      
    } catch (error) {
      return { success: false, message: 'Erro interno do servidor' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterForm): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if email already exists
      const emailExists = mockCustomers.some(c => c.email === data.email);
      if (emailExists) {
        return { success: false, message: 'Email já cadastrado no sistema' };
      }
      
      // Check if CPF already exists
      const cpfExists = mockCustomers.some(c => c.cpf === data.cpf);
      if (cpfExists) {
        return { success: false, message: 'CPF já cadastrado no sistema' };
      }
      
      // Create new customer
      const newCustomerId = (mockCustomers.length + 1).toString();
      const newCustomer: Customer = {
        id: newCustomerId,
        code: generateCustomerCode(newCustomerId),
        name: data.name,
        cpf: data.cpf,
        email: data.email,
        password: data.password, // In real app, this would be hashed
        gender: data.gender,
        birthDate: data.birthDate,
        phone: data.phone,
        ranking: 1,
        addresses: [
          {
            id: '1',
            identifier: data.addressIdentifier || 'Endereço Principal',
            type: 'AMBOS',
            residenceType: data.residenceType,
            street: data.street,
            number: data.number,
            complement: data.complement || '',
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state,
            country: 'Brasil',
            zipCode: data.zipCode,
            observations: data.observations || '',
            isDefault: true
          }
        ],
        cards: [],
        status: 'active'
      };
      
      // Add to mock data (in real app, this would be saved to database)
      mockCustomers.push(newCustomer);
      
      // Auto-login the user
      const newUser: User = {
        id: newCustomer.id,
        email: newCustomer.email,
        role: 'customer',
        customer: newCustomer
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return { success: true, message: 'Conta criada com sucesso! Você já está logado.' };
      
    } catch (error) {
      return { success: false, message: 'Erro interno do servidor' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
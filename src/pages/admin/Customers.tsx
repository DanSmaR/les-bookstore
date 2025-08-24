import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';

interface Customer {
  id: string;
  code: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  birthDate: string;
  gender: 'M' | 'F' | 'O';
  ranking: number;
  status: 'active' | 'inactive';
  registrationDate: string;
  lastPurchase?: string;
  totalSpent: number;
  ordersCount: number;
}

const Customers: React.FC = () => {
  const [customers] = useState<Customer[]>([
    {
      id: '1',
      code: 'CLT-001',
      name: 'João Silva',
      email: 'joao@email.com',
      cpf: '123.456.789-00',
      phone: '(11) 99999-9999',
      birthDate: '1990-05-15',
      gender: 'M',
      ranking: 95,
      status: 'active',
      registrationDate: '2024-01-15',
      lastPurchase: '2025-08-20',
      totalSpent: 1299.90,
      ordersCount: 15
    },
    {
      id: '2',
      code: 'CLT-002',
      name: 'Maria Santos',
      email: 'maria@email.com',
      cpf: '987.654.321-00',
      phone: '(11) 88888-8888',
      birthDate: '1985-12-03',
      gender: 'F',
      ranking: 88,
      status: 'active',
      registrationDate: '2024-03-22',
      lastPurchase: '2025-08-18',
      totalSpent: 899.50,
      ordersCount: 8
    },
    {
      id: '3',
      code: 'CLT-003',
      name: 'Pedro Costa',
      email: 'pedro@email.com',
      cpf: '456.789.123-00',
      phone: '(11) 77777-7777',
      birthDate: '1992-08-10',
      gender: 'M',
      ranking: 72,
      status: 'inactive',
      registrationDate: '2024-02-10',
      lastPurchase: '2025-06-15',
      totalSpent: 456.80,
      ordersCount: 4
    }
  ]);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    gender: '',
    ranking: ''
  });

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      customer.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      customer.cpf.includes(filters.search) ||
      customer.code.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus = !filters.status || customer.status === filters.status;
    const matchesGender = !filters.gender || customer.gender === filters.gender;
    
    let matchesRanking = true;
    if (filters.ranking) {
      if (filters.ranking === 'high') matchesRanking = customer.ranking >= 80;
      else if (filters.ranking === 'medium') matchesRanking = customer.ranking >= 60 && customer.ranking < 80;
      else if (filters.ranking === 'low') matchesRanking = customer.ranking < 60;
    }

    return matchesSearch && matchesStatus && matchesGender && matchesRanking;
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', status: '', gender: '', ranking: '' });
  };

  const toggleCustomerStatus = (customerId: string) => {
    // Aqui seria feita a chamada para ativar/inativar o cliente
    console.log('Toggling status for customer:', customerId);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getGenderLabel = (gender: string) => {
    const labels = { M: 'Masculino', F: 'Feminino', O: 'Outro' };
    return labels[gender as keyof typeof labels] || gender;
  };

  const getRankingBadge = (ranking: number) => {
    if (ranking >= 80) return <Badge variant="success">Premium ({ranking})</Badge>;
    if (ranking >= 60) return <Badge variant="warning">Intermediário ({ranking})</Badge>;
    return <Badge variant="default">Básico ({ranking})</Badge>;
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Gerenciar Clientes</h1>
          <p className="text-muted-foreground">Consulte e gerencie informações dos clientes</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Input
              placeholder="Buscar por nome, email, CPF ou código..."
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
            />

            <Select
              placeholder="Status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              options={[
                { value: '', label: 'Todos' },
                { value: 'active', label: 'Ativo' },
                { value: 'inactive', label: 'Inativo' }
              ]}
            />

            <Select
              placeholder="Gênero"
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
              options={[
                { value: '', label: 'Todos' },
                { value: 'M', label: 'Masculino' },
                { value: 'F', label: 'Feminino' },
                { value: 'O', label: 'Outro' }
              ]}
            />

            <Select
              placeholder="Ranking"
              name="ranking"
              value={filters.ranking}
              onChange={handleFilterChange}
              options={[
                { value: '', label: 'Todos' },
                { value: 'high', label: 'Premium (80+)' },
                { value: 'medium', label: 'Intermediário (60-79)' },
                { value: 'low', label: 'Básico (<60)' }
              ]}
            />

            <Button variant="outline" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Customers List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">
                {filteredCustomers.length} cliente(s) encontrado(s)
              </p>
            </div>

            {filteredCustomers.map((customer) => (
              <Card 
                key={customer.id}
                className={`cursor-pointer transition-all ${
                  selectedCustomer?.id === customer.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedCustomer(customer)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {customer.name}
                      </h3>
                      <span className="text-sm text-muted-foreground font-mono">
                        {customer.code}
                      </span>
                      <Badge variant={customer.status === 'active' ? 'success' : 'default'}>
                        {customer.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                      {getRankingBadge(customer.ranking)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <p>📧 {customer.email}</p>
                      <p>📱 {customer.phone}</p>
                      <p>📄 {customer.cpf}</p>
                      <p>👤 {getGenderLabel(customer.gender)}</p>
                    </div>

                    <div className="mt-3 flex items-center space-x-6 text-sm">
                      <span className="text-muted-foreground">
                        Total gasto: <span className="font-medium text-foreground">
                          {formatCurrency(customer.totalSpent)}
                        </span>
                      </span>
                      <span className="text-muted-foreground">
                        Pedidos: <span className="font-medium text-foreground">
                          {customer.ordersCount}
                        </span>
                      </span>
                      {customer.lastPurchase && (
                        <span className="text-muted-foreground">
                          Última compra: <span className="font-medium text-foreground">
                            {formatDate(customer.lastPurchase)}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <Button
                      variant={customer.status === 'active' ? 'destructive' : 'primary'}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCustomerStatus(customer.id);
                      }}
                    >
                      {customer.status === 'active' ? 'Inativar' : 'Ativar'}
                    </Button>
                    <Button variant="outline" size="sm">
                      Ver Transações
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {filteredCustomers.length === 0 && (
              <Card>
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">👥</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Nenhum cliente encontrado
                  </h3>
                  <p className="text-muted-foreground">
                    Ajuste os filtros para encontrar clientes
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Customer Details */}
          <div className="lg:col-span-1">
            {selectedCustomer ? (
              <Card>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Detalhes do Cliente
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Informações Básicas</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Código:</span>
                        <span className="font-mono">{selectedCustomer.code}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nome:</span>
                        <span>{selectedCustomer.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span>{selectedCustomer.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">CPF:</span>
                        <span>{selectedCustomer.cpf}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Telefone:</span>
                        <span>{selectedCustomer.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nascimento:</span>
                        <span>{formatDate(selectedCustomer.birthDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gênero:</span>
                        <span>{getGenderLabel(selectedCustomer.gender)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Status e Ranking</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={selectedCustomer.status === 'active' ? 'success' : 'default'}>
                          {selectedCustomer.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Ranking:</span>
                        {getRankingBadge(selectedCustomer.ranking)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Histórico de Compras</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total gasto:</span>
                        <span className="font-medium">
                          {formatCurrency(selectedCustomer.totalSpent)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pedidos realizados:</span>
                        <span className="font-medium">{selectedCustomer.ordersCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cadastro:</span>
                        <span>{formatDate(selectedCustomer.registrationDate)}</span>
                      </div>
                      {selectedCustomer.lastPurchase && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Última compra:</span>
                          <span>{formatDate(selectedCustomer.lastPurchase)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button className="w-full" size="sm">
                      Ver Todas as Transações
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      Editar Cliente
                    </Button>
                    <Button 
                      variant={selectedCustomer.status === 'active' ? 'destructive' : 'primary'}
                      className="w-full" 
                      size="sm"
                      onClick={() => toggleCustomerStatus(selectedCustomer.id)}
                    >
                      {selectedCustomer.status === 'active' ? 'Inativar Cliente' : 'Ativar Cliente'}
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card>
                <div className="text-center py-8">
                  <div className="text-2xl mb-3">👈</div>
                  <p className="text-muted-foreground">
                    Selecione um cliente para ver os detalhes
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

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

interface Transaction {
  id: string;
  date: string;
  orderId: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
  items: string[];
  paymentMethod: string;
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'M' as 'M' | 'F' | 'O',
    birthDate: ''
  });

  // Mock transactions data
  const [transactions] = useState<Record<string, Transaction[]>>({
    '1': [
      {
        id: 'T001',
        date: '2025-08-20',
        orderId: 'PED-001',
        amount: 299.90,
        status: 'completed',
        items: ['Livro "Dom Casmurro"', 'Livro "O Cortiço"'],
        paymentMethod: 'Cartão de Crédito'
      },
      {
        id: 'T002',
        date: '2025-08-15',
        orderId: 'PED-002',
        amount: 149.50,
        status: 'completed',
        items: ['Livro "Memórias Póstumas"'],
        paymentMethod: 'PIX'
      },
      {
        id: 'T003',
        date: '2025-07-28',
        orderId: 'PED-003',
        amount: 89.90,
        status: 'cancelled',
        items: ['Livro "Iracema"'],
        paymentMethod: 'Cartão de Débito'
      }
    ],
    '2': [
      {
        id: 'T004',
        date: '2025-08-18',
        orderId: 'PED-004',
        amount: 199.90,
        status: 'completed',
        items: ['Livro "Senhora"', 'Livro "Lucíola"'],
        paymentMethod: 'Cartão de Crédito'
      }
    ],
    '3': [
      {
        id: 'T005',
        date: '2025-06-15',
        orderId: 'PED-005',
        amount: 99.90,
        status: 'completed',
        items: ['Livro "O Guarani"'],
        paymentMethod: 'PIX'
      }
    ]
  });

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

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setEditFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      gender: customer.gender,
      birthDate: customer.birthDate
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingCustomer) {
      // Aqui seria feita a chamada para salvar as alterações
      console.log('Saving customer edits:', { ...editingCustomer, ...editFormData });
      setIsEditModalOpen(false);
      setEditingCustomer(null);
    }
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleViewTransactions = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsTransactionsModalOpen(true);
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Concluída</Badge>;
      case 'pending':
        return <Badge variant="warning">Pendente</Badge>;
      case 'cancelled':
        return <Badge variant="error">Cancelada</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewTransactions(customer);
                      }}
                    >
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
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={() => handleViewTransactions(selectedCustomer)}
                    >
                      Ver Todas as Transações
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      size="sm"
                      onClick={() => handleEditCustomer(selectedCustomer)}
                    >
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

        {/* Edit Customer Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Editar Cliente"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome Completo"
                name="name"
                value={editFormData.name}
                onChange={handleEditFormChange}
              />

              <Input
                label="Email"
                type="email"
                name="email"
                value={editFormData.email}
                onChange={handleEditFormChange}
              />

              <Input
                label="Telefone"
                name="phone"
                value={editFormData.phone}
                onChange={handleEditFormChange}
                mask="phone"
              />

              <Select
                label="Gênero"
                name="gender"
                value={editFormData.gender}
                onChange={handleEditFormChange}
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
                value={editFormData.birthDate}
                onChange={handleEditFormChange}
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Informações Não Editáveis</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>CPF: {editingCustomer?.cpf}</p>
                <p>Código: {editingCustomer?.code}</p>
                <p>Data de Cadastro: {editingCustomer && formatDate(editingCustomer.registrationDate)}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit}>
                Salvar Alterações
              </Button>
            </div>
          </div>
        </Modal>

        {/* Transactions Modal */}
        <Modal
          isOpen={isTransactionsModalOpen}
          onClose={() => setIsTransactionsModalOpen(false)}
          title={`Transações - ${selectedCustomer?.name}`}
        >
          <div className="space-y-6">
            {selectedCustomer && transactions[selectedCustomer.id] ? (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Total de {transactions[selectedCustomer.id].length} transação(ões) encontrada(s)
                </div>
                
                {transactions[selectedCustomer.id].map((transaction) => (
                  <Card key={transaction.id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-foreground">
                            {transaction.orderId}
                          </h4>
                          {getStatusBadge(transaction.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-foreground">
                          {formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.paymentMethod}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-foreground mb-1">
                        Itens:
                      </h5>
                      <ul className="text-sm text-muted-foreground">
                        {transaction.items.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                ))}
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">Resumo</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total gasto:</span>
                      <span className="font-medium">
                        {formatCurrency(
                          transactions[selectedCustomer.id]
                            .filter(t => t.status === 'completed')
                            .reduce((sum, t) => sum + t.amount, 0)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transações concluídas:</span>
                      <span className="font-medium">
                        {transactions[selectedCustomer.id].filter(t => t.status === 'completed').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transações canceladas:</span>
                      <span className="font-medium">
                        {transactions[selectedCustomer.id].filter(t => t.status === 'cancelled').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-2xl mb-3">📊</div>
                <p className="text-muted-foreground">
                  Nenhuma transação encontrada para este cliente
                </p>
              </div>
            )}
            
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsTransactionsModalOpen(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Customers;
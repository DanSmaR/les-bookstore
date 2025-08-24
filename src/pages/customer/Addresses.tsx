import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import { brazilianStates, residenceTypes } from '../../utils/mock-data';

interface Address {
  id: string;
  identifier: string;
  type: 'delivery' | 'billing';
  residenceType: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  observations?: string;
  isDefault: boolean;
}

const Addresses: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      identifier: 'Casa Principal',
      type: 'delivery',
      residenceType: 'Casa',
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      observations: 'Portão azul',
      isDefault: true
    },
    {
      id: '2',
      identifier: 'Trabalho',
      type: 'delivery',
      residenceType: 'Comercial',
      street: 'Avenida Paulista',
      number: '1000',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      isDefault: false
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    identifier: '',
    type: 'delivery' as 'delivery' | 'billing',
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

  const handleAdd = () => {
    setEditingAddress(null);
    setFormData({
      identifier: '',
      type: 'delivery',
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
    setIsModalOpen(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      identifier: address.identifier,
      type: address.type,
      residenceType: address.residenceType,
      street: address.street,
      number: address.number,
      complement: address.complement || '',
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      observations: address.observations || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const handleSave = () => {
    if (editingAddress) {
      // Editar endereço existente
      setAddresses(addresses.map(addr => 
        addr.id === editingAddress.id 
          ? { ...editingAddress, ...formData }
          : addr
      ));
    } else {
      // Adicionar novo endereço
      const newAddress: Address = {
        id: Date.now().toString(),
        ...formData,
        isDefault: addresses.length === 0
      };
      setAddresses([...addresses, newAddress]);
    }
    setIsModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Meus Endereços</h1>
            <p className="text-muted-foreground">Gerencie seus endereços de entrega e cobrança</p>
          </div>
          <Button onClick={handleAdd}>
            Novo Endereço
          </Button>
        </div>

        {/* Address List */}
        <div className="grid gap-6">
          {addresses.map((address) => (
            <Card key={address.id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      {address.identifier}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      address.type === 'delivery' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-secondary/10 text-secondary'
                    }`}>
                      {address.type === 'delivery' ? 'Entrega' : 'Cobrança'}
                    </span>
                    {address.isDefault && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-success/10 text-success">
                        Padrão
                      </span>
                    )}
                  </div>
                  
                  <div className="text-muted-foreground space-y-1">
                    <p>
                      {address.street}, {address.number}
                      {address.complement && `, ${address.complement}`}
                    </p>
                    <p>{address.neighborhood} - {address.city}/{address.state}</p>
                    <p>CEP: {address.zipCode}</p>
                    {address.observations && (
                      <p className="text-sm italic">Obs: {address.observations}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!address.isDefault && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      Tornar Padrão
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(address)}
                  >
                    Editar
                  </Button>
                  {!address.isDefault && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                    >
                      Excluir
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {addresses.length === 0 && (
            <Card>
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhum endereço cadastrado
                </h3>
                <p className="text-muted-foreground mb-6">
                  Adicione seu primeiro endereço para começar a fazer compras
                </p>
                <Button onClick={handleAdd}>
                  Adicionar Endereço
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Address Form Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingAddress ? 'Editar Endereço' : 'Novo Endereço'}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome do Endereço"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Ex: Casa, Trabalho"
              />

              <Select
                label="Tipo"
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={[
                  { value: 'delivery', label: 'Entrega' },
                  { value: 'billing', label: 'Cobrança' }
                ]}
              />

              <Select
                label="Tipo de Residência"
                name="residenceType"
                value={formData.residenceType}
                onChange={handleChange}
                placeholder="Selecione"
                options={residenceTypes.map(type => ({ value: type, label: type }))}
              />

              <Input
                label="CEP"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                mask="zipCode"
                placeholder="00000-000"
              />

              <Input
                label="Logradouro"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Rua, Avenida, etc."
              />

              <Input
                label="Número"
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="123"
              />

              <Input
                label="Complemento"
                name="complement"
                value={formData.complement}
                onChange={handleChange}
                placeholder="Apto, Bloco, etc. (opcional)"
              />

              <Input
                label="Bairro"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                placeholder="Nome do bairro"
              />

              <Input
                label="Cidade"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Nome da cidade"
              />

              <Select
                label="Estado"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Selecione o estado"
                options={brazilianStates.map(state => ({ value: state.code, label: state.name }))}
              />
            </div>

            <Input
              label="Observações"
              name="observations"
              value={formData.observations}
              onChange={handleChange}
              placeholder="Informações adicionais (opcional)"
            />

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {editingAddress ? 'Salvar' : 'Adicionar'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Addresses;
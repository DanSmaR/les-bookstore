import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { brazilianStates } from '../../utils/mock-data';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  
  const [formData, setFormData] = useState({
    name: user?.customer?.name || '',
    email: user?.email || '',
    phone: user?.customer?.phone || '',
    gender: user?.customer?.gender || '',
    birthDate: user?.customer?.birthDate || '',
    cpf: user?.customer?.cpf || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Aqui seria feita a chamada para atualizar os dados
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Resetar dados para valores originais
    setFormData({
      name: user?.customer?.name || '',
      email: user?.email || '',
      phone: user?.customer?.phone || '',
      gender: user?.customer?.gender || '',
      birthDate: user?.customer?.birthDate || '',
      cpf: user?.customer?.cpf || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Meu Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'personal'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Dados Pessoais
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'security'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Segurança
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'preferences'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Preferências
          </button>
        </div>

        {/* Personal Data Tab */}
        {activeTab === 'personal' && (
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-foreground">Informações Pessoais</h2>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  Editar
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>
                    Salvar
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nome Completo"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
              />

              <Input
                label="CPF"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                disabled={!isEditing}
                mask="cpf"
              />

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />

              <Input
                label="Telefone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                mask="phone"
              />

              <Select
                label="Gênero"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!isEditing}
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
                disabled={!isEditing}
              />
            </div>

            {/* Customer Status */}
            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Status da Conta</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Conta ativa</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Ranking:</span>
                  <span className="text-sm font-medium text-foreground">Cliente Premium</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Código:</span>
                  <span className="text-sm font-mono text-foreground">CLT-001</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <Card>
            <h2 className="text-xl font-semibold text-foreground mb-6">Segurança</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-foreground mb-4">Alterar Senha</h3>
                <div className="grid grid-cols-1 gap-4 max-w-md">
                  <Input
                    label="Senha Atual"
                    type="password"
                    placeholder="••••••••"
                  />
                  <Input
                    label="Nova Senha"
                    type="password"
                    placeholder="••••••••"
                  />
                  <Input
                    label="Confirmar Nova Senha"
                    type="password"
                    placeholder="••••••••"
                  />
                  <Button className="w-fit">
                    Alterar Senha
                  </Button>
                </div>
              </div>

              <hr className="border-border" />

              <div>
                <h3 className="font-medium text-foreground mb-4">Atividade da Conta</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">Último login</span>
                    <span className="text-sm text-foreground">24 Aug 2025, 14:30</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">Última alteração de senha</span>
                    <span className="text-sm text-foreground">15 Aug 2025</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <Card>
            <h2 className="text-xl font-semibold text-foreground mb-6">Preferências</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-foreground mb-4">Notificações</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Novidades e promoções</span>
                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Status de pedidos</span>
                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Newsletters</span>
                    <input type="checkbox" className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <hr className="border-border" />

              <div>
                <h3 className="font-medium text-foreground mb-4">Privacidade</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Perfil público</span>
                    <input type="checkbox" className="h-4 w-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Compartilhar dados para recomendações</span>
                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                  </div>
                </div>
              </div>

              <Button>Salvar Preferências</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
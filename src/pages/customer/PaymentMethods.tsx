import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';

interface CreditCard {
  id: string;
  cardNumber: string;
  cardHolder: string;
  brand: string;
  securityCode: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

const cardBrands = [
  { value: 'visa', label: 'Visa' },
  { value: 'mastercard', label: 'Mastercard' },
  { value: 'amex', label: 'American Express' },
  { value: 'elo', label: 'Elo' },
  { value: 'hipercard', label: 'Hipercard' }
];

const PaymentMethods: React.FC = () => {
  const [cards, setCards] = useState<CreditCard[]>([
    {
      id: '1',
      cardNumber: '4532 1234 5678 9012',
      cardHolder: 'João Silva',
      brand: 'visa',
      securityCode: '123',
      expiryMonth: '12',
      expiryYear: '2027',
      isDefault: true
    },
    {
      id: '2',
      cardNumber: '5555 4444 3333 2222',
      cardHolder: 'João Silva',
      brand: 'mastercard',
      securityCode: '456',
      expiryMonth: '06',
      expiryYear: '2028',
      isDefault: false
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    brand: '',
    securityCode: '',
    expiryMonth: '',
    expiryYear: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAdd = () => {
    setEditingCard(null);
    setFormData({
      cardNumber: '',
      cardHolder: '',
      brand: '',
      securityCode: '',
      expiryMonth: '',
      expiryYear: ''
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (card: CreditCard) => {
    setEditingCard(card);
    setFormData({
      cardNumber: card.cardNumber,
      cardHolder: card.cardHolder,
      brand: card.brand,
      securityCode: card.securityCode,
      expiryMonth: card.expiryMonth,
      expiryYear: card.expiryYear
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setCards(cards.map(card => ({
      ...card,
      isDefault: card.id === id
    })));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Número do cartão é obrigatório';
    } else if (formData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Número do cartão inválido';
    }

    if (!formData.cardHolder.trim()) {
      newErrors.cardHolder = 'Nome no cartão é obrigatório';
    }

    if (!formData.brand) {
      newErrors.brand = 'Bandeira é obrigatória';
    }

    if (!formData.securityCode.trim()) {
      newErrors.securityCode = 'Código de segurança é obrigatório';
    } else if (formData.securityCode.length < 3) {
      newErrors.securityCode = 'Código de segurança inválido';
    }

    if (!formData.expiryMonth) {
      newErrors.expiryMonth = 'Mês de validade é obrigatório';
    }

    if (!formData.expiryYear) {
      newErrors.expiryYear = 'Ano de validade é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (editingCard) {
      // Editar cartão existente
      setCards(cards.map(card => 
        card.id === editingCard.id 
          ? { ...editingCard, ...formData }
          : card
      ));
    } else {
      // Adicionar novo cartão
      const newCard: CreditCard = {
        id: Date.now().toString(),
        ...formData,
        isDefault: cards.length === 0
      };
      setCards([...cards, newCard]);
    }
    setIsModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getBrandIcon = (brand: string) => {
    const icons: Record<string, string> = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
      elo: '💳',
      hipercard: '💳'
    };
    return icons[brand] || '💳';
  };

  const maskCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    return cleaned.slice(0, 4) + ' **** **** ' + cleaned.slice(-4);
  };

  // Generate month/year options
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1).padStart(2, '0')
  }));

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 20 }, (_, i) => ({
    value: String(currentYear + i),
    label: String(currentYear + i)
  }));

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Métodos de Pagamento</h1>
            <p className="text-muted-foreground">Gerencie seus cartões de crédito</p>
          </div>
          <Button onClick={handleAdd}>
            Novo Cartão
          </Button>
        </div>

        {/* Cards List */}
        <div className="grid gap-6">
          {cards.map((card) => (
            <Card key={card.id}>
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">
                    {getBrandIcon(card.brand)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {maskCardNumber(card.cardNumber)}
                      </h3>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary capitalize">
                        {cardBrands.find(b => b.value === card.brand)?.label}
                      </span>
                      {card.isDefault && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-success/10 text-success">
                          Padrão
                        </span>
                      )}
                    </div>
                    <div className="text-muted-foreground space-y-1">
                      <p className="font-medium">{card.cardHolder}</p>
                      <p className="text-sm">Válido até {card.expiryMonth}/{card.expiryYear}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!card.isDefault && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSetDefault(card.id)}
                    >
                      Tornar Padrão
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(card)}
                  >
                    Editar
                  </Button>
                  {!card.isDefault && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(card.id)}
                    >
                      Excluir
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {cards.length === 0 && (
            <Card>
              <div className="text-center py-12">
                <div className="text-4xl mb-4">💳</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhum cartão cadastrado
                </h3>
                <p className="text-muted-foreground mb-6">
                  Adicione um cartão de crédito para facilitar suas compras
                </p>
                <Button onClick={handleAdd}>
                  Adicionar Cartão
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Card Form Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingCard ? 'Editar Cartão' : 'Novo Cartão'}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Número do Cartão"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                error={errors.cardNumber}
                mask="cardNumber"
                placeholder="0000 0000 0000 0000"
              />

              <Input
                label="Nome no Cartão"
                name="cardHolder"
                value={formData.cardHolder}
                onChange={handleChange}
                error={errors.cardHolder}
                placeholder="Como está escrito no cartão"
              />

              <Select
                label="Bandeira"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                error={errors.brand}
                placeholder="Selecione a bandeira"
                options={cardBrands}
              />

              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Código de Segurança"
                  name="securityCode"
                  value={formData.securityCode}
                  onChange={handleChange}
                  error={errors.securityCode}
                  placeholder="CVV"
                  maxLength={4}
                />

                <Select
                  label="Mês"
                  name="expiryMonth"
                  value={formData.expiryMonth}
                  onChange={handleChange}
                  error={errors.expiryMonth}
                  placeholder="MM"
                  options={monthOptions}
                />

                <Select
                  label="Ano"
                  name="expiryYear"
                  value={formData.expiryYear}
                  onChange={handleChange}
                  error={errors.expiryYear}
                  placeholder="AAAA"
                  options={yearOptions}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {editingCard ? 'Salvar' : 'Adicionar'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default PaymentMethods;
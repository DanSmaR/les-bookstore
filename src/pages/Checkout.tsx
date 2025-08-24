import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, MapPin, Truck, Gift, Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'credit' | 'coupon';
  name: string;
  lastFourDigits?: string;
  value?: number;
  isDefault?: boolean;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();

  // Estados
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [newAddress, setNewAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    saveToProfile: false
  });
  const [selectedPayments, setSelectedPayments] = useState<{id: string, amount: number}[]>([]);
  const [shipping, setShipping] = useState({ cost: 0, method: '' });
  const [newCard, setNewCard] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    saveToProfile: false
  });
  const [coupons, setCoupons] = useState({ promotional: '', exchange: '' });

  // Mock data
  const addresses: Address[] = [
    {
      id: '1',
      name: 'Casa',
      street: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      isDefault: true
    },
    {
      id: '2',
      name: 'Trabalho',
      street: 'Av. Paulista, 1000',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      isDefault: false
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'credit',
      name: 'Visa',
      lastFourDigits: '1234',
      isDefault: true
    },
    {
      id: '2',
      type: 'credit',
      name: 'Mastercard',
      lastFourDigits: '5678',
      isDefault: false
    },
    {
      id: '3',
      type: 'coupon',
      name: 'Cupom de Troca',
      value: 50.00
    },
    {
      id: '4',
      type: 'coupon',
      name: 'Cupom Promocional',
      value: 25.00
    }
  ];

  const calculateShipping = () => {
    if (!selectedAddress && !newAddress.zipCode) {
      toast({
        title: "Erro",
        description: "Selecione um endereço para calcular o frete",
        variant: "destructive"
      });
      return;
    }

    // Simulação do cálculo de frete
    const shippingCost = Math.random() * 20 + 10; // Entre R$ 10-30
    setShipping({
      cost: Number(shippingCost.toFixed(2)),
      method: 'Correios - Sedex'
    });

    toast({
      title: "Frete calculado",
      description: `Frete: R$ ${shippingCost.toFixed(2)} - ${shipping.method}`
    });
  };

  const addPaymentMethod = (paymentId: string, amount: number) => {
    if (amount < 10 && paymentMethods.find(p => p.id === paymentId)?.type === 'credit') {
      // Verificar se pode pagar menos de R$ 10,00 (apenas com cupons)
      const totalCoupons = selectedPayments
        .filter(p => paymentMethods.find(pm => pm.id === p.id)?.type === 'coupon')
        .reduce((sum, p) => sum + p.amount, 0);
      
      if (totalCoupons === 0) {
        toast({
          title: "Valor mínimo",
          description: "Valor mínimo para cartão de crédito é R$ 10,00",
          variant: "destructive"
        });
        return;
      }
    }

    setSelectedPayments(prev => {
      const existing = prev.find(p => p.id === paymentId);
      if (existing) {
        return prev.map(p => p.id === paymentId ? { ...p, amount } : p);
      }
      return [...prev, { id: paymentId, amount }];
    });
  };

  const getTotalPayments = () => {
    return selectedPayments.reduce((sum, p) => sum + p.amount, 0);
  };

  const getRemainingAmount = () => {
    const total = getCartTotal() + shipping.cost;
    return Math.max(0, total - getTotalPayments());
  };

  const finalizePurchase = () => {
    if (!selectedAddress && !newAddress.zipCode) {
      toast({
        title: "Erro",
        description: "Selecione um endereço de entrega",
        variant: "destructive"
      });
      return;
    }

    if (shipping.cost === 0) {
      toast({
        title: "Erro",
        description: "Calcule o frete antes de finalizar",
        variant: "destructive"
      });
      return;
    }

    if (getRemainingAmount() > 0) {
      toast({
        title: "Erro",
        description: "Complete o pagamento antes de finalizar",
        variant: "destructive"
      });
      return;
    }

    // Simular finalização da compra
    clearCart();
    
    toast({
      title: "Compra realizada com sucesso!",
      description: "Pedido #12345 - Status: EM PROCESSAMENTO"
    });

    navigate('/orders');
  };

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário de Checkout */}
          <div className="lg:col-span-2 space-y-6">
            {/* Endereço de Entrega */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Endereço de Entrega</h2>
              </div>

              <Tabs defaultValue="existing" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="existing">Endereços Salvos</TabsTrigger>
                  <TabsTrigger value="new">Novo Endereço</TabsTrigger>
                </TabsList>

                <TabsContent value="existing" className="space-y-4">
                  <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                    {addresses.map((address) => (
                      <div key={address.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value={address.id} id={address.id} />
                        <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                          <div>
                            <p className="font-medium">{address.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {address.street}, {address.city} - {address.state}
                            </p>
                            <p className="text-sm text-muted-foreground">{address.zipCode}</p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </TabsContent>

                <TabsContent value="new" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="addressName">Nome do Endereço</Label>
                      <Input
                        id="addressName"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                        placeholder="Ex: Casa, Trabalho"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">CEP</Label>
                      <Input
                        id="zipCode"
                        value={newAddress.zipCode}
                        onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                        placeholder="12345-678"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="street">Endereço Completo</Label>
                      <Input
                        id="street"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                        placeholder="Rua, número, complemento"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        placeholder="São Paulo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">Estado</Label>
                      <Select value={newAddress.state} onValueChange={(value) => setNewAddress({...newAddress, state: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SP">São Paulo</SelectItem>
                          <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                          <SelectItem value="MG">Minas Gerais</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saveAddress"
                      checked={newAddress.saveToProfile}
                      onCheckedChange={(checked) => setNewAddress({...newAddress, saveToProfile: checked as boolean})}
                    />
                    <Label htmlFor="saveAddress">Salvar endereço no meu perfil</Label>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-4">
                <Button onClick={calculateShipping} className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Calcular Frete
                </Button>
                {shipping.cost > 0 && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {shipping.method}: R$ {shipping.cost.toFixed(2)}
                  </p>
                )}
              </div>
            </Card>

            {/* Forma de Pagamento */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Forma de Pagamento</h2>
              </div>

              <Tabs defaultValue="saved" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="saved">Métodos Salvos</TabsTrigger>
                  <TabsTrigger value="new">Novo Cartão</TabsTrigger>
                  <TabsTrigger value="coupons">Cupons</TabsTrigger>
                </TabsList>

                <TabsContent value="saved" className="space-y-4">
                  {paymentMethods.filter(p => p.type === 'credit').map((method) => (
                    <div key={method.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{method.name} •••• {method.lastFourDigits}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Valor"
                            className="w-24"
                            onChange={(e) => {
                              const amount = Number(e.target.value);
                              if (amount > 0) addPaymentMethod(method.id, amount);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="new" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="cardNumber">Número do Cartão</Label>
                      <Input
                        id="cardNumber"
                        value={newCard.number}
                        onChange={(e) => setNewCard({...newCard, number: e.target.value})}
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="cardName">Nome no Cartão</Label>
                      <Input
                        id="cardName"
                        value={newCard.name}
                        onChange={(e) => setNewCard({...newCard, name: e.target.value})}
                        placeholder="Nome completo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardExpiry">Validade</Label>
                      <Input
                        id="cardExpiry"
                        value={newCard.expiry}
                        onChange={(e) => setNewCard({...newCard, expiry: e.target.value})}
                        placeholder="MM/AA"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardCvv">CVV</Label>
                      <Input
                        id="cardCvv"
                        value={newCard.cvv}
                        onChange={(e) => setNewCard({...newCard, cvv: e.target.value})}
                        placeholder="123"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saveCard"
                      checked={newCard.saveToProfile}
                      onCheckedChange={(checked) => setNewCard({...newCard, saveToProfile: checked as boolean})}
                    />
                    <Label htmlFor="saveCard">Salvar cartão no meu perfil</Label>
                  </div>
                </TabsContent>

                <TabsContent value="coupons" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="promotionalCoupon">Cupom Promocional</Label>
                      <Input
                        id="promotionalCoupon"
                        value={coupons.promotional}
                        onChange={(e) => setCoupons({...coupons, promotional: e.target.value})}
                        placeholder="Digite o código do cupom"
                      />
                    </div>
                    <div>
                      <Label htmlFor="exchangeCoupon">Cupom de Troca</Label>
                      <Input
                        id="exchangeCoupon"
                        value={coupons.exchange}
                        onChange={(e) => setCoupons({...coupons, exchange: e.target.value})}
                        placeholder="Digite o código do cupom"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Cupons Disponíveis:</h4>
                    {paymentMethods.filter(p => p.type === 'coupon').map((coupon) => (
                      <div key={coupon.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Gift className="h-4 w-4" />
                          <span>{coupon.name} - R$ {coupon.value?.toFixed(2)}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addPaymentMethod(coupon.id, coupon.value || 0)}
                        >
                          Usar
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {selectedPayments.length > 0 && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Pagamentos Selecionados:</h4>
                  <div className="space-y-2">
                    {selectedPayments.map((payment) => {
                      const method = paymentMethods.find(p => p.id === payment.id);
                      return (
                        <div key={payment.id} className="flex justify-between text-sm">
                          <span>{method?.name}</span>
                          <span>R$ {payment.amount.toFixed(2)}</span>
                        </div>
                      );
                    })}
                    {getRemainingAmount() > 0 && (
                      <div className="flex justify-between text-sm text-destructive font-medium">
                        <span>Restante:</span>
                        <span>R$ {getRemainingAmount().toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
              
              <div className="space-y-2 mb-4">
                {cart.items.map((item) => (
                  <div key={item.bookId} className="flex justify-between text-sm">
                    <span>{item.book.title} (x{item.quantity})</span>
                    <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <hr className="my-4" />
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R$ {getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete</span>
                  <span>R$ {shipping.cost.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>R$ {(getCartTotal() + shipping.cost).toFixed(2)}</span>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={finalizePurchase}
                disabled={getRemainingAmount() > 0 || shipping.cost === 0}
              >
                Finalizar Compra
              </Button>

              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  🔒 Seus dados estão protegidos
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
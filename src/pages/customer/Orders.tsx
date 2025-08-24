import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  trackingCode?: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

const Orders: React.FC = () => {
  const [orders] = useState<Order[]>([
    {
      id: 'PED-001',
      date: '2025-08-20',
      status: 'delivered',
      total: 129.90,
      items: [
        {
          id: '1',
          title: 'O Senhor dos Anéis',
          price: 65.90,
          quantity: 1,
          image: '/lovable-uploads/book-1.jpg'
        },
        {
          id: '2',
          title: 'Harry Potter',
          price: 64.00,
          quantity: 1,
          image: '/lovable-uploads/book-2.jpg'
        }
      ],
      trackingCode: 'BR123456789',
      address: {
        street: 'Rua das Flores',
        number: '123',
        complement: 'Apto 45',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567'
      }
    },
    {
      id: 'PED-002',
      date: '2025-08-22',
      status: 'shipped',
      total: 89.90,
      items: [
        {
          id: '3',
          title: 'Dom Casmurro',
          price: 89.90,
          quantity: 1,
          image: '/lovable-uploads/book-3.jpg'
        }
      ],
      trackingCode: 'BR987654321',
      address: {
        street: 'Rua das Flores',
        number: '123',
        complement: 'Apto 45',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567'
      }
    },
    {
      id: 'PED-003',
      date: '2025-08-24',
      status: 'processing',
      total: 199.80,
      items: [
        {
          id: '4',
          title: 'Clean Code',
          price: 99.90,
          quantity: 2,
          image: '/lovable-uploads/book-4.jpg'
        }
      ],
      address: {
        street: 'Rua das Flores',
        number: '123',
        complement: 'Apto 45',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567'
      }
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      processing: { label: 'Em Processamento', variant: 'warning' as const },
      shipped: { label: 'Enviado', variant: 'default' as const },
      delivered: { label: 'Entregue', variant: 'success' as const },
      cancelled: { label: 'Cancelado', variant: 'error' as const }
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Meus Pedidos</h1>
          <p className="text-muted-foreground">Acompanhe o histórico e status dos seus pedidos</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-2 space-y-6">
            {orders.map((order) => (
              <Card 
                key={order.id}
                className={`cursor-pointer transition-all ${
                  selectedOrder?.id === order.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        Pedido #{order.id}
                      </h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Realizado em {formatDate(order.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">
                      {formatCurrency(order.total)}
                    </p>
                    {order.trackingCode && (
                      <p className="text-sm text-muted-foreground">
                        Código: {order.trackingCode}
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="space-y-3">
                  {order.items.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Qtd: {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-sm text-muted-foreground">
                      + {order.items.length - 2} item(s) a mais
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {order.items.length} item(s)
                    </span>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {orders.length === 0 && (
              <Card>
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📦</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Nenhum pedido encontrado
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Você ainda não fez nenhum pedido. Explore nosso catálogo!
                  </p>
                  <Button>
                    Ver Catálogo
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Order Details */}
          <div className="lg:col-span-1">
            {selectedOrder ? (
              <Card>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Detalhes do Pedido
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Status</h4>
                    {getStatusBadge(selectedOrder.status)}
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Data do Pedido</h4>
                    <p className="text-muted-foreground">
                      {formatDate(selectedOrder.date)}
                    </p>
                  </div>

                  {selectedOrder.trackingCode && (
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Código de Rastreamento</h4>
                      <p className="text-muted-foreground font-mono">
                        {selectedOrder.trackingCode}
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Rastrear Pedido
                      </Button>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Endereço de Entrega</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        {selectedOrder.address.street}, {selectedOrder.address.number}
                        {selectedOrder.address.complement && `, ${selectedOrder.address.complement}`}
                      </p>
                      <p>
                        {selectedOrder.address.neighborhood} - {selectedOrder.address.city}/{selectedOrder.address.state}
                      </p>
                      <p>CEP: {selectedOrder.address.zipCode}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-3">Itens</h4>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-10 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {item.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.quantity}× {formatCurrency(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">Total</span>
                      <span className="font-bold text-foreground">
                        {formatCurrency(selectedOrder.total)}
                      </span>
                    </div>
                  </div>

                  {selectedOrder.status === 'delivered' && (
                    <Button className="w-full">
                      Avaliar Pedido
                    </Button>
                  )}

                  {selectedOrder.status === 'processing' && (
                    <Button variant="destructive" className="w-full">
                      Cancelar Pedido
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              <Card>
                <div className="text-center py-8">
                  <div className="text-2xl mb-3">👈</div>
                  <p className="text-muted-foreground">
                    Selecione um pedido para ver os detalhes
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

export default Orders;
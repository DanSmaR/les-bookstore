import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Package, Truck, CheckCircle, RefreshCw, Eye, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrderItem {
  id: string;
  bookTitle: string;
  bookAuthor: string;
  quantity: number;
  price: number;
  canExchange: boolean;
}

interface Order {
  id: string;
  date: string;
  status: 'EM_PROCESSAMENTO' | 'APROVADA' | 'REPROVADA' | 'EM_TRANSPORTE' | 'ENTREGUE' | 'EM_TROCA' | 'TROCA_AUTORIZADA' | 'TROCADO';
  total: number;
  items: OrderItem[];
  address: string;
  trackingCode?: string;
}

const Orders: React.FC = () => {
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [exchangeItems, setExchangeItems] = useState<string[]>([]);

  // Mock data
  const orders: Order[] = [
    {
      id: '12345',
      date: '2024-01-15',
      status: 'ENTREGUE',
      total: 89.90,
      items: [
        {
          id: '1',
          bookTitle: 'Dom Casmurro',
          bookAuthor: 'Machado de Assis',
          quantity: 1,
          price: 29.90,
          canExchange: true
        },
        {
          id: '2',
          bookTitle: 'O Cortiço',
          bookAuthor: 'Aluísio Azevedo',
          quantity: 2,
          price: 30.00,
          canExchange: true
        }
      ],
      address: 'Rua das Flores, 123 - São Paulo/SP',
      trackingCode: 'BR123456789'
    },
    {
      id: '12346',
      date: '2024-01-20',
      status: 'EM_TRANSPORTE',
      total: 45.90,
      items: [
        {
          id: '3',
          bookTitle: 'Memórias Póstumas de Brás Cubas',
          bookAuthor: 'Machado de Assis',
          quantity: 1,
          price: 45.90,
          canExchange: false
        }
      ],
      address: 'Av. Paulista, 1000 - São Paulo/SP',
      trackingCode: 'BR987654321'
    },
    {
      id: '12347',
      date: '2024-01-25',
      status: 'EM_TROCA',
      total: 35.90,
      items: [
        {
          id: '4',
          bookTitle: 'Senhora',
          bookAuthor: 'José de Alencar',
          quantity: 1,
          price: 35.90,
          canExchange: false
        }
      ],
      address: 'Rua das Flores, 123 - São Paulo/SP'
    }
  ];

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'EM_PROCESSAMENTO':
      case 'APROVADA':
        return <Package className="h-4 w-4" />;
      case 'EM_TRANSPORTE':
        return <Truck className="h-4 w-4" />;
      case 'ENTREGUE':
        return <CheckCircle className="h-4 w-4" />;
      case 'EM_TROCA':
      case 'TROCA_AUTORIZADA':
      case 'TROCADO':
        return <RefreshCw className="h-4 w-4" />;
      case 'REPROVADA':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'EM_PROCESSAMENTO':
        return 'bg-blue-500';
      case 'APROVADA':
        return 'bg-green-500';
      case 'REPROVADA':
        return 'bg-red-500';
      case 'EM_TRANSPORTE':
        return 'bg-orange-500';
      case 'ENTREGUE':
        return 'bg-green-600';
      case 'EM_TROCA':
        return 'bg-yellow-500';
      case 'TROCA_AUTORIZADA':
        return 'bg-blue-600';
      case 'TROCADO':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'EM_PROCESSAMENTO':
        return 'Em Processamento';
      case 'APROVADA':
        return 'Aprovada';
      case 'REPROVADA':
        return 'Reprovada';
      case 'EM_TRANSPORTE':
        return 'Em Transporte';
      case 'ENTREGUE':
        return 'Entregue';
      case 'EM_TROCA':
        return 'Em Troca';
      case 'TROCA_AUTORIZADA':
        return 'Troca Autorizada';
      case 'TROCADO':
        return 'Trocado';
      default:
        return status;
    }
  };

  const handleExchangeRequest = (orderId: string) => {
    if (exchangeItems.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um item para troca",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Solicitação de troca enviada",
      description: `Solicitação de troca para o pedido #${orderId} foi enviada com sucesso`,
    });

    setExchangeItems([]);
    setSelectedOrder(null);
  };

  const toggleExchangeItem = (itemId: string) => {
    setExchangeItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const filterOrdersByStatus = (status?: Order['status']) => {
    if (!status) return orders;
    return orders.filter(order => order.status === status);
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="p-4 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Pedido #{order.id}</h3>
          <p className="text-sm text-muted-foreground">
            Realizado em {new Date(order.date).toLocaleDateString('pt-BR')}
          </p>
          <p className="text-sm text-muted-foreground">{order.address}</p>
        </div>
        <div className="text-right">
          <Badge className={`${getStatusColor(order.status)} text-white mb-2`}>
            <div className="flex items-center gap-1">
              {getStatusIcon(order.status)}
              {getStatusText(order.status)}
            </div>
          </Badge>
          <p className="text-lg font-semibold">R$ {order.total.toFixed(2)}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.bookTitle} - {item.bookAuthor} (x{item.quantity})</span>
            <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {order.trackingCode && (
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <p className="text-sm">
            <strong>Código de rastreamento:</strong> {order.trackingCode}
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
              <Eye className="h-4 w-4 mr-1" />
              Ver Detalhes
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Pedido #{order.id}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Data do Pedido</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge className={`${getStatusColor(order.status)} text-white`}>
                    {getStatusText(order.status)}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium">Endereço de Entrega</p>
                  <p className="text-sm text-muted-foreground">{order.address}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Itens do Pedido</h4>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{item.bookTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.bookAuthor} - Qtd: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-semibold">Total: R$ {order.total.toFixed(2)}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {order.status === 'ENTREGUE' && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-1" />
                Solicitar Troca
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Solicitar Troca - Pedido #{order.id}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Selecione os itens que deseja trocar. Apenas itens entregues podem ser trocados.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2 p-2 border rounded">
                      <input
                        type="checkbox"
                        id={`exchange-${item.id}`}
                        checked={exchangeItems.includes(item.id)}
                        onChange={() => toggleExchangeItem(item.id)}
                        disabled={!item.canExchange}
                        className="rounded"
                      />
                      <label htmlFor={`exchange-${item.id}`} className="flex-1 cursor-pointer">
                        <p className="font-medium">{item.bookTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.bookAuthor} - Qtd: {item.quantity} - R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setExchangeItems([])}>
                    Cancelar
                  </Button>
                  <Button onClick={() => handleExchangeRequest(order.id)}>
                    Solicitar Troca
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {order.status === 'TROCA_AUTORIZADA' && (
          <Alert className="mt-4">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Sua troca foi autorizada! Envie os itens para o endereço que será fornecido por email.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Meus Pedidos</h1>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="EM_PROCESSAMENTO">Em Processamento</TabsTrigger>
            <TabsTrigger value="EM_TRANSPORTE">Em Transporte</TabsTrigger>
            <TabsTrigger value="ENTREGUE">Entregues</TabsTrigger>
            <TabsTrigger value="EM_TROCA">Em Troca</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="EM_PROCESSAMENTO">
            <div className="space-y-4">
              {filterOrdersByStatus('EM_PROCESSAMENTO').map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="EM_TRANSPORTE">
            <div className="space-y-4">
              {filterOrdersByStatus('EM_TRANSPORTE').map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ENTREGUE">
            <div className="space-y-4">
              {filterOrdersByStatus('ENTREGUE').map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="EM_TROCA">
            <div className="space-y-4">
              {filterOrdersByStatus('EM_TROCA').map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Nenhum pedido encontrado</h2>
            <p className="text-muted-foreground mb-6">
              Você ainda não fez nenhum pedido. Explore nosso catálogo!
            </p>
            <Button onClick={() => window.location.href = '/catalog'}>
              Explorar Catálogo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
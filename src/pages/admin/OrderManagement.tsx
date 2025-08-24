import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Package, Truck, CheckCircle, RefreshCw, Eye, Send, Archive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrderItem {
  id: string;
  bookTitle: string;
  bookAuthor: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: 'EM_PROCESSAMENTO' | 'APROVADA' | 'REPROVADA' | 'EM_TRANSPORTE' | 'ENTREGUE' | 'EM_TROCA' | 'TROCA_AUTORIZADA' | 'TROCADO';
  total: number;
  items: OrderItem[];
  address: string;
  trackingCode?: string;
  exchangeRequest?: {
    itemIds: string[];
    requestDate: string;
    reason?: string;
  };
}

const OrderManagement: React.FC = () => {
  const { toast } = useToast();
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [trackingCode, setTrackingCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Mock data
  const orders: Order[] = [
    {
      id: '12345',
      customerId: '1',
      customerName: 'João Silva',
      customerEmail: 'joao@email.com',
      date: '2024-01-15',
      status: 'APROVADA',
      total: 89.90,
      items: [
        { id: '1', bookTitle: 'Dom Casmurro', bookAuthor: 'Machado de Assis', quantity: 1, price: 29.90 },
        { id: '2', bookTitle: 'O Cortiço', bookAuthor: 'Aluísio Azevedo', quantity: 2, price: 30.00 }
      ],
      address: 'Rua das Flores, 123 - São Paulo/SP'
    },
    {
      id: '12346',
      customerId: '2',
      customerName: 'Maria Santos',
      customerEmail: 'maria@email.com',
      date: '2024-01-20',
      status: 'EM_TRANSPORTE',
      total: 45.90,
      items: [
        { id: '3', bookTitle: 'Memórias Póstumas de Brás Cubas', bookAuthor: 'Machado de Assis', quantity: 1, price: 45.90 }
      ],
      address: 'Av. Paulista, 1000 - São Paulo/SP',
      trackingCode: 'BR987654321'
    },
    {
      id: '12347',
      customerId: '3',
      customerName: 'Pedro Costa',
      customerEmail: 'pedro@email.com',
      date: '2024-01-25',
      status: 'EM_TROCA',
      total: 35.90,
      items: [
        { id: '4', bookTitle: 'Senhora', bookAuthor: 'José de Alencar', quantity: 1, price: 35.90 }
      ],
      address: 'Rua das Flores, 123 - São Paulo/SP',
      exchangeRequest: {
        itemIds: ['4'],
        requestDate: '2024-01-30',
        reason: 'Produto com defeito'
      }
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

  const handleDispatchOrders = () => {
    if (selectedOrders.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um pedido para despachar",
        variant: "destructive"
      });
      return;
    }

    if (!trackingCode.trim()) {
      toast({
        title: "Erro",
        description: "Informe o código de rastreamento",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Pedidos despachados",
      description: `${selectedOrders.length} pedido(s) despachado(s) com sucesso`,
    });

    setSelectedOrders([]);
    setTrackingCode('');
  };

  const handleMarkAsDelivered = (orderId: string) => {
    toast({
      title: "Pedido marcado como entregue",
      description: `Pedido #${orderId} foi marcado como entregue`,
    });
  };

  const handleAuthorizeExchange = (orderId: string) => {
    toast({
      title: "Troca autorizada",
      description: `Troca do pedido #${orderId} foi autorizada. Cliente será notificado.`,
    });
  };

  const handleConfirmExchangeReceived = (orderId: string, returnToStock: boolean) => {
    toast({
      title: "Recebimento confirmado",
      description: `Itens recebidos do pedido #${orderId}. ${returnToStock ? 'Itens retornaram ao estoque.' : 'Itens não retornaram ao estoque.'}`,
    });
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const filteredOrders = orders.filter(order => 
    order.id.includes(searchTerm) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filterOrdersByStatus = (status?: Order['status']) => {
    const filtered = filteredOrders;
    if (!status) return filtered;
    return filtered.filter(order => order.status === status);
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="p-4 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={selectedOrders.includes(order.id)}
            onCheckedChange={() => toggleOrderSelection(order.id)}
          />
          <div>
            <h3 className="text-lg font-semibold">Pedido #{order.id}</h3>
            <p className="text-sm text-muted-foreground">Cliente: {order.customerName}</p>
            <p className="text-sm text-muted-foreground">Email: {order.customerEmail}</p>
            <p className="text-sm text-muted-foreground">
              Data: {new Date(order.date).toLocaleDateString('pt-BR')}
            </p>
            <p className="text-sm text-muted-foreground">{order.address}</p>
          </div>
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

      {order.exchangeRequest && (
        <Alert className="mb-4">
          <RefreshCw className="h-4 w-4" />
          <AlertDescription>
            Solicitação de troca recebida em {new Date(order.exchangeRequest.requestDate).toLocaleDateString('pt-BR')}
            {order.exchangeRequest.reason && (
              <><br />Motivo: {order.exchangeRequest.reason}</>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2 flex-wrap">
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
                  <p className="text-sm font-medium">Cliente</p>
                  <p className="text-sm text-muted-foreground">{order.customerName}</p>
                  <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
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

        {order.status === 'EM_TRANSPORTE' && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleMarkAsDelivered(order.id)}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Marcar como Entregue
          </Button>
        )}

        {order.status === 'EM_TROCA' && (
          <>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleAuthorizeExchange(order.id)}
            >
              <Send className="h-4 w-4 mr-1" />
              Autorizar Troca
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Archive className="h-4 w-4 mr-1" />
                  Confirmar Recebimento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar Recebimento - Pedido #{order.id}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Confirme o recebimento dos itens para troca e informe se devem retornar ao estoque.
                  </p>
                  
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="p-2 border rounded">
                        <p className="font-medium">{item.bookTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.bookAuthor} - Qtd: {item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleConfirmExchangeReceived(order.id, false)}
                    >
                      Recebido - Não retornar ao estoque
                    </Button>
                    <Button onClick={() => handleConfirmExchangeReceived(order.id, true)}>
                      Recebido - Retornar ao estoque
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Gerenciamento de Pedidos</h1>

        {/* Filtros e Busca */}
        <Card className="p-4 mb-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="search">Buscar Pedidos</Label>
              <Input
                id="search"
                placeholder="Buscar por ID, cliente ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Ações em Lote */}
        {selectedOrders.length > 0 && (
          <Card className="p-4 mb-6 bg-blue-50">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="tracking">Código de Rastreamento</Label>
                <Input
                  id="tracking"
                  placeholder="Digite o código de rastreamento"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                />
              </div>
              <Button onClick={handleDispatchOrders}>
                <Send className="h-4 w-4 mr-1" />
                Despachar {selectedOrders.length} Pedido(s)
              </Button>
            </div>
          </Card>
        )}

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="APROVADA">Aprovados</TabsTrigger>
            <TabsTrigger value="EM_TRANSPORTE">Em Transporte</TabsTrigger>
            <TabsTrigger value="ENTREGUE">Entregues</TabsTrigger>
            <TabsTrigger value="EM_TROCA">Solicitações de Troca</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="APROVADA">
            <div className="space-y-4">
              {filterOrdersByStatus('APROVADA').map((order) => (
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

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Nenhum pedido encontrado</h2>
            <p className="text-muted-foreground">
              Nenhum pedido corresponde aos filtros aplicados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getCartTotal, timeRemaining } = useCart();
  const { toast } = useToast();
  const [removedItems, setRemovedItems] = useState<any[]>([]);

  // Simular itens removidos por tempo limite
  useEffect(() => {
    if (timeRemaining <= 300 && timeRemaining > 0) { // 5 minutos antes
      toast({
        title: "Atenção",
        description: "Seu carrinho expirará em 5 minutos. Finalize sua compra!",
        variant: "destructive"
      });
    }
  }, [timeRemaining, toast]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleQuantityChange = (bookId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(bookId);
    } else {
      updateQuantity(bookId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho para continuar",
        variant: "destructive"
      });
      return;
    }
    navigate('/checkout');
  };

  const readdToCart = (item: any) => {
    setRemovedItems(prev => prev.filter(i => i.id !== item.id));
    // Aqui normalmente chamaria addToCart do contexto
    toast({
      title: "Item readicionado",
      description: `${item.title} foi readicionado ao carrinho`
    });
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h1>
          <p className="text-muted-foreground mb-6">
            Explore nosso catálogo e adicione livros ao seu carrinho
          </p>
          <Button onClick={() => navigate('/catalog')}>
            Continuar Comprando
          </Button>

          {removedItems.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Itens removidos por tempo limite</h2>
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Os itens abaixo foram removidos do carrinho por atingirem o tempo limite.
                  Revalide o estoque antes de readicionar.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                {removedItems.map((item) => (
                  <Card key={item.id} className="p-4 opacity-60">
                    <div className="flex items-center gap-4">
                      <img 
                        src={item.image || '/placeholder.svg'} 
                        alt={item.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.author}</p>
                        <p className="text-sm font-medium">R$ {item.price.toFixed(2)}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => readdToCart(item)}
                      >
                        Readicionar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Meu Carrinho</h1>
          {timeRemaining > 0 && (
            <div className="flex items-center gap-2 text-amber-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">
                Expira em: {formatTime(timeRemaining)}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items do Carrinho */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <Card key={item.bookId} className="p-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={`/lovable-uploads/book-${Math.floor(Math.random() * 5) + 1}.jpg`}
                    alt={item.book.title}
                    className="w-20 h-24 object-cover rounded"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{item.book.title}</h3>
                    <p className="text-muted-foreground">{item.book.author}</p>
                    <p className="text-sm text-muted-foreground">
                      Estoque disponível: {item.book.stock}
                    </p>
                    <p className="text-lg font-semibold text-primary">
                      R$ {item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.bookId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    
                    <span className="w-12 text-center font-medium">
                      {item.quantity}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.bookId, item.quantity + 1)}
                      disabled={item.quantity >= item.book.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.bookId)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R$ {getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete</span>
                  <span className="text-muted-foreground">Calcular no checkout</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>R$ {getCartTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleCheckout}
                >
                  Finalizar Compra
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/catalog')}
                >
                  Continuar Comprando
                </Button>
              </div>

              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  🔒 Compra 100% segura e protegida
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
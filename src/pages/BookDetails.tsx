import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { mockBooks } from '@/utils/mock-data';
import { formatPrice } from '@/utils/formatters';

const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const book = mockBooks.find(b => b.id === id);

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Livro não encontrado</h1>
          <Button onClick={() => navigate('/catalog')}>
            Voltar ao Catálogo
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    const success = addToCart(book);
    if (success) {
      toast({
        title: "Adicionado ao carrinho",
        description: `"${book.title}" foi adicionado ao seu carrinho.`
      });
    } else {
      toast({
        title: "Produto indisponível",
        description: "Este livro não está disponível no estoque.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate('/catalog')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar ao Catálogo
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Imagem do Livro */}
        <div className="space-y-4">
          <div className="aspect-[2/3] bg-muted rounded-lg overflow-hidden">
            <img
              src={book.image || '/placeholder.svg'}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Informações do Livro */}
        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {book.category.map((cat) => (
                <Badge key={cat} variant="secondary">
                  {cat}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">por {book.author}</p>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(4.5 - 120 avaliações)</span>
            </div>
          </div>

          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(book.price)}
                </span>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {book.stock > 0 ? `${book.stock} em estoque` : 'Indisponível'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Status: {book.status === 'active' ? 'Ativo' : 'Inativo'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={book.stock === 0}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {book.stock === 0 ? 'Indisponível' : 'Adicionar ao Carrinho'}
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Informações Detalhadas */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Detalhes do Produto</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ISBN:</span>
                <span>{book.isbn}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Editora:</span>
                <span>{book.publisher}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ano de Publicação:</span>
                <span>{book.year}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Edição:</span>
                <span>{book.edition}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Páginas:</span>
                <span>{book.pages}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dimensões (A x L x P):</span>
                <span>{book.dimensions.height} x {book.dimensions.width} x {book.dimensions.depth} cm</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Peso:</span>
                <span>{book.dimensions.weight}g</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Código de Barras:</span>
                <span>{book.barcode}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Sinopse */}
      <Card className="p-6 mt-8">
        <h3 className="text-lg font-semibold mb-4">Sinopse</h3>
        <p className="text-muted-foreground leading-relaxed">
          {book.synopsis}
        </p>
      </Card>

    </div>
  );
};

export default BookDetails;
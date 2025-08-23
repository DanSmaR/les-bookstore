import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { mockBooks } from '../utils/mock-data';
import { formatPrice } from '../utils/formatters';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

const Home: React.FC = () => {
  const { addToCart } = useCart();

  const featuredBooks = mockBooks.slice(0, 4);
  const categories = [
    'Literatura Brasileira',
    'Ficção Científica', 
    'Fantasia',
    'Tecnologia',
    'Romance',
    'Biografia'
  ];

  const handleAddToCart = (book: any) => {
    const success = addToCart(book);
    if (!success) {
      alert('Produto indisponível no estoque');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero text-white py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Descubra Sua Próxima
              <span className="block text-accent">Grande Leitura</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Mais de 10.000 livros dos melhores autores. Entrega rápida para todo o Brasil.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/catalog">
                <Button size="lg" className="btn-primary w-full sm:w-auto">
                  Explorar Catálogo
                </Button>
              </Link>
              <Link to="/offers">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary"
                >
                  Ver Ofertas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Categorias Populares</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/catalog?category=${encodeURIComponent(category)}`}
                className="group"
              >
                <Card hover className="text-center p-6 h-full">
                  <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl">
                    📚
                  </div>
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {category}
                  </h3>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Livros em Destaque</h2>
            <Link to="/catalog">
              <Button variant="outline">Ver Todos</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <Card key={book.id} hover className="group">
                <Link to={`/book/${book.id}`}>
                  <div className="aspect-[2/3] bg-muted rounded-lg mb-4 overflow-hidden">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                
                <div className="space-y-3">
                  <div>
                    <Link to={`/book/${book.id}`}>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {book.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {book.author}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {book.category.slice(0, 2).map((cat) => (
                      <Badge key={cat} variant="default" size="sm">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(book.price)}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {book.stock} em estoque
                      </p>
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(book);
                      }}
                      disabled={book.stock === 0}
                    >
                      {book.stock === 0 ? 'Indisponível' : 'Adicionar'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center text-white text-2xl">
                🚚
              </div>
              <h3 className="text-xl font-semibold mb-2">Entrega Rápida</h3>
              <p className="text-muted-foreground">
                Receba seus livros em até 5 dias úteis em todo o Brasil
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center text-white text-2xl">
                🔒
              </div>
              <h3 className="text-xl font-semibold mb-2">Compra Segura</h3>
              <p className="text-muted-foreground">
                Pagamento 100% seguro com as principais bandeiras
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center text-white text-2xl">
                ↩️
              </div>
              <h3 className="text-xl font-semibold mb-2">Troca Garantida</h3>
              <p className="text-muted-foreground">
                Não gostou? Troque ou devolva em até 30 dias
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Receba Nossas Novidades
            </h2>
            <p className="text-muted-foreground mb-8">
              Cadastre-se e seja o primeiro a saber sobre lançamentos e ofertas especiais
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu melhor email"
                className="input-base flex-1"
              />
              <Button className="whitespace-nowrap">
                Cadastrar
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
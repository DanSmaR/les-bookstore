import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { mockBooks } from '../utils/mock-data';
import { formatPrice } from '../utils/formatters';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Select from '../components/common/Select';
import Input from '../components/common/Input';
import { Link } from 'react-router-dom';

const Catalog: React.FC = () => {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('title');

  // Get unique categories
  const categories = Array.from(
    new Set(mockBooks.flatMap(book => book.category))
  );

  // Filter and sort books
  const filteredBooks = mockBooks
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || book.category.includes(categoryFilter);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'author':
          return a.author.localeCompare(b.author);
        default:
          return a.title.localeCompare(b.title);
      }
    });

  const handleAddToCart = (book: any) => {
    const success = addToCart(book);
    if (!success) {
      alert('Produto indisponível no estoque');
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Catálogo de Livros</h1>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              placeholder="Buscar livros ou autores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={[
                { value: '', label: 'Todas as categorias' },
                ...categories.map(category => ({ value: category, label: category }))
              ]}
            />
            
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: 'title', label: 'Ordenar por Título' },
                { value: 'author', label: 'Ordenar por Autor' },
                { value: 'price-asc', label: 'Menor Preço' },
                { value: 'price-desc', label: 'Maior Preço' }
              ]}
            />
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredBooks.length} livro{filteredBooks.length !== 1 ? 's' : ''} encontrado{filteredBooks.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
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

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Nenhum livro encontrado com os filtros selecionados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
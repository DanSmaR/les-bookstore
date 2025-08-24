import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { Search, Plus, Edit, Eye, EyeOff } from 'lucide-react';

interface Book {
  id: string;
  code: string;
  title: string;
  author: string;
  publisher: string;
  category: string[];
  year: number;
  edition: string;
  isbn: string;
  pages: number;
  synopsis: string;
  dimensions: {
    height: number;
    width: number;
    depth: number;
    weight: number;
  };
  pricingGroup: string;
  barcode: string;
  salePrice: number;
  costPrice: number;
  stock: number;
  status: 'active' | 'inactive';
  registrationDate: string;
  inactivationReason?: string;
  inactivationCategory?: string;
  activationReason?: string;
  activationCategory?: string;
}

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([
    {
      id: '1',
      code: 'LIV-001',
      title: 'Dom Casmurro',
      author: 'Machado de Assis',
      publisher: 'Editora Companhia das Letras',
      category: ['Literatura Brasileira', 'Clássicos'],
      year: 1899,
      edition: '3ª Edição',
      isbn: '978-85-359-0277-5',
      pages: 256,
      synopsis: 'Romance clássico da literatura brasileira que narra a história de Bentinho e Capitu.',
      dimensions: { height: 21, width: 14, depth: 2, weight: 300 },
      pricingGroup: 'Literatura Premium',
      barcode: '7898901234567',
      salePrice: 29.90,
      costPrice: 15.00,
      stock: 25,
      status: 'active',
      registrationDate: '2024-01-15'
    },
    {
      id: '2',
      code: 'LIV-002',
      title: 'O Cortiço',
      author: 'Aluísio Azevedo',
      publisher: 'Editora Ática',
      category: ['Literatura Brasileira', 'Naturalismo'],
      year: 1890,
      edition: '2ª Edição',
      isbn: '978-85-08-12345-6',
      pages: 320,
      synopsis: 'Obra naturalista que retrata a vida em um cortiço no Rio de Janeiro do século XIX.',
      dimensions: { height: 20, width: 13, depth: 2.5, weight: 280 },
      pricingGroup: 'Literatura Clássica',
      barcode: '7898901234568',
      salePrice: 24.90,
      costPrice: 12.00,
      stock: 0,
      status: 'inactive',
      registrationDate: '2024-02-10',
      inactivationReason: 'Produto sem estoque há mais de 90 dias',
      inactivationCategory: 'FORA DE MERCADO'
    }
  ]);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    author: '',
    publisher: '',
    status: '',
    pricingGroup: ''
  });

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<'activate' | 'inactivate'>('inactivate');

  const [bookFormData, setBookFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    category: [] as string[],
    year: new Date().getFullYear(),
    edition: '',
    isbn: '',
    pages: 0,
    synopsis: '',
    height: 0,
    width: 0,
    depth: 0,
    weight: 0,
    pricingGroup: '',
    barcode: '',
    costPrice: 0
  });

  const [statusFormData, setStatusFormData] = useState({
    reason: '',
    category: ''
  });

  // Mock data for dropdowns
  const categories = ['Literatura Brasileira', 'Literatura Estrangeira', 'Romance', 'Ficção', 'Biografia', 'História', 'Ciências', 'Autoajuda', 'Infantil', 'Clássicos', 'Naturalismo'];
  const pricingGroups = ['Literatura Premium', 'Literatura Clássica', 'Livros Populares', 'Edições Especiais'];
  const inactivationCategories = ['FORA DE MERCADO', 'DESCONTINUADO', 'PROBLEMA EDITORIAL', 'BAIXA PROCURA'];
  const activationCategories = ['REPOSIÇÃO ESTOQUE', 'NOVA EDIÇÃO', 'DEMANDA AUMENTOU', 'CORREÇÃO SISTEMA'];

  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      book.author.toLowerCase().includes(filters.search.toLowerCase()) ||
      book.isbn.includes(filters.search) ||
      book.code.toLowerCase().includes(filters.search.toLowerCase());

    const matchesCategory = !filters.category || book.category.includes(filters.category);
    const matchesAuthor = !filters.author || book.author.toLowerCase().includes(filters.author.toLowerCase());
    const matchesPublisher = !filters.publisher || book.publisher.toLowerCase().includes(filters.publisher.toLowerCase());
    const matchesStatus = !filters.status || book.status === filters.status;
    const matchesPricingGroup = !filters.pricingGroup || book.pricingGroup === filters.pricingGroup;

    return matchesSearch && matchesCategory && matchesAuthor && matchesPublisher && matchesStatus && matchesPricingGroup;
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', author: '', publisher: '', status: '', pricingGroup: '' });
  };

  const handleAddBook = () => {
    setBookFormData({
      title: '',
      author: '',
      publisher: '',
      category: [],
      year: new Date().getFullYear(),
      edition: '',
      isbn: '',
      pages: 0,
      synopsis: '',
      height: 0,
      width: 0,
      depth: 0,
      weight: 0,
      pricingGroup: '',
      barcode: '',
      costPrice: 0
    });
    setIsAddModalOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setBookFormData({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      category: book.category,
      year: book.year,
      edition: book.edition,
      isbn: book.isbn,
      pages: book.pages,
      synopsis: book.synopsis,
      height: book.dimensions.height,
      width: book.dimensions.width,
      depth: book.dimensions.depth,
      weight: book.dimensions.weight,
      pricingGroup: book.pricingGroup,
      barcode: book.barcode,
      costPrice: book.costPrice
    });
    setIsEditModalOpen(true);
  };

  const handleStatusChange = (book: Book, action: 'activate' | 'inactivate') => {
    setSelectedBook(book);
    setStatusAction(action);
    setStatusFormData({ reason: '', category: '' });
    setIsStatusModalOpen(true);
  };

  const handleBookFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'category') {
      // Handle multiple categories
      const categories = value.split(',').map(cat => cat.trim()).filter(cat => cat);
      setBookFormData(prev => ({ ...prev, category: categories }));
    } else {
      setBookFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleStatusFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStatusFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateSalePrice = (costPrice: number, pricingGroup: string) => {
    // Mock calculation based on pricing group
    const margins = {
      'Literatura Premium': 1.8,
      'Literatura Clássica': 1.6,
      'Livros Populares': 1.4,
      'Edições Especiais': 2.0
    };
    return costPrice * (margins[pricingGroup as keyof typeof margins] || 1.5);
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Gerenciar Livros</h1>
            <p className="text-muted-foreground">Cadastre e gerencie o catálogo de livros</p>
          </div>
          <Button onClick={handleAddBook} className="flex items-center gap-2">
            <Plus size={16} />
            Novo Livro
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, autor, ISBN..."
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                className="pl-10"
              />
            </div>

            <Select
              placeholder="Categoria"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              options={[
                { value: '', label: 'Todas' },
                ...categories.map(cat => ({ value: cat, label: cat }))
              ]}
            />

            <Input
              placeholder="Autor"
              name="author"
              value={filters.author}
              onChange={handleFilterChange}
            />

            <Input
              placeholder="Editora"
              name="publisher"
              value={filters.publisher}
              onChange={handleFilterChange}
            />

            <Select
              placeholder="Status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              options={[
                { value: '', label: 'Todos' },
                { value: 'active', label: 'Ativo' },
                { value: 'inactive', label: 'Inativo' }
              ]}
            />

            <Button variant="outline" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          </div>
        </Card>

        {/* Books List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              {filteredBooks.length} livro(s) encontrado(s)
            </p>
          </div>

          {filteredBooks.map((book) => (
            <Card key={book.id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      {book.title}
                    </h3>
                    <span className="text-sm text-muted-foreground font-mono">
                      {book.code}
                    </span>
                    <Badge variant={book.status === 'active' ? 'success' : 'error'}>
                      {book.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                    {book.stock === 0 && (
                      <Badge variant="warning">Sem Estoque</Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground mb-3">
                    <p>✍️ Autor: {book.author}</p>
                    <p>🏢 Editora: {book.publisher}</p>
                    <p>📅 Ano: {book.year}</p>
                    <p>📖 Páginas: {book.pages}</p>
                    <p>📚 ISBN: {book.isbn}</p>
                    <p>📦 Estoque: {book.stock}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {book.category.map((cat, index) => (
                      <Badge key={index} variant="default" size="sm">
                        {cat}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center space-x-6 text-sm">
                    <span className="text-muted-foreground">
                      Preço: <span className="font-medium text-foreground">
                        {formatCurrency(book.salePrice)}
                      </span>
                    </span>
                    <span className="text-muted-foreground">
                      Grupo: <span className="font-medium text-foreground">
                        {book.pricingGroup}
                      </span>
                    </span>
                  </div>

                  {(book.inactivationReason || book.activationReason) && (
                    <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                      <p className="text-muted-foreground">
                        {book.status === 'inactive' ? 'Motivo inativação:' : 'Motivo ativação:'} {book.inactivationReason || book.activationReason}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditBook(book)}
                    className="flex items-center gap-1"
                  >
                    <Edit size={14} />
                    Editar
                  </Button>
                  
                  {book.status === 'active' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(book, 'inactivate')}
                      className="flex items-center gap-1 text-error border-error hover:bg-error hover:text-white"
                    >
                      <EyeOff size={14} />
                      Inativar
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(book, 'activate')}
                      className="flex items-center gap-1 text-success border-success hover:bg-success hover:text-white"
                    >
                      <Eye size={14} />
                      Ativar
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {filteredBooks.length === 0 && (
            <Card>
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhum livro encontrado
                </h3>
                <p className="text-muted-foreground mb-6">
                  Ajuste os filtros para encontrar livros ou cadastre um novo
                </p>
                <Button onClick={handleAddBook}>
                  Cadastrar Primeiro Livro
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Add/Edit Book Modal */}
        <Modal
          isOpen={isAddModalOpen || isEditModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
          }}
          title={isAddModalOpen ? 'Cadastrar Novo Livro' : 'Editar Livro'}
        >
          <div className="space-y-6 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Título *"
                name="title"
                value={bookFormData.title}
                onChange={handleBookFormChange}
                placeholder="Digite o título do livro"
              />

              <Input
                label="Autor *"
                name="author"
                value={bookFormData.author}
                onChange={handleBookFormChange}
                placeholder="Nome do autor"
              />

              <Input
                label="Editora *"
                name="publisher"
                value={bookFormData.publisher}
                onChange={handleBookFormChange}
                placeholder="Nome da editora"
              />

              <Input
                label="Categorias * (separadas por vírgula)"
                name="category"
                value={bookFormData.category.join(', ')}
                onChange={handleBookFormChange}
                placeholder="Literatura Brasileira, Romance"
              />

              <Input
                label="Ano *"
                type="number"
                name="year"
                value={bookFormData.year}
                onChange={handleBookFormChange}
                placeholder="2024"
              />

              <Input
                label="Edição *"
                name="edition"
                value={bookFormData.edition}
                onChange={handleBookFormChange}
                placeholder="1ª Edição"
              />

              <Input
                label="ISBN *"
                name="isbn"
                value={bookFormData.isbn}
                onChange={handleBookFormChange}
                placeholder="978-85-359-0277-5"
              />

              <Input
                label="Número de Páginas *"
                type="number"
                name="pages"
                value={bookFormData.pages}
                onChange={handleBookFormChange}
                placeholder="256"
              />

              <Input
                label="Altura (cm) *"
                type="number"
                name="height"
                value={bookFormData.height}
                onChange={handleBookFormChange}
                placeholder="21"
              />

              <Input
                label="Largura (cm) *"
                type="number"
                name="width"
                value={bookFormData.width}
                onChange={handleBookFormChange}
                placeholder="14"
              />

              <Input
                label="Profundidade (cm) *"
                type="number"
                name="depth"
                value={bookFormData.depth}
                onChange={handleBookFormChange}
                placeholder="2"
              />

              <Input
                label="Peso (g) *"
                type="number"
                name="weight"
                value={bookFormData.weight}
                onChange={handleBookFormChange}
                placeholder="300"
              />

              <Select
                label="Grupo de Precificação *"
                name="pricingGroup"
                value={bookFormData.pricingGroup}
                onChange={handleBookFormChange}
                options={pricingGroups.map(group => ({ value: group, label: group }))}
              />

              <Input
                label="Código de Barras *"
                name="barcode"
                value={bookFormData.barcode}
                onChange={handleBookFormChange}
                placeholder="7898901234567"
              />

              <Input
                label="Preço de Custo *"
                type="number"
                step="0.01"
                name="costPrice"
                value={bookFormData.costPrice}
                onChange={handleBookFormChange}
                placeholder="15.00"
              />

              {bookFormData.costPrice > 0 && bookFormData.pricingGroup && (
                <div className="bg-muted/50 p-3 rounded">
                  <label className="text-sm font-medium text-foreground">Preço de Venda Calculado</label>
                  <p className="text-lg font-bold text-primary">
                    {formatCurrency(calculateSalePrice(bookFormData.costPrice, bookFormData.pricingGroup))}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Sinopse *
              </label>
              <textarea
                name="synopsis"
                value={bookFormData.synopsis}
                onChange={handleBookFormChange}
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Descreva brevemente o conteúdo do livro..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}>
                Cancelar
              </Button>
              <Button onClick={() => {
                // Aqui seria feita a chamada para salvar
                console.log('Saving book:', bookFormData);
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}>
                {isAddModalOpen ? 'Cadastrar' : 'Salvar'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Status Change Modal */}
        <Modal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          title={statusAction === 'activate' ? 'Ativar Livro' : 'Inativar Livro'}
        >
          <div className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">
                {selectedBook?.title}
              </h4>
              <p className="text-sm text-muted-foreground">
                Código: {selectedBook?.code}
              </p>
            </div>

            <Input
              label="Justificativa *"
              name="reason"
              value={statusFormData.reason}
              onChange={handleStatusFormChange}
              placeholder={`Motivo para ${statusAction === 'activate' ? 'ativar' : 'inativar'} este livro`}
            />

            <Select
              label="Categoria *"
              name="category"
              value={statusFormData.category}
              onChange={handleStatusFormChange}
              placeholder="Selecione uma categoria"
              options={(statusAction === 'activate' ? activationCategories : inactivationCategories)
                .map(cat => ({ value: cat, label: cat }))}
            />

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setIsStatusModalOpen(false)}>
                Cancelar
              </Button>
              <Button 
                variant={statusAction === 'activate' ? 'primary' : 'outline'}
                onClick={() => {
                  // Aqui seria feita a chamada para alterar status
                  console.log(`${statusAction} book:`, selectedBook?.id, statusFormData);
                  setIsStatusModalOpen(false);
                }}
              >
                {statusAction === 'activate' ? 'Ativar' : 'Inativar'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Books;
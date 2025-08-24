import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { toast } from '../../hooks/use-toast';
import { Package, Plus, Search, Filter, History } from 'lucide-react';
import { Book } from '../../types';
import { mockBooks } from '../../utils/mock-data';

interface StockEntry {
  id: string;
  bookId: string;
  book: Book;
  quantity: number;
  costPrice: number;
  supplier: string;
  entryDate: string;
  entryType: 'COMPRA' | 'TROCA' | 'AJUSTE';
  notes?: string;
}

interface StockMovement {
  id: string;
  bookId: string;
  book: Book;
  type: 'ENTRADA' | 'SAIDA';
  quantity: number;
  reason: string;
  date: string;
  reference?: string;
}

// Mock data para entradas de estoque
const mockStockEntries: StockEntry[] = [
  {
    id: '1',
    bookId: '1',
    book: mockBooks[0],
    quantity: 50,
    costPrice: 25.00,
    supplier: 'Editora Alpha',
    entryDate: '2024-01-15',
    entryType: 'COMPRA',
    notes: 'Compra inicial'
  },
  {
    id: '2',
    bookId: '2',
    book: mockBooks[1],
    quantity: 30,
    costPrice: 18.50,
    supplier: 'Distribuidora Beta',
    entryDate: '2024-01-20',
    entryType: 'COMPRA'
  }
];

const mockStockMovements: StockMovement[] = [
  {
    id: '1',
    bookId: '1',
    book: mockBooks[0],
    type: 'ENTRADA',
    quantity: 50,
    reason: 'Compra - Editora Alpha',
    date: '2024-01-15',
    reference: 'ENT-001'
  },
  {
    id: '2',
    bookId: '1',
    book: mockBooks[0],
    type: 'SAIDA',
    quantity: 5,
    reason: 'Venda #ORD-001',
    date: '2024-01-16',
    reference: 'ORD-001'
  }
];

const Inventory: React.FC = () => {
  const [stockEntries, setStockEntries] = useState<StockEntry[]>(mockStockEntries);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(mockStockMovements);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSupplier, setFilterSupplier] = useState('');
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);

  // Form states
  const [entryForm, setEntryForm] = useState({
    bookId: '',
    quantity: '',
    costPrice: '',
    supplier: '',
    entryDate: new Date().toISOString().split('T')[0],
    entryType: 'COMPRA' as 'COMPRA' | 'TROCA' | 'AJUSTE',
    notes: ''
  });

  const suppliers = ['Editora Alpha', 'Distribuidora Beta', 'Editora Gamma', 'Fornecedor Delta'];

  // Filtrar livros com estoque baixo
  const lowStockBooks = mockBooks.filter(book => book.stock <= 5);

  // Calcular valor de venda baseado no custo e grupo de precificação
  const calculateSalePrice = (costPrice: number, pricingGroup: string): number => {
    const margins: Record<string, number> = {
      'LITERATURA': 0.8, // 80% margem
      'TECNOLOGIA': 0.6, // 60% margem
      'ACADEMICO': 0.5,  // 50% margem
      'INFANTIL': 0.7    // 70% margem
    };
    
    const margin = margins[pricingGroup] || 0.6;
    return costPrice * (1 + margin);
  };

  const handleStockEntry = () => {
    if (!entryForm.bookId || !entryForm.quantity || !entryForm.costPrice || !entryForm.supplier) {
      toast({
        title: "Erro",
        description: "Todos os campos obrigatórios devem ser preenchidos.",
        variant: "destructive"
      });
      return;
    }

    if (parseInt(entryForm.quantity) <= 0) {
      toast({
        title: "Erro", 
        description: "A quantidade deve ser maior que zero.",
        variant: "destructive"
      });
      return;
    }

    const book = mockBooks.find(b => b.id === entryForm.bookId);
    if (!book) return;

    const newEntry: StockEntry = {
      id: Date.now().toString(),
      bookId: entryForm.bookId,
      book,
      quantity: parseInt(entryForm.quantity),
      costPrice: parseFloat(entryForm.costPrice),
      supplier: entryForm.supplier,
      entryDate: entryForm.entryDate,
      entryType: entryForm.entryType,
      notes: entryForm.notes
    };

    setStockEntries([...stockEntries, newEntry]);

    // Adicionar movimento de estoque
    const movement: StockMovement = {
      id: Date.now().toString(),
      bookId: book.id,
      book,
      type: 'ENTRADA',
      quantity: parseInt(entryForm.quantity),
      reason: `${entryForm.entryType} - ${entryForm.supplier}`,
      date: entryForm.entryDate,
      reference: `ENT-${Date.now().toString().slice(-6)}`
    };

    setStockMovements([...stockMovements, movement]);

    // Atualizar estoque do livro (mock)
    book.stock += parseInt(entryForm.quantity);

    // Calcular novo preço de venda se necessário
    const salePrice = calculateSalePrice(parseFloat(entryForm.costPrice), book.category[0]);
    
    toast({
      title: "Entrada realizada",
      description: `${entryForm.quantity} unidades de "${book.title}" adicionadas ao estoque. Preço de venda calculado: R$ ${salePrice.toFixed(2)}`,
    });

    // Reset form
    setEntryForm({
      bookId: '',
      quantity: '',
      costPrice: '',
      supplier: '',
      entryDate: new Date().toISOString().split('T')[0],
      entryType: 'COMPRA',
      notes: ''
    });

    setIsEntryDialogOpen(false);
  };

  const filteredEntries = stockEntries.filter(entry => {
    const matchesSearch = entry.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSupplier = !filterSupplier || entry.supplier === filterSupplier;
    return matchesSearch && matchesSupplier;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Controle de Estoque</h1>
          <p className="text-muted-foreground">Gerencie entradas, saídas e movimentações de estoque</p>
        </div>
        
        <Dialog open={isEntryDialogOpen} onOpenChange={setIsEntryDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Entrada
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Entrada em Estoque</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="book">Livro *</Label>
                <Select value={entryForm.bookId} onValueChange={(value) => setEntryForm({...entryForm, bookId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o livro" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBooks.map((book) => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.title} - {book.author}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity">Quantidade *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={entryForm.quantity}
                  onChange={(e) => setEntryForm({...entryForm, quantity: e.target.value})}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="costPrice">Valor de Custo (R$) *</Label>
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={entryForm.costPrice}
                  onChange={(e) => setEntryForm({...entryForm, costPrice: e.target.value})}
                  placeholder="0,00"
                />
              </div>

              <div>
                <Label htmlFor="supplier">Fornecedor *</Label>
                <Select value={entryForm.supplier} onValueChange={(value) => setEntryForm({...entryForm, supplier: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o fornecedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier} value={supplier}>
                        {supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="entryDate">Data de Entrada *</Label>
                <Input
                  id="entryDate"
                  type="date"
                  value={entryForm.entryDate}
                  onChange={(e) => setEntryForm({...entryForm, entryDate: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="entryType">Tipo de Entrada</Label>
                <Select value={entryForm.entryType} onValueChange={(value: any) => setEntryForm({...entryForm, entryType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMPRA">Compra</SelectItem>
                    <SelectItem value="TROCA">Troca</SelectItem>
                    <SelectItem value="AJUSTE">Ajuste</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Observações</Label>
                <Input
                  id="notes"
                  value={entryForm.notes}
                  onChange={(e) => setEntryForm({...entryForm, notes: e.target.value})}
                  placeholder="Observações opcionais"
                />
              </div>

              <Button onClick={handleStockEntry} className="w-full">
                Confirmar Entrada
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alertas de estoque baixo */}
      {lowStockBooks.length > 0 && (
        <Card className="p-4 border-orange-200 bg-orange-50">
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-orange-800">Estoque Baixo</h3>
          </div>
          <div className="space-y-1">
            {lowStockBooks.map((book) => (
              <p key={book.id} className="text-sm text-orange-700">
                {book.title} - Apenas {book.stock} unidade(s) em estoque
              </p>
            ))}
          </div>
        </Card>
      )}

      <Tabs defaultValue="entries" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entries">Entradas</TabsTrigger>
          <TabsTrigger value="movements">Movimentações</TabsTrigger>
          <TabsTrigger value="current">Estoque Atual</TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="space-y-4">
          {/* Filtros */}
          <Card className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-60">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Pesquisar por livro ou autor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filterSupplier} onValueChange={setFilterSupplier}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filtrar por fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os fornecedores</SelectItem>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier} value={supplier}>
                      {supplier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Lista de entradas */}
          <div className="grid gap-4">
            {filteredEntries.map((entry) => {
              const salePrice = calculateSalePrice(entry.costPrice, entry.book.category[0]);
              
              return (
                <Card key={entry.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{entry.book.title}</h3>
                        <Badge variant="outline">{entry.entryType}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">por {entry.book.author}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Quantidade:</span> {entry.quantity} unidades
                        </div>
                        <div>
                          <span className="font-medium">Fornecedor:</span> {entry.supplier}
                        </div>
                        <div>
                          <span className="font-medium">Custo unitário:</span> {formatCurrency(entry.costPrice)}
                        </div>
                        <div>
                          <span className="font-medium">Preço de venda:</span> {formatCurrency(salePrice)}
                        </div>
                        <div>
                          <span className="font-medium">Data de entrada:</span> {new Date(entry.entryDate).toLocaleDateString('pt-BR')}
                        </div>
                        <div>
                          <span className="font-medium">Valor total:</span> {formatCurrency(entry.costPrice * entry.quantity)}
                        </div>
                      </div>
                      {entry.notes && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Obs:</span> {entry.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="movements">
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <History className="w-5 h-5" />
                Histórico de Movimentações
              </h3>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Livro</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Referência</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>{new Date(movement.date).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{movement.book.title}</p>
                          <p className="text-sm text-muted-foreground">{movement.book.author}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={movement.type === 'ENTRADA' ? 'default' : 'secondary'}>
                          {movement.type}
                        </Badge>
                      </TableCell>
                      <TableCell className={movement.type === 'ENTRADA' ? 'text-green-600' : 'text-red-600'}>
                        {movement.type === 'ENTRADA' ? '+' : '-'}{movement.quantity}
                      </TableCell>
                      <TableCell>{movement.reason}</TableCell>
                      <TableCell>{movement.reference}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="current">
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Estoque Atual</h3>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Livro</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBooks.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {book.category.map((cat) => (
                            <Badge key={cat} variant="outline" className="text-xs">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={book.stock <= 5 ? 'text-red-600 font-semibold' : ''}>
                          {book.stock}
                        </span>
                      </TableCell>
                      <TableCell>{formatCurrency(book.price)}</TableCell>
                      <TableCell>
                        <Badge variant={book.stock === 0 ? 'destructive' : book.stock <= 5 ? 'secondary' : 'default'}>
                          {book.stock === 0 ? 'Sem estoque' : book.stock <= 5 ? 'Estoque baixo' : 'Disponível'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inventory;
import { Book, Customer, Order } from '../types';

export const mockBooks: Book[] = [
  {
    id: '1',
    isbn: '978-0-123456-47-2',
    title: 'O Senhor dos Anéis: A Sociedade do Anel',
    author: 'J.R.R. Tolkien',
    category: ['Fantasia', 'Aventura', 'Literatura Clássica'],
    price: 59.90,
    stock: 25,
    synopsis: 'Uma épica jornada através da Terra-média, onde um hobbit deve destruir um anel para salvar o mundo da escuridão. Uma obra-prima da literatura fantástica que cativou gerações de leitores.',
    dimensions: { height: 23, width: 16, weight: 450, depth: 3 },
    pages: 576,
    publisher: 'HarperCollins',
    year: 2019,
    edition: '1ª',
    barcode: '9780123456472',
    status: 'active',
    image: '/lovable-uploads/book-1.jpg'
  },
  {
    id: '2',
    isbn: '978-0-321125-48-3',
    title: 'Clean Code: Código Limpo',
    author: 'Robert C. Martin',
    category: ['Tecnologia', 'Programação', 'Desenvolvimento'],
    price: 89.90,
    stock: 15,
    synopsis: 'Um guia essencial para escrever código limpo, manutenível e eficiente. Aprenda as melhores práticas de programação com exemplos práticos e dicas valiosas.',
    dimensions: { height: 24, width: 17, weight: 520, depth: 2.8 },
    pages: 464,
    publisher: 'Alta Books',
    year: 2020,
    edition: '2ª',
    barcode: '9780321125483',
    status: 'active',
    image: '/lovable-uploads/book-2.jpg'
  },
  {
    id: '3',
    isbn: '978-0-456789-12-1',
    title: '1984',
    author: 'George Orwell',
    category: ['Ficção Científica', 'Distopia', 'Literatura Clássica'],
    price: 34.90,
    stock: 40,
    synopsis: 'Uma distopia visionária sobre um futuro totalitário onde a liberdade de pensamento é crime. Uma obra atemporal sobre vigilância, controle social e resistência.',
    dimensions: { height: 21, width: 14, weight: 280, depth: 2 },
    pages: 328,
    publisher: 'Companhia das Letras',
    year: 2021,
    edition: '3ª',
    barcode: '9780456789121',
    status: 'active',
    image: '/lovable-uploads/book-3.jpg'
  },
  {
    id: '4',
    isbn: '978-0-789123-45-6',
    title: 'Dom Casmurro',
    author: 'Machado de Assis',
    category: ['Literatura Brasileira', 'Romance', 'Clássicos'],
    price: 29.90,
    stock: 30,
    synopsis: 'O clássico romance de Machado de Assis que narra a história de Bentinho e Capitu. Uma obra fundamental da literatura brasileira que explora ciúme, amor e sociedade.',
    dimensions: { height: 20, width: 13, weight: 200, depth: 1.5 },
    pages: 256,
    publisher: 'Penguin Clássicos',
    year: 2020,
    edition: '1ª',
    barcode: '9780789123456',
    status: 'active',
    image: '/lovable-uploads/book-4.jpg'
  },
  {
    id: '5',
    isbn: '978-0-654321-98-7',
    title: 'O Pequeno Príncipe',
    author: 'Antoine de Saint-Exupéry',
    category: ['Infantil', 'Filosofia', 'Literatura Clássica'],
    price: 24.90,
    stock: 50,
    synopsis: 'Uma fábula poética sobre amizade, amor e perda. Uma história que toca corações de todas as idades com suas lições sobre o que realmente importa na vida.',
    dimensions: { height: 19, width: 12, weight: 150, depth: 1.2 },
    pages: 144,
    publisher: 'Agir',
    year: 2022,
    edition: '4ª',
    barcode: '9780654321987',
    status: 'active',
    image: '/lovable-uploads/book-5.jpg'
  }
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    code: 'CLI001',
    name: 'Ana Silva',
    cpf: '123.456.789-00',
    email: 'ana.silva@email.com',
    password: 'hashedPassword123',
    gender: 'F',
    birthDate: '1990-05-15',
    phone: '(11) 99123-4567',
    ranking: 4,
    addresses: [
      {
        id: '1',
        identifier: 'Casa Principal',
        type: 'AMBOS',
        residenceType: 'Casa',
        street: 'Rua das Letras',
        number: '123',
        complement: '',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        country: 'Brasil',
        zipCode: '01234-567',
        observations: '',
        isDefault: true
      },
      {
        id: '2',
        identifier: 'Trabalho',
        type: 'ENTREGA',
        residenceType: 'Comercial',
        street: 'Av. dos Romances',
        number: '456',
        complement: 'Sala 1201',
        neighborhood: 'Jardins',
        city: 'São Paulo',
        state: 'SP',
        country: 'Brasil',
        zipCode: '04567-890',
        observations: 'Portaria 24h',
        isDefault: false
      }
    ],
    cards: [
      {
        id: '1',
        number: '**** **** **** 1234',
        name: 'ANA SILVA',
        expiryDate: '12/26',
        isDefault: true
      }
    ],
    status: 'active'
  },
  {
    id: '2',
    code: 'CLI002',
    name: 'João Santos',
    cpf: '987.654.321-00',
    email: 'joao.santos@email.com',
    password: 'hashedPassword456',
    gender: 'M',
    birthDate: '1985-10-22',
    phone: '(11) 99987-6543',
    ranking: 3,
    addresses: [
      {
        id: '3',
        identifier: 'Apartamento',
        type: 'ENTREGA',
        residenceType: 'Apartamento',
        street: 'Av. dos Romances',
        number: '456',
        complement: 'Apto 504',
        neighborhood: 'Vila Madalena',
        city: 'Rio de Janeiro',
        state: 'RJ',
        country: 'Brasil',
        zipCode: '20567-890',
        observations: '',
        isDefault: true
      },
      {
        id: '4',
        identifier: 'Endereço de Cobrança',
        type: 'COBRANCA',
        residenceType: 'Casa',
        street: 'Rua da Poesia',
        number: '789',
        complement: '',
        neighborhood: 'Copacabana',
        city: 'Rio de Janeiro',
        state: 'RJ',
        country: 'Brasil',
        zipCode: '22071-900',
        observations: '',
        isDefault: true
      }
    ],
    cards: [],
    status: 'active'
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    customerId: '1',
    items: [
      {
        bookId: '1',
        book: mockBooks[0],
        quantity: 1,
        price: 59.90,
        addedAt: new Date('2024-01-15T10:00:00Z')
      },
      {
        bookId: '3',
        book: mockBooks[2],
        quantity: 2,
        price: 34.90,
        addedAt: new Date('2024-01-15T10:05:00Z')
      }
    ],
    deliveryAddress: mockCustomers[0].addresses[0],
    billingAddress: mockCustomers[0].addresses[0],
    freight: 15.90,
    total: 145.60,
    status: 'ENTREGUE',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:00:00Z'
  },
  {
    id: '2',
    customerId: '2',
    items: [
      {
        bookId: '2',
        book: mockBooks[1],
        quantity: 1,
        price: 89.90,
        addedAt: new Date('2024-01-18T15:30:00Z')
      }
    ],
    deliveryAddress: mockCustomers[1].addresses[0],
    billingAddress: mockCustomers[1].addresses[1],
    freight: 12.50,
    total: 102.40,
    status: 'EM_TRANSITO',
    createdAt: '2024-01-18T16:00:00Z',
    updatedAt: '2024-01-19T09:15:00Z'
  }
];

// Mock data para dropdown de estados brasileiros
export const brazilianStates = [
  { code: 'AC', name: 'Acre' },
  { code: 'AL', name: 'Alagoas' },
  { code: 'AP', name: 'Amapá' },
  { code: 'AM', name: 'Amazonas' },
  { code: 'BA', name: 'Bahia' },
  { code: 'CE', name: 'Ceará' },
  { code: 'DF', name: 'Distrito Federal' },
  { code: 'ES', name: 'Espírito Santo' },
  { code: 'GO', name: 'Goiás' },
  { code: 'MA', name: 'Maranhão' },
  { code: 'MT', name: 'Mato Grosso' },
  { code: 'MS', name: 'Mato Grosso do Sul' },
  { code: 'MG', name: 'Minas Gerais' },
  { code: 'PA', name: 'Pará' },
  { code: 'PB', name: 'Paraíba' },
  { code: 'PR', name: 'Paraná' },
  { code: 'PE', name: 'Pernambuco' },
  { code: 'PI', name: 'Piauí' },
  { code: 'RJ', name: 'Rio de Janeiro' },
  { code: 'RN', name: 'Rio Grande do Norte' },
  { code: 'RS', name: 'Rio Grande do Sul' },
  { code: 'RO', name: 'Rondônia' },
  { code: 'RR', name: 'Roraima' },
  { code: 'SC', name: 'Santa Catarina' },
  { code: 'SP', name: 'São Paulo' },
  { code: 'SE', name: 'Sergipe' },
  { code: 'TO', name: 'Tocantins' }
];

export const residenceTypes = [
  'Casa',
  'Apartamento',
  'Condomínio',
  'Comercial',
  'Rural',
  'Outros'
];

export const bookCategories = [
  'Literatura Brasileira',
  'Literatura Estrangeira', 
  'Ficção Científica',
  'Fantasia',
  'Romance',
  'Suspense/Thriller',
  'Mistério',
  'Drama',
  'Biografia',
  'História',
  'Filosofia',
  'Ciências',
  'Tecnologia',
  'Programação',
  'Desenvolvimento',
  'Autoajuda',
  'Negócios',
  'Economia',
  'Política',
  'Religião',
  'Espiritualidade',
  'Saúde',
  'Culinária',
  'Arte',
  'Música',
  'Esportes',
  'Viagem',
  'Infantil',
  'Juvenil',
  'Educação',
  'Didático',
  'Dicionários',
  'Enciclopédias'
];
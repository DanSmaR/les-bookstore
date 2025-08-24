// E-commerce Types
export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string[];
  price: number;
  stock: number;
  synopsis: string;
  dimensions: {
    height: number;
    width: number;
    weight: number;
    depth: number;
  };
  pages: number;
  publisher: string;
  year: number;
  edition: string;
  barcode: string;
  status: 'active' | 'inactive';
  image?: string;
}

export interface Address {
  id: string;
  identifier: string;
  type: 'ENTREGA' | 'COBRANCA' | 'AMBOS';
  residenceType: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  observations?: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  cpf: string;
  email: string;
  password: string;
  gender: 'M' | 'F' | 'O';
  birthDate: string;
  phone: string;
  ranking: number;
  addresses: Address[];
  cards: Card[];
  status: 'active' | 'inactive';
}

export interface Card {
  id: string;
  number: string; // masked
  name: string;
  expiryDate: string;
  isDefault: boolean;
}

export interface CartItem {
  bookId: string;
  book: Book;
  quantity: number;
  price: number;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  expiresAt: Date;
}

export interface Order {
  id: string;
  customerId: string;
  items: CartItem[];
  deliveryAddress: Address;
  billingAddress: Address;
  freight: number;
  total: number;
  status: 'EM_PROCESSAMENTO' | 'APROVADO' | 'EM_TRANSITO' | 'ENTREGUE' | 'CANCELADO';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  role: 'customer' | 'admin';
  customer?: Customer;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  cpf: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: 'M' | 'F' | 'O';
  birthDate: string;
  phone: string;
  // Initial address
  addressIdentifier: string;
  residenceType: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  observations?: string;
}

export interface AddressForm {
  identifier: string;
  type: 'ENTREGA' | 'COBRANCA' | 'AMBOS';
  residenceType: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  observations?: string;
  isDefault: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  errors?: Record<string, string>;
}

// Filter types
export interface BookFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  author?: string;
  sortBy?: 'title' | 'price' | 'author' | 'year';
  sortOrder?: 'asc' | 'desc';
}

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// Inventory types
export interface StockEntry {
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

export interface StockMovement {
  id: string;
  bookId: string;
  book: Book;
  type: 'ENTRADA' | 'SAIDA';
  quantity: number;
  reason: string;
  date: string;
  reference?: string;
}
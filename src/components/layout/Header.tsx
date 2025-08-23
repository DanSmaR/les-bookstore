import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import Button from '../common/Button';
import Badge from '../common/Badge';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const cartItemsCount = getCartItemsCount();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">📚</span>
            </div>
            <span className="text-xl font-bold text-foreground">BookStore</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/catalog" className="text-foreground hover:text-primary transition-colors">
              Catálogo
            </Link>
            <Link to="/categories" className="text-foreground hover:text-primary transition-colors">
              Categorias
            </Link>
            <Link to="/offers" className="text-foreground hover:text-primary transition-colors">
              Ofertas
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar livros..."
                  className="w-64 px-4 py-2 pl-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m2.5-5h6" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-medium text-sm">
                      {user.customer?.name.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                  <span className="hidden md:block">
                    {user.customer?.name || 'Admin'}
                  </span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                    {user.role === 'customer' ? (
                      <>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-foreground hover:bg-muted transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Meu Perfil
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-foreground hover:bg-muted transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Meus Pedidos
                        </Link>
                        <Link
                          to="/addresses"
                          className="block px-4 py-2 text-foreground hover:bg-muted transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Endereços
                        </Link>
                      </>
                    ) : (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-foreground hover:bg-muted transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Painel Admin
                      </Link>
                    )}
                    <hr className="my-2 border-border" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-destructive hover:bg-muted transition-colors"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost">Entrar</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary">Cadastrar</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="flex flex-col space-y-4">
              <Link to="/catalog" className="text-foreground hover:text-primary transition-colors">
                Catálogo
              </Link>
              <Link to="/categories" className="text-foreground hover:text-primary transition-colors">
                Categorias
              </Link>
              <Link to="/offers" className="text-foreground hover:text-primary transition-colors">
                Ofertas
              </Link>
              
              {/* Mobile search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar livros..."
                  className="w-full px-4 py-2 pl-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
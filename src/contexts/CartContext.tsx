import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart, CartItem, Book } from '../types';

interface CartContextType {
  cart: Cart | null;
  addToCart: (book: Book, quantity?: number) => boolean;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  isItemInCart: (bookId: string) => boolean;
  timeRemaining: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_EXPIRY_MINUTES = 15;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart: Cart = JSON.parse(storedCart);
        const now = new Date();
        const expiresAt = new Date(parsedCart.expiresAt);
        
        if (expiresAt > now) {
          setCart(parsedCart);
        } else {
          localStorage.removeItem('cart');
        }
      } catch (error) {
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Timer for cart expiry
  useEffect(() => {
    if (!cart) {
      setTimeRemaining(0);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const expiresAt = new Date(cart.expiresAt);
      const remaining = Math.max(0, expiresAt.getTime() - now.getTime());
      
      setTimeRemaining(Math.ceil(remaining / 1000));
      
      if (remaining <= 0) {
        setCart(null);
        localStorage.removeItem('cart');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cart]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);

  const addToCart = (book: Book, quantity = 1): boolean => {
    if (book.stock < quantity) {
      return false;
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + CART_EXPIRY_MINUTES * 60 * 1000);

    const newItem: CartItem = {
      bookId: book.id,
      book,
      quantity,
      price: book.price,
      addedAt: now
    };

    setCart(prevCart => {
      if (!prevCart) {
        return {
          items: [newItem],
          expiresAt
        };
      }

      const existingItemIndex = prevCart.items.findIndex(item => item.bookId === book.id);
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevCart.items];
        const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
        
        if (newQuantity > book.stock) {
          return prevCart; // Don't add if exceeds stock
        }
        
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newQuantity
        };
        
        return {
          ...prevCart,
          items: updatedItems,
          expiresAt // Reset expiry time when adding items
        };
      } else {
        return {
          ...prevCart,
          items: [...prevCart.items, newItem],
          expiresAt // Reset expiry time when adding items
        };
      }
    });

    return true;
  };

  const removeFromCart = (bookId: string) => {
    setCart(prevCart => {
      if (!prevCart) return null;
      
      const updatedItems = prevCart.items.filter(item => item.bookId !== bookId);
      
      if (updatedItems.length === 0) {
        return null;
      }
      
      return {
        ...prevCart,
        items: updatedItems
      };
    });
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }

    setCart(prevCart => {
      if (!prevCart) return null;
      
      const updatedItems = prevCart.items.map(item => {
        if (item.bookId === bookId) {
          // Check stock availability
          if (quantity > item.book.stock) {
            return item; // Don't update if exceeds stock
          }
          return {
            ...item,
            quantity
          };
        }
        return item;
      });
      
      return {
        ...prevCart,
        items: updatedItems
      };
    });
  };

  const clearCart = () => {
    setCart(null);
  };

  const getCartTotal = (): number => {
    if (!cart) return 0;
    
    return cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const getCartItemsCount = (): number => {
    if (!cart) return 0;
    
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  const isItemInCart = (bookId: string): boolean => {
    if (!cart) return false;
    
    return cart.items.some(item => item.bookId === bookId);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartItemsCount,
      isItemInCart,
      timeRemaining
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  productId: string;
  quantity: number;
  startDate: Date;
  endDate: Date;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, startDate: Date) => void;
  updateQuantity: (productId: string, startDate: Date, quantity: number) => void;
  updateDates: (productId: string, oldStartDate: Date, newStartDate: Date, newEndDate: Date) => void;
  clearCart: () => void;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        cartItem => 
          cartItem.productId === item.productId && 
          cartItem.startDate.getTime() === item.startDate.getTime() &&
          cartItem.endDate.getTime() === item.endDate.getTime()
      );
      
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.productId === item.productId && 
          cartItem.startDate.getTime() === item.startDate.getTime()
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      
      return [...prevCart, item];
    });
  };

  const removeFromCart = (productId: string, startDate: Date) => {
    setCart(prevCart => 
      prevCart.filter(item => 
        !(item.productId === productId && item.startDate.getTime() === startDate.getTime())
      )
    );
  };

  const updateQuantity = (productId: string, startDate: Date, quantity: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId && item.startDate.getTime() === startDate.getTime()
          ? { ...item, quantity }
          : item
      )
    );
  };

  const updateDates = (productId: string, oldStartDate: Date, newStartDate: Date, newEndDate: Date) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId && item.startDate.getTime() === oldStartDate.getTime()
          ? { ...item, startDate: newStartDate, endDate: newEndDate }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateDates,
      clearCart,
      getCartItemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

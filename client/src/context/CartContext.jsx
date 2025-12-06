import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // {product, quantity}

  function addToCart(product, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((p) => p.product.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.product.id === product.id
            ? { ...p, quantity: p.quantity + quantity }
            : p
        );
      }
      return [...prev, { product, quantity }];
    });
  }

  function updateQuantity(productId, quantity) {
    setItems((prev) =>
      prev.map((p) =>
        p.product.id === productId ? { ...p, quantity } : p
      )
    );
  }

  function removeFromCart(productId) {
    setItems((prev) => prev.filter((p) => p.product.id !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
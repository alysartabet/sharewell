import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { createOrder } from "../api.js";

export default function CartCheckoutPage() {
  const { items, total, updateQuantity, removeFromCart, clearCart } =
    useCart();
  const { customerId, refreshCustomerStats } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setSubmitting(true);
    setError("");
    setResult(null);

    try {
    if (!customerId) {
      setError("Please select a customer before checking out.");
      setSubmitting(false);
      return;
    }

    const payload = {
      customerId: Number(customerId),
      items: items.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
      })),
    };

    const data = await createOrder(payload);
    setResult(data);
    clearCart();

    // Immediately refresh XP and tier from backend
    refreshCustomerStats();
  } catch (err) {
    console.error(err);
    setError(err.message || "Error: Failed to create order");
  } finally {
    setSubmitting(false);
  }
}

  if (!items.length) {
    return (
      <div className="page cart-page">
        <h1>Cart</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="page cart-page">
      <h1>Cart & Checkout</h1>

      <table className="cart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Line Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ product, quantity }) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    updateQuantity(product.id, Number(e.target.value))
                  }
                />
              </td>
              <td>${Number(product.price).toFixed(2)}</td>
              <td>${(Number(product.price) * quantity).toFixed(2)}</td>
              <td>
                <button onClick={() => removeFromCart(product.id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="cart-total">Subtotal (approx): ${total.toFixed(2)}</p>
      <p className="muted">
        Final total, tax, and discounts come from the backend orders logic.
      </p>

      <button disabled={submitting} onClick={handleCheckout}>
        {submitting ? "Processing..." : "Place Order"}
      </button>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="card">
          <h2>Order Placed!</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchOrderHistory } from "../api.js";

export default function OrderHistoryPage() {
  const { customerId } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId) return;
    setLoading(true);
    fetchOrderHistory(customerId)
      .then(setOrders)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [customerId]);

  if (loading) return <p>Loading order history...</p>;

  return (
    <div className="page orders-page">
      <h1>Order History</h1>
      {!orders.length && <p>No orders yet.</p>}

      {orders.map((o) => (
        <div key={o.id} className="card order-card">
          <h2>Order {new Date(o.created_at).toLocaleDateString()}</h2>
          <p>Status: {o.status}</p>
          <p>
            Total: ${Number(o.total_amount).toFixed(2)} (Subtotal: $
            {Number(o.subtotal_amount).toFixed(2)}, Tax: $
            {Number(o.tax_amount).toFixed(2)})
          </p>
          <p>
            Placed at: {" "}
            {new Date(o.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <h3>Items</h3>
          <ul>
            {o.items.map((it, idx) => (
              <li key={idx}>
                Product #{it.product_id} - Qty {it.quantity} - $
                {Number(it.line_total).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
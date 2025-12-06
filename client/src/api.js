const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function jsonFetch(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

// Products
export const fetchProducts = () => jsonFetch("/products");
export const fetchProductById = (id) => jsonFetch(`/products/${id}`);
export const searchProducts = (q) => jsonFetch(`/products/search/query?q=${encodeURIComponent(q)}`);

// Customers (for fake login)
export const fetchCustomers = () => jsonFetch("/customers");

// Orders
export const createOrder = (body) =>
  jsonFetch("/orders", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const fetchOrderHistory = (customerId) =>
  jsonFetch(`/orders/history/${customerId}`);

// Admin
export const fetchAdminOrders = () => jsonFetch("/admin/orders");
export const fetchAdminCustomers = () => jsonFetch("/admin/customers");
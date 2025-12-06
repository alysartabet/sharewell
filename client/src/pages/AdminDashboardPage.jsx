import { useEffect, useState } from "react";
import { fetchAdminCustomers, fetchAdminOrders } from "../api.js";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [o, c] = await Promise.all([
          fetchAdminOrders(),
          fetchAdminCustomers(),
        ]);
        setOrders(o);
        setCustomers(c);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Loading admin data...</p>;

  return (
    <div className="page admin-page">
      <h1>Admin Dashboard</h1>

      <section>
        <h2>Recent Orders</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Customer</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{new Date(o.created_at).toLocaleString()}</td>
                <td>{o.status}</td>
                <td>{Number(o.total_amount).toFixed(2)}</td>
                <td>
                  {o.first_name} {o.last_name} ({o.email})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Recent Customers</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>XP</th>
              <th>Tier ID</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>
                  {c.first_name} {c.last_name}
                </td>
                <td>{c.email}</td>
                <td>{c.xp_balance}</td>
                <td>{c.membership_tier_name || "—"}</td>
                <td>
                  {c.total_equity != null
                    ? Number(c.total_equity).toFixed(4)
                    : "0.0000"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
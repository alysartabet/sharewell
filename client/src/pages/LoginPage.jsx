//AuthUI
// src/pages/LoginPage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchCustomers } from "../api.js";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { loginCustomer, loginAdmin } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers()
      .then(setCustomers)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  function handleCustomerSignIn(e) {
    e.preventDefault();
    setError("");

    if (!selectedCustomerId) {
      setError("Please select a customer to sign in.");
      return;
    }

    loginCustomer(Number(selectedCustomerId));
  }

  function handleAdminLogin(e) {
    e.preventDefault();
    setError("");

    // Fake admin code (for project demo)
    if (adminCode === "sharewell-admin") {
      loginAdmin();
      navigate("/admin");
    } else {
      setError("Invalid admin code");
    }
  }

  if (loading) return <p>Loading customers...</p>;

  return (
    <div className="page login-page">
      <h1>Sign In</h1>

      {error && <p className="error">{error}</p>}

      <section className="card">
        <h2>Sign in as Customer</h2>
        <p>Select an existing customer and click Sign In.</p>

        <form onSubmit={handleCustomerSignIn} className="login-form">
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
          >
            <option value="">-- Select a customer --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                #{c.id} {c.first_name} {c.last_name} ({c.email})
              </option>
            ))}
          </select>

          <button type="submit" disabled={!selectedCustomerId}>
            Sign In
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Sign in as Admin</h2>
        <form onSubmit={handleAdminLogin} className="login-form">
          <input
            type="password"
            placeholder="Admin code"
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
          />
          <button type="submit">Login as Admin</button>
        </form>
        <p className="hint">Hint: try code "sharewell-admin"</p>
      </section>
    </div>
  );
}

import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CartCheckoutPage from "./pages/CartCheckoutPage.jsx";
import OrderHistoryPage from "./pages/OrderHistoryPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function CustomerRoute({ children }) {
  const { customerId } = useAuth();
  if (!customerId) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />

        <Route
          path="/cart"
          element={
            <CustomerRoute>
              <CartCheckoutPage />
            </CustomerRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <CustomerRoute>
              <OrderHistoryPage />
            </CustomerRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
      </Routes>
    </Layout>
  );
}
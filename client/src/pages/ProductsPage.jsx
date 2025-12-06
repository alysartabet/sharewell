//Product Listing
import { useEffect, useState } from "react";
import { fetchProducts, searchProducts } from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!q.trim()) {
      loadAll();
      return;
    }
    setLoading(true);
    try {
      const data = await searchProducts(q.trim());
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <div className="page products-page">
      <h1>Products</h1>

      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Search for rice, oil..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { PRODUCT_IMAGES } from "../assets/productImages.js";

function getInitials(str = "") {
  return str
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { id, name, price, inventory_qty, supplier_name } = product;
  const [open, setOpen] = useState(false);

  const supplierInitials = getInitials(supplier_name);
  const imageSet = PRODUCT_IMAGES[name]; 

  return (
    <div className={`card product-card ${open ? "product-card-open" : ""}`}>
      {/* Clickable product header (expands card) */}
      <button
        type="button"
        className="product-head"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className={`product-media ${imageSet ? "has-image" : ""}`}>
          {imageSet ? (
            <div className="product-image-wrap">
              <img 
                src={imageSet.front}
                alt={`${name} front`}
                className="product-image product-image-front"
              />
              {imageSet.back && (
                <img 
                  src={imageSet.back}
                  alt={`$(name) back`}
                  className= "product-image product-image-back"
                />
              )}
            </div>
          ) : (
            <div className="product-can">
              <div className="product-can-top" />
              <div className="product-can-body">
                <span className="product-initials">
                  {getInitials(name)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="product-main">
          <h3>{name}</h3>
          <p className="product-price">${Number(price).toFixed(2)}</p>
          <p className="product-supplier">
            <span
              className="supplier-logo"
              data-supplier={supplier_name}
            >
              {supplierInitials}
            </span>
            {supplier_name}
          </p>
        </div>

        <span className="product-toggle">
          {open ? "-" : "+"}
        </span>
      </button>

      {/* Expanded area */}
      {open && (
        <div className="product-extra">
          <p className="muted">
            {product.inventory_qty > 10 
              ? "In stock" 
              : `${product.inventory_qty} left. Hurry!`
            }
          </p>
          <p className="muted">
            Earn XP &amp; equity rewards when you buy this!
          </p>
        </div>
      )}

      {/* Actions stay fixed at the bottom */}
      <div className="product-actions">
        <Link to={`/products/${id}`}>Details</Link>
        <button onClick={() => addToCart(product, 1)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
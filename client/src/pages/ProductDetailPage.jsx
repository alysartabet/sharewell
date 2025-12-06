import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../api.js";
import { useCart } from "../context/CartContext.jsx";
import { PRODUCT_IMAGES } from "../assets/productImages.js";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSide, setActiveSide] = useState("front");

  useEffect(() => {
    setLoading(true);
    fetchProductById(id)
      .then(setProduct)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading product...</p>;
  if (!product) return <p>Product not found.</p>;
  
  const imageSet = PRODUCT_IMAGES[product.name];
  const hasFront = !!imageSet?.front;
  const hasBack = !!imageSet?.back;
  const currentImage =
    activeSide === "back" && hasBack ? imageSet.back : imageSet?.front;

  return (
    <div className="page product-detail">
      <div className="product-detail-info">
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p className="price">${Number(product.price).toFixed(2)}</p>
        <p>
          {product.inventory_qty > 10 
            ? "In stock" 
            : `${product.inventory_qty} left. Hurry!`
          }
        </p>
        <button onClick={() => addToCart(product, 1)}>Add to Cart</button>
      </div>

      {hasFront && (
        <div className="product-detail-visual">
          <div className="product-detail-frame">
            <img
              src={currentImage}
              alt={
                activeSide === "back"
                  ? `${product.name} back`
                  : `${product.name} front`
              }
              className="product-detail-image"
            />
          </div>

          {hasBack && (
            <div className="product-detail-carousel">
              <button
                type="button"
                className={
                  activeSide === "front"
                    ? "carousel-dot carousel-dot-active"
                    : "carousel-dot"
                }
                onClick={() => setActiveSide("front")}
              >
                Front
              </button>
              <button
                type="button"
                className={
                  activeSide === "back"
                    ? "carousel-dot carousel-dot-active"
                    : "carousel-dot"
                }
                onClick={() => setActiveSide("back")}
              >
                Back
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
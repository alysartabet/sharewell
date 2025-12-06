import { Link } from "react-router-dom";
import logoWrapper from "../assets/logo/logowrapper.png";
import fruitsBasket from "../assets/products/fruits-basket.png";

export default function HomePage() {
  return (
    <div className="page home-page">
      <div className="home-copy">
        <img
          src={logoWrapper}
          alt="Sharewell"
          className="home-logo"
        />

        <p className="home-subtitle">
          <span className="subtitle-primary">
            Grow with every choice, share in the reward.
          </span>
          <span className="subtitle-secondary">
            A member-first marketplace reimagined: discover products, check out with ease,
            and earn XP and equity on every purchase.
          </span>
        </p>

        <div className="home-actions">
          <Link to="/login" className="btn">
            Sign In
          </Link>
          <Link to="/products" className="btn-secondary">
            Start Shopping
          </Link>
        </div>
      </div>

      <div className="home-hero">
        <div className="home-hero-card">
          <img
            src={fruitsBasket}
            alt="Curated basket of fresh produce"
            className="home-hero-image"
          />
        </div>
      </div>
    </div>
  );
}
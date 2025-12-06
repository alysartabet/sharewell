import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import logo from "../assets/logo/logo.png";
import hamburgerIcon from "../assets/icons/hamburger-menu.png";

export default function NavBar() {
  const { customerId, isAdmin, logout, xpBalance, tierName, customerName } = useAuth();
  const { items } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const hasSession = customerId || isAdmin;

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className="nav">
      <nav className="nav-inner">
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          <img src={logo} alt="Sharewell" className="logo-img" />
        </Link>

        {/* Desktop links */}
        <div className="nav-links nav-links-desktop">
          <Link to="/products">Shop</Link>
          {customerId && <Link to="/orders">My Orders</Link>}
          {isAdmin && <Link to="/admin">Admin</Link>}
          <Link to="/cart">My Cart ({cartCount})</Link>
        </div>

        <div className="nav-right">
          {/* Mobile hamburger */}
          <button
            type="button"
            className={`nav-hamburger ${mobileOpen ? "nav-hamburger-open" : ""}`}
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <img
              src={hamburgerIcon}
              alt=""
              className="nav-hamburger-icon"
            />
          </button>

          {/* Auth section (visible on all sizes) */}
          <div className="nav-auth">
            {customerId && !isAdmin && (
              <span className="nav-pill">
                {tierName || "Member"} • {xpBalance ?? 0} XP
              </span>
            )}
            {isAdmin && <span className="nav-pill">Admin</span>}
            <Link to="/login" className="btn-small" onClick={closeMobileMenu}>
              {hasSession
                ? isAdmin
                  ? "Not Admin?"
                  : customerName
                  ? `Not ${customerName}?`
                  : "Switch"
                : "Sign In"}
            </Link>
            {hasSession && (
              <button
                className="btn-small"
                type="button"
                onClick={() => {
                  logout();
                  closeMobileMenu();
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="nav-mobile-menu">
          <Link to="/products" onClick={closeMobileMenu}>
            Shop
          </Link>
          {customerId && (
            <Link to="/orders" onClick={closeMobileMenu}>
              My Orders
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" onClick={closeMobileMenu}>
              Admin
            </Link>
          )}
          <Link to="/cart" onClick={closeMobileMenu}>
            My Cart ({cartCount})
          </Link>
        </div>
      )}
    </header>
  );
}
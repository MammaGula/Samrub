import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useStore } from "../../context/StoreContext";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  // import functions from StoreContext
  const { getTotalCartCount, clearFavorites, clearCart } = useStore();

  // - authed: true/false — used to show Sign In or Sign Out button
  // - logout: clears token + user from localStorage and React state
  const { authed, logout } = useAuth();

  // Controls hamburger dropdown open/close
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  // Toggle hamburger menu open/close
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  // handleSignOut: UI-logic , Coordinator
  const handleSignOut = () => {
    logout(); // Clear auth data (token + user) from localStorage and React state
    clearFavorites(); // Clear favorites from state
    clearCart(); // Clear cart from state
    navigate("/");
    closeMenu();
  };

  // =============== Render >>> html ===============
  return (
    <nav className="navbar">
      {/* 1. Left: Hamburger */}
      <button className="hamburger" onClick={toggleMenu} aria-label="Open menu">
        <Icon icon="mdi:menu" width="55" height="45" />
      </button>

      {/* 1.1. Hamburger dropdown */}
      {menuOpen && (
        <div className="dropdown-menu">
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>
          <Link to="/menu" onClick={closeMenu}>
            Menu
          </Link>
          <Link to="/favorites" onClick={closeMenu}>
            Favorites
          </Link>
          <Link to="/basket" onClick={closeMenu}>
            Basket
          </Link>

          {/* Show Sign In or Sign Out based on auth status */}
          {authed ? (
            <button onClick={handleSignOut}>Sign Out</button>
          ) : (
            <Link to="/login" onClick={closeMenu}>
              Sign In
            </Link>
          )}
        </div>
      )}


      {/* 2. Center: Logo */}
      <Link to="/" className="navbar-logo" onClick={closeMenu}>
        Samrub
      </Link>

      {/* 3. Right: Icons */}
      <div className="navbar-icons">

        {/* 3.1 Favorites */}
        <Link to="/favorites" className="heart-icon" aria-label="Favorites">
          <Icon icon="mdi:heart-outline" width="50" height="50" />
        </Link>

        {/* 3.2 Basket */}
        <Link
          to="/basket"
          className="basket-icon"
          aria-label="Basket"
          onClick={closeMenu}
        >
          <Icon icon="majesticons:basket-2" width="50" height="50" />
          {/* Show badge(amount) only when cart has items */}
          {getTotalCartCount() > 0 && (
            <span className="cart-badge">{getTotalCartCount()}</span>
          )}
        </Link>

        {/* 3.3 Sign in/out */}
        {/* when auth > True: show Sign out button, otherwise show Sign in link */}
        {authed ? (
          <button className="btn-signin" onClick={handleSignOut}>
            Sign out
          </button>
        ) : (
          <Link to="/login" className="btn-signin">
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

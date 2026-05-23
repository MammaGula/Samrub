import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useStore } from "../../context/StoreContext";
import "./Navbar.css";

const Navbar = () => {
  const { getTotalCartCount, token, setToken } = useStore();

  // Controls hamburger dropdown open/close
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  // Clear token from state + localStorage, redirect to home
  const handleSignOut = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/");
    closeMenu();
  };

  return (
    <nav className="navbar">
      {/* 1. Left: Hamburger */}
      <button className="hamburger" onClick={toggleMenu} aria-label="Open menu">
        <Icon icon="mdi:menu" width="55" height="45" />
      </button>

      {/* 4. Hamburger dropdown */}
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
          {token ? (
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
        <Link to="/favorites" aria-label="Favorites">
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
          {/* Show badge only when cart has items */}
          {getTotalCartCount() > 0 && (
            <span className="cart-badge">{getTotalCartCount()}</span>
          )}
        </Link>

        {/* 3.3 Sign in/out */}
        {token ? (
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

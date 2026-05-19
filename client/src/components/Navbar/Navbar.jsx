import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { StoreContext } from "../../context/StoreContext";
import "./Navbar.css";

// Context: Navbar component >> shows logo, navigation links, cart icon etc.
const Navbar = () => {
  // Get global state from StoreContext
  const { getTotalCartCount, token, setToken } = useContext(StoreContext);

  // State: to control hamburger dropdown open/close
  const [menuOpen, setMenuOpen] = useState(false);

  // For programmatic navigation after sign out
  const navigate = useNavigate();

  // ================= Handlers =========================

  // Toggle hamburger dropdown: open if closed, close if open
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // Close dropdown when user clicks a link
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Handle Sign Out: clear token from state + localStorage, go to home
  const handleSignOut = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/");
    closeMenu();
  };

  // ================= Render =========================
  return (
    <nav className="navbar">
      {/* Left: Hamburger button */}
      <button className="hamburger" onClick={toggleMenu} aria-label="Open menu">
        <Icon icon="mdi:menu" width="55" height="45" />
      </button>

      {/* Center: Logo (absolute positioned) */}
      <Link to="/" className="navbar-logo" onClick={closeMenu}>
        Samrub
      </Link>

      {/* Right-Frame: Icon buttons */}
      <div className="navbar-icons">
        <Link to="/favorites" aria-label="Favorites">
          <Icon icon="mdi:heart-outline" width="50" height="50" />
        </Link>

        <Link to="/menu" aria-label="Search menu">
          <Icon icon="mdi:magnify" width="50" height="50" />
        </Link>

        <Link to="/basket" className="basket-icon" aria-label="Basket">
          <Icon icon="majesticons:basket-2" width="50" height="50" />

          {/* Badge: show total count only if cart has items */}
          {getTotalCartCount() > 0 && (
            <span className="cart-badge">{getTotalCartCount()}</span>
          )}
        </Link>

        {/* Sign In / Sign Out button */}
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

      {/* Dropdown menu (hamburger) 
      - if menuOpen is true, show dropdown >> and close menu when a link is clicked */}
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
    </nav>
  );
};

export default Navbar;

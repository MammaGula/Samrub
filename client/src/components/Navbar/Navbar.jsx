import { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { StoreContext } from "../../context/StoreContext";
import "./Navbar.css";

// Context: Navbar component >> shows logo, navigation links, cart icon etc.
const Navbar = () => {
  // Get global state from StoreContext
  const { getTotalCartCount, token, setToken, foodList } =
    useContext(StoreContext);

  // State: to control hamburger dropdown open/close
  const [menuOpen, setMenuOpen] = useState(false);

  // State: to control search bar open/close
  const [searchOpen, setSearchOpen] = useState(false);

  // State: search input value
  const [searchQuery, setSearchQuery] = useState("");

  // Ref: focus input when search bar opens
  const searchInputRef = useRef(null);

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

  // Toggle search bar: open/close + clear query on close
  const toggleSearch = () => {
    setSearchOpen((prev) => {
      if (prev) setSearchQuery(""); // clear when closing
      return !prev;
    });
  };

  // Close search bar
  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  // Focus on input when search bar opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Filter foodList by search query (case-insensitive), if not empty
  const searchResults =
    searchQuery.trim().length > 0
      ? foodList.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : [];

  // Navigate to menu when clicking a search result
  const handleResultClick = (item) => {
    closeSearch();
    navigate("/menu"); // ska navigate to menuDetails later!!!!!!!
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

        <button
          className={`search-toggle${searchOpen ? " search-toggle--active" : ""}`}
          onClick={toggleSearch}
          aria-label="Search menu"
        >
          <Icon icon="mdi:magnify" width="50" height="50" />
        </button>

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

      {/* Search bar — slides down when searchOpen is true */}
      {searchOpen && (
        <div className="search-bar">
          <div className="search-bar__inner">
            <Icon
              icon="mdi:magnify"
              width="22"
              height="22"
              className="search-bar__icon"
            />
            <input
              ref={searchInputRef}
              className="search-bar__input"
              type="text"
              placeholder="Search for food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className="search-bar__close"
              onClick={closeSearch}
              aria-label="Close search"
            >
              <Icon icon="mdi:close" width="22" height="22" />
            </button>
          </div>

          {/* Results dropdown */}
          {searchResults.length > 0 && (
            <ul className="search-results">
              {searchResults.map((item) => (
                <li
                  key={item.id}
                  className="search-results__item"
                  onClick={() => handleResultClick(item)}
                >
                  <img
                    src={`/images/foods/${item.image}`}
                    alt={item.name}
                    className="search-results__img"
                  />
                  <div className="search-results__info">
                    <span className="search-results__name">{item.name}</span>
                    <span className="search-results__category">
                      {item.category}
                    </span>
                  </div>
                  <span className="search-results__price">{item.price} kr</span>
                </li>
              ))}
            </ul>
          )}

          {/* No results message */}
          {searchQuery.trim().length > 0 && searchResults.length === 0 && (
            <p className="search-no-results">No results for "{searchQuery}"</p>
          )}
        </div>
      )}

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

// Favorites.jsx — My Favorites page
// Used in: App.jsx route /favorites
// Reads favorites (array of itemIds) + foodList from StoreContext

import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useStore } from "../../context/StoreContext";
import FoodItem from "../../components/FoodItem/FoodItem";
import Button from "../../components/Button/Button";
import "./Favorites.css";

const Favorites = () => {
  const navigate = useNavigate();
  const { foodList, favorites } = useStore(); // Get foodList and favorites from StoreContext

  // Filter foodList to only items the user has favorited (matching with id) to show all info. of those foods
  const favoriteItems = foodList.filter((food) => favorites.includes(food.id));

  return (
    // Page — full-width background image
    <div className="favorites__page">
      {/* Header-Section — maroon strip with heart icon + title */}
      <div className="favorites__header">
        <div className="favorites__header-text">
          {/* mdi:heart icon — Colors/Pink, Figma: gap 46px from title */}
          <Icon icon="mdi:heart" className="favorites__header-icon" />
          {/* "My Favorites" — Topic-Desktop: Roboto Serif 40px weight 800 WeakYellow */}
          <h1 className="favorites__title">My Favorites</h1>
        </div>
      </div>

      {/* Menu-Section — centers the dark card */}
      <div className="favorites__section">
        {/* Menu-Frame — dark semi-transparent card */}
        {/* Figma: width 1128px, padding 20px, flex column, gap 62px, rgba(48,48,48,0.50) */}
        <div className="favorites__frame">
          {favoriteItems.length === 0 ? (
            // Empty state — when no items are favorited
            <div className="favorites__empty">
              <p>No favorites yet. Go explore the menu!</p>
              <Button onClick={() => navigate("/menu")}>Go to Menu</Button>
            </div>
          ) : (
            // Grid — 3 columns, row-gap/column-gap 30px (from Figma)
            <div className="favorites__grid">
              {favoriteItems.map((item) => (
                <FoodItem key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* Back to Home button */}
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    </div>
  );
};

export default Favorites;

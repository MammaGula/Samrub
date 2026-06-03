//  My Favorites page >> Send props to FoodItem-component
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
      {/* 1. Header-Section — maroon strip with heart icon + title */}
      <div className="favorites__header">
        <div className="favorites__header-text">
          <Icon icon="mdi:heart" className="favorites__header-icon" />
          <h1 className="favorites__title">My Favorites</h1>
        </div>
      </div>

      {/* 2. Menu-Section — centers the dark card */}
      <div className="favorites__section">
        <div className="favorites__frame">
          {/* 2.1 If there are no favorited items, show empty state with message and button to go explore the menu.  */}
          {favoriteItems.length === 0 ? (
            // Empty state — when no items are favorited
            <div className="favorites__empty">
              <p>No favorites yet. Go explore the menu!</p>

              <Button onClick={() => navigate("/menu")}>Go to Menu</Button>
            </div>
          ) : (
            /* 2.2 If there are favorited items, show them in a grid. Each item is rendered as a FoodItem card. */
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

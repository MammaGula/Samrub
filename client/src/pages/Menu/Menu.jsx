import { useState } from "react";
import { Icon } from "@iconify/react";
import FoodCategory from "../../components/FoodCategory/FoodCategory";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import "./Menu.css";

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="menu">
      {/* 1. Hero Section — background image + slogan bar bottom-right */}
      <section className="menu__hero">
        <div className="menu__hero-slogan">
          <p>Crafted With Wisdom, Serve as Art</p>
        </div>
      </section>

      {/* 2. Search Bar */}
      <div className="menu__search-wrap">
        <div className="menu__search-box">
          <Icon icon="mdi:magnify" className="menu__search-icon" />
          <input
            type="text"
            className="menu__search-input"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* Clear button — only visible when there is text */}
          {searchQuery && (
            <button
              className="menu__search-clear"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <Icon icon="mdi:close-circle" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Category Filter
      - Send state(selectedCategory, setSelectedCategory) to FoodCategory */}
      <FoodCategory
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* 4. Food Grid 
      - Send state(selectedCategory, searchQuery) to FoodDisplay */}
      <FoodDisplay
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default Menu;

import { useState } from "react";
import FoodCategory from "../../components/FoodCategory/FoodCategory";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import "./Menu.css";

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="menu">
      {/* ── 1. Hero Section — background image + slogan bar bottom-right ── */}
      <section className="menu__hero">
        <div className="menu__hero-slogan">
          <p>Crafted With Wisdom, Serve as Art</p>
        </div>
      </section>

      {/* ── 2. Categories Section ── */}
      <FoodCategory
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* ── 3. Food Grid Section to show food items based on selected category ── */}
      <FoodDisplay selectedCategory={selectedCategory} />
    </div>
  );
};

export default Menu;

import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
import "./FoodDisplay.css";

// FoodDisplay renders a responsive grid of FoodItem cards.
// Props:
//   selectedCategory — "All" | "Starter" | "MainCourse" | "SingleDish" | "Dessert" | "Set"
//   searchQuery      — free-text search string (optional, defaults to "")
const FoodDisplay = ({ selectedCategory = "All", searchQuery = "" }) => {
  const { foodList } = useContext(StoreContext);

  // Loading state — foodList not fetched yet
  if (foodList.length === 0) {
    return <p className="food-display__message">Loading...</p>;
  }

  // Build filtered list to check empty state before rendering grid
  const filtered = foodList.filter((item) => {
    if (selectedCategory !== "All" && selectedCategory !== item.category) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Empty state — filter/search returned no results
  if (filtered.length === 0) {
    return <p className="food-display__message">No dishes found.</p>;
  }

  return (
    <section className="food-display">
      <div className="food-display__grid">
        {filtered.map((item) => (
          <FoodItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default FoodDisplay;

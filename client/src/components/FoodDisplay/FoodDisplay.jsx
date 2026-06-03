// FoodDisplay.jsx — Displays a grid of food items based on selected category and search query
// - Show a list of food items 


import { useStore } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
import "./FoodDisplay.css";

// FoodDisplay renders a responsive grid of FoodItem cards.
// Props:
//   selectedCategory — "All" | "Starter" | "MainCourse" | "SingleDish" | "Dessert" | "Set"
//   searchQuery      — free-text search string (optional, defaults to "")
const FoodDisplay = ({ selectedCategory = "All", searchQuery = "" }) => {
  const { foodList } = useStore();

  // Loading state — foodList not fetched yet > If foodList is empty, show loading message
  if (foodList.length === 0) {
    return <p className="food-display__message">Loading...</p>;
  }

  // If foodList is not empty, filter it based on selectedCategory and searchQuery
  const filtered = foodList.filter((item) => {
    
    // If user hasn't selected All and Category doesn't match, exclude item.
    if (selectedCategory !== "All" && selectedCategory !== item.category)
      return false;

    // If searchQuery exists and item name doesn't include searchQuery, exclude item. Case-insensitive search.
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    // Otherwise include item.
    return true;
  });

  // If no items match the filters, show "No dishes found" message
  if (filtered.length === 0) {
    return <p className="food-display__message">No dishes found.</p>;
  }

  return (
    <section className="food-display">
      <div className="food-display__grid">
        {filtered.map((item) => (
          // Render a FoodItem card for each item in the filtered list.
          <FoodItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default FoodDisplay;

// Create as a component because it has its own logic for filtering and displaying food items, and is used in the Menu page.
// It also keeps the Menu component cleaner by abstracting away the food display logic.

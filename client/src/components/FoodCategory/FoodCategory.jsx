import "./FoodCategory.css";

// Each category object: label is display text, image is the oval photo

const CATEGORIES = [
  { id: "All", label: "All", image: null },
  {
    id: "Starter",
    label: "Starter",
    image: "/images/categories/Starter_TodMunKong.jpg",
  },
  {
    id: "MainCourse",
    label: "Main Course",
    image: "/images/categories/MainCourse_Somtum.jpg",
  },
  {
    id: "SingleDish",
    label: "Single Dish",
    image: "/images/categories/SingleDish_KhaoPad.jpg",
  },
  {
    id: "Dessert",
    label: "Dessert",
    image: "/images/categories/Dessert_KhaoNeowMamuang.jpg",
  },
  { id: "Set", label: "Set Menu", image: "/images/categories/Set1.jpg" },
];

// Props : get from Menu.jsx when we render <FoodCategory selected={selectedCategory} onSelect={setSelectedCategory} />
// selected — string of currently selected category (e.g. "All", "Starter", etc.) to apply active styling
// onSelect — Function to change selected category in parent component (Menu.jsx) when user clicks a category button. Called with the category id (e.g. "Starter") as argument.
const FoodCategory = ({ selected, onSelect }) => {
  
  return (
    /*nav = part of navigation*/
    <nav className="food-category">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          /* If category is the selected one, add class-active */
          className={`food-category__item ${selected === cat.id ? "food-category__item--active" : ""}`}
          onClick={() => onSelect(cat.id)}
        >
          {/* If there is an image → set backgroundImage / If not (All) → CSS will show grey fallback */}
          <div
            className="food-category__img"
            style={cat.image ? { backgroundImage: `url(${cat.image})` } : {}}
          />
          <span className="food-category__label">{cat.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default FoodCategory;

// User clicks a category button → onClick calls onSelect with the category id
// → Menu.jsx updates selectedCategory state → FoodCategory re-renders with new selected prop
// → active styling updates to show which category is selected.

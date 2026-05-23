import "./FoodCategory.css";

// Each category object: id matches db.json value, label is display text, image is the oval photo
// id = send to parent, label: show on the button, image: oval photo
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
// selected — currently active category "id" (e.g. "All", "Starter")
// onSelect — Function Callback sending id to parent component to update selectedCategory state in Menu.jsx´
const FoodCategory = ({ selected, onSelect }) => {
  return (
    <nav className="food-category">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
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

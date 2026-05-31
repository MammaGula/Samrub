import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import { useAuth } from "../../context/AuthContext";
import "./FoodItem.css";

const FoodItem = ({ item }) => {
  const { cartItems, addToCart, removeFromCart, toggleFavorite, isFavorite } =
    useStore();
  const { authed } = useAuth();
  const navigate = useNavigate();

  // If guest clicks heart → redirect to login instead of toggling
  const handleFavoriteClick = () => {
    if (!authed) {
      navigate("/login");
      return;
    }
    toggleFavorite(item.id);
  };

  return (
    <div className="food-item">
      {/* ── 1. Image section — background-image + (+) button at bottom-right (via padding) ── */}
      <div
        className="food-item__img-wrap"
        style={{ backgroundImage: `url(/images/foods/${item.image})` }}
      >
        {/* Not in cart yet → show + button / Already in cart → show [−] qty [+] counter */}
        {!cartItems[item.id] ? (
          <button
            className="food-item__add-btn"
            onClick={() => addToCart(item.id)}
          >
            <Icon icon="mdi:plus" />
          </button>
        ) : (
          <div className="food-item__counter">
            <button onClick={() => removeFromCart(item.id)}>
              <Icon icon="mdi:minus" />
            </button>
            <p>{cartItems[item.id]}</p>
            <button onClick={() => addToCart(item.id)}>
              <Icon icon="mdi:plus" />
            </button>
          </div>
        )}
      </div>
      {/* ── 2. Info section — heart (right) / name / price ── */}
      {/* - MainClass: food-item__fav 
      - Check if this itemIt is in array of isFavorite? (T/F) 
      - If True, add class food-item__fav--active, False--tomt
      */}
      <div className="food-item__info">
        <button
          className={`food-item__fav ${isFavorite(item.id) ? "food-item__fav--active" : ""}`}
          onClick={handleFavoriteClick}
        >
          {/* If active, show filled heart icon */}
          <Icon
            icon={isFavorite(item.id) ? "mdi:heart" : "mdi:heart-outline"}
          />
        </button>

        <h3 className="food-item__name">{item.name}</h3>
        <p className="food-item__price">{item.price} SEK</p>
      </div>
    </div>
  );
};

export default FoodItem;

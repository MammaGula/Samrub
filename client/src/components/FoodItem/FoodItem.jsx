import { useContext } from "react";
import { Icon } from "@iconify/react";
import { StoreContext } from "../../context/StoreContext";
import "./FoodItem.css";

const FoodItem = ({ item }) => {
  const { cartItems, addToCart, removeFromCart, toggleFavorite, isFavorite } =
    useContext(StoreContext);

  return (
    <div className="food-item">

      {/* ── Image section — background-image + + button at bottom-right (via padding) ── */}
      <div
        className="food-item__img-wrap"
        style={{ backgroundImage: `url(/images/foods/${item.image})` }}
      >
        {/* Not in cart yet → show + button / Already in cart → show [−] qty [+] counter */}
        {!cartItems[item.id]
          ? <button className="food-item__add-btn" onClick={() => addToCart(item.id)}>
              <Icon icon="mdi:plus" />
            </button>
          : <div className="food-item__counter">
              <button onClick={() => removeFromCart(item.id)}><Icon icon="mdi:minus" /></button>
              <p>{cartItems[item.id]}</p>
              <button onClick={() => addToCart(item.id)}><Icon icon="mdi:plus" /></button>
            </div>
        }
      </div>

      {/* ── Info section — heart (right) / name / price ── */}
      <div className="food-item__info">
        <button
          className={`food-item__fav ${isFavorite(item.id) ? "food-item__fav--active" : ""}`}
          onClick={() => toggleFavorite(item.id)}
        >
          <Icon icon={isFavorite(item.id) ? "mdi:heart" : "mdi:heart-outline"} />
        </button>

        <h3 className="food-item__name">{item.name}</h3>
        <p className="food-item__price">{item.price} SEK</p>
      </div>

    </div>
  );
};

export default FoodItem;

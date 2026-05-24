import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useStore } from "../../context/StoreContext";
import Button from "../../components/Button/Button";
import "./Basket.css";

// Get data from StoreContext:
const Basket = () => {
  const { cartItems, foodList, addToCart, removeFromCart, deleteFromCart } =
    useStore();

  const navigate = useNavigate();

  // Only show items that are actually in the cart (quantity > 0)
  // Card showing in Basket and foodList are the same, just filtered by cartItems
  // (Array of objects: id, name, price, image, category)
  const cartFoodItems = foodList.filter((item) => cartItems[item.id] > 0);

  // Calculate total directly from cartFoodItems (same foodList + cartItems Basket already has)
  // .reduce() to sum up = sum + (price × quantity) for each item in cart
  const subtotal = cartFoodItems.reduce(
    (sum, item) => sum + item.price * cartItems[item.id],
    0,
  );

  // ── Empty basket state ──
  // If cartFoodItems is empty → show empty state with icon, text, and button to go back to menu
  if (cartFoodItems.length === 0) {
    return (
      <div className="basket">
        <h2 className="basket__title">Your Basket</h2>
        <div className="basket__empty">
          <Icon icon="mdi:cart-off" className="basket__empty-icon" />
          <p className="basket__empty-text">Your basket is empty</p>
          <button
            className="basket__empty-btn"
            onClick={() => navigate("/menu")}
          >
            Go to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="basket">
      <h2 className="basket__title">Your Basket</h2>

      <div className="basket__container">
        {/* ── 1. Left Column: Cart Items(Image + Text + Counter) ── */}
        <div className="basket__items">
          {cartFoodItems.map((item) => (
            <div key={item.id} className="basket__item">
              {/* 1.1 Delete (trash) button — left side */}
              <button
                className="basket__delete-btn"
                onClick={() => deleteFromCart(item.id)}
                aria-label={`Remove ${item.name} from basket`}
              >
                <Icon icon="mdi:delete" />
              </button>

              {/* 1.2 Food image + [−] qty [+] counter overlay */}
              <div className="basket__item-img-wrap">
                <img
                  src={`/images/foods/${item.image}`}
                  alt={item.name}
                  className="basket__item-img"
                />
                {/* Counter overlay bottom-right — same style as FoodItem__counter */}
                <div className="basket__item-counter">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Decrease quantity"
                  >
                    <Icon icon="mdi:minus" />
                  </button>
                  <p>{cartItems[item.id]}</p>
                  <button
                    onClick={() => addToCart(item.id)}
                    aria-label="Increase quantity"
                  >
                    <Icon icon="mdi:plus" />
                  </button>
                </div>
              </div>

              {/* 1.3 Item info: "Name : price SEK x qty" */}
              <p className="basket__item-info">
                <span className="basket__item-name">{item.name}</span>
                <span className="basket__item-sep"> : </span>
                <span className="basket__item-price">{item.price} SEK</span>
                <span className="basket__item-sep"> x </span>
                <span className="basket__item-qty">{cartItems[item.id]}</span>
              </p>
            </div>
          ))}
        </div>

        {/* ── 2. Right Column: Order Summary ── */}
        <div className="basket__summary">
          <h3 className="basket__summary-title">Order Summary</h3>
          {/* 2.1 Subtotal */}
          <div className="basket__summary-row">
            <span>Subtotal:</span>
            <span>{subtotal} SEK</span>
          </div>

          {/* 2.2 Delivery fee */}
          <div className="basket__summary-row">
            <span>Delivery fee:</span>
            <span>0 SEK</span>
          </div>

          {/* Dashed divider — matches Figma "- - - - - -" line */}
          <div className="basket__summary-divider" />

          {/* 2.3 Total */}
          <div className="basket__summary-row basket__summary-row--total">
            <span>Total :</span>
            <span>{subtotal} SEK</span>
          </div>

          <Button onClick={() => navigate("/payment")}>Check out</Button>
        </div>
      </div>
    </div>
  );
};

export default Basket;

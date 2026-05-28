// Confirmation.jsx — Order success page
// Used in: App.jsx route /confirmation
// Receives state from Payment.jsx: { customerName, total, paymentMethod, orderId }
// Structure (from Figma):
//   Details-Section (bg image)
//     └── Overall-frame (dark card)
//           ├── OrderConfirm  → title + ✅ icon
//           ├── Thankyou      → thank you text
//           └── OrderInfo     → Order ID / Name / Total
//     └── Buttons             → View Menu + Back to home

// useLocation: To fetch data from current route/ To read state passed from Payment.jsx (customerName, total, paymentMethod) via navigate
import { useEffect /*, useState */ } from "react"; // useState used in commented-out orderId below
import { useNavigate, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import Button from "../../components/Button/Button";
import "./Confirmation.css";

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Read order summary passed from Payment.jsx via navigate state
  // orderId: real MongoDB _id from POST /api/orders response
  const { customerName, total, orderId } = location.state || {};

  // Generate a random 5-digit order ID on mount (fake, since no real backend yet)
  // const [orderId] = useState(() => Math.floor(10000 + Math.random() * 90000));

  // Guard: if user lands here without going through Payment → redirect to home and return null
  useEffect(() => {
    if (!location.state) {
      navigate("/");
    }
  }, [location.state, navigate]);

  // Prevent flash before redirect
  if (!location.state) return null;

  return (
    // Details-Section — full-width background image
    <div className="confirmation__details">
      {/* Overall-frame — dark semi-transparent card */}
      <div className="confirmation__card">
        {/* OrderConfirm — title + checkmark icon */}
        <div className="confirmation__title-row">
          <h1 className="confirmation__title">Order Confirmed!</h1>
          {/* icon-park-solid:correct — 60×60, MediumGreen */}
          <Icon
            icon="icon-park-solid:correct"
            className="confirmation__checkmark"
          />
        </div>

        {/* Thankyou — thank you message */}
        <p className="confirmation__thankyou">
          Thank you for your order. Your food is being prepared and will be
          delivered soon.
        </p>

        {/* OrderInfo — order details */}
        <div className="confirmation__info">
          {/* Show last 8 chars of MongoDB _id for readability e.g. #A3F2C1D8 */}
          <p>Order ID: #{orderId ? orderId.slice(-8).toUpperCase() : "—"}</p>
          <p>Name: {customerName}</p>
          <p>Total: {total} SEK</p>
        </div>
      </div>

      {/* Buttons — View Menu + Back to home */}
      <div className="confirmation__buttons">
        <Button onClick={() => navigate("/menu")}>View Menu</Button>
        <Button onClick={() => navigate("/")}>Back to home</Button>
      </div>
    </div>
  );
};

export default Confirmation;

// Payment.jsx — Checkout page
// Flow: Fill form → choose payment method → Place Order → navigate to /confirmation

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useStore } from "../../context/StoreContext";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import "./Payment.css";

const Payment = () => {
  const navigate = useNavigate();

  // Pull what we need from global store
  const { cartItems, foodList, clearCart, url } = useStore();

  // ── 1. State ────────────────────────────────────────────────────────────────

  // Which payment method is selected — "card" or "swish"
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Delivery information fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Card-specific fields (only used when paymentMethod === "card")
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  // Swish phone number (only used when paymentMethod === "swish")
  const [swishNumber, setSwishNumber] = useState("");

  // Validation errors — key = field name, value = error message string
  const [errors, setErrors] = useState({});

  // Flag to prevent guard from redirecting to /basket after successful submit
  // useRef because we don't need re-render when it changes
  const isSubmitting = useRef(false);

  // ── 2. Derived data ─────────────────────────────────────────────────────────

  // - Items currently in cart (filter foodList to only items with qty > 0)
  const cartFoodItems = foodList.filter((item) => cartItems[item.id] > 0);

  // Calculate subtotal directly from cartFoodItems — same pattern as Basket.jsx
  // (avoids closure timing issue with getTotalCartAmount from context)
  const subtotal = cartFoodItems.reduce(
    (sum, item) => sum + item.price * cartItems[item.id],
    0,
  );
  const total = subtotal;

  // ── Guard: redirect to basket if cart is empty ───────────────────────────────
  // useEffect runs after render — if no items in cart, send user back to basket
  // Check if foodList has loaded > there are no items in cart → navigate to /basket (can't checkout with empty cart)
  useEffect(() => {
    // Skip guard if user just submitted the form (clearCart makes cart empty)
    if (isSubmitting.current) return;
    if (foodList.length > 0 && cartFoodItems.length === 0) {
      navigate("/basket");
    }
  }, [foodList, cartFoodItems.length, navigate]);

  // ── 3. Handlers (2 ways-binding)─────────────────────────────────────────────────────────────

  // User types in FormInput > HandlerForm works > Update formData only that filed
  // > Clear error for that field if it existed before> UI rerenders with new value + error cleared

  // - One handler for ALL delivery fields
  // - e.target.name (value getting from the input) tells us which field changed (matches name prop on each input)
  // - Copy previous formData and update just the changed field → setFormData with new object
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // One handler for card fields (same pattern as handleFormChange)
  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ── 4. Validation ────────────────────────────────────────────────────────────
  // User submit > PreventDefault() > Validate > If Passed → Create OrderPayload > Clear Cart > Navigate to Confirmation
  const validate = () => {
    // Object to hold error messages for each field
    // (If exists error, add a key with field name and error message. If no error, leave it out)
    const newErrors = {};

    // 1. Delivery fields — all required
    // - If the name field is empty (after trimming whitespace), add an error message to newErrors with key "name"
    if (!formData.name.trim()) newErrors.name = "Please enter your full name";
    if (!formData.email.trim()) newErrors.email = "Please enter your email";
    if (!formData.phone.trim())
      newErrors.phone = "Please enter your phone number";
    if (!formData.address.trim())
      newErrors.address = "Please enter your delivery address";

    // - Email format check — simple regex
    // - If e-mail exists but doesn't match the regex pattern, add an error message to newErrors with key "email"
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    if (formData.email && !emailOk) newErrors.email = "Invalid email format";

    // 2. Payment fields — required based on selected payment method
    // 2.1 Card fields — only validate if payment method is "card"
    // - If the card number field is empty (after trimming whitespace), add an error message to newErrors with key "cardNumber"
    if (paymentMethod === "card") {
      if (!cardData.cardNumber.trim())
        newErrors.cardNumber = "Please enter your card number";
      if (!cardData.expiry.trim())
        newErrors.expiry = "Please enter expiry date";
      if (!cardData.cvv.trim()) newErrors.cvv = "Please enter CVV";
    }

    // 2.2 Swish fields — only validate if payment method is "swish"
    if (paymentMethod === "swish") {
      if (!swishNumber.trim())
        newErrors.swishNumber = "Please enter your Swish number";
    }

    setErrors(newErrors); // Update state with any errors found — this triggers UI to show error messages and red borders

    // If newErrors has any keys → validation failed(return false). If no keys → validation passed (return true)
    // >> using in HandleSubmit to decide whether to proceed with order placement or not
    return Object.keys(newErrors).length === 0;
  };

  // ── 5. Submit ────────────────────────────────────────────────────────────────

  // submitError: error message from backend if order fails
  // submitting: disable button while waiting for backend response
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent browser from refreshing the page

    // Run validation first — stop if any field is invalid
    if (!validate()) return;

    setSubmitError("");
    setSubmitting(true);

    // ─ Order payload — POST to Express backend /api/orders ─
    const orderPayload = {
      delivery: formData, // { name, email, phone, address } — matches orderModel delivery fields
      payment: {
        method: paymentMethod,
        cardNumber: paymentMethod === "card" ? cardData.cardNumber : null,
        expiry: paymentMethod === "card" ? cardData.expiry : null,
        cvv: paymentMethod === "card" ? cardData.cvv : null,
        swishNumber: paymentMethod === "swish" ? swishNumber : null,
      },
      items: cartFoodItems.map((item) => ({
        productId: item.id, // map to productId — matches orderModel items[].productId
        name: item.name,
        price: item.price,
        quantity: cartItems[item.id],
      })),
      totalAmount: total,
    };

    try {
      // POST to Express backend /api/orders — public route, no token needed
      const res = await axios.post(`${url}/api/orders`, orderPayload);

      // Set flag BEFORE clearCart — prevents guard useEffect from redirecting to /basket
      isSubmitting.current = true;

      // Clear cart from global state + localStorage
      clearCart();

      // Navigate to confirmation — pass real orderId from MongoDB response
      navigate("/confirmation", {
        state: {
          customerName: formData.name,
          total,
          paymentMethod,
          orderId: res.data._id,
        },
      });
    } catch (err) {
      // Show error from backend (e.g. network error, validation error)
      setSubmitError(err.response?.data?.message || "Failed to place order. Please try again.");
      setSubmitting(false);
    }
  };

  // ── 6. Render ────────────────────────────────────────────────────────────────

  return (
    // Outer wrapper — background image, no overlay
    // Inner content — dark semi-transparent panel (rgba 25,25,25,0.70)
    // Form: Form of the page, contains all input fields
    <div className="payment">
      <div className="payment__content">
        <form onSubmit={handleSubmit} noValidate>
          {/* noValidate = disable browser's built-in popups, we handle errors ourselves */}

          {/* ── Section 1: Delivery Information ── */}
          <section className="payment__section">
            <h3 className="payment__section-title">Delivery Information</h3>

            {/* Use reusable InputField component for all delivery fields — pass error message for each field if exists */}
            <div className="payment__fields">
              <InputField
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={
                  handleFormChange
                } /* Update formData state when user types and clear any existing error for this field */
                placeholder="Enter your full name"
                error={
                  errors.name
                } /* If there's an error message for the "name" field, pass it as a prop to show error state in the InputField component (red border + error text) */
              />
              <InputField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="Enter your email"
                error={errors.email}
              />
              <InputField
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                placeholder="Enter your phone number"
                error={errors.phone}
              />
              <InputField
                label="Delivery Address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                placeholder="Enter your delivery address"
                error={errors.address}
              />
            </div>
          </section>

          {/* ── Section 2: Payment Method ── */}
          <section className="payment__section">
            <h3 className="payment__section-title">Payment Method</h3>

            <div className="payment__methods">
              {/* 2.1 Card option */}
              <label className="payment__method-option">
                {/* Hidden native radio — we style our own circle */}
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={
                    paymentMethod === "card"
                  } /* If paymentMethod state is "card", this radio is selected */
                  onChange={() => setPaymentMethod("card")}
                  className="payment__radio-input"
                />
                {/* Custom styled circle — orange fill when selected */}
                <span className="payment__radio-circle" />
                <span className="payment__method-label">Card</span>
              </label>

              {/* 2.2 Swish option */}
              <label className="payment__method-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="swish"
                  checked={paymentMethod === "swish"}
                  onChange={() => setPaymentMethod("swish")}
                  className="payment__radio-input"
                />
                <span className="payment__radio-circle" />
                <span className="payment__method-label">Swish</span>
              </label>
            </div>
          </section>

          {/* ── Section 3.1: Card Details (conditional) ── */}
          {/* Only show if paymentMethod state is "card". If user selects "Swish", this section is hidden and the Swish Number section is shown instead. */}
          {paymentMethod === "card" && (
            <section className="payment__section">
              <h3 className="payment__section-title">Card Details</h3>
              <div className="payment__fields">
                <InputField
                  label="Card Number"
                  type="text"
                  name="cardNumber"
                  value={cardData.cardNumber}
                  onChange={handleCardChange}
                  placeholder="1234 5678 9012 3456"
                  error={errors.cardNumber}
                />
                {/* EXP + CVV — side by side on desktop, stacked on mobile (CSS grid) */}
                <div className="payment__card-row">
                  <InputField
                    label="Expiry Date"
                    type="text"
                    name="expiry"
                    value={cardData.expiry}
                    onChange={handleCardChange}
                    placeholder="MM/YY"
                    error={errors.expiry}
                  />
                  <InputField
                    label="CVV"
                    type="text"
                    name="cvv"
                    value={cardData.cvv}
                    onChange={handleCardChange}
                    placeholder="123"
                    error={errors.cvv}
                  />
                </div>
              </div>
            </section>
          )}

          {/* ── Section 3.2: Swish Number (conditional) ── */}
          {paymentMethod === "swish" && (
            <section className="payment__section">
              <h3 className="payment__section-title">Swish Number</h3>
              <div className="payment__fields">
                <InputField
                  label="Swish Phone Number"
                  type="tel"
                  name="swishNumber"
                  value={swishNumber}
                  onChange={(e) => {
                    setSwishNumber(e.target.value);
                    if (errors.swishNumber)
                      setErrors((prev) => ({ ...prev, swishNumber: "" }));
                  }}
                  placeholder="070-123 45 67"
                  error={errors.swishNumber}
                />
              </div>
            </section>
          )}

          {/* ── Section 4: Total + Place Order Button ── */}
          <div className="payment__footer">
            <div className="payment__total-line">
              <span>Total</span>
              <span>{total} SEK</span>
            </div>
            {/* Show backend error if order failed */}
            {submitError && <p className="payment__submit-error">{submitError}</p>}
            {/* disabled while waiting for backend — prevent double submit */}
            <Button type="submit" disabled={submitting}>
              {submitting ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;

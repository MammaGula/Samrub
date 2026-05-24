// Button.jsx — Reusable button component
// Matches Figma "Button-Desktop" and "Button-Mobile" components exactly
// Used in: Basket, Payment, Login, Register, and any page that needs a primary button

import "./Button.css";

// Props(Get from parent component):
// children  → button text(text between <Button> tags), e.g. "Place Order", "Check out"
// onClick   → function called when button is clicked (optional for type="submit")
// type      → "button" (default) or "submit" — "submit" triggers form onSubmit
// disabled  → true/false — disables the button when needed (e.g. empty cart)
const Button = ({ children, onClick, type = "button", disabled = false }) => {
  return (
    <button className="btn" type={type} onClick={onClick} disabled={disabled}>
      {/* children = whatever text is passed between <Button> tags */}
      {children}
    </button>
  );
};

export default Button;

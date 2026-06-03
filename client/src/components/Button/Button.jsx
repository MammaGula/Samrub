// Button.jsx — Reusable button component
// Used in: Basket, Payment, Login, Register, and any page that needs a primary button

import "./Button.css";

// Props(Get from parent component):
// onClick   → function called when button is clicked (optional for type="submit")
// type      → "button" (default) or "submit" — "submit" triggers form onSubmit
// disabled  → true/false — disables the button when needed (e.g. empty cart)

// Props getted from parent component,type "button" is default, disabled is false by default, so if not provided, button will be enabled and of type "button".
const Button = ({ children, onClick, type = "button", disabled = false }) => {
  return (
    <button className="btn" type={type} onClick={onClick} disabled={disabled}>
      {/* children = whatever text is passed between <Button> tags */}
      {children}
    </button>
  );
};

export default Button;

// InputField.jsx — Reusable input component
// Used in: Payment.jsx, Login.jsx, Register.jsx

import "./InputField.css";

const InputField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
}) => {
  return (
    // 1. Wrapper div — groups label + input + error together as one block
    <div className="input-field">
      {/* 2. Label — shown above the input box, e.g. "Full Name" 
        - when clicked, focuses the input */}
      <label className="input-field__label" htmlFor={name}>
        {label}
      </label>

      {/* 3. The actual input box
            - type: controls keyboard on mobile (email → email keyboard, tel → number pad)
            - id={name}: links to label's htmlFor, so clicking label focuses the input
            - name={name}: used by onChange to know which field changed
            - value + onChange: "controlled component" — React owns the value(current value)
            - placeholder: grey hint text when input is empty
            - required: built-in HTML validation, browser blocks submit if empty 
            - onChange: callback function when input value changes */}

      <input
        /* If there's an error prop (truthy), add the "input-field__input--error" class to show red border.
         If no error prop (falsy), just use "input-field__input" class. */
        className={`input-field__input ${error ? "input-field__input--error" : ""}`}
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
      />

      {/* 4. Error message — if error exists show red text, if not show nothing */}
      {error ? <span className="input-field__error">{error}</span> : null}
    </div>
  );
};

export default InputField;

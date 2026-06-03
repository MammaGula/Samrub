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

      {/* 3. The actual input box — shows user input, calls onChange when user types, and shows red border if error exists */}

      <input
        /* If there's an error prop (truthy), add the "input-field__input--error" class to show red border.
         If no error prop (falsy), just use "input-field__input" class. */
        className={`input-field__input ${error ? "input-field__input--error" : ""}`}
        type={type}
        id={name} /* id links to label's htmlFor, so clicking label focuses the input */
        name={name} /* name is used by onChange to identify which field changed */
        value={value}
        onChange={onChange} /* When user types, onChange is called with the event, parent component updates the value prop, input re-renders with new value */
        placeholder={placeholder}
        required
      />

      {/* 4. Error message — if error exists show red text, if not show nothing */}
      {error ? <span className="input-field__error">{error}</span> : null}
    </div>
  );
};

export default InputField;



// Parent send data to InputField via props: > components shows label+input
// >> user types in input → onChange is called → parent component updates state with new value 
// → InputField re-renders with new value in input
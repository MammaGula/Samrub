// Register.jsx — Register page
// Used in: App.jsx route /register

// RegisterPage: Recieve inputData from Form > send to check with backend(registerRequest)

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerRequest } from "../../services/authApi";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  // 1. Form state — controlled inputs: Keep data from userInput(username, email, password, confirmPassword) in state to send to backend
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // 2. UI state
  const [error, setError] = useState("");       // error message from backend or validation
  const [loading, setLoading] = useState(false); // disable button while waiting
  const [success, setSuccess] = useState(false); // show success message after register

  // 3. Handle input change — one handler for all fields
  // e.target.name matches field name ("username", "email", "password", "confirmPassword")
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(""); // clear error when user starts typing again
  };

  // 4. Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page refresh on submit
    setError("");

    // 4.1 Client-side validation — check passwords match before calling API
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Call POST /api/users/register → returns { id, username, email }
      // confirmPassword not sent to backend — only username, email, password needed
      await registerRequest({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // Show success message then redirect to login after 1.5s
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      // Show error from backend (e.g. "Username already taken", "Please fill all the fields")
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Content-section — full page with background image
    <div className="register">

      {/* RegisterForm-frame — dark semi-transparent card, contains the whole form */}
      <form className="register__form" onSubmit={handleSubmit}>

        {/* header — "Register" title */}
        <div className="register__header">
          <h1 className="register__title">Register</h1>
        </div>

        {/* inputForm — Username + Email + Password + Confirm Password + error/success */}
        <div className="register__inputform">
          <InputField
            label="Username:"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <InputField
            label="E-mail:"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            label="Password:"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <InputField
            label="Confirm Password:"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          {/* Error message — only shows if validation fails or backend returns an error */}
          {error && <p className="register__error">{error}</p>}

          {/* Success message — shows when registration is successful */}
          {success && (
            <p className="register__success">
              Account created! Redirecting to login...
            </p>
          )}
        </div>

        {/* Buttons — Register submits form, Log in navigates to /login */}
        <div className="register__buttons">
          <Button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
          <Button type="button" onClick={() => navigate("/login")}>
            Log in
          </Button>
        </div>

      </form>
    </div>
  );
};

export default Register;

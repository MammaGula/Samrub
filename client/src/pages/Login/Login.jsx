// Login.jsx — Login page
// Used in: App.jsx route /login

// LoginPage: Recieve inputData from Form > send to check with backend(loginRequest)
// > If success, save token + user to AuthContext > Redirect to home page

import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Get login function from AuthContext to update auth state on successful login
import { useAuth } from "../../context/AuthContext";
// API call to backend(POST) → returns token + user data if successful, or throws error
import { loginRequest } from "../../services/authApi";

import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  // 1. Get login function from AuthContext
  // login(token, user) → saves to localStorage + updates React state
  const { login } = useAuth();

  // 2. Form state — controlled inputs, keep track of username + password
  const [formData, setFormData] = useState({ username: "", password: "" });

  // 3. UI state:
  const [error, setError] = useState(""); // error message from backend
  const [loading, setLoading] = useState(false); // disable button while waiting

  // 4. Handle input change — one handler for all fields: update formData when user types
  // - e.target.name matches field name ("username" or "password")
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(""); // clear error when user starts typing again
  };

  // 5. Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page refresh on submit
    setError("");
    setLoading(true);

    try {
      // Call POST /api/users/login → returns { accessToken, user: { id, username, email } }
      const data = await loginRequest(formData);

      // If Login successful, save token + user → AuthContext updates authed state + navbar re-renders
      login(data.accessToken, data.user);

      // Redirect to home after successful login
      navigate("/");
    } catch (err) {
      // Show error from backend (e.g. "Invalid credentials", "Please fill all the fields")
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================================
  // UI: Login form with username + password fields, error message, and buttons
  // ==========================================================================
  return (
    // Content-section — full page with background image
    <div className="login">
      {/* LoginForm-frame — dark semi-transparent card, contains the whole form */}
      <form className="login__form" onSubmit={handleSubmit}>
        {/* header — "Login / Register" title */}
        <div className="login__header">
          <h1 className="login__title">Login / Register</h1>
        </div>

        {/* inputForm — Username + Password + error message */}
        <div className="login__inputform">
          <InputField
            label="Username:"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <InputField
            label="Password:"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />

          {/* Error message — only shows if backend returns an error */}
          {error && <p className="login__error">{error}</p>}
        </div>

        {/* Buttons — Log in submits form, Register navigates to /register */}
        <div className="login__buttons">
          <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"} {/* Show loading state on button */}
          </Button>
          <Button type="button" onClick={() => navigate("/register")}>
            Register
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;

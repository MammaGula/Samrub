// NotFound.jsx — 404 page
// Used in: App.jsx route path="*" (catch-all for unknown URLs)
// Shows when user navigates to a URL that doesn't exist in the app

import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Button from "../../components/Button/Button";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    // Page — full-width background, same dark theme as rest of app
    <div className="notfound">
      <div className="notfound__card">
        {/* Icon */}
        <Icon icon="" className="notfound__icon" />

        {/* 404 number */}
        <h1 className="notfound__code">404</h1>

        {/* Message */}
        <p className="notfound__message">Oops! Page not found.</p>
        <p className="notfound__sub">
          The page you are looking for doesn't exist or has been moved.
        </p>

        {/* Buttons */}
        <div className="notfound__buttons">
          <Button onClick={() => navigate("/")}>Back to Home</Button>
          <Button onClick={() => navigate("/menu")}>View Menu</Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

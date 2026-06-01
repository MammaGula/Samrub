// /=============== Entry Point of Application =================

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// import Global states from StoreContext for ex. cartItems, foodList, etc.
import StoreContextProvider from "./context/StoreContext";
// import AuthProvider to share auth state (authed, user, login, logout) across the app
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import App from "./App.jsx";

// Use to find the root element in the HTML and render the React application inside it.
// Provider order: AuthProvider wraps StoreContext so StoreContext can call getToken() if needed
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StoreContextProvider>
          <App />
        </StoreContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

// - StrictMode: Special component helps to detect the potential problems in the app during development.
// It doesn't affect production performance but can help identify issues like deprecated APIs, side effects, and other potential problems in the component tree.

// - BrowserRouter: a React component that enables your app to use React Router for client‑side navigation.

// - AuthProvider: a custom context provider that shares authentication state
// (like whether the user is logged in, user info, and login/logout functions) across the entire app.
// This allows any component to access auth state without prop drilling.

// - StoreContextProvider: another custom context provider that shares global states (like cart items, food list, etc.) across the app.

// - Provider = the component that holds and shares the data(stores & provides the data)
// - Custom Hook = the function that reads the data from the provider, a shortcut to access that data inside any component

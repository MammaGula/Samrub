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
  <StrictMode> /* Check error */
    <BrowserRouter> /* Enable routing in the app */
      <AuthProvider> /* Share auth state across the application */
        <StoreContextProvider> /* Share global states across the application */
          <App />
        </StoreContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

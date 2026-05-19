import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// import Global states from StoreContext for ex. cartItems, foodList, etc.
import StoreContextProvider from "./context/StoreContext";
import "./index.css";
import App from "./App.jsx";

// Use to find the root element in the HTML and render the React application inside it.
createRoot(document.getElementById("root")).render(
  <StrictMode> /* Check error */
    <BrowserRouter>
      <StoreContextProvider> /* Share global states across the application */
        <App />
      </StoreContextProvider>
    </BrowserRouter>
  </StrictMode>,
);

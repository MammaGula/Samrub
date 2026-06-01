// ========== App.jsx: Main Structure of Application, Defines Routes and Layout ============

import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Menu from "./pages/Menu/Menu";
import Basket from "./pages/Basket/Basket";
import Payment from "./pages/Payment/Payment";
import Confirmation from "./pages/Confirmation/Confirmation";
import Favorites from "./pages/Favorites/Favorites";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import NotFound from "./pages/NotFound/NotFound";
import { isAuthenticated } from "./services/authApi";
import "./App.css";

// Route guard — redirects to /login if user is not authenticated
// replace: true → replaces history entry so user can't press Back to sneak in
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public routes — anyone can access */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/basket" element={<Basket />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected route — must be logged in to view favorites and save favorites*/}
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />

          {/* Catch-all — shows 404 page for any unknown URL */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

// Routes: Container of Route components
// Route: Defines a mapping between a URL path and the component that should be rendered when the app is at that path.
// Navigate: Redirects to a different route.

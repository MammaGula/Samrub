import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { isAuthenticated, getFavoritesRequest, addFavoriteRequest, removeFavoriteRequest } from "../services/authApi";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  // 1. Backend URL
  const url = "http://localhost:4000";

  // 2. States shared across the app
  const [foodList, setFoodList] = useState([]); // all food items from backend (RAM only)

  // 3. cartItems: lazy initializer — reads from localStorage immediately on first render
  // keeps id and quantity of each item in cart (e.g. { "abc123": 2, "def456": 1 })
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : {}; // return object
  });

  // 4. favorites: array of product IDs (e.g. ["abc123", "def456"])
  // Loaded from backend on login — not localStorage (favorites are per-user in MongoDB)
  const [favorites, setFavorites] = useState([]);

  // 5. Add item to cart:
  // - If not in cart → set quantity = 1
  // - If already exists → increment quantity by 1
  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
    }));  
  };

  // 6. Decrease item quantity in cart:
  // - If quantity is 1 → remove from cart entirely
  // - If greater than 1 → decrement quantity by 1
  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      if (prev[itemId] <= 1) {
        const updated = { ...prev };
        delete updated[itemId];
        return updated;
      }
      return { ...prev, [itemId]: prev[itemId] - 1 };
    });
  };

  // 7. Remove item from cart immediately (clicking X)
  const deleteFromCart = (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      delete updated[itemId];
      return updated;
    });
  };

  // 8. Calculate total price in cart:
  // Loop through each itemId in cartItems → find item in foodList → multiply price × quantity
  const getTotalCartAmount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      // itemId and food.id are both strings (MongoDB ObjectId) — compare directly
      const item = foodList.find((food) => food.id === itemId);
      if (item && cartItems[itemId] > 0) {
        total += item.price * cartItems[itemId];
      }
    }
    return total;
  };

  // 9. Count total items in cart (used to display badge on Navbar icon)
  const getTotalCartCount = () => {
    let count = 0;
    for (const itemId in cartItems) {
      count += cartItems[itemId];
    }
    return count;
  };

  // 10. Clear cart after a successful order
  const clearCart = () => setCartItems({});

  // 10b. Clear favorites from state (called on logout)
  const clearFavorites = () => setFavorites([]);

  // 11. Check if a product is in favorites (returns true/false)
  const isFavorite = (itemId) => favorites.includes(itemId);

  // 12. Toggle favorite — syncs with backend (requires login)
  // - If already in favorites → DELETE from backend + remove from state
  // - If not → POST to backend + add to state
  const toggleFavorite = async (itemId) => {
    try {
      if (favorites.includes(itemId)) {
        await removeFavoriteRequest(itemId);
        setFavorites((prev) => prev.filter((id) => id !== itemId));
      } else {
        await addFavoriteRequest(itemId);
        setFavorites((prev) => [...prev, itemId]);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  // 13. Fetch food list from backend on app startup (once)
  useEffect(() => {
    const loadFoodList = async () => {
      try {
        const response = await axios.get(url + "/api/products");
        setFoodList(response.data);
      } catch (error) {
        console.error("Failed to fetch food list:", error);
      }
    };
    loadFoodList();
  }, []);

  // 14. Persist cartItems to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // 15. Fetch favorites from backend on app load if user is already logged in
  // (handles page refresh while still logged in — token is in localStorage)
  useEffect(() => {
    const loadFavorites = async () => {
      if (!isAuthenticated()) return;
      try {
        const data = await getFavoritesRequest();
        // Backend returns [{ _id, userId, productId: { ...product } }]
        // Extract productId._id (string) to match food.id in foodList
        const ids = data.map((fav) => fav.productId._id || fav.productId);
        setFavorites(ids);
      } catch (error) {
        console.error("Failed to load favorites:", error);
      }
    };
    loadFavorites();
  }, []);

  // 16. Fetch favorites from backend — called from Login.jsx after successful login
  const loadFavorites = async () => {
    try {
      const data = await getFavoritesRequest();
      const ids = data.map((fav) => fav.productId._id || fav.productId);
      setFavorites(ids);
    } catch (error) {
      console.error("Failed to load favorites:", error);
    }
  };

  // 17. Collect all values and functions to share with every component
  const contextValue = {
    url,
    foodList,
    cartItems,
    favorites,
    addToCart,
    removeFromCart,
    deleteFromCart,
    getTotalCartAmount,
    getTotalCartCount,
    clearCart,
    clearFavorites,
    isFavorite,
    toggleFavorite,
    loadFavorites,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

// Custom hook — components use useStore() instead of useContext(StoreContext)
export const useStore = () => useContext(StoreContext);

export default StoreContextProvider;

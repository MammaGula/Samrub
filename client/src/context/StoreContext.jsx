// StoreContext.jsx = global state for the whole app (food list, cart items, favorites) + functions to manipulate them (add/remove from cart, toggle favorite, etc.)
// Context = container
// Provider = keep & share
// Custom hook = to use context easily in components


import { createContext, useContext, useEffect, useState } from "react";
import {
  isAuthenticated,
  authRequest,
  getFavoritesRequest,
  addFavoriteRequest,
  removeFavoriteRequest,
} from "../services/authApi";


export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  //  Backend URL
  const url = "http://localhost:4000";

  // ===============1. States ===============

  // 1.1. FoodList
  const [foodList, setFoodList] = useState([]); // all food items from backend (RAM only)

  // 1.2. cartItems: lazy initializer — If you pass a function to useState, React will treat it as lazy initialization> Run only one time .
  // Load cart from localStorage if it exists, otherwise start with empty cart (object)
  //keeps id and quantity of each item in cart (e.g. { "abc123": 2, "def456": 1 })
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : {}; // return object
  });

  // 1.3. favorites: array of product IDs (e.g. ["abc123", "def456"])
  // Loaded from backend on login — not localStorage (favorites are per-user in MongoDB)
  const [favorites, setFavorites] = useState([]);

  // ===============2. Cart Functions ===============
  // 2.1. Add item to cart:
  // - If not in cart → set quantity = 1
  // - If already exists → increment quantity by 1
  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
    }));
  };

  // 2.2. Decrease item quantity in cart:
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

  // 2.3. Remove item from cart immediately (clicking X)
  const deleteFromCart = (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      delete updated[itemId];
      return updated;
    });
  };

  // 2.4. Calculate total price in cart:
  // Loop through each itemId in cartItems → find item in foodList → multiply price × quantity
  const getTotalCartAmount = () => {
    let total = 0;
    // cartItems: { itemId: quantity } >> Loop through each key(itemId) in cartItems
    for (const itemId in cartItems) {
      // itemId and food.id are both strings (MongoDB ObjectId) — compare directly
      const item = foodList.find((food) => food.id === itemId);
      if (item && cartItems[itemId] > 0) {
        total += item.price * cartItems[itemId];
      }
    }
    return total;
  };

  // 2.5. Count total items in cart (used to display badge on Navbar icon)
  const getTotalCartCount = () => {
    let count = 0;
    // cartItems: { itemId: quantity } >> Loop through each key(itemId) in cartItems
    for (const itemId in cartItems) {
      // item[key] = value of that key (quantity) >> add to count
      count += cartItems[itemId];
    }
    return count;
  };

  // 2.6. Clear cart after a successful order
  const clearCart = () => setCartItems({});

  // ===============3. Favorites Functions ===============
  // 3.1. Clear favorites from state (called on logout)
  const clearFavorites = () => setFavorites([]);

  // 3.2. Check if a product is in favorites (returns true/false)
  const isFavorite = (itemId) => favorites.includes(itemId);

  // 3.3. Toggle favorite — syncs with backend (requires login)
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

  // 3.4. Fetch favorites from backend — called from Login.jsx after successful login
  const loadFavorites = async () => {
    try {
      const data = await getFavoritesRequest();
      const ids = data.map((fav) => fav.productId._id || fav.productId);
      setFavorites(ids);
    } catch (error) {
      console.error("Failed to load favorites:", error);
    }
  };

  // =============== 4. UseEffect Hooks ===============
  // 4.1. Fetch food list from backend on app load
  useEffect(() => {
    const loadFoodList = async () => {
      try {
        // authRequest automatically includes token in headers if user is logged in (token is in localStorage) 
        // — food list is public data, so it works with or without token
        const data = await authRequest("/api/products");
        setFoodList(data);
      } catch (error) {
        console.error("Failed to fetch food list:", error);
      }
    };
    loadFoodList();
  }, []);

  // 4.2. Save cartItems to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // 4.3. Fetch favorites from backend on app load if user is already logged in
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

  // 4. Collect all values and functions to share with every component
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

// Hooks can be used only in React components or custom hooks, not in regular functions or outside of components. If you try to use a hook in a non-component function, React will throw an error because hooks rely on the React component lifecycle and context to work properly.
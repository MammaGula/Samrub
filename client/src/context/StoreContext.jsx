import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

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

  // 4. favorites: lazy initializer — same pattern as cartItems
  // keeps array of product IDs (e.g. ["abc123", "def456"])
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : []; // return array
  });

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

  // 10b. Clear favorites from state + localStorage (called on logout)
  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem("favorites");
  };

  // 11. Check if a product is in favorites (returns true/false)
  const isFavorite = (itemId) => favorites.includes(itemId);

  // 12. Toggle favorite:
  // - If already in favorites → remove it (filter out the itemId)
  // - If not → add it
  const toggleFavorite = (itemId) => {
    setFavorites((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  // 13. Fetch food list from backend on app startup
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

  // 15. Persist favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // 16. Collect all values and functions to share with every component
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

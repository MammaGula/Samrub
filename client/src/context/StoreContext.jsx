import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  // json-server URL (will change to Express backend port 4000 later)
  const url = "http://localhost:3000";

  // 2. States shared across the app
  const [foodList, setFoodList] = useState([]); // all food items from backend

  // 3. cartItems: lazy initializer — reads from localStorage immediately on first render
  // keep id and quantity of each item in cart (e.g. { 1: 2, 3: 1 }
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : {}; // return object
  });

  // 4. favorites: lazy initializer — same pattern as cartItems
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : []; // return Array of itemIds (e.g. [1, 3, 5])
  });

  const [token, setToken] = useState(""); // JWT token of the logged-in user
  const [user, setUser] = useState(null); // { id, username, email } from login response

  // 5. Add item to cart:
  // - If not in cartItems → set quantity = 1
  // - If already exists → increment quantity by 1
  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
    }));
  };

  // 6. Decrease item quantity in cart
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
    // Total: sum of (price × quantity) for all items in cart
    let total = 0;

    // key:value = itemId:quantity
    // for-in loop: loop through keys (itemId) in cartItems
    for (const itemId in cartItems) {
      // Number(itemId) because itemId is a string from cartItems but food.id is a number
      const item = foodList.find((food) => food.id === Number(itemId));

      // If item exists in foodList and quantity > 0 → add to total
      if (item && cartItems[itemId] > 0) {
        total += item.price * cartItems[itemId]; // key[] = value
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

  // 10. Toggle favorites
  // If itemId is already in favorites → remove it
  // If not → add it
  const toggleFavorite = (itemId) => {
    // Check if itemId is already in favorites: prev= array of favorite itemIds
    setFavorites((prev) =>
      prev.includes(itemId)
        ? //If already in favorites → remove it by filtering out the itemId(create a new array without that itemId)
          prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  // 11. Check if an itemId is in favorites (returns true/false)
  const isFavorite = (itemId) => favorites.includes(itemId);

  // 12. Fetch food list from backend
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/products");
      setFoodList(response.data);
    } catch (error) {
      console.error("Failed to fetch food list:", error);
    }
  };

  // 13. Clear cart after a successful order
  const clearCart = () => {
    setCartItems({});
  };

  // 14. Load data on app startup
  // - fetch food list
  // - if token exists in localStorage → restore session (user stays logged in)
  // - if favorites exist in localStorage → restore favorites
  useEffect(() => {
    // Fetch food list directly inside useEffect (avoids ESLint warning)
    const loadData = async () => {
      try {
        const response = await axios.get(url + "/products");
        setFoodList(response.data);
      } catch (error) {
        console.error("Failed to fetch food list:", error);
      }
    };
    loadData();

    // Check if token exists in localStorage → if yes, set it to state (user stays logged in)
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
    // Note: cartItems and favorites are loaded via lazy useState initializer above
    // No need to read them here — avoids race condition with save effects
  }, []);

  // 13. Persist favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // 13b. Persist cartItems to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // 14. Collect all values and functions to share with every component
  const contextValue = {
    url,
    foodList,
    cartItems,
    favorites,
    token,
    setToken,
    user,
    setUser,
    addToCart,
    removeFromCart,
    deleteFromCart,
    getTotalCartAmount,
    getTotalCartCount,
    toggleFavorite,
    isFavorite,
    clearCart,
  };

  {
    /* Returns : Values/ Methods shared across the app */
  }
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

// Custom hook — components use useStore() instead of useContext(StoreContext)
export const useStore = () => useContext(StoreContext);

export default StoreContextProvider;

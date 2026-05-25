// AuthContext.jsx — Authentication state for the whole app
// Used in: main.jsx (wraps entire app), Login.jsx, Register.jsx, Navbar.jsx
// Pattern: same as teacher's AuthContext.jsx in Fullstack-Contact
// Provides: { authed, user, login, logout } to all child components

import { createContext, useContext, useState } from "react";

// import helper functions to interact with localStorage and check auth status
import {
  saveToken,
  saveUser,
  clearToken,
  clearUser,
  getUser,
  isAuthenticated,
} from "../services/authApi";

// 1. Create the context object: Create a variable to hold the context.
// This is what components will import to access auth state and functions.
// null = default value before Provider is in place
const AuthContext = createContext(null);

// 2. Provider component — wraps the entire app in main.jsx
// - Provides Authed, User, Login, Logout to all children via value prop
export function AuthProvider({ children }) {
  // 2.1 authed: boolean — is the user currently logged in?
  // Initialize from localStorage so user stays logged in on page refresh
  const [authed, setAuthed] = useState(isAuthenticated());

  // 2.2 user: { id, username, email } or null
  // Initialize from localStorage → restore user info on page refresh
  const [user, setUser] = useState(getUser());

  // 2.3 login — called after successful API response from /api/users/login
  // token: JWT string from backend
  // userData: { id, username, email } from backend
  const login = (token, userData) => {
    saveToken(token); // persist token to localStorage
    saveUser(userData); // persist user object to localStorage
    setAuthed(true); // update React state → navbar re-renders immediately
    setUser(userData); // update React state → user info available everywhere
  };

  // 2.4 logout — clears all auth data
  const logout = () => {
    clearToken(); // remove token from localStorage
    clearUser(); // remove user from localStorage
    setAuthed(false); // update React state → navbar re-renders immediately
    setUser(null); // clear user info from state
  };

  return (
    // Value: all states + functions that we want to share across the app go here
    <AuthContext.Provider value={{ authed, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom hook — so components don't need to write useContext(AuthContext) themselves
// Usage: const { authed, user, login, logout } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}

// ----AuthContext.jsx — Authentication state for the whole app, Manage State & User Info of App ----
// ---- Context: Container ----
// ---- Providers: Keep & Share data >> { authed, user, login, logout } to all child components ----
// ---- CustomHook (useAuth): To use functions/states from Context easily ----

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
const AuthContext = createContext(null);

//-----------------------------------------------------------------------------

// 2. AuthProvider component — Keep & Share data, wraps the entire app in main.jsx
export function AuthProvider({ children }) {
  // 2.1 authed: boolean — is the user currently logged in?(from authApi: LocalStorage token check)
  const [authed, setAuthed] = useState(isAuthenticated());

  // 2.2 user: { id, username, email } or null — current user info (from authApi: LocalStorage userInfo check)
  const [user, setUser] = useState(getUser());

  // 2.3 login — called after successful API response from /api/users/login
  // token: JWT string from backend
  // userData: { id, username, email } from backend
  const login = (token, userData) => {
    saveToken(token); // keep JWT token in localStorage
    saveUser(userData); // keep user object in localStorage
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
    //Put data in Container: Values in provider: all states + functions that we want to share across the app go here
    <AuthContext.Provider value={{ authed, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// -----------------------------------------------------------------------------

// 3. Custom hook: const { authed, user, login, logout } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}

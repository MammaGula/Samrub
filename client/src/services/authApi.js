// authApi.js = utility functions — works with localStorage and send HTTP requests(communication between frontend and backend) regarding authentication and user data.
// - provides an authRequest function that automatically attaches the token to every API call, and exposes ready-made functions for login, register, and favorites requests.
// - Used in: AuthContext.jsx (login/logout), ProtectedRoute.jsx (isAuthenticated)

import axios from "axios";

// const API_URL = "http://localhost:3000"; // json-server URL (no auth, for testing only)
const API_URL = "http://localhost:4000"; // real backend URL (with auth, MongoDB, etc.)

// ===================================================================================
// 1. Token helpers: handle with JWT-token in LocalStorage → getToken, saveToken, clearToken
// ===================================================================================

// 1.1 Get token from localStorage >>> Returns the JWT string, or NULL if not logged in
export const getToken = () => localStorage.getItem("token");

// 1.2 Save token to localStorage after successful login
export const saveToken = (token) => localStorage.setItem("token", token);

// 1.3 Remove token from localStorage on logout
export const clearToken = () => localStorage.removeItem("token");

// ========================================================================================
// 2. User helpers: handle with user-Object in LocalStorage → getUser, saveUser, clearUser
// ========================================================================================

// 2.1 Get user object from localStorage >>
// - need to parse from JSON string back to Object(LocalStorage only stores strings)
// - Returns { id, username, email } or null
export const getUser = () => {
  const saved = localStorage.getItem("user");
  // localStorage.getItem: returns null if key(user) not found → check before parsing
  return saved ? JSON.parse(saved) : null;
};

// 2.2 Save user object  ->  localStorage(JSON-string)
// user = { id, username, email } from login response
export const saveUser = (user) =>
  localStorage.setItem("user", JSON.stringify(user));

// 2.3 Remove user object from localStorage on Logout
export const clearUser = () => localStorage.removeItem("user");

// ==============================================================================
// 3. Auth check: Check if user is logged in >> Convert token existence to boolean
// ==============================================================================

// If getToken() returns a string (token exists) → !! converts to true, if null (no token) → !! converts to false
export const isAuthenticated = () => !!getToken();

// ==================================================================================================
// 4. Authenticated request: Function to make API calls with token automatically attached in headers(Add Header "Authorization)
// ==================================================================================================

// - General request function — auto-attaches Bearer token to every call
// - path: e.g. "/api/users/login"
// - options: { method, body } — same as fetch options
// - All API calls should go through this function so token is always sent
export const authRequest = async (path, options = {}) => {
  // 4.1 Build headers with token
  const headers = { ...(options.headers || {}) };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    // 4.2 Send request with axios — auto parses JSON, no need to manually parse response,
    // GET by default, body is "data" in axios
    const res = await axios({
      url: `${API_URL}${path}`,
      method: options.method || "GET",
      headers,
      data: options.body ? JSON.parse(options.body) : undefined, // axios uses "data" not "body"
    });
    return res.data;
  } catch (error) {
    // 4.3 axios throws automatically on 4xx/5xx — extract message from backend response
    const errMsg =
      error.response?.data?.message || error.message || "Request failed";
    throw new Error(errMsg);
  }
};

// =======================================================================================================
// 5. USER REQUESTS(API Calls): use authRequest to automatically include token in headers for these calls >> Send to Route on Server
// =======================================================================================================

// 5.1 Login: POST /api/users/login
// body: { username, password }
// Returns: { accessToken, user: { id, username, email } }
export const loginRequest = (credentials) =>
  authRequest("/api/users/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

// 5.2 Register: POST /api/users/register
// body: { username, email, password }
// Returns: { id, username, email }
export const registerRequest = (userData) =>
  authRequest("/api/users/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });

// ===========================================
// 6. FAVORITE REQUESTS (all require token) >> Send to Route on Server
// ===========================================

// 6.1 Get all favorites for logged in user
// Returns: [{ _id, userId, productId: { ...productData } }]
export const getFavoritesRequest = () => authRequest("/api/favorites");

// 6.2 Add a favorite
// body: { productId }
export const addFavoriteRequest = (productId) =>
  authRequest("/api/favorites", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });

// 6.3 Remove a favorite
// DELETE /api/favorites/:productId
export const removeFavoriteRequest = (productId) =>
  authRequest(`/api/favorites/${productId}`, {
    method: "DELETE",
  });

// Login.jsx → loginRequest() → authRequest() → axios POST /api/users/login
//        ← token + user ← backend
//        → saveToken() + saveUser() → localStorage
//        → setAuthed(true) → Navbar re-renders

// authApi.js — Authentication utility functions
// Used in: AuthContext.jsx (login/logout), ProtectedRoute.jsx (isAuthenticated)
// Pattern: same as teacher's api.js in Fullstack-Contact
// All token + user data lives in localStorage, exposed via these helper functions

// Express backend URL (auth endpoints live here)
// json-server (port 3000) handles food data — Express (port 4000) handles auth + orders
// const API_URL = "http://localhost:3000";
const API_URL = "http://localhost:4000";


// ======================
// 1. Token helpers: getToken, saveToken, clearToken
// ======================

// 1.1 Get token from localStorage
// Returns the JWT string, or null if not logged in
export const getToken = () => localStorage.getItem("token");

// 1.2 Save token to localStorage after successful login
export const saveToken = (token) => localStorage.setItem("token", token);

// 1.3 Remove token from localStorage on logout
export const clearToken = () => localStorage.removeItem("token");

// ======================
// 2. User helpers: getUser, saveUser, clearUser from localStorage
// ======================

// 2.1 Get user object from localStorage >> need to parse from JSON string back to object(LocalStorage only stores strings)
// Returns { id, username, email } or null
export const getUser = () => {
  const saved = localStorage.getItem("user");
  // localStorage.getItem returns null if key not found → check before parsing
  return saved ? JSON.parse(saved) : null;
};

// 2.2 Save user object to localStorage
// user = { id, username, email } from login response
export const saveUser = (user) =>
  localStorage.setItem("user", JSON.stringify(user));

// 2.3 Remove user object from localStorage on logout
export const clearUser = () => localStorage.removeItem("user");

// ======================
// 3. Auth check
// ======================

// 3.1 Check if user is logged in
// !! converts token string to Boolean : string → true, or null → false
export const isAuthenticated = () => !!getToken();

// ======================
// 4. Authenticated request: automatically includes token in headers
// ======================

// 4.1 General request function — auto-attaches Bearer token to every call
// path: e.g. "/api/users/login"
// options: { method, body } — same as fetch options
// All API calls should go through this function so token is always sent
export const authRequest = async (path, options = {}) => {
  const headers = { ...(options.headers || {}) };

  // Attach token: if it exists → attach to Authorization header so backend uses this to identify the user
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Tell backend we're sending JSON
  headers["Content-Type"] = "application/json";

  // Send Http request to backend with fetch — include headers and any other options (method, body)
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  // Read response as text first → then try to parse as JSON
  const text = await res.text();
  let data = null;
  // If response is JSON → parse it, otherwise just return text (e.g. for error messages that aren't JSON)
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // If JSON.parse fails → use raw text (e.g. plain error messages)
    data = text;
  }

  // res.ok = false when status is 400, 401, 404, 500 etc.
  if (!res.ok) {
    // Use message from backend if available, otherwise use HTTP status text
    const errMsg = (data && data.message) || res.statusText || "Request failed";
    throw new Error(errMsg);
  }

  return data;
};

// ======================
// 5. USER REQUESTS(API Calls): use authRequest to automatically include token in headers for these calls
// ======================

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

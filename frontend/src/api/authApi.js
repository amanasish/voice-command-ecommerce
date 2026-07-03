const API_URL = import.meta.env.VITE_API_URL || "https://voice-command-ecommerce-backend.onrender.com";
const AUTH_TOKEN_KEY = "voice-commerce-auth-token";
const AUTH_USER_KEY = "voice-commerce-auth-user";

async function request(path, payload) {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({
    success: false,
    error: "Invalid JSON response from server",
  }));

  if (!response.ok || data.success === false) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }

  return data;
}

function storeAuthData(data) {
  if (data?.token) {
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
  }

  if (data?.user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
  }
}

export async function loginUser(credentials) {
  const result = await request("/auth/login", credentials);
  storeAuthData(result);
  return result;
}

export async function registerUser(userData) {
  const result = await request("/auth/register", userData);
  storeAuthData(result);
  return result;
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getAuthUser() {
  const value = localStorage.getItem(AUTH_USER_KEY);
  return value ? JSON.parse(value) : null;
}

export function logoutUser() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

import React, { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode"; // npm install jwt-decode
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);        // { id, role, email }
  const [loading, setLoading] = useState(true);  // Wait while checking token

  // Load user from localStorage on refresh
useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token);

      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        setUser(null);  // Log the user out
        // Optionally redirect to login page here, e.g., using navigate()
      } else {
        setUser(decoded);
      }
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
      setUser(null); // Log the user out if the token is invalid
    }
  }

  setLoading(false);
}, []);


  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/admin/login`, {
        email,
        password,
      });

      const { token } = res.data;

      // Save token
      localStorage.setItem("token", token);

      // Decode token + set user
      const decoded = jwtDecode(token);
      setUser(decoded);

      return decoded;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export default function useAuth() {
  return useContext(AuthContext);
}

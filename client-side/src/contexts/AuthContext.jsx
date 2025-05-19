import { createContext, useContext, useEffect, useState } from "react";
import { getToken, saveToken, removeToken } from "../utils/token";
import { jwtDecode } from "jwt-decode";
import * as authService from "../services/authService"; // adjust path if needed

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (data) => {
    try {
      const response = await authService.login(data);
      console.log("response login", response.data.user);
      const token = response.data.token; // assuming API returns token here
      saveToken(token);
      setUser({ ...response.data.user });
      console.log("user", user);
      return true;
    } catch (error) {
      if (error.response) {
        console.error("Login failed, status:", error.response.status);
        console.error("Response data:", error.response.data);
      } else {
        console.error("Login failed:", error.message);
      }
      return false;
    }
  };

  const register = async (data) => {
    try {
      await authService.register(data);
      return true;
    } catch (error) {
      console.error("Register failed", error);
      return false;
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const response = await authService.getUserProfile(decoded.userId);
          setUser({
            ...response.data,
          });
        } catch (err) {
          console.log(err);
          logout();
        }
      }
      setLoading(false);

    };
    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register ,loading}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

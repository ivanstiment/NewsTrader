import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();
let inMemoryToken = null;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getAccessToken();
      if (token) {
        inMemoryToken = token;
        setUser({});
      }
      setLoading(false);
    };
    fetchToken();
  }, []);

  const login = (accessToken) => {
    inMemoryToken = accessToken; // guardar en memoria
    const decodedToken = jwtDecode(accessToken); // guardar en memoria
    setUser({
      username: decodedToken.username,
      userId: decodedToken.user_id,
    }); // podrías decodificar user de token
    setLoading(false);
  };

  const logout = () => {
    inMemoryToken = null;
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function getAccessToken() {
  return inMemoryToken;
}
export function setAccessToken(token) {
  inMemoryToken = token;
}

// // AuthContext.jsx
// import { createContext, useState, useContext } from "react";

// const AuthContext = createContext();
// export function AuthProvider({ children }) {
//   const [accessToken, setAccessToken] = useState(null); // en memoria

//   return (
//     <AuthContext.Provider value={{ accessToken, setAccessToken }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
// export const useAuth = () => useContext(AuthContext);

import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();
let inMemoryToken = null;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (accessToken) => {
    inMemoryToken = accessToken;    // guardar en memoria 
    setUser({});                    // podrías decodificar user de token
  };

  const logout = () => {
    inMemoryToken = null;
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
import React from 'react';
import "./App.scss";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { NewsPage } from "./pages/NewsPage";
import { NewFormPage } from "./pages/NewFormPage";
import { NavigationMenu } from "./components/NavigationMenu/index";
import { Header } from "./components/Header/index";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';

function AppContent() {
  const { pathname } = useLocation();
  const hideNavOn = ["/home", "/login", "/register"];
  const hideHeaderOn = ["/home"];
  const showNav = !hideNavOn.includes(pathname);
  const showHeader = !hideHeaderOn.includes(pathname);

  return (
    <>
      {showNav && <NavigationMenu />}
      {showHeader && <Header />}      
      <AuthProvider>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path="news" element={<NewsPage />} />
            <Route path="news-create" element={<NewFormPage />} />
            <Route path="news/:uuid" element={<NewFormPage />} />
          </Route>
        </Routes>
      </AuthProvider>
      {/* <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news-create" element={<NewFormPage />} />
        <Route path="/news/:uuid" element={<NewFormPage />} />
      </Routes> */}
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

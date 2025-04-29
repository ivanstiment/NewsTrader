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

function AppContent() {
  const { pathname } = useLocation();
  const hideNavOn = ["/", "/login", "/register"];
  const hideHeaderOn = ["/"];
  const showNav = !hideNavOn.includes(pathname);
  const showHeader = !hideHeaderOn.includes(pathname);

  return (
    <>
      {showNav && <NavigationMenu />}
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news-create" element={<NewFormPage />} />
        <Route path="/news/:uuid" element={<NewFormPage />} />
      </Routes>
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

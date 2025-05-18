import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import "./App.scss";
import { CandlestickChart } from "./components/CandlestickChart/index";
import { Header } from "./components/Header/index";
import { NavigationMenu } from "./components/NavigationMenu/index";
import { PrivateRoute } from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { NewFormPage } from "./pages/NewFormPage";
import { NewsPage } from "./pages/NewsPage";
import { RegisterPage } from "./pages/RegisterPage";
import { SearchPage } from "./pages/SearchPage";
import { StockPage } from "./pages/StockPage";
import { ArticlesPage } from "./pages/ArticlesPage";
import { ArticleAnalyzePage } from "./pages/ArticleAnalyzePage";

function AppContent() {
  const { pathname } = useLocation();
  const hideNavOn = ["/home", "/login", "/register"];
  const hideHeaderOn = ["/home"];
  const showNav = !hideNavOn.includes(pathname);
  const showHeader = !hideHeaderOn.includes(pathname);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchStock, setSearchStock] = useState("");

  return (
    <>
      {showNav && <NavigationMenu />}
      {showHeader && (
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      )}
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route
            path="search"
            element={
              <SearchPage
                searchStock={searchStock}
                setSearchStock={setSearchStock}
              />
            }
          />
          <Route
            path="stock/:symbol"
            element={<StockPage searchStock={searchStock} />}
          />
          <Route
            path="historical-price/:symbol"
            element={<CandlestickChart />}
          />
          <Route path="news" element={<NewsPage searchTerm={searchTerm} />} />
          <Route path="news-create" element={<NewFormPage />} />
          <Route path="news/:uuid" element={<NewFormPage />} />

          <Route path="articles" element={<ArticlesPage />} />
          <Route path="articles/:id/analyze" element={<ArticleAnalyzePage />} />
        </Route>
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

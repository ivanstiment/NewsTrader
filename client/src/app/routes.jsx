import { StockChart } from "@/features/charts/components/StockChart/index";
import { NewFormPage } from "@/features/news/pages/NewFormPage";
import { NewsPage } from "@/features/news/pages/NewsPage";
import { ArticleAnalyzePage } from "@/features/articles/pages/ArticleAnalyzePage";
import { ArticlesPage } from "@/features/articles/pages/ArticlesPage";
import { HomePage } from "@/features/home/pages/HomePage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { SearchPage } from "@/features/search/pages/SearchPage";
import { StockPage } from "@/features/stocks/pages/StockPage";
import { PrivateRoute } from "@/shared/routing/PrivateRoute";
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";

export default function AppRoutes() {
  const [searchStock, setSearchStock] = useState("");

  return (
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
        <Route path="historical-price/:symbol" element={<StockChart />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="news-create" element={<NewFormPage />} />
        <Route path="news/:uuid" element={<NewFormPage />} />

        <Route path="articles" element={<ArticlesPage />} />
        <Route path="articles/:id/analyze" element={<ArticleAnalyzePage />} />
      </Route>
      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
}

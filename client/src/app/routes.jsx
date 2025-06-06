import { FinancialSkeleton } from "@/shared/components/loaders/FinancialSkeleton";
import { PrivateRoute } from "@/shared/routing/PrivateRoute";
import { Suspense, lazy, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.scss";

/**
 * @description Lazy loading de páginas para optimizar el bundle inicial
 * Solo se pre-cargan las rutas públicas críticas
 */
const HomePage = lazy(() => import("@/features/home/pages/HomePage"));
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"));

// Rutas privadas - se cargan bajo demanda cuando el usuario está autenticado
const SearchPage = lazy(() => import("@/features/search/pages/SearchPage"));
const StockPage = lazy(() => import("@/features/stocks/pages/StockPage"));
const StockChart = lazy(() =>
  import("@/features/charts/components/StockChart")
);
const NewsPage = lazy(() => import("@/features/news/pages/NewsPage"));
const NewFormPage = lazy(() => import("@/features/news/pages/NewFormPage"));
const ArticlesPage = lazy(() =>
  import("@/features/articles/pages/ArticlesPage")
);
const ArticleAnalyzePage = lazy(() =>
  import("@/features/articles/pages/ArticleAnalyzePage")
);

/**
 * @description Rutas principales de la aplicación con lazy loading
 * @returns {JSX.Element} Componente de rutas con Suspense boundaries
 */

export default function AppRoutes() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/search") {
      // Precargar componentes de stock que probablemente se usarán
      import("@/features/stocks/pages/StockPage");
      import("@/features/charts/components/StockChart");
    }
  }, [location]);

  const [searchStock, setSearchStock] = useState("");

  return (
    <Suspense fallback={<FinancialSkeleton />}>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas privadas */}
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
    </Suspense>
  );
}

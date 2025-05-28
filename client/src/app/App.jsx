import { AuthProvider } from "@/features/auth/AuthContext";
import { SearchProvider } from "@/features/search/SearchContext";
import { CsrfProvider } from "@/services/api/csrf/CsrfContext";
import { BrowserRouter } from "react-router-dom";
import AppContent from "./AppContent";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CsrfProvider>
          <SearchProvider>
            <AppContent />
          </SearchProvider>
        </CsrfProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

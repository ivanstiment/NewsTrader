import { AuthProvider } from "@/features/auth/AuthContext";
import { CsrfProvider } from "@/services/api/csrf/CsrfContext";
import { BrowserRouter } from "react-router-dom";
import AppContent from "./AppContent";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CsrfProvider>
          <AppContent />
        </CsrfProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

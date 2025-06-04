/*
 * NewsTrader - Sistema automatizado de monitoreo y análisis de noticias
 * Copyright 2025 Iván Soto Cobos
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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

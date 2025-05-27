import { Header } from "@/shared/components/layout/Header/index";
import { NavigationMenu } from "@/shared/components/navigation/NavigationMenu/index";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import "./App.scss";
import AppRoutes from "./routes";

export default function AppContent() {
  const { pathname } = useLocation();
  const hideNavOn = ["/home", "/login", "/register"];
  const hideHeaderOn = ["/home"];
  const showNav = !hideNavOn.includes(pathname);
  const showHeader = !hideHeaderOn.includes(pathname);

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      {showNav && <NavigationMenu />}
      {showHeader && (
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      )}
      <AppRoutes />
      <Toaster />
    </>
  );
}

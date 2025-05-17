import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/context/NotificationContext";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import CheckoutPage from "@/pages/CheckoutPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminOrdersPage from "@/pages/AdminOrdersPage";
import ProductManagementPage from "@/pages/ProductManagementPage";
import SubscriptionsPage from "@/pages/SubscriptionsPage";
import OrdersPage from "@/pages/OrdersPage";
import TutorialsPage from "@/pages/TutorialsPage";
import AnunciosPage from "@/pages/AnunciosPage";
import ProxyPage from "@/pages/ProxyPage";
import NotFound from "@/pages/not-found";
import NotificationPopup from "@/components/NotificationPopup";
import { useEffect } from "react";

function Router() {
  const { isAuthenticated, userType } = useAuth();

  if (!isAuthenticated) {
    // Rotas públicas para autenticação
    return (
      <Switch>
        <Route path="/">
          <LoginPage />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/admin/login">
          <LoginPage isAdmin={true} />
        </Route>
        <Route path="/cadastro">
          <LoginPage isRegister={true} />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    );
  }

  // Se autenticado como admin, mostrar dashboard admin
  if (userType === "admin") {
    return (
      <Switch>
        <Route path="/">
          <AdminDashboardPage />
        </Route>
        <Route path="/admin">
          <AdminDashboardPage />
        </Route>
        <Route path="/admin/produtos">
          <ProductManagementPage />
        </Route>
        <Route path="/admin/pedidos">
          <AdminOrdersPage />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    );
  }

  // Se autenticado como cliente, mostrar rotas do cliente
  return (
    <Switch>
      <Route path="/">
        <DashboardPage />
      </Route>
      <Route path="/dashboard">
        <DashboardPage />
      </Route>
      <Route path="/assinaturas">
        <SubscriptionsPage />
      </Route>
      <Route path="/pedidos">
        <OrdersPage />
      </Route>
      <Route path="/tutoriais">
        <TutorialsPage />
      </Route>
      <Route path="/anuncios">
        <AnunciosPage />
      </Route>
      <Route path="/proxies">
        <ProxyPage />
      </Route>
      <Route path="/checkout/:productId">
        <CheckoutPage />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  const { activeNotification } = useNotifications();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        {activeNotification && <NotificationPopup />}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

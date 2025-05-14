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
import SubscriptionsPage from "@/pages/SubscriptionsPage";
import OrdersPage from "@/pages/OrdersPage";
import TutorialsPage from "@/pages/TutorialsPage";
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
        <Route path="/" component={AdminDashboardPage} />
        <Route path="/admin" component={AdminDashboardPage} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Se autenticado como cliente, mostrar rotas do cliente
  return (
    <Switch>
      <Route path="/" component={DashboardPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/assinaturas" component={SubscriptionsPage} />
      <Route path="/pedidos" component={OrdersPage} />
      <Route path="/tutoriais" component={TutorialsPage} />
      <Route path="/checkout/:productId" component={CheckoutPage} />
      <Route component={NotFound} />
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

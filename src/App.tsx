import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import CreateOS from "./pages/CreateOS";
import Orders from "./pages/Orders";
import Parameters from "./pages/Parameters";
import Reports from "./pages/Reports";
import Indicators from "./pages/Indicators";
import ViewOrder from "./pages/ViewOrder";
import EditOrder from "./pages/EditOrder";
import Users from "./pages/Users";
import PopsManuais from "./pages/PopsManuais"; // <-- Importado o novo componente
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/create-os" element={<CreateOS />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/view-order/:id" element={<ViewOrder />} />
        <Route path="/edit-order/:id" element={<EditOrder />} />
        <Route path="/parameters" element={<Parameters />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/quality-control" element={<Indicators />} />
        <Route path="/users" element={<Users />} />
        <Route path="/pops-manuais" element={<PopsManuais />} /> {/* <-- Adicionada a nova rota */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
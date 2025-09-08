import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/contexts/AuthContext";

// Import das páginas e componentes
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage"; // <-- 1. Importamos a nova HomePage
import Index from "./pages/Index";
import CreateOS from "./pages/CreateOS";
import Orders from "./pages/Orders";
import Parameters from "./pages/Parameters";
import Reports from "./pages/Reports";
import Indicators from "./pages/Indicators";
import ViewOrder from "./pages/ViewOrder";
import EditOrder from "./pages/EditOrder";
import Users from "./pages/Users";
import PopsManuais from "./pages/PopsManuais";
import NotFound from "./pages/NotFound";
import Charts from './pages/Charts';

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

  // --- 2. LÓGICA DE ROTEAMENTO ALTERADA ---
  // Agora separamos as rotas públicas das privadas.
  return (
    <Routes>
      {/* Rota Pública: Todos podem ver a HomePage */}
      <Route path="/" element={<HomePage />} />

      {/* Rotas Privadas: Só são acessíveis se o 'user' existir */}
      {user && (
        <Route element={<Layout />}>
          <Route path="/index" element={<Index />} />
          <Route path="/create-os" element={<CreateOS />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/view-order/:id" element={<ViewOrder />} />
          <Route path="/edit-order/:id" element={<EditOrder />} />
          <Route path="/parameters" element={<Parameters />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/quality-control" element={<Indicators />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="/users" element={<Users />} />
          <Route path="/pops-manuais" element={<PopsManuais />} />
        </Route>
      )}

      {/* Rota para "Não Encontrado" */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// O componente App principal permanece o mesmo
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

export default App
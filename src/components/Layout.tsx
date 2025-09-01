import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/Header"
import { Outlet } from 'react-router-dom';

// 1. A prop 'children' foi removida da definição da função.
export default function Layout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          {/* 2. O {children} foi substituído pelo <Outlet /> */}
          {/* O React Router irá renderizar as rotas filhas aqui automaticamente */}
          <main className="flex-1 p-4 sm:p-6 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
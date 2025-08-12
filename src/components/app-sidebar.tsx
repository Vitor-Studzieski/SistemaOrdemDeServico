import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  AlertTriangle, 
  BarChart3, 
  Users, 
  Settings,
  LogOut,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Criar OS",
    url: "/create-os",
    icon: Plus,
  },
  {
    title: "Ordens de Serviço",
    url: "/orders", 
    icon: FileText,
  },
  {
    title: "Parâmetros Críticos",
    url: "/parameters",
    icon: AlertTriangle,
  },
  {
    title: "Relatórios",
    url: "/reports",
    icon: BarChart3,
  },
  {
    title: "Indicadores",
    url: "/quality-control",
    icon: BarChart3,
  },
  {
    title: "Usuários",
    url: "/users",
    icon: Users,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { signOut, user } = useAuth();

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-emerald-600 text-white border-r-2 border-emerald-400" : "text-slate-300 hover:bg-slate-800 hover:text-white";

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Sidebar
      className="w-64"
      variant="sidebar"
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold text-white">OSActive</h2>
      </div>

      <SidebarContent className="bg-slate-900">
        <SidebarGroup className="mt-8">
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end 
                        className={getNavCls}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User info and logout at bottom */}
        <div className="mt-auto p-4 border-t border-slate-700">
          <div className="text-xs text-slate-400 mb-2">
            {user?.email}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSignOut}
            className="w-full justify-start text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sair
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
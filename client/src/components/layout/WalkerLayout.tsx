import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, LayoutDashboard, Calendar, Users, Package, DollarSign, Megaphone, Webhook } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface WalkerLayoutProps {
  children: React.ReactNode;
}

export const WalkerLayout = ({ children }: WalkerLayoutProps) => {
  const { signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/schedule", icon: Calendar, label: "Agenda" },
    { href: "/clients", icon: Users, label: "Clientes" },
    { href: "/service-plans", icon: Package, label: "Planos" },
    { href: "/financial", icon: DollarSign, label: "Financeiro" },
    { href: "/marketing", icon: Megaphone, label: "Marketing" },
    { href: "/webhook-builder", icon: Webhook, label: "Webhooks" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header com Menu */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 lg:px-8">
          {/* Primeira linha - Logo e Sair */}
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                DW
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">DogWalker Pro</h2>
                <p className="text-xs text-gray-600">Gestão Pet Profissional</p>
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={signOut} 
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>

          {/* Segunda linha - Menu de Navegação */}
          <nav className="border-t pt-4 pb-4">
            <div className="flex space-x-6 overflow-x-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                      ${isActive
                        ? "bg-cyan-100 text-cyan-700 border border-cyan-200"
                        : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <main className="p-4 lg:p-8">
        {children}
      </main>
    </div>
  );
};

import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import logoUrl from "@/assets/logo.png";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Package,
  DollarSign, 
  Megaphone,
  Settings,
  LogOut 
} from "lucide-react";

export const WalkerHeader = () => {
  const { signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/schedule", icon: Calendar, label: "Agenda" },
    { href: "/clients", icon: Users, label: "Clientes" },
    { href: "/service-plans", icon: Package, label: "Planos" },
    { href: "/financial", icon: DollarSign, label: "Financeiro" },
    { href: "/marketing", icon: Megaphone, label: "Marketing" },
    { href: "/webhook-builder", icon: Settings, label: "Webhooks" },
  ];

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <img 
                src={logoUrl} 
                alt="Walki Pet Logo" 
                className="h-8 w-auto hover:opacity-80 transition-opacity"
              />
              <span className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Walki Pet
              </span>
            </Link>
            
            <nav className="hidden md:flex space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <Button variant="outline" onClick={signOut} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};

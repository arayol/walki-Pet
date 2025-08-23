import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Package,
  DollarSign, 
  Megaphone,
  Webhook,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface WalkerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalkerSidebar = ({ isOpen, onClose }: WalkerSidebarProps) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-white shadow-lg z-50 transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        ${isCollapsed ? 'lg:w-16' : 'lg:w-80'}
        ${isOpen && !isCollapsed ? 'w-80' : 'w-16'}
      `}>
        <div className={`${isCollapsed ? 'p-3' : 'p-6'} h-full flex flex-col`}>
          {/* Header */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center mb-6' : 'justify-between mb-8'}`}>
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  DW
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">DogWalker Pro</h2>
                  <p className="text-sm text-gray-600">Gestão Pet Profissional</p>
                </div>
              </div>
            )}
            
            {isCollapsed && (
              <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">
                DW
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Collapse/Expand Button - Desktop only */}
          <div className="hidden lg:flex justify-end mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 p-0"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors relative group
                    ${isActive
                      ? "bg-cyan-100 text-cyan-700 border border-cyan-200"
                      : "text-gray-700 hover:bg-gray-100"
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className="h-5 w-5" />
                  {!isCollapsed && <span>{item.label}</span>}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};
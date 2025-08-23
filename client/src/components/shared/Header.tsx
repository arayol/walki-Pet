import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/shared/hooks/useAuth";
import { LogOut, User } from "lucide-react";
import logoUrl from "@/assets/logo.png";

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  const { user, userRole, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/auth");
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const getUserDashboard = () => {
    if (userRole === "walker") return "/dashboard";
    if (userRole === "client") return "/client-dashboard";
    return "/";
  };

  return (
    <header className={`bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src={logoUrl} 
                alt="Walki Pet Logo" 
                className="h-10 w-auto hover:opacity-80 transition-opacity"
              />
              <span className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                Walki Pet
              </span>
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-20 h-8 bg-gray-200 animate-pulse rounded" />
            ) : user ? (
              <div className="flex items-center space-x-3">
                {/* User info */}
                <Link 
                  to={getUserDashboard()}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline-block font-medium">
                    {user.name || user.email.split("@")[0]}
                  </span>
                </Link>
                
                {/* Logout button */}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                  data-testid="button-logout"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline-block">Sair</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleLogin}
                variant="default"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="button-login"
              >
                Entrar
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
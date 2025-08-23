
import { useState, useEffect, createContext, useContext } from "react";
import { apiClient } from "@/integrations/api/client";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface Session {
  user: User;
  access_token: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  userRole: null,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  const fetchUserRole = async (userId: string) => {
    try {
      const response = await fetch(`/api/profiles/${userId}`);
      const data = await response.json();
      
      setUserRole(data?.role || null);
      
      // Redirecionar após obter o papel do usuário
      const currentPath = window.location.pathname;
      
      if (currentPath === '/auth' && data?.role) {
        if (data.role === 'walker') {
          window.location.href = '/dashboard';
        } else if (data.role === 'client') {
          window.location.href = '/client-dashboard';
        }
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      setUserRole(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing session in localStorage
        const savedSession = localStorage.getItem('auth-session');
        
        if (savedSession) {
          const session = JSON.parse(savedSession);
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await fetchUserRole(session.user.id);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signOut = async () => {
    const currentUserRole = userRole;
    
    // Clear local session
    localStorage.removeItem('auth-session');
    setSession(null);
    setUser(null);
    setUserRole(null);
    
    // Redirect baseado no tipo de usuário
    if (currentUserRole === 'client') {
      // Para clientes, sempre redirecionar para a landing page do cliente
      window.location.href = '/client-landing';
    } else {
      // Para walkers, redirecionar para a página inicial
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, userRole, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

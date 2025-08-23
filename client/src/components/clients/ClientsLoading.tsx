
import { WalkerHeader } from "@/components/walker/WalkerHeader";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const ClientsLoading = () => {
  return (
    <ProtectedRoute requiredRole="walker">
      <div className="min-h-screen bg-gray-50">
        <WalkerHeader />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

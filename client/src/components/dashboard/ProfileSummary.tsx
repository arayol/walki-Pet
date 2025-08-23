
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Edit } from "lucide-react";
import { AvatarUpload } from "./AvatarUpload";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface ProfileSummaryProps {
  walkerData: any;
  onProfileUpdate?: () => void;
}

export const ProfileSummary = ({ walkerData, onProfileUpdate }: ProfileSummaryProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleViewPublicPage = () => {
    if (walkerData?.slug) {
      window.open(`/profile/${walkerData.slug}`, '_blank');
    }
  };

  const handleAvatarUpdate = () => {
    if (onProfileUpdate) {
      onProfileUpdate();
    }
  };

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-gray-700">Meu Perfil</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {/* Container dividido: avatar à esquerda, botões à direita */}
        <div className="flex items-center gap-4">
          {/* Lado esquerdo - Avatar maior */}
          <div className="flex-shrink-0">
            <AvatarUpload
              currentAvatarUrl={walkerData?.profiles?.avatar_url}
              walkerId={user?.id || ""}
              onAvatarUpdate={handleAvatarUpdate}
              size="md"
            />
          </div>
          
          {/* Lado direito - Botões */}
          <div className="flex-1 space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/marketing')}
              className="w-full h-7 justify-start"
            >
              <Edit className="h-3 w-3 mr-1" />
              Editar Perfil
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleViewPublicPage}
              className="w-full h-7 justify-start"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Visualizar Página
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

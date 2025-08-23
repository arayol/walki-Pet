import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, Users, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  walkerId: string;
  onAvatarUpdate: (avatarUrl: string) => void;
  size?: "sm" | "md" | "lg";
}

export const AvatarUpload = ({ 
  currentAvatarUrl, 
  walkerId, 
  onAvatarUpdate,
  size = "md" 
}: AvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16", 
    lg: "w-24 h-24"
  };

  const iconSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar formato
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive"
      });
      return;
    }

    // Validar tamanho (500KB)
    if (file.size > 500 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "Por favor, selecione uma imagem com menos de 500KB.",
        variant: "destructive"
      });
      return;
    }

    uploadAvatar(file);
  };

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true);

      // Simulate avatar upload for now - can be implemented with API later
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate upload delay
      
      // Generate a data URL for the uploaded file as a placeholder
      const reader = new FileReader();
      reader.onload = (event) => {
        const avatarUrl = event.target?.result as string;
        onAvatarUpdate(avatarUrl);
        
        toast({
          title: "Avatar atualizado!",
          description: "Sua foto de perfil foi simulada com sucesso.",
        });
      };
      
      reader.readAsDataURL(file);

    } catch (error) {
      console.error("Erro ao fazer upload do avatar:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a foto de perfil. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    try {
      setUploading(true);

      // Simulate avatar removal for now - can be implemented with API later
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

      onAvatarUpdate("");
      
      toast({
        title: "Avatar removido!",
        description: "Sua foto de perfil foi simulada como removida.",
      });

    } catch (error) {
      console.error("Erro ao remover avatar:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a foto de perfil. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative group">
      <div 
        className={`${sizeClasses[size]} cursor-pointer relative overflow-hidden rounded-full transition-all duration-200 hover:ring-2 hover:ring-primary/20`}
        onClick={handleClick}
      >
        <Avatar className="w-full h-full">
          <AvatarImage src={currentAvatarUrl} alt="Avatar" />
          <AvatarFallback className="bg-blue-100">
            <Users className={`${iconSizes[size]} text-blue-600`} />
          </AvatarFallback>
        </Avatar>
        
        {/* Overlay de upload */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <Upload className="h-4 w-4 text-white" />
        </div>
        
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
      
      {size === "lg" && (
        <div className="mt-2 text-center space-y-2">
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClick}
              disabled={uploading}
              className="text-xs"
            >
              <Upload className="h-3 w-3 mr-1" />
              {currentAvatarUrl ? "Alterar" : "Adicionar"} Foto
            </Button>
            {currentAvatarUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={removeAvatar}
                disabled={uploading}
                className="text-xs text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Remover
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Recomendado: 500x500px, máx. 500KB<br />
            Formatos: JPG, PNG, GIF
          </p>
        </div>
      )}
    </div>
  );
};

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Share2, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ClientInvitationService } from "@/services/ClientInvitationService";
import { SocialSharingService } from "@/services/SocialSharingService";
import { InvitationUrl } from "@/value-objects/InvitationUrl";

interface ClientInviteLinkProps {
  walkerSlug: string;
}

export const ClientInviteLink = ({ walkerSlug }: ClientInviteLinkProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const invitationService = new ClientInvitationService();
  const sharingService = new SocialSharingService();
  const invitationUrl = invitationService.createInvitationUrl(walkerSlug);

  const showSuccessToast = () => {
    toast({
      title: "Link copiado!",
      description: "O link de convite foi copiado para a área de transferência",
    });
  };

  const showErrorToast = () => {
    toast({
      title: "Erro",
      description: "Não foi possível copiar o link",
      variant: "destructive",
    });
  };

  const copyToClipboard = async () => {
    const success = await invitationService.copyToClipboard(invitationUrl);
    
    if (success) {
      setCopied(true);
      showSuccessToast();
      setTimeout(() => setCopied(false), 2000);
      return;
    }
    
    showErrorToast();
  };

  const shareToWhatsApp = () => {
    sharingService.shareToWhatsApp(invitationUrl);
  };

  const shareToFacebook = () => {
    sharingService.shareToFacebook(invitationUrl);
  };

  const shareToEmail = () => {
    sharingService.shareToEmail(invitationUrl);
  };

  const shareToInstagram = () => {
    copyToClipboard();
    toast({
      title: "Link copiado!",
      description: "Cole o link em uma publicação do Instagram",
    });
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Link de Convite para Clientes</span>
            <Button
              onClick={() => setShowShareModal(true)}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Share2 className="h-4 w-4" />
              <span>Compartilhar</span>
            </Button>
          </CardTitle>
          <CardDescription>
            Compartilhe este link com seus clientes para que eles possam se cadastrar automaticamente em sua lista
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Seu Link de Convite</Label>
            <div className="flex space-x-2">
              <Input
                value={invitationUrl.toString()}
                readOnly
                className="bg-gray-50"
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="flex-shrink-0"
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-700">
              <strong>Como usar:</strong><br />
              1. Copie o link acima<br />
              2. Envie para seus clientes via WhatsApp, email ou SMS<br />
              3. Quando acessarem o link, eles verão um formulário personalizado<br />
              4. Após o cadastro, aparecerão automaticamente na sua lista de clientes
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Compartilhamento */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Compartilhar Link</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShareModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={shareToWhatsApp}
                className="flex items-center space-x-2 p-4 h-auto"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">W</span>
                </div>
                <span>WhatsApp</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={shareToFacebook}
                className="flex items-center space-x-2 p-4 h-auto"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">f</span>
                </div>
                <span>Facebook</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={shareToEmail}
                className="flex items-center space-x-2 p-4 h-auto"
              >
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">@</span>
                </div>
                <span>Email</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={shareToInstagram}
                className="flex items-center space-x-2 p-4 h-auto"
              >
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">I</span>
                </div>
                <span>Instagram</span>
              </Button>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={copyToClipboard}
                className="w-full flex items-center justify-center space-x-2"
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span>{copied ? "Copiado!" : "Copiar Link"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

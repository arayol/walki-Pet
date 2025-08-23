
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

interface UserInfoDisplayProps {
  clientInfo: any;
}

export const UserInfoDisplay = ({ clientInfo }: UserInfoDisplayProps) => {
  if (!clientInfo) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-6 w-6 mr-2" />
          Informações do Usuário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="font-medium">Nome:</span>
            <p>{clientInfo.name}</p>
          </div>
          <div>
            <span className="font-medium">Email:</span>
            <p>{clientInfo.email}</p>
          </div>
          <div>
            <span className="font-medium">Tipo:</span>
            <Badge>{clientInfo.role}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

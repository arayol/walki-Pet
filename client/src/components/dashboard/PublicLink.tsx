
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PublicLinkProps {
  walkerData: any;
}

export const PublicLink = ({ walkerData }: PublicLinkProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seu Link Público</CardTitle>
        <CardDescription>Compartilhe com seus clientes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-3 rounded-lg mb-3">
          <code className="text-sm">
            petwalker.com/{walkerData?.slug || 'walker'}
          </code>
        </div>
        <Button size="sm" className="w-full">
          Copiar Link
        </Button>
      </CardContent>
    </Card>
  );
};

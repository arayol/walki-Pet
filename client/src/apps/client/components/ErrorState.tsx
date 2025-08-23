
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: string;
  onGoBack: () => void;
}

export const ErrorState = ({ error, onGoBack }: ErrorStateProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="text-center py-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ops!</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={onGoBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

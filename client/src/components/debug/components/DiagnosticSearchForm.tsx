
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Database, Search, RefreshCw } from "lucide-react";

interface DiagnosticSearchFormProps {
  email: string;
  onEmailChange: (email: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export const DiagnosticSearchForm = ({ 
  email, 
  onEmailChange, 
  onSearch, 
  loading 
}: DiagnosticSearchFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-6 w-6 mr-2" />
          Diagnóstico de Pagamentos, Agendamentos e Disponibilidade
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Email do Cliente/Walker</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="Digite o email para buscar dados"
            />
          </div>
          <Button 
            onClick={onSearch}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Buscar Dados
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

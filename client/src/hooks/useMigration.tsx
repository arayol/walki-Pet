
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MigrationResult {
  success: boolean;
  migrated_plans?: number;
  message?: string;
  error?: string;
}

export const useMigration = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const migrateExistingPlans = async (): Promise<MigrationResult> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('migrate_existing_service_plans');

      if (error) throw error;

      // Type guard to ensure data is the expected type
      let result: MigrationResult;
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        result = data as unknown as MigrationResult;
      } else {
        result = {
          success: false,
          error: 'Invalid response format'
        };
      }
      
      if (result.success) {
        toast({
          title: "Migração Concluída",
          description: `${result.migrated_plans} plano(s) migrado(s) com sucesso`,
        });
      } else {
        toast({
          title: "Erro na Migração",
          description: result.error || "Erro desconhecido",
          variant: "destructive",
        });
      }

      return result;
    } catch (error: any) {
      console.error('Error running migration:', error);
      const errorResult: MigrationResult = {
        success: false,
        error: error.message
      };
      
      toast({
        title: "Erro na Migração",
        description: error.message,
        variant: "destructive",
      });

      return errorResult;
    } finally {
      setLoading(false);
    }
  };

  return {
    migrateExistingPlans,
    loading
  };
};

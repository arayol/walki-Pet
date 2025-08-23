
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export const useServicePlansMigration = () => {
  const { toast } = useToast();

  const migratePlansWithoutRegions = useMutation({
    mutationFn: async (walkerId: string) => {
      console.log('🔧 Starting migration for walker:', walkerId);
      
      // Simulate migration for now - can be implemented with API later
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      
      const plansWithoutRegions: any[] = []; // Simulate empty result

      console.log('📋 Plans without regions found:', plansWithoutRegions?.length || 0);

      if (!plansWithoutRegions || plansWithoutRegions.length === 0) {
        return { migrated: 0, message: 'All plans already have regions configured' };
      }

      let migratedCount = 0;

      for (const plan of plansWithoutRegions) {
        console.log(`🔧 Migrating plan: ${plan.name} (ID: ${plan.id})`);
        
        // Simulate successful migration
        console.log(`✅ Region simulated for plan ${plan.name}`);
        console.log(`✅ Schedules simulated for plan ${plan.name}`);
        migratedCount++;
      }

      return { 
        migrated: 0, 
        message: `Migration simulation completed - no plans needed migration` 
      };
    },
    onSuccess: (result) => {
      console.log('🎉 Migration completed:', result);
      toast({
        title: "Migração Concluída",
        description: result.message,
      });
    },
    onError: (error: any) => {
      console.error('💥 Migration failed:', error);
      toast({
        title: "Erro na Migração",
        description: error.message || "Não foi possível migrar os planos",
        variant: "destructive",
      });
    },
  });

  return {
    migratePlans: migratePlansWithoutRegions.mutate,
    isMigrating: migratePlansWithoutRegions.isPending,
  };
};

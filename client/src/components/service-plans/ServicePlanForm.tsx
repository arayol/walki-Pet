import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ServicePlan } from "@/apps/walker/pages/ServicePlans";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ServicePlanFormData } from "./form/types";
import { ServicePlanFormContent } from "./form/ServicePlanFormContent";
import { RegionsManagerModal } from "./form/RegionsManagerModal";
import { useWalkCount } from "./form/useWalkCount";
import { uploadImage } from "./form/ImageUploadUtils";
import { useCreateServicePlan, useUpdateServicePlan } from "@/hooks/useServicePlans";

const formSchema = z.object({
  name: z.string().min(5, "Nome deve ter pelo menos 5 caracteres"),
  description: z.string().optional(),
  price: z.string().min(1, "Preço é obrigatório"),
  is_recurring: z.boolean(),
  recurrence_type: z.enum(["weekly", "monthly"]).optional(),
  walk_count: z.number().min(1, "Deve ter pelo menos 1 passeio"),
  plan_type: z.enum(["walk", "extra"]),
});

interface ServicePlanFormProps {
  plan?: ServicePlan | null;
  planType: 'walks' | 'extras';
  onClose: () => void;
  onSave: () => void;
}

export const ServicePlanForm = ({ plan, planType, onClose, onSave }: ServicePlanFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(plan?.image_url || null);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(plan?.id || null);
  const [showRegionsManager, setShowRegionsManager] = useState(false);

  const createPlanMutation = useCreateServicePlan();
  const updatePlanMutation = useUpdateServicePlan();

  const form = useForm<ServicePlanFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: plan?.name || "",
      description: plan?.description || "",
      price: plan?.price.toString() || "",
      is_recurring: plan?.is_recurring || false,
      recurrence_type: plan?.recurrence_type as "weekly" | "monthly" || undefined,
      walk_count: plan?.walk_count || 1,
      plan_type: planType === 'walks' ? 'walk' : 'extra',
    },
  });

  const {
    walkCount,
    incrementWalkCount,
    decrementWalkCount,
    handleWalkCountChange
  } = useWalkCount(plan?.walk_count || 1, form);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (data: ServicePlanFormData) => {
    if (!user) return;

    console.log('💾 Saving plan with data:', data);

    setLoading(true);
    try {
      let imageUrl = plan?.image_url || null;
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, user.id);
      }

      const planData = {
        walker_id: user.id,
        name: data.name,
        description: data.description || null,
        image_url: imageUrl,
        price: parseFloat(data.price),
        is_recurring: data.is_recurring,
        recurrence_type: data.is_recurring ? data.recurrence_type : null,
        walk_count: walkCount,
        includes_bath: false,
        includes_grooming: false,
        includes_feeding: false,
        includes_playtime: false,
      };

      console.log('💾 Plan data to save:', planData);

      let result;
      if (plan) {
        // Update existing plan
        result = await updatePlanMutation.mutateAsync({
          planId: plan.id,
          updates: planData
        });
        setCurrentPlanId(plan.id);
        console.log('✅ Plan updated successfully:', result);
      } else {
        // Create new plan
        result = await createPlanMutation.mutateAsync(planData);
        setCurrentPlanId(result.id);
        console.log('✅ Plan created successfully:', result);
      }

      toast({
        title: plan ? "Plano atualizado!" : "Plano criado!",
        description: `O plano "${data.name}" foi ${plan ? 'atualizado' : 'criado'} com sucesso.`,
      });

      setShowRegionsManager(true);
    } catch (error: any) {
      console.error("❌ Error saving plan:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar o plano",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegionsManagerClose = () => {
    setShowRegionsManager(false);
    onSave();
  };

  // Se estamos mostrando o gerenciador de regiões, renderizar apenas ele
  if (showRegionsManager && currentPlanId) {
    return (
      <RegionsManagerModal
        currentPlanId={currentPlanId}
        planName={form.getValues("name")}
        onClose={handleRegionsManagerClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>
                {plan ? 'Editar Plano' : 'Novo Plano'}
              </CardTitle>
              <CardDescription>
                {plan ? 'Atualize as informações do seu plano' : 'Crie um novo plano de serviços'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <ServicePlanFormContent
            form={form}
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
            walkCount={walkCount}
            onIncrementWalkCount={incrementWalkCount}
            onDecrementWalkCount={decrementWalkCount}
            onWalkCountChange={handleWalkCountChange}
            onSubmit={handleSubmit}
            onCancel={onClose}
            loading={loading}
            isEdit={!!plan}
            servicePlanId={currentPlanId || plan?.id}
            servicePlanName={form.watch("name") || plan?.name}
          />
        </CardContent>
      </Card>
    </div>
  );
};

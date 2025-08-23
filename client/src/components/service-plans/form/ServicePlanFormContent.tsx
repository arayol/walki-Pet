
import { UseFormReturn } from "react-hook-form";
import { BasicInfoSection } from "./BasicInfoSection";
import { PricingSection } from "./PricingSection";
import { ServicesSection } from "./ServicesSection";
import { FormActions } from "./FormActions";
import { ServicePlanFormData } from "./types";

interface ServicePlanFormContentProps {
  form: UseFormReturn<ServicePlanFormData>;
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  walkCount: number;
  onIncrementWalkCount: () => void;
  onDecrementWalkCount: () => void;
  onWalkCountChange: (value: string) => void;
  onSubmit: (data: ServicePlanFormData) => void;
  onCancel: () => void;
  loading: boolean;
  isEdit: boolean;
}

export const ServicePlanFormContent = ({
  form,
  imagePreview,
  onImageChange,
  walkCount,
  onIncrementWalkCount,
  onDecrementWalkCount,
  onWalkCountChange,
  onSubmit,
  onCancel,
  loading,
  isEdit
}: ServicePlanFormContentProps) => {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <BasicInfoSection 
        form={form}
        imagePreview={imagePreview}
        onImageChange={onImageChange}
      />

      <PricingSection form={form} />

      <ServicesSection 
        form={form}
        walkCount={walkCount}
        onIncrementWalkCount={onIncrementWalkCount}
        onDecrementWalkCount={onDecrementWalkCount}
        onWalkCountChange={onWalkCountChange}
      />

      <FormActions 
        onCancel={onCancel}
        loading={loading}
        isEdit={isEdit}
      />
    </form>
  );
};

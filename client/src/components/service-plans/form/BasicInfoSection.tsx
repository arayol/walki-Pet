
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { ServicePlanForm } from "./types";

interface BasicInfoSectionProps {
  form: ServicePlanForm;
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BasicInfoSection = ({ form, imagePreview, onImageChange }: BasicInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informações Básicas</h3>
      
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Plano *</Label>
        <Input
          id="name"
          {...form.register("name")}
          placeholder="Ex: Passeio Premium, Cuidados Completos"
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          {...form.register("description")}
          rows={3}
          placeholder="Descreva os benefícios e detalhes do seu plano..."
        />
      </div>

      <div className="space-y-2">
        <Label>Tipo de Plano</Label>
        <Select
          value={form.watch("plan_type")}
          onValueChange={(value) => form.setValue("plan_type", value as "walk" | "extra")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de plano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="walk">Plano de Passeio</SelectItem>
            <SelectItem value="extra">Plano de Serviço Extra</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Imagem do Plano</Label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('image-upload')?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Fazer Upload
          </Button>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="hidden"
          />
          {imagePreview && (
            <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

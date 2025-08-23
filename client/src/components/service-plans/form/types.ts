
import { UseFormReturn } from "react-hook-form";

export interface ServicePlanFormData {
  name: string;
  description?: string;
  price: string;
  is_recurring: boolean;
  recurrence_type?: "weekly" | "monthly";
  walk_count: number;
  plan_type: "walk" | "extra";
}

export type ServicePlanForm = UseFormReturn<ServicePlanFormData>;

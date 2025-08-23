
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ServicePlanFormData } from "./types";

export const useWalkCount = (initialCount: number, form: UseFormReturn<ServicePlanFormData>) => {
  const [walkCount, setWalkCount] = useState(initialCount);

  const incrementWalkCount = () => {
    const newCount = walkCount + 1;
    setWalkCount(newCount);
    form.setValue("walk_count", newCount);
  };

  const decrementWalkCount = () => {
    if (walkCount > 1) {
      const newCount = walkCount - 1;
      setWalkCount(newCount);
      form.setValue("walk_count", newCount);
    }
  };

  const handleWalkCountChange = (value: string) => {
    const num = parseInt(value) || 1;
    const clampedNum = Math.max(1, Math.min(50, num));
    setWalkCount(clampedNum);
    form.setValue("walk_count", clampedNum);
  };

  return {
    walkCount,
    incrementWalkCount,
    decrementWalkCount,
    handleWalkCountChange,
    setWalkCount
  };
};

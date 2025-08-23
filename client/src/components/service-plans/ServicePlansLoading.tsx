
import { Skeleton } from "@/components/ui/skeleton";

export const ServicePlansLoading = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-8 w-1/2" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-6 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
};

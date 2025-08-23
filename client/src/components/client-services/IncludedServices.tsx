
import { useState } from "react";
import { Heart, Scissors, Utensils, Bath, ChevronDown, ChevronUp } from "lucide-react";

interface IncludedServicesProps {
  includesPlaytime: boolean;
  includesFeeding: boolean;
  includesGrooming: boolean;
  includesBath: boolean;
}

export const IncludedServices = ({ 
  includesPlaytime, 
  includesFeeding, 
  includesGrooming, 
  includesBath 
}: IncludedServicesProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const getIncludedServices = () => {
    const included = [];
    if (includesPlaytime) included.push({ icon: Heart, text: "Brincadeiras" });
    if (includesFeeding) included.push({ icon: Utensils, text: "Alimentação" });
    if (includesGrooming) included.push({ icon: Scissors, text: "Cuidados básicos" });
    if (includesBath) included.push({ icon: Bath, text: "Banho" });
    return included;
  };

  const includedServices = getIncludedServices();

  if (includedServices.length === 0) return null;

  return (
    <div className="mb-4">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
      >
        <span>Serviços inclusos ({includedServices.length})</span>
        {showDetails ? (
          <ChevronUp className="h-4 w-4 ml-1" />
        ) : (
          <ChevronDown className="h-4 w-4 ml-1" />
        )}
      </button>
      
      {showDetails && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {includedServices.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-center text-sm text-gray-600">
                <Icon className="h-4 w-4 mr-2 text-blue-500" />
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

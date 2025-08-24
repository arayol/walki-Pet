
import { Users, MapPin } from "lucide-react";

interface AvailableRegion {
  region_id: string;
  cep: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  raio_km: number;
  available_slots: number;
}

interface AvailabilitySlotsProps {
  availableRegions: AvailableRegion[];
  totalSlots: number;
}

export const AvailabilitySlots = ({ availableRegions, totalSlots }: AvailabilitySlotsProps) => {
  const getAvailabilityTextColor = () => {
    if (totalSlots === 0) return "text-red-700";
    if (totalSlots <= 2) return "text-yellow-700";
    return "text-green-700";
  };

  return (
    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">
            Vagas disponíveis hoje
          </span>
        </div>
        <span className={`text-lg font-bold ${getAvailabilityTextColor()}`}>
          {totalSlots}
        </span>
      </div>
      
      <div className="mt-2 space-y-1">
        {availableRegions.map((region, index) => {
          const displayLocation = region.endereco && region.bairro 
            ? `${region.endereco}, ${region.bairro}`
            : `CEP ${region.cep}`;
          
          return (
            <div key={`${region.region_id}-${index}`} className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span title={region.endereco ? `${region.cidade}/${region.uf} - CEP: ${region.cep}` : undefined}>
                  {displayLocation}
                </span>
              </div>
              <span className="font-medium">
                {region.available_slots} vaga{region.available_slots !== 1 ? 's' : ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

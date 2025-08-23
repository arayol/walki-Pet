import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus, MapPin } from "lucide-react";

interface Region {
  name: string;
  cep: string;
  radius: number;
}

interface RegionInputProps {
  regions: Region[];
  onChange: (regions: Region[]) => void;
}

export const RegionInput = ({ regions, onChange }: RegionInputProps) => {
  const [newRegion, setNewRegion] = useState<Region>({
    name: "",
    cep: "",
    radius: 5
  });

  const addRegion = () => {
    if (newRegion.name && newRegion.cep) {
      onChange([...regions, newRegion]);
      setNewRegion({ name: "", cep: "", radius: 5 });
    }
  };

  const removeRegion = (index: number) => {
    onChange(regions.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Regiões Atendidas</Label>
      
      {/* Lista de regiões existentes */}
      <div className="space-y-2">
        {regions.map((region, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <div>
                <span className="font-medium">{region.name}</span>
                <span className="text-sm text-gray-600 ml-2">
                  CEP: {region.cep} • Raio: {region.radius}km
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeRegion(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Formulário para adicionar nova região */}
      <div className="border border-gray-200 rounded-lg p-4 space-y-3">
        <Label className="text-sm font-medium">Adicionar Nova Região</Label>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label htmlFor="region-name" className="text-xs">Nome da Região</Label>
            <Input
              id="region-name"
              placeholder="Ex: Vila Madalena"
              value={newRegion.name}
              onChange={(e) => setNewRegion(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="region-cep" className="text-xs">CEP</Label>
            <Input
              id="region-cep"
              placeholder="01000-000"
              value={newRegion.cep}
              onChange={(e) => setNewRegion(prev => ({ ...prev, cep: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="region-radius" className="text-xs">Raio (km)</Label>
            <Input
              id="region-radius"
              type="number"
              min="1"
              max="50"
              value={newRegion.radius}
              onChange={(e) => setNewRegion(prev => ({ ...prev, radius: parseInt(e.target.value) || 5 }))}
            />
          </div>
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addRegion}
          disabled={!newRegion.name || !newRegion.cep}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Região
        </Button>
      </div>
    </div>
  );
};
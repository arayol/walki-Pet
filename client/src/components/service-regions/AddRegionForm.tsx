
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { MapPin, Loader2 } from 'lucide-react';
import { useViaCEP, ViaCEPData } from '@/hooks/useViaCEP';
import { useServiceRegions, CreateServiceRegionData } from '@/hooks/useServiceRegions';

interface AddRegionFormProps {
  servicePlanId: string;
  onClose: () => void;
}

export const AddRegionForm = ({ servicePlanId, onClose }: AddRegionFormProps) => {
  const [cep, setCep] = useState('');
  const [raioKm, setRaioKm] = useState([5]);
  const [cepData, setCepData] = useState<ViaCEPData | null>(null);
  const [cepValidated, setCepValidated] = useState(false);

  const { loading: viaCepLoading, formatCEP, fetchCEPData } = useViaCEP();
  const { createRegion, isCreating } = useServiceRegions();

  const handleCEPChange = (value: string) => {
    const formatted = formatCEP(value);
    setCep(formatted);
    setCepData(null);
    setCepValidated(false);
  };

  const handleValidateCEP = async () => {
    const data = await fetchCEPData(cep);
    if (data) {
      setCepData(data);
      setCepValidated(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cepValidated || !cepData) return;

    const regionData: CreateServiceRegionData = {
      service_plan_id: servicePlanId,
      cep: cep.replace(/\D/g, ''),
      endereco: cepData.logradouro,
      bairro: cepData.bairro,
      cidade: cepData.localidade,
      uf: cepData.uf,
      raio_km: raioKm[0],
    };

    console.log('🏠 Criando região com dados de endereço:', regionData);
    createRegion(regionData);
    onClose();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Nova Região de Atendimento
        </CardTitle>
        <CardDescription>
          Adicione uma nova região onde você atende clientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cep">CEP Central *</Label>
            <div className="flex gap-2">
              <Input
                id="cep"
                placeholder="00000-000"
                value={cep}
                onChange={(e) => handleCEPChange(e.target.value)}
                maxLength={9}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleValidateCEP}
                disabled={cep.length < 9 || viaCepLoading}
              >
                {viaCepLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Validar'
                )}
              </Button>
            </div>
          </div>

          {cepData && cepValidated && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm font-medium text-green-800">
                {cepData.logradouro}, {cepData.bairro}
              </p>
              <p className="text-sm text-green-600">
                {cepData.localidade}/{cepData.uf}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Label>Raio de Atendimento: {raioKm[0]} km</Label>
            <Slider
              value={raioKm}
              onValueChange={setRaioKm}
              max={20}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 km</span>
              <span>20 km</span>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!cepValidated || isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                'Adicionar Região'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

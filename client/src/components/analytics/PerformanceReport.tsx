
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Users, 
  BarChart3,
  FileText
} from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

export const PerformanceReport = () => {
  const { performanceReport, loading, fetchPerformanceReport } = useAnalytics();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleGenerateReport = () => {
    fetchPerformanceReport(startDate || undefined, endDate || undefined);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Gerar Relatório de Performance
          </CardTitle>
          <CardDescription>
            Selecione o período para gerar um relatório detalhado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="start-date">Data Inicial</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="end-date">Data Final</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Button onClick={handleGenerateReport} disabled={loading}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Gerar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Report */}
      {performanceReport && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bookings Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Resumo de Agendamentos
              </CardTitle>
              <CardDescription>
                Período: {new Date(performanceReport.period.start_date).toLocaleDateString('pt-BR')} - {new Date(performanceReport.period.end_date).toLocaleDateString('pt-BR')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total de Agendamentos</span>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {performanceReport.bookings.total}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Agendamentos Confirmados</span>
                  <Badge variant="default" className="text-lg px-3 py-1">
                    {performanceReport.bookings.confirmed}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Receita do Período</span>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(performanceReport.bookings.revenue)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Utilization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Utilização de Horários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total de Vagas</span>
                  <Badge variant="outline">
                    {performanceReport.schedule_utilization.total_slots}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Vagas Ocupadas</span>
                  <Badge variant="secondary">
                    {performanceReport.schedule_utilization.booked_slots}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Taxa de Utilização</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min(performanceReport.schedule_utilization.utilization_rate, 100)}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {performanceReport.schedule_utilization.utilization_rate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Services */}
      {performanceReport?.top_services && performanceReport.top_services.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Serviços Mais Populares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performanceReport.top_services.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{service.service_name}</h4>
                    <p className="text-sm text-gray-600">{service.bookings} agendamentos</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {formatCurrency(service.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

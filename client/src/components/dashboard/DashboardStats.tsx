
import { StatsCard } from "@/components/walker/StatsCard";
import { Calendar, Users, DollarSign, Star } from "lucide-react";

interface DashboardStatsProps {
  stats: {
    todayWalks: number;
    activeClients: number;
    monthlyRevenue: number;
    rating: number;
  };
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const statsData = [
    {
      title: "Agendamentos Hoje",
      value: stats.todayWalks.toString(),
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Clientes Ativos",
      value: stats.activeClients.toString(),
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Receita Mensal",
      value: `R$ ${stats.monthlyRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Avaliação Média",
      value: stats.rating.toFixed(1),
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
};

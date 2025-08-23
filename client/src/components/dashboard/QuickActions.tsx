
import { Card } from "@/components/ui/card";
import { Package, Users, DollarSign, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Planos",
      icon: Package,
      onClick: () => navigate("/service-plans"),
      bgStyle: { background: "linear-gradient(135deg, #3b82f6, #2563eb)" },
      iconBg: "bg-white/90",
      iconColor: "text-blue-600",
      textColor: "text-white"
    },
    {
      title: "Clientes", 
      icon: Users,
      onClick: () => navigate("/clients"),
      bgStyle: { background: "linear-gradient(135deg, #10b981, #059669)" },
      iconBg: "bg-white/90",
      iconColor: "text-emerald-600",
      textColor: "text-white"
    },
    {
      title: "Financeiro",
      icon: DollarSign,
      onClick: () => navigate("/financial"),
      bgStyle: { background: "linear-gradient(135deg, #f59e0b, #d97706)" },
      iconBg: "bg-white/90",
      iconColor: "text-amber-600",
      textColor: "text-white"
    },
    {
      title: "Analytics",
      icon: BarChart3,
      onClick: () => navigate("/analytics"),
      bgStyle: { background: "linear-gradient(135deg, #8b5cf6, #7c3aed)" },
      iconBg: "bg-white/90", 
      iconColor: "text-violet-600",
      textColor: "text-white"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <Card
          key={index}
          className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 p-6 border-none shadow-lg"
          style={action.bgStyle}
          onClick={action.onClick}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className={`${action.iconBg} p-3 rounded-full shadow-md backdrop-blur-sm`}>
              <action.icon className={`h-6 w-6 ${action.iconColor}`} />
            </div>
            <span className={`font-medium ${action.textColor}`}>{action.title}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};

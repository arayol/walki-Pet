import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Heart } from "lucide-react";

interface ServicePlanCardProps {
  plan: {
    id: string;
    name: string;
    description?: string;
    price: number;
    walk_count: number;
    is_recurring: boolean;
    recurrence_type?: string;
    includes_bath: boolean;
    includes_grooming: boolean;
    includes_feeding: boolean;
    includes_playtime: boolean;
  };
  onSelectPlan: () => void;
}

export const ServicePlanCard = ({ plan, onSelectPlan }: ServicePlanCardProps) => {
  const [expanded, setExpanded] = useState(false);     // estado de expansão
  const [isOverflowing, setIsOverflowing] = useState(false); // overflow atual
  const [showToggle, setShowToggle] = useState(false); // mantém se precisa do botão
  const descRef = useRef<HTMLParagraphElement>(null);

  /* ----------- helpers ----------- */
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);

  /* ----------- detecta overflow ----------- */
  useEffect(() => {
    const el = descRef.current;
    if (!el) return;

    const check = () => {
      const hasOverflow = el.scrollHeight > el.clientHeight + 1; // margem de erro
      setIsOverflowing(hasOverflow);

      // grava 1× se ainda não inicializamos showToggle e estamos colapsados
      if (!expanded && !showToggle) setShowToggle(hasOverflow);
    };

    check();                               // 1ª verificação
    const ro = new ResizeObserver(check);  // recalcula em resize / fonte carregada
    ro.observe(el);

    return () => ro.disconnect();
  }, [plan.description, expanded, showToggle]);

  /* ----------- render ----------- */
  return (
    <div className="plan-card group flex flex-col h-full rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex flex-col justify-between flex-grow p-6">
        {/* Cabeçalho + descrição */}
        <div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">{plan.name}</h3>

          {plan.description && (
            <>
              <p
                ref={descRef}
                className={`text-sm leading-relaxed text-gray-600 ${
                  expanded ? "line-clamp-none" : "line-clamp-4"
                }`}
              >
                {plan.description}
              </p>

              {showToggle && (
                <button
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                  className="mt-2 flex items-center gap-1 text-xs text-blue-600 transition-colors hover:text-blue-700"
                >
                  {expanded ? (
                    <>
                      Ver menos <ChevronUp className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      Ver mais <ChevronDown className="h-3 w-3" />
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>

        {/* Rodapé: preço, badge, CTA */}
        <div className="pt-6">
          <div className="mb-4 text-2xl font-bold text-green-600">
            {formatPrice(plan.price)}
            {plan.is_recurring && (
              <span className="ml-1 text-sm text-gray-500">
                /{plan.recurrence_type === "weekly" ? "semana" : "mês"}
              </span>
            )}
          </div>

          <div className="mb-4">
            <Badge
              variant="outline"
              className="border-blue-200 bg-blue-50 text-blue-700"
            >
              {plan.walk_count} passeio{plan.walk_count > 1 ? "s" : ""}
            </Badge>
          </div>

          <Button
            onClick={onSelectPlan}
            className="group-hover:scale-[1.02] w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3 font-semibold text-white shadow transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-md"
          >
            <Heart className="mr-2 h-4 w-4" />
            Escolher Plano
          </Button>
        </div>
      </div>
    </div>
  );
};
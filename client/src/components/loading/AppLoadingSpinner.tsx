
import { useEffect, useState } from "react";

interface AppLoadingSpinnerProps {
  message?: string;
  appName?: string;
  showProgress?: boolean;
}

export const AppLoadingSpinner = ({ 
  message = "Carregando...", 
  appName,
  showProgress = true 
}: AppLoadingSpinnerProps) => {
  const [progress, setProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState("Inicializando...");

  useEffect(() => {
    if (!showProgress) return;

    const stages = [
      "Inicializando...",
      "Carregando componentes...",
      "Configurando interface...",
      "Quase pronto..."
    ];

    let currentStage = 0;
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 15, 90);
        
        // Atualiza o estágio baseado no progresso
        const stageIndex = Math.floor((newProgress / 90) * stages.length);
        if (stageIndex !== currentStage && stageIndex < stages.length) {
          currentStage = stageIndex;
          setLoadingStage(stages[stageIndex]);
        }
        
        return newProgress;
      });
    }, 200);

    return () => clearInterval(progressInterval);
  }, [showProgress]);

  const getAppColor = (appName?: string) => {
    switch (appName) {
      case 'walker': return 'border-blue-600';
      case 'client': return 'border-green-600';
      case 'auth': return 'border-indigo-600';
      case 'public': return 'border-purple-600';
      default: return 'border-gray-600';
    }
  };

  const getAppBg = (appName?: string) => {
    switch (appName) {
      case 'walker': return 'bg-blue-50';
      case 'client': return 'bg-green-50';
      case 'auth': return 'bg-indigo-50';
      case 'public': return 'bg-purple-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${getAppBg(appName)}`}>
      <div className="flex flex-col items-center space-y-6 p-8">
        {/* Spinner principal */}
        <div className="relative">
          <div className={`animate-spin rounded-full h-16 w-16 border-4 border-gray-200 ${getAppColor(appName)}`}></div>
          {showProgress && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {Math.round(progress)}%
              </span>
            </div>
          )}
        </div>

        {/* Mensagem e estágio */}
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-gray-900">{message}</p>
          {showProgress && (
            <p className="text-sm text-gray-600">{loadingStage}</p>
          )}
          {appName && (
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              {appName} App
            </p>
          )}
        </div>

        {/* Barra de progresso */}
        {showProgress && (
          <div className="w-64 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                appName === 'walker' ? 'bg-blue-600' :
                appName === 'client' ? 'bg-green-600' :
                appName === 'auth' ? 'bg-indigo-600' :
                appName === 'public' ? 'bg-purple-600' :
                'bg-gray-600'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

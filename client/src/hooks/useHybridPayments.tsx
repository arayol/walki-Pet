import { useMemo } from 'react';
import { HybridPaymentsManager, defaultConfig, loadConfig } from '@/modules/hybrid-payments';

export function useHybridPayments() {
  const hybridPayments = useMemo(() => {
    const config = loadConfig() || defaultConfig;
    return new HybridPaymentsManager(config);
  }, []);

  return hybridPayments;
}
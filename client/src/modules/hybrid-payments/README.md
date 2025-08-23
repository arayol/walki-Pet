# Hybrid Payments Module

## Overview
Módulo híbrido de pagamentos que suporta assinaturas, marketplace e pagamentos diretos. Desenvolvido para ser reutilizável em diferentes plataformas.

## Estrutura
```
src/modules/hybrid-payments/
├── config.ts              # Configuração do módulo
├── types.ts               # Tipos e interfaces
├── utils.ts               # Utilitários
├── index.ts               # Exports principais
├── core/                  # Managers principais (TODO)
├── providers/             # Implementações de provedores (TODO)
├── services/              # Camada de serviços (TODO)
└── README.md             # Esta documentação
```

## Recursos Implementados

### ✅ Base Architecture
- [x] Configuração modular (`config.ts`)
- [x] Tipos TypeScript completos (`types.ts`)  
- [x] Utilitários de formatação e validação (`utils.ts`)
- [x] Sistema de exports organizado

### 🚧 Em Desenvolvimento
- [ ] Core Managers (payment, subscription, marketplace)
- [ ] Stripe Provider Implementation
- [ ] Service Layer
- [ ] Edge Functions
- [ ] Database Schema Migration

## Configuração

```typescript
import { loadConfig } from './modules/hybrid-payments';

const config = loadConfig();
// Configuração automática baseada no ambiente
```

## Tipos Principais

- `BasePayment` - Pagamento base
- `BaseSubscription` - Assinatura base
- `MarketplaceTransaction` - Transação de marketplace
- `HybridPaymentsConfig` - Configuração do módulo

## Utilitários

```typescript
import { 
  formatCurrency, 
  getPaymentStatusText, 
  validateEmail 
} from './modules/hybrid-payments';

// Formatação de moeda brasileira
const formatted = formatCurrency(1500); // "R$ 15,00"

// Status em português
const status = getPaymentStatusText('paid'); // "Pago"

// Validação de email
const isValid = validateEmail('user@example.com'); // true
```

## Próximos Passos

1. **Core Managers** - Implementar gerenciadores principais
2. **Stripe Provider** - Implementar integração com Stripe
3. **Edge Functions** - Criar funções serverless
4. **Database Migration** - Migrar esquema do banco
5. **Integration Layer** - Conectar com sistema atual

## Compatibilidade

- ✅ Sistema atual de dog walking mantido intacto
- ✅ Migração gradual sem breaking changes
- ✅ Reutilizável para outras plataformas
- ✅ TypeScript com tipagem forte
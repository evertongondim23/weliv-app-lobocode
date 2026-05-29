import type { DefaultRiskLevel, RecoveryStage } from '../../../services/defaultRisk.service';

export const riskConfig: Record<
  DefaultRiskLevel,
  { label: string; color: string; bg: string; border: string }
> = {
  baixo: {
    label: 'Risco baixo',
    color: '#475569',
    bg: 'rgba(71, 85, 105, 0.1)',
    border: 'rgba(71, 85, 105, 0.35)',
  },
  moderado: {
    label: 'Moderado',
    color: '#a16207',
    bg: 'rgba(161, 98, 7, 0.1)',
    border: 'rgba(161, 98, 7, 0.35)',
  },
  alto: {
    label: 'Alto',
    color: '#c2410c',
    bg: 'rgba(194, 65, 12, 0.12)',
    border: 'rgba(194, 65, 12, 0.4)',
  },
  critico: {
    label: 'Crítico',
    color: '#b91c1c',
    bg: 'rgba(185, 28, 28, 0.12)',
    border: 'rgba(185, 28, 28, 0.4)',
  },
};

export const stageLabels: Record<RecoveryStage, string> = {
  cobranca_ativa: 'Cobrança ativa',
  negociacao: 'Negociação',
  juridico: 'Jurídico',
  suspenso: 'Suspenso / pausa',
};

export const riskSort: Record<DefaultRiskLevel, number> = {
  critico: 0,
  alto: 1,
  moderado: 2,
  baixo: 3,
};

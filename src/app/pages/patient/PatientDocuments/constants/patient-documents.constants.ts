import { FileBadge, Files, FlaskConical, Pill } from 'lucide-react';
import type { Document } from '../../../../types';
import type { DocumentSectionConfig, PeriodPreset } from '../types/patient-documents.types';

export const TYPE_LABELS: Record<Document['type'], string> = {
  exam: 'Exame',
  prescription: 'Receita',
  report: 'Laudo',
  other: 'Outro',
};

export const FIELD_BORDER_STYLE = { borderColor: 'rgba(255, 165, 0, 0.2)' } as const;
export const HEADER_BORDER_STYLE = { borderColor: 'rgba(255, 165, 0, 0.2)' } as const;
export const PRIMARY_ACTION_STYLE = {
  background: 'linear-gradient(135deg, #FFA500, #FF8C00)',
} as const;
export const TITLE_COLOR = '#4A3728';
export const MUTED_COLOR = '#6B5D53';
export const OUTLINE_BUTTON_STYLE = {
  borderColor: 'rgba(255, 165, 0, 0.35)',
  color: '#4A3728',
} as const;

export const PERIOD_OPTIONS: { value: PeriodPreset; label: string }[] = [
  { value: 'all', label: 'Qualquer data' },
  { value: '7', label: 'Últimos 7 dias' },
  { value: '30', label: 'Últimos 30 dias' },
  { value: '90', label: 'Últimos 90 dias' },
  { value: '365', label: 'Último ano' },
];

export const UPLOAD_TYPE_OPTIONS: { value: Document['type']; label: string }[] = [
  { value: 'exam', label: 'Exame' },
  { value: 'prescription', label: 'Receita Médica' },
  { value: 'report', label: 'Laudo' },
  { value: 'other', label: 'Outro' },
];

export const DOCUMENT_SECTIONS: DocumentSectionConfig[] = [
  {
    key: 'prescription',
    id: 'docs-receitas',
    title: 'Receitas',
    description: 'Medicamentos e orientações prescritas pelo profissional.',
    icon: Pill,
    accent: '#059669',
    chipBg: '#ECFDF5',
  },
  {
    key: 'exam',
    id: 'docs-exames',
    title: 'Exames',
    description: 'Resultados de exames laboratoriais e de imagem.',
    icon: FlaskConical,
    accent: '#2563EB',
    chipBg: '#EFF6FF',
  },
  {
    key: 'report',
    id: 'docs-laudos',
    title: 'Laudos',
    description: 'Pareceres médicos, laudos e relatórios estruturados.',
    icon: FileBadge,
    accent: '#7C3AED',
    chipBg: '#F5F3FF',
  },
  {
    key: 'other',
    id: 'docs-outros',
    title: 'Outros',
    description: 'Documentos complementares (atestados, comprovantes etc.).',
    icon: Files,
    accent: '#78716C',
    chipBg: '#F5F5F4',
  },
];

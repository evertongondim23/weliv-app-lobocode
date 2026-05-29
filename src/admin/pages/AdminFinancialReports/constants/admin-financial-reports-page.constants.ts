import { reportCategoryLabels } from '../../../services/financialReports.service';
import type { ReportCategory } from '../../../services/financialReports.service';

export const categoryStyle: Record<
  ReportCategory,
  { color: string; bg: string; border: string }
> = {
  consultas: { color: '#047857', bg: 'rgba(4, 120, 87, 0.1)', border: 'rgba(4, 120, 87, 0.35)' },
  exames: { color: '#1d4ed8', bg: 'rgba(29, 78, 216, 0.08)', border: 'rgba(29, 78, 216, 0.35)' },
  taxas: { color: '#a16207', bg: 'rgba(161, 98, 7, 0.1)', border: 'rgba(161, 98, 7, 0.35)' },
  estornos: { color: '#b91c1c', bg: 'rgba(185, 28, 28, 0.1)', border: 'rgba(185, 28, 28, 0.35)' },
  repasses: { color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.1)', border: 'rgba(124, 58, 237, 0.35)' },
};

export const REPORT_CATEGORY_FILTER_OPTIONS = [
  { label: 'Todas as categorias', value: 'all' },
  { label: reportCategoryLabels.consultas, value: 'consultas' },
  { label: reportCategoryLabels.exames, value: 'exames' },
  { label: reportCategoryLabels.taxas, value: 'taxas' },
  { label: reportCategoryLabels.estornos, value: 'estornos' },
  { label: reportCategoryLabels.repasses, value: 'repasses' },
] as const;

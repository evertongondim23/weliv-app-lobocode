import type { Document } from '../../../../types';
import { TYPE_LABELS } from '../constants/patient-documents.constants';
import type { GroupedDocuments, PeriodPreset } from '../types/patient-documents.types';

export function getMyDocuments(
  documents: Document[],
  patientId: string | undefined,
): Document[] {
  return documents.filter((doc) => doc.patientId === patientId);
}

export function getPeriodStartDate(periodPreset: PeriodPreset): Date | null {
  if (periodPreset === 'all') return null;
  const days = Number(periodPreset);
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function filterDocuments(
  list: Document[],
  periodStartDate: Date | null,
  searchQuery: string,
  typeLabels: Record<Document['type'], string> = TYPE_LABELS,
): Document[] {
  let filtered = list;
  if (periodStartDate) {
    filtered = filtered.filter((doc) => new Date(doc.uploadedAt) >= periodStartDate);
  }
  const q = searchQuery.trim().toLowerCase();
  if (q.length > 0) {
    filtered = filtered.filter((doc) => {
      const typeLabel = typeLabels[doc.type].toLowerCase();
      return (
        doc.name.toLowerCase().includes(q) ||
        doc.id.toLowerCase().includes(q) ||
        typeLabel.includes(q)
      );
    });
  }
  return filtered;
}

export function groupDocumentsByType(filtered: Document[]): GroupedDocuments {
  const byType = (type: Document['type']) =>
    filtered
      .filter((d) => d.type === type)
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

  return {
    prescription: byType('prescription'),
    exam: byType('exam'),
    report: byType('report'),
    other: byType('other'),
  };
}

export function hasActiveFilters(searchQuery: string, periodPreset: PeriodPreset): boolean {
  return searchQuery.trim().length > 0 || periodPreset !== 'all';
}

export function scrollToSection(elementId: string) {
  document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

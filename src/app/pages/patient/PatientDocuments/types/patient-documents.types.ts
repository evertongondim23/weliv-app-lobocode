import type { ChangeEvent, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { Document } from '../../../../types';

export type PeriodPreset = 'all' | '7' | '30' | '90' | '365';

export type UploadDocumentType = Document['type'];

export type DocumentSectionConfig = {
  key: Document['type'];
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  chipBg: string;
};

export type GroupedDocuments = Record<Document['type'], Document[]>;

export type UploadDocumentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
  uploadType: UploadDocumentType;
  uploadName: string;
  selectedFile: File | null;
  onUploadTypeChange: (value: UploadDocumentType) => void;
  onUploadNameChange: (value: string) => void;
  onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
};

export type DocumentsEmptyStateProps = {
  onUpload: () => void;
};

export type DocumentsNoResultsStateProps = {
  totalCount: number;
  onClearFilters: () => void;
};

export type DocumentsFiltersSectionProps = {
  searchQuery: string;
  periodPreset: PeriodPreset;
  hasActiveFilters: boolean;
  filteredCount: number;
  onSearchChange: (value: string) => void;
  onPeriodChange: (value: PeriodPreset) => void;
  onClearFilters: () => void;
};

export type DocumentsSummarySectionProps = {
  documentSections: DocumentSectionConfig[];
  groupedDocuments: GroupedDocuments;
  onScrollToSection: (elementId: string) => void;
};

export type DocumentCategorySectionProps = {
  section: DocumentSectionConfig;
  documents: Document[];
  typeLabels: Record<Document['type'], string>;
  hasActiveFilters: boolean;
  onOpenUpload: () => void;
};

export type DocumentsCategoriesSectionProps = {
  documentSections: DocumentSectionConfig[];
  groupedDocuments: GroupedDocuments;
  typeLabels: Record<Document['type'], string>;
  hasActiveFilters: boolean;
  onOpenUpload: () => void;
};

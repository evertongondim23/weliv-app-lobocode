import { useMemo, useState, type ChangeEvent } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../../contexts/AuthContext';
import { useData } from '../../../../contexts/DataContext';
import { DOCUMENT_SECTIONS, TYPE_LABELS } from '../constants/patient-documents.constants';
import type { PeriodPreset, UploadDocumentType } from '../types/patient-documents.types';
import {
  filterDocuments,
  getMyDocuments,
  getPeriodStartDate,
  groupDocumentsByType,
  hasActiveFilters as checkActiveFilters,
  scrollToSection,
} from '../utils/patient-documents.utils';

export function usePatientDocuments() {
  const { user } = useAuth();
  const { documents, uploadDocument } = useData();

  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadType, setUploadType] = useState<UploadDocumentType>('exam');
  const [uploadName, setUploadName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [periodPreset, setPeriodPreset] = useState<PeriodPreset>('all');

  const myDocuments = useMemo(
    () => getMyDocuments(documents, user?.id),
    [documents, user?.id],
  );

  const periodStartDate = useMemo(
    () => getPeriodStartDate(periodPreset),
    [periodPreset],
  );

  const filteredMyDocuments = useMemo(
    () => filterDocuments(myDocuments, periodStartDate, searchQuery, TYPE_LABELS),
    [myDocuments, periodStartDate, searchQuery],
  );

  const groupedDocuments = useMemo(
    () => groupDocumentsByType(filteredMyDocuments),
    [filteredMyDocuments],
  );

  const activeFilters = checkActiveFilters(searchQuery, periodPreset);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadName(file.name);
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !uploadName || !user) return;

    uploadDocument({
      patientId: user.id,
      type: uploadType,
      name: uploadName,
      url: URL.createObjectURL(selectedFile),
      status: 'ready',
    });

    toast.success('Documento enviado com sucesso!');
    setShowUploadDialog(false);
    setSelectedFile(null);
    setUploadName('');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPeriodPreset('all');
  };

  const openUploadDialog = () => setShowUploadDialog(true);

  return {
    upload: {
      open: showUploadDialog,
      onOpenChange: setShowUploadDialog,
      uploadType,
      uploadName,
      selectedFile,
      onUploadTypeChange: setUploadType,
      onUploadNameChange: setUploadName,
      onFileSelect: handleFileSelect,
      onUpload: handleUpload,
    },
    isEmpty: myDocuments.length === 0,
    hasNoFilterResults: myDocuments.length > 0 && filteredMyDocuments.length === 0,
    emptyState: { onUpload: openUploadDialog },
    noResults: {
      totalCount: myDocuments.length,
      onClearFilters: clearFilters,
    },
    filters: {
      searchQuery,
      periodPreset,
      hasActiveFilters: activeFilters,
      filteredCount: filteredMyDocuments.length,
      onSearchChange: setSearchQuery,
      onPeriodChange: setPeriodPreset,
      onClearFilters: clearFilters,
    },
    summary: {
      documentSections: DOCUMENT_SECTIONS,
      groupedDocuments,
      onScrollToSection: scrollToSection,
    },
    categories: {
      documentSections: DOCUMENT_SECTIONS,
      groupedDocuments,
      typeLabels: TYPE_LABELS,
      hasActiveFilters: activeFilters,
      onOpenUpload: openUploadDialog,
    },
  };
}

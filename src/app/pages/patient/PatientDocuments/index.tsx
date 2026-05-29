import { DocumentsEmptyState } from './components/documents-empty-state';
import { DocumentsNoResultsState } from './components/documents-no-results-state';
import { usePatientDocuments } from './hooks/use-patient-documents';
import { DocumentsCategoriesSection } from './sections/documents-categories-section';
import { DocumentsFiltersSection } from './sections/documents-filters-section';
import { DocumentsHeaderSection } from './sections/documents-header-section';
import { DocumentsSummarySection } from './sections/documents-summary-section';

export function PatientDocuments() {
  const {
    upload,
    isEmpty,
    hasNoFilterResults,
    emptyState,
    noResults,
    filters,
    summary,
    categories,
  } = usePatientDocuments();

  return (
    <div className="space-y-6 pb-6">
      <DocumentsHeaderSection {...upload} />

      {isEmpty ? (
        <DocumentsEmptyState {...emptyState} />
      ) : hasNoFilterResults ? (
        <DocumentsNoResultsState {...noResults} />
      ) : (
        <>
          <DocumentsFiltersSection {...filters} />
          <DocumentsSummarySection {...summary} />
          <DocumentsCategoriesSection {...categories} />
        </>
      )}
    </div>
  );
}

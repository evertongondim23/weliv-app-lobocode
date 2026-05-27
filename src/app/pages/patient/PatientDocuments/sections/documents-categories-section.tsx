import { DocumentCategorySection } from '../components/document-category-section';
import type { DocumentsCategoriesSectionProps } from '../types/patient-documents.types';

export function DocumentsCategoriesSection({
  documentSections,
  groupedDocuments,
  typeLabels,
  hasActiveFilters,
  onOpenUpload,
}: DocumentsCategoriesSectionProps) {
  return (
    <div className="space-y-8">
      {documentSections.map((section) => (
        <DocumentCategorySection
          key={section.key}
          section={section}
          documents={groupedDocuments[section.key]}
          typeLabels={typeLabels}
          hasActiveFilters={hasActiveFilters}
          onOpenUpload={onOpenUpload}
        />
      ))}
    </div>
  );
}

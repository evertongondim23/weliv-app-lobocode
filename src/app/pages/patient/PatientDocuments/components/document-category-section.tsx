import { Upload } from 'lucide-react';
import { DocumentCard } from '../../../../components/common';
import { Button } from '../../../../components/ui/button';
import { HEADER_BORDER_STYLE, OUTLINE_BUTTON_STYLE, TITLE_COLOR, MUTED_COLOR } from '../constants/patient-documents.constants';
import type { DocumentCategorySectionProps } from '../types/patient-documents.types';

export function DocumentCategorySection({
  section,
  documents,
  typeLabels,
  hasActiveFilters,
  onOpenUpload,
}: DocumentCategorySectionProps) {
  const Icon = section.icon;

  return (
    <section
      id={section.id}
      className="scroll-mt-24 rounded-2xl border bg-white overflow-hidden shadow-sm"
      style={HEADER_BORDER_STYLE}
      aria-labelledby={`${section.id}-title`}
    >
      <div
        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 px-4 py-4 md:px-6 border-b"
        style={{
          borderColor: 'rgba(255, 165, 0, 0.12)',
          borderLeftWidth: 4,
          borderLeftColor: section.accent,
        }}
      >
        <div className="flex gap-3">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-xl"
            style={{ background: `${section.accent}18` }}
          >
            <Icon className="size-5" style={{ color: section.accent }} aria-hidden />
          </div>
          <div>
            <h2
              id={`${section.id}-title`}
              className="text-lg md:text-xl font-bold"
              style={{ color: TITLE_COLOR }}
            >
              {section.title}
            </h2>
            <p className="text-sm mt-0.5 max-w-2xl" style={{ color: MUTED_COLOR }}>
              {section.description}
            </p>
          </div>
        </div>
        <span
          className="text-sm font-semibold tabular-nums px-3 py-1 rounded-full self-start"
          style={{ background: section.chipBg, color: section.accent }}
        >
          {documents.length} {documents.length === 1 ? 'arquivo' : 'arquivos'}
        </span>
      </div>

      <div className="p-4 md:p-6">
        {documents.length === 0 ? (
          <div
            className="rounded-xl border border-dashed py-10 px-4 text-center"
            style={{
              borderColor: 'rgba(255, 165, 0, 0.25)',
              background: '#FAFAFA',
            }}
          >
            <p className="text-sm font-medium" style={{ color: TITLE_COLOR }}>
              {hasActiveFilters
                ? 'Nenhum resultado nesta categoria'
                : 'Nenhum documento nesta categoria'}
            </p>
            <p className="text-xs mt-1 max-w-md mx-auto" style={{ color: MUTED_COLOR }}>
              {hasActiveFilters
                ? 'Tente outra busca, ampliar o período ou limpar os filtros.'
                : 'Ao enviar um arquivo, escolha o tipo correspondente no formulário para ele aparecer aqui.'}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4 border-2"
              style={OUTLINE_BUTTON_STYLE}
              onClick={onOpenUpload}
            >
              <Upload className="size-4 mr-2" />
              Enviar em {section.title.toLowerCase()}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                title={doc.name}
                type={typeLabels[doc.type]}
                uploadDate={doc.uploadedAt}
                onView={() => {}}
                onDownload={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

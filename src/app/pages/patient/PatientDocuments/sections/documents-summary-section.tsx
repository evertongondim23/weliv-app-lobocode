import { HEADER_BORDER_STYLE, MUTED_COLOR, TITLE_COLOR } from '../constants/patient-documents.constants';
import type { DocumentsSummarySectionProps } from '../types/patient-documents.types';

export function DocumentsSummarySection({
  documentSections,
  groupedDocuments,
  onScrollToSection,
}: DocumentsSummarySectionProps) {
  return (
    <nav
      aria-label="Sumário das categorias de documentos"
      className="rounded-2xl border bg-white sticky top-2 z-10 shadow-sm overflow-hidden"
      style={HEADER_BORDER_STYLE}
    >
      <div
        className="flex flex-col gap-2 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-5 border-b"
        style={{ borderColor: 'rgba(255, 165, 0, 0.12)', background: '#FFFCF5' }}
      >
        <div>
          <h3 className="text-sm font-semibold" style={{ color: TITLE_COLOR }}>
            Sumário
          </h3>
          <p className="text-xs mt-0.5 leading-relaxed max-w-xl" style={{ color: MUTED_COLOR }}>
            Toque em uma categoria para ir à seção na página.
          </p>
        </div>
        <p
          className="text-[11px] font-medium shrink-0 md:hidden"
          style={{ color: '#9CA3AF' }}
          aria-hidden="true"
        >
          Deslize para ver todas →
        </p>
      </div>

      <div className="px-3 py-3 md:px-4 md:py-4">
        <div
          className="flex gap-3 overflow-x-auto overscroll-x-contain snap-x snap-mandatory scroll-pl-3 scroll-pr-3 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:scroll-pl-4 sm:scroll-pr-4 [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-4 lg:gap-3 lg:overflow-visible lg:pb-0 lg:snap-none"
          role="list"
        >
          {documentSections.map((section) => {
            const count = groupedDocuments[section.key].length;
            const Icon = section.icon;
            return (
              <button
                key={section.key}
                type="button"
                role="listitem"
                onClick={() => onScrollToSection(section.id)}
                title={`Ir para ${section.title} (${count} ${count === 1 ? 'arquivo' : 'arquivos'})`}
                className="snap-start shrink-0 flex w-[min(44vw,168px)] flex-col gap-2 rounded-xl border-2 bg-white p-3 text-left shadow-sm transition-all hover:shadow-md hover:border-[#FFA500]/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFA500]/45 focus-visible:ring-offset-2 lg:w-auto lg:min-w-0 lg:hover:-translate-y-0.5"
                style={{
                  borderColor: 'rgba(255, 165, 0, 0.22)',
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: `${section.accent}15`,
                    }}
                    aria-hidden
                  >
                    <Icon className="size-[18px]" style={{ color: section.accent }} />
                  </span>
                  <span
                    className="text-sm font-semibold leading-tight line-clamp-2"
                    style={{ color: TITLE_COLOR }}
                  >
                    {section.title}
                  </span>
                </div>
                <div className="mt-auto flex items-baseline justify-between gap-2 pt-0.5">
                  <span
                    className="text-2xl font-bold tabular-nums leading-none"
                    style={{ color: count > 0 ? section.accent : '#D1D5DB' }}
                  >
                    {count}
                  </span>
                  <span
                    className="text-[10px] font-medium uppercase tracking-wide"
                    style={{ color: '#9CA3AF' }}
                  >
                    {count === 1 ? 'arq.' : 'arqs.'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

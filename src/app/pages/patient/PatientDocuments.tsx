import React, { useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Upload, FolderOpen, Pill, FlaskConical, FileBadge, Files, Search, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { DocumentCard } from '../../components/common';
import { EmptyState } from '../../components/EmptyState';
import type { Document } from '../../types';

export function PatientDocuments() {
  const { user } = useAuth();
  const { documents, uploadDocument } = useData();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadType, setUploadType] = useState<'exam' | 'prescription' | 'report' | 'other'>('exam');
  const [uploadName, setUploadName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [periodPreset, setPeriodPreset] = useState<'all' | '7' | '30' | '90' | '365'>('all');

  const myDocuments = useMemo(
    () => documents.filter((doc) => doc.patientId === user?.id),
    [documents, user?.id],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadName(file.name);
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !uploadName || !user) return;

    // Simulate file upload
    uploadDocument({
      patientId: user.id,
      type: uploadType,
      name: uploadName,
      url: URL.createObjectURL(selectedFile), // In production, this would be a real URL
      status: 'ready',
    });

    toast.success('Documento enviado com sucesso!');
    setShowUploadDialog(false);
    setSelectedFile(null);
    setUploadName('');
  };

  const typeLabels: Record<Document['type'], string> = {
    exam: 'Exame',
    prescription: 'Receita',
    report: 'Laudo',
    other: 'Outro',
  };

  const periodStartDate = useMemo((): Date | null => {
    if (periodPreset === 'all') return null;
    const days = Number(periodPreset);
    const d = new Date();
    d.setDate(d.getDate() - days);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [periodPreset]);

  const filteredMyDocuments = useMemo(() => {
    let list = myDocuments;
    if (periodStartDate) {
      list = list.filter((doc) => new Date(doc.uploadedAt) >= periodStartDate);
    }
    const q = searchQuery.trim().toLowerCase();
    if (q.length > 0) {
      list = list.filter((doc) => {
        const typeLabel = typeLabels[doc.type].toLowerCase();
        return (
          doc.name.toLowerCase().includes(q) ||
          doc.id.toLowerCase().includes(q) ||
          typeLabel.includes(q)
        );
      });
    }
    return list;
  }, [myDocuments, periodPreset, periodStartDate, searchQuery]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 || periodPreset !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setPeriodPreset('all');
  };

  type DocCategory = Document['type'];

  const documentSections: Array<{
    key: DocCategory;
    id: string;
    title: string;
    description: string;
    icon: typeof Pill;
    accent: string;
    chipBg: string;
  }> = [
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

  const groupedDocuments = useMemo(() => {
    const byType = (type: DocCategory) =>
      filteredMyDocuments
        .filter((d) => d.type === type)
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    return {
      prescription: byType('prescription'),
      exam: byType('exam'),
      report: byType('report'),
      other: byType('other'),
    };
  }, [filteredMyDocuments]);

  const scrollToSection = (elementId: string) => {
    document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div 
        className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between" 
        style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
      >
        <div className="flex items-center gap-3">
          <FolderOpen className="size-8 text-[#FFA500]" strokeWidth={2.5} />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#4A3728' }}>
              Meus Documentos
            </h1>
            <p className="text-sm md:text-base" style={{ color: '#6B5D53' }}>
              Exames, laudos e receitas
            </p>
          </div>
        </div>

        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button 
              className="w-full sm:w-auto whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
            >
              <Upload className="size-4 mr-2" />
              <span className="hidden xs:inline">Enviar Documento</span>
              <span className="xs:hidden">Enviar</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle style={{ color: '#4A3728' }}>Enviar Documento</DialogTitle>
              <DialogDescription>
                Faça upload de exames, receitas ou outros documentos médicos
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="docType">Tipo de Documento</Label>
                <Select value={uploadType} onValueChange={(val: any) => setUploadType(val)}>
                  <SelectTrigger id="docType" className="border-2" 
                                 style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exam">Exame</SelectItem>
                    <SelectItem value="prescription">Receita Médica</SelectItem>
                    <SelectItem value="report">Laudo</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="docName">Nome do Documento</Label>
                <Input
                  id="docName"
                  placeholder="Ex: Hemograma Completo"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  className="border-2"
                  style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Arquivo</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="border-2"
                  style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
                />
                <p className="text-xs" style={{ color: '#6B5D53' }}>
                  Formatos aceitos: PDF, JPG, PNG (máx. 10MB)
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}
                      className="border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
                Cancelar
              </Button>
              <Button onClick={handleUpload} disabled={!selectedFile || !uploadName}
                      style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}>
                Enviar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {myDocuments.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Nenhum documento encontrado"
          description="Envie receitas, exames ou laudos e organize tudo por categoria nesta página."
          action={
            <Button
              type="button"
              style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
              onClick={() => setShowUploadDialog(true)}
            >
              <Upload className="size-4 mr-2" />
              Enviar primeiro documento
            </Button>
          }
        />
      ) : filteredMyDocuments.length === 0 ? (
        <div
          className="rounded-2xl border bg-white p-8 text-center shadow-sm"
          style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
        >
          <div
            className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full border"
            style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: '#FFF8E7' }}
          >
            <Search className="size-7 text-[#FFA500]" />
          </div>
          <p className="text-lg font-semibold" style={{ color: '#4A3728' }}>
            Nenhum documento encontrado
          </p>
          <p className="mt-2 text-sm max-w-md mx-auto" style={{ color: '#6B5D53' }}>
            Ajuste a busca ou o período — você tem {myDocuments.length}{' '}
            {myDocuments.length === 1 ? 'documento salvo' : 'documentos salvos'} no total.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-6 border-2"
            style={{ borderColor: 'rgba(255, 165, 0, 0.35)', color: '#4A3728' }}
            onClick={clearFilters}
          >
            <RotateCcw className="size-4 mr-2" />
            Limpar busca e período
          </Button>
        </div>
      ) : (
        <>
          <div
            className="rounded-2xl border bg-white p-4 md:p-5 shadow-sm space-y-3"
            style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="doc-search">Buscar documentos</Label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6B5D53]" />
                  <Input
                    id="doc-search"
                    type="search"
                    placeholder="Nome do arquivo, tipo ou ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-2 pl-9"
                    style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="w-full lg:w-[220px] space-y-2">
                <Label htmlFor="doc-period">Período</Label>
                <Select value={periodPreset} onValueChange={(v) => setPeriodPreset(v as typeof periodPreset)}>
                  <SelectTrigger
                    id="doc-period"
                    className="border-2 w-full"
                    style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
                  >
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Qualquer data</SelectItem>
                    <SelectItem value="7">Últimos 7 dias</SelectItem>
                    <SelectItem value="30">Últimos 30 dias</SelectItem>
                    <SelectItem value="90">Últimos 90 dias</SelectItem>
                    <SelectItem value="365">Último ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {hasActiveFilters ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full lg:w-auto shrink-0 text-[#6B5D53]"
                  onClick={clearFilters}
                >
                  <RotateCcw className="size-4 mr-2" />
                  Limpar filtros
                </Button>
              ) : null}
            </div>
            <p className="text-xs md:text-sm" style={{ color: '#6B5D53' }}>
              <span className="font-medium tabular-nums" style={{ color: '#4A3728' }}>
                {filteredMyDocuments.length}
              </span>{' '}
              {filteredMyDocuments.length === 1 ? 'documento corresponde' : 'documentos correspondem'}
              {hasActiveFilters ? ' aos filtros.' : '.'}
            </p>
          </div>

          <nav
            aria-label="Sumário das categorias de documentos"
            className="rounded-2xl border bg-white sticky top-2 z-10 shadow-sm overflow-hidden"
            style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
          >
            <div
              className="flex flex-col gap-2 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-5 border-b"
              style={{ borderColor: 'rgba(255, 165, 0, 0.12)', background: '#FFFCF5' }}
            >
              <div>
                <h3 className="text-sm font-semibold" style={{ color: '#4A3728' }}>
                  Sumário
                </h3>
                <p className="text-xs mt-0.5 leading-relaxed max-w-xl" style={{ color: '#6B5D53' }}>
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
                      onClick={() => scrollToSection(section.id)}
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
                          style={{ color: '#4A3728' }}
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
                        <span className="text-[10px] font-medium uppercase tracking-wide" style={{ color: '#9CA3AF' }}>
                          {count === 1 ? 'arq.' : 'arqs.'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          <div className="space-y-8">
            {documentSections.map((section) => {
              const list = groupedDocuments[section.key];
              const Icon = section.icon;
              return (
                <section
                  key={section.key}
                  id={section.id}
                  className="scroll-mt-24 rounded-2xl border bg-white overflow-hidden shadow-sm"
                  style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
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
                          style={{ color: '#4A3728' }}
                        >
                          {section.title}
                        </h2>
                        <p className="text-sm mt-0.5 max-w-2xl" style={{ color: '#6B5D53' }}>
                          {section.description}
                        </p>
                      </div>
                    </div>
                    <span
                      className="text-sm font-semibold tabular-nums px-3 py-1 rounded-full self-start"
                      style={{ background: section.chipBg, color: section.accent }}
                    >
                      {list.length} {list.length === 1 ? 'arquivo' : 'arquivos'}
                    </span>
                  </div>

                  <div className="p-4 md:p-6">
                    {list.length === 0 ? (
                      <div
                        className="rounded-xl border border-dashed py-10 px-4 text-center"
                        style={{
                          borderColor: 'rgba(255, 165, 0, 0.25)',
                          background: '#FAFAFA',
                        }}
                      >
                        <p className="text-sm font-medium" style={{ color: '#4A3728' }}>
                          {hasActiveFilters
                            ? 'Nenhum resultado nesta categoria'
                            : 'Nenhum documento nesta categoria'}
                        </p>
                        <p className="text-xs mt-1 max-w-md mx-auto" style={{ color: '#6B5D53' }}>
                          {hasActiveFilters
                            ? 'Tente outra busca, ampliar o período ou limpar os filtros.'
                            : 'Ao enviar um arquivo, escolha o tipo correspondente no formulário para ele aparecer aqui.'}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-4 border-2"
                          style={{ borderColor: 'rgba(255, 165, 0, 0.35)', color: '#4A3728' }}
                          onClick={() => setShowUploadDialog(true)}
                        >
                          <Upload className="size-4 mr-2" />
                          Enviar em {section.title.toLowerCase()}
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {list.map((doc) => (
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
            })}
          </div>
        </>
      )}
    </div>
  );
}
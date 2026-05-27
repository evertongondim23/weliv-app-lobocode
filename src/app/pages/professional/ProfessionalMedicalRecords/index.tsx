import { ClipboardList, Plus } from 'lucide-react';
import { WelcomeCard } from '../../../components/common';
import { EmptyState } from '../../../components/EmptyState';
import { Button } from '../../../components/ui/button';
import { DeleteRecordDialog } from './components/delete-record-dialog';
import { MedicalRecordFormDialog } from './components/medical-record-form-dialog';
import { PRIMARY_ACTION_STYLE, TEXT_MUTED_COLOR } from './constants/professional-medical-records.constants';
import { useProfessionalMedicalRecords } from './hooks/use-professional-medical-records';
import { PatientRecordSection } from './sections/patient-record-section';
import { RecordsListSection } from './sections/records-list-section';
import { SearchToolbarSection } from './sections/search-toolbar-section';

export function ProfessionalMedicalRecords() {
  const { professionalId, searchToolbar, workspace, detail, formDialog, deleteDialog } =
    useProfessionalMedicalRecords();

  if (!professionalId) {
    return (
      <div className="text-sm" style={{ color: TEXT_MUTED_COLOR }}>
        Faça login como profissional para gerenciar prontuários.
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <WelcomeCard
        icon={ClipboardList}
        title="Prontuários médicos"
        subtitle="Crie, edite e organize prontuários (demo em memória — recarregar a página restaura os dados iniciais)."
      />

      <SearchToolbarSection {...searchToolbar} />

      {workspace.isEmpty ? (
        <div className="space-y-4">
          <EmptyState
            icon={ClipboardList}
            title={workspace.hasSearch ? 'Nenhum prontuário encontrado' : 'Sem prontuários para exibir'}
            description={
              workspace.hasSearch
                ? 'Ajuste a busca ou limpe o campo.'
                : 'Crie o primeiro prontuário ou aguarde novos cadastros.'
            }
          />
          {!workspace.hasSearch ? (
            <div className="flex justify-center">
              <Button
                type="button"
                className="text-white border-0"
                style={PRIMARY_ACTION_STYLE}
                onClick={workspace.onCreate}
              >
                <Plus className="size-4 mr-2" />
                Criar prontuário
              </Button>
            </div>
          ) : null}
        </div>
      ) : (
        <div
          className={`grid gap-4 ${workspace.selected ? 'xl:grid-cols-[1fr_minmax(300px,400px)]' : 'grid-cols-1'}`}
        >
          <RecordsListSection
            records={workspace.records}
            selectedId={workspace.selected?.id ?? null}
            onSelect={workspace.onSelect}
          />
          {workspace.selected ? (
            <PatientRecordSection
              record={workspace.selected}
              onEdit={detail.onEdit}
              onDelete={detail.onDelete}
              onClose={detail.onClose}
              onPdfUpload={detail.onPdfUpload}
              onPdfRemove={detail.onPdfRemove}
            />
          ) : null}
        </div>
      )}

      <MedicalRecordFormDialog {...formDialog} />
      <DeleteRecordDialog {...deleteDialog} />
    </div>
  );
}

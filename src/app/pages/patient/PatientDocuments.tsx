import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Upload, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';
import { WelcomeCard, DocumentCard } from '../../components/common';
import { EmptyState } from '../../components/EmptyState';

export function PatientDocuments() {
  const { user } = useAuth();
  const { documents, uploadDocument } = useData();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadType, setUploadType] = useState<'exam' | 'prescription' | 'report' | 'other'>('exam');
  const [uploadName, setUploadName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const myDocuments = documents.filter(doc => doc.patientId === user?.id);

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

  const typeLabels: Record<string, string> = {
    exam: 'Exame',
    prescription: 'Receita',
    report: 'Laudo',
    other: 'Outro',
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
          description="Envie seus exames e documentos médicos"
          actionLabel="Enviar primeiro documento"
          onAction={() => setShowUploadDialog(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myDocuments.map(doc => (
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
  );
}
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Users, Plus, Search, Phone, Mail, FileText, Calendar, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Patient } from '../../types';
import { WelcomeCard } from '../../components/common';
import { EmptyState } from '../../components/EmptyState';

interface PatientForm {
  name: string;
  phone: string;
  cpf: string;
  email: string;
}

export function ProfessionalPatients() {
  const { user } = useAuth();
  const { appointments } = useData();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
  // Mock patients data - Em produção viria do DataContext
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 'p1',
      name: 'Maria Silva',
      email: 'maria.silva@email.com',
      phone: '(11) 98765-4321',
      cpf: '123.456.789-00',
      role: 'patient',
      appointments: ['apt1', 'apt2'],
      documents: ['doc1'],
    },
    {
      id: 'p2',
      name: 'João Santos',
      email: 'joao.santos@email.com',
      phone: '(11) 91234-5678',
      cpf: '987.654.321-00',
      role: 'patient',
      appointments: ['apt3'],
      documents: [],
    },
  ]);

  const [formData, setFormData] = useState<PatientForm>({
    name: '',
    phone: '',
    cpf: '',
    email: '',
  });

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.cpf.includes(searchTerm)
  );

  const handleAddPatient = () => {
    if (!formData.name || !formData.phone || !formData.cpf || !formData.email) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const newPatient: Patient = {
      id: `p${Date.now()}`,
      ...formData,
      role: 'patient',
      appointments: [],
      documents: [],
    };

    setPatients([...patients, newPatient]);
    setShowAddDialog(false);
    setFormData({ name: '', phone: '', cpf: '', email: '' });
    toast.success('Paciente cadastrado com sucesso!');
  };

  const handleEditPatient = () => {
    if (!selectedPatient || !formData.name || !formData.phone || !formData.cpf || !formData.email) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setPatients(patients.map(p => 
      p.id === selectedPatient.id 
        ? { ...p, ...formData }
        : p
    ));
    
    setShowEditDialog(false);
    setSelectedPatient(null);
    setFormData({ name: '', phone: '', cpf: '', email: '' });
    toast.success('Paciente atualizado com sucesso!');
  };

  const handleDeletePatient = (patientId: string) => {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
      setPatients(patients.filter(p => p.id !== patientId));
      toast.success('Paciente excluído com sucesso');
    }
  };

  const openEditDialog = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormData({
      name: patient.name,
      phone: patient.phone,
      cpf: patient.cpf,
      email: patient.email,
    });
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', cpf: '', email: '' });
    setSelectedPatient(null);
  };

  const getPatientStats = (patient: Patient) => {
    const patientAppointments = appointments.filter(apt => apt.patientId === patient.id);
    return {
      total: patientAppointments.length,
      upcoming: patientAppointments.filter(apt => apt.status === 'scheduled' || apt.status === 'confirmed').length,
    };
  };

  const PatientForm = ({ onSubmit, onCancel }: { onSubmit: () => void; onCancel: () => void }) => (
    <>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo *</Label>
          <Input
            id="name"
            placeholder="Digite o nome completo"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border-2"
            style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone *</Label>
          <Input
            id="phone"
            placeholder="(00) 00000-0000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="border-2"
            style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">CPF *</Label>
          <Input
            id="cpf"
            placeholder="000.000.000-00"
            value={formData.cpf}
            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
            className="border-2"
            style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            type="email"
            placeholder="exemplo@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="border-2"
            style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
          />
        </div>
      </div>

      <DialogFooter>
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="border-2"
          style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={onSubmit}
          style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
        >
          Salvar
        </Button>
      </DialogFooter>
    </>
  );

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <WelcomeCard
        icon={Users}
        title="Gerenciar Pacientes"
        subtitle="Cadastre e gerencie seus pacientes"
      />

      {/* Search and Add */}
      <Card className="border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, e-mail ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2"
                style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
              />
            </div>

            <Dialog open={showAddDialog} onOpenChange={(open) => {
              setShowAddDialog(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button
                  className="w-full sm:w-auto"
                  style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
                >
                  <Plus className="size-4 mr-2" />
                  Novo Paciente
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle style={{ color: '#4A3728' }}>Cadastrar Paciente</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do novo paciente
                  </DialogDescription>
                </DialogHeader>
                <PatientForm 
                  onSubmit={handleAddPatient}
                  onCancel={() => {
                    setShowAddDialog(false);
                    resetForm();
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Patients List */}
      {filteredPatients.length === 0 ? (
        <EmptyState
          icon={Users}
          title={searchTerm ? "Nenhum paciente encontrado" : "Nenhum paciente cadastrado"}
          description={searchTerm ? "Tente ajustar sua busca" : "Cadastre seu primeiro paciente para começar"}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredPatients.map(patient => {
            const stats = getPatientStats(patient);
            
            return (
              <Card 
                key={patient.id} 
                className="border-2 hover:shadow-md transition-shadow"
                style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="border-2" style={{ borderColor: '#FFA500' }}>
                        <AvatarImage src={patient.avatar} alt={patient.name} />
                        <AvatarFallback style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)', color: 'white' }}>
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg" style={{ color: '#4A3728' }}>
                          {patient.name}
                        </CardTitle>
                        <CardDescription>
                          CPF: {patient.cpf}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(patient)}
                        className="size-8"
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePatient(patient.id)}
                        className="size-8 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2" style={{ color: '#6B5D53' }}>
                      <Phone className="size-4" />
                      <span>{patient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2" style={{ color: '#6B5D53' }}>
                      <Mail className="size-4" />
                      <span>{patient.email}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t" style={{ borderColor: 'rgba(255, 165, 0, 0.1)' }}>
                    <Badge variant="outline" className="gap-1">
                      <Calendar className="size-3" />
                      {stats.upcoming} próxima{stats.upcoming !== 1 ? 's' : ''}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <FileText className="size-3" />
                      {patient.documents.length} doc{patient.documents.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={(open) => {
        setShowEditDialog(open);
        if (!open) resetForm();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ color: '#4A3728' }}>Editar Paciente</DialogTitle>
            <DialogDescription>
              Atualize os dados do paciente
            </DialogDescription>
          </DialogHeader>
          <PatientForm 
            onSubmit={handleEditPatient}
            onCancel={() => {
              setShowEditDialog(false);
              resetForm();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

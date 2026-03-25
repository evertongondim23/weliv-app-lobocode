export type MedicationEntry = {
  name: string;
  dosage: string;
  since: string;
};

export type MedicalRecord = {
  id: string;
  professionalId: string;
  patientId: string;
  patientName: string;
  patientCpf: string;
  patientBirthDate: string;
  bloodType?: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: MedicationEntry[];
  lastConsultAt: string;
  chiefComplaint: string;
  clinicalSummary: string;
  updatedAt: string;
};

/** Payload para criar ou substituir um prontuário (sem id / professionalId / updatedAt). */
export type MedicalRecordWriteInput = {
  patientId: string;
  patientName: string;
  patientCpf: string;
  patientBirthDate: string;
  bloodType?: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: MedicationEntry[];
  lastConsultAt: string;
  chiefComplaint: string;
  clinicalSummary: string;
};

const medicalRecordsSeed: MedicalRecord[] = [
  {
    id: 'mr-001',
    professionalId: 'prof1',
    patientId: 'patient1',
    patientName: 'João Santos',
    patientCpf: '111.222.333-44',
    patientBirthDate: '1988-05-14',
    bloodType: 'O+',
    allergies: ['Dipirona'],
    chronicConditions: ['Hipertensão arterial sistêmica leve'],
    currentMedications: [
      { name: 'Losartana 50 mg', dosage: '1 comprimido à noite', since: '2025-08-01' },
      { name: 'Sinvastatina 20 mg', dosage: '1 comprimido à noite', since: '2025-11-10' },
    ],
    lastConsultAt: '2026-03-18T14:30:00Z',
    chiefComplaint: 'Dor precordial em aperto aos esforços',
    clinicalSummary:
      'Paciente relata episódios de dor retroesternal de início recente, ECG de triagem sem alterações agudas. Encaminhado para ecocardiograma e teste ergométrico; orientações sobre sinais de alarme.',
    updatedAt: '2026-03-18T15:00:00Z',
  },
  {
    id: 'mr-002',
    professionalId: 'prof1',
    patientId: 'pat-maria',
    patientName: 'Maria Silva',
    patientCpf: '123.456.789-00',
    patientBirthDate: '1992-11-03',
    bloodType: 'A+',
    allergies: [],
    chronicConditions: ['Rinite alérgica'],
    currentMedications: [
      { name: 'Loratadina 10 mg', dosage: '1 comprimido em dias sintomáticos', since: '2025-04-20' },
    ],
    lastConsultAt: '2026-02-10T09:15:00Z',
    chiefComplaint: 'Retorno: controle de pressão e exames de rotina',
    clinicalSummary:
      'PA 128x82 mmHg em consulta; sem queixas cardiológicas atuais. Mantém hábitos. Resultados de laboratório dentro do esperado para perfil; continuar monitorização anual.',
    updatedAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 'mr-003',
    professionalId: 'prof1',
    patientId: 'pat-carlos',
    patientName: 'Carlos Eduardo Lima',
    patientCpf: '987.654.321-00',
    patientBirthDate: '1976-02-28',
    bloodType: 'B+',
    allergies: ['Penicilina', 'Frutos do mar'],
    chronicConditions: ['Diabetes mellitus tipo 2', 'Dislipidemia'],
    currentMedications: [
      { name: 'Metformina 850 mg', dosage: '1 comprimido 12/12h', since: '2024-06-01' },
      { name: 'Atorvastatina 40 mg', dosage: '1 comprimido à noite', since: '2025-01-15' },
    ],
    lastConsultAt: '2026-03-02T11:45:00Z',
    chiefComplaint: 'Parestesias em membros inferiores e revisão de glicemia',
    clinicalSummary:
      'Glicemia de jejum 142 mg/dL na medição ambulatorial. Exame físico: sensibilidade preservada monofilamento; pulsos pediosos presentes. Ajuste nutricional reforçado; manter esquema atual e reavaliar exames em 90 dias.',
    updatedAt: '2026-03-02T12:30:00Z',
  },
  {
    id: 'mr-004',
    professionalId: 'prof1',
    patientId: 'pat-fernanda',
    patientName: 'Fernanda Oliveira',
    patientCpf: '456.789.123-99',
    patientBirthDate: '2001-07-22',
    bloodType: 'AB-',
    allergies: ['Látex'],
    chronicConditions: [],
    currentMedications: [],
    lastConsultAt: '2026-01-22T16:00:00Z',
    chiefComplaint: 'Consulta pré-operatória de cirurgia ortopédica eclusa',
    clinicalSummary:
      'Avaliação cardiológica para cirurgia eletiva: ecg e ecocardiograma normais para idade, sem fatores de risco cardiovascular adicionais. Parecer favorável com recomendações de jejum e hidratação conforme equipe cirúrgica.',
    updatedAt: '2026-01-22T16:40:00Z',
  },
];

function deepCloneRecords(source: MedicalRecord[]): MedicalRecord[] {
  return source.map((r) => ({
    ...r,
    allergies: [...r.allergies],
    chronicConditions: [...r.chronicConditions],
    currentMedications: r.currentMedications.map((m) => ({ ...m })),
  }));
}

let mutableRecords: MedicalRecord[] = deepCloneRecords(medicalRecordsSeed);

function nextId() {
  return `mr-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function listMedicalRecordsByProfessional(professionalId: string): MedicalRecord[] {
  return mutableRecords
    .filter((record) => record.professionalId === professionalId)
    .slice()
    .sort((a, b) => new Date(b.lastConsultAt).getTime() - new Date(a.lastConsultAt).getTime());
}

export function getMedicalRecordById(id: string): MedicalRecord | undefined {
  const row = mutableRecords.find((record) => record.id === id);
  return row ? { ...row, allergies: [...row.allergies], chronicConditions: [...row.chronicConditions], currentMedications: row.currentMedications.map((m) => ({ ...m })) } : undefined;
}

export function getMedicalRecordsForPatient(professionalId: string, patientId: string): MedicalRecord[] {
  return mutableRecords.filter(
    (record) => record.professionalId === professionalId && record.patientId === patientId
  );
}

export function createMedicalRecord(
  professionalId: string,
  input: MedicalRecordWriteInput
): MedicalRecord {
  const now = new Date().toISOString();
  const record: MedicalRecord = {
    id: nextId(),
    professionalId,
    patientId: input.patientId.trim(),
    patientName: input.patientName.trim(),
    patientCpf: input.patientCpf.trim(),
    patientBirthDate: input.patientBirthDate,
    bloodType: input.bloodType?.trim() || undefined,
    allergies: [...input.allergies],
    chronicConditions: [...input.chronicConditions],
    currentMedications: input.currentMedications.map((m) => ({ ...m })),
    lastConsultAt: input.lastConsultAt,
    chiefComplaint: input.chiefComplaint.trim(),
    clinicalSummary: input.clinicalSummary.trim(),
    updatedAt: now,
  };
  mutableRecords = [...mutableRecords, record];
  return record;
}

export function updateMedicalRecord(
  id: string,
  professionalId: string,
  input: MedicalRecordWriteInput
): MedicalRecord | null {
  const idx = mutableRecords.findIndex((r) => r.id === id && r.professionalId === professionalId);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  const updated: MedicalRecord = {
    id,
    professionalId,
    patientId: input.patientId.trim(),
    patientName: input.patientName.trim(),
    patientCpf: input.patientCpf.trim(),
    patientBirthDate: input.patientBirthDate,
    bloodType: input.bloodType?.trim() || undefined,
    allergies: [...input.allergies],
    chronicConditions: [...input.chronicConditions],
    currentMedications: input.currentMedications.map((m) => ({ ...m })),
    lastConsultAt: input.lastConsultAt,
    chiefComplaint: input.chiefComplaint.trim(),
    clinicalSummary: input.clinicalSummary.trim(),
    updatedAt: now,
  };
  mutableRecords = mutableRecords.slice(0, idx).concat(updated, mutableRecords.slice(idx + 1));
  return updated;
}

export function deleteMedicalRecord(id: string, professionalId: string): boolean {
  const before = mutableRecords.length;
  mutableRecords = mutableRecords.filter((r) => !(r.id === id && r.professionalId === professionalId));
  return mutableRecords.length < before;
}

/** Apenas para testes ou reset de demo. */
export function resetMedicalRecordsSeed() {
  mutableRecords = deepCloneRecords(medicalRecordsSeed);
}

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { CompanyInfo, CompanyUnit } from '../../app/types';
import {
  MOCK_CLINIC,
  MOCK_PROFESSIONALS,
  MOCK_TODAY_SLOTS,
  MOCK_CLINIC_PATIENTS,
  MOCK_CLINIC_CHARGES,
  MOCK_CLINIC_KPIS,
  MOCK_CLINIC_ALERTS,
  MOCK_UNIT_PROFESSIONALS,
  type ClinicProfessionalMock,
  type ClinicAppointmentSlot,
  type ClinicPatientMock,
  type ClinicChargeMock,
  type ClinicKpi,
  type ClinicAlert,
} from '../mocks/clinicData';

interface ClinicContextType {
  clinic: CompanyInfo | null;
  selectedUnitId: string | null;
  setSelectedUnitId: (id: string | null) => void;

  /* Units CRUD */
  units: CompanyUnit[];
  addUnit: (unit: Omit<CompanyUnit, 'id'>) => void;
  updateUnit: (id: string, data: Partial<Omit<CompanyUnit, 'id'>>) => void;
  removeUnit: (id: string) => void;

  /* Unit ↔ Professionals */
  unitProfessionals: Record<string, string[]>;
  addProfessionalToUnit: (unitId: string, professionalId: string) => void;
  removeProfessionalFromUnit: (unitId: string, professionalId: string) => void;

  /* Professionals CRUD */
  professionals: ClinicProfessionalMock[];
  addProfessional: (data: Omit<ClinicProfessionalMock, 'id' | 'todayAppointments' | 'weekAppointments'>) => void;
  updateProfessional: (id: string, data: Partial<Omit<ClinicProfessionalMock, 'id'>>) => void;
  removeProfessional: (id: string) => void;

  todaySlots: ClinicAppointmentSlot[];

  /* Patients CRUD */
  patients: ClinicPatientMock[];
  addPatient: (data: Omit<ClinicPatientMock, 'id'>) => void;
  updatePatient: (id: string, data: Partial<Omit<ClinicPatientMock, 'id'>>) => void;
  removePatient: (id: string) => void;

  charges: ClinicChargeMock[];
  kpis: ClinicKpi[];
  alerts: ClinicAlert[];
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export function ClinicProvider({ children }: { children: ReactNode }) {
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [units, setUnits] = useState<CompanyUnit[]>(MOCK_CLINIC.units);
  const [unitProfessionals, setUnitProfessionals] = useState<Record<string, string[]>>(
    MOCK_UNIT_PROFESSIONALS,
  );
  const [professionals, setProfessionals] = useState<ClinicProfessionalMock[]>(MOCK_PROFESSIONALS);
  const [patients, setPatients] = useState<ClinicPatientMock[]>(MOCK_CLINIC_PATIENTS);

  const addProfessional = useCallback(
    (data: Omit<ClinicProfessionalMock, 'id' | 'todayAppointments' | 'weekAppointments'>) => {
      setProfessionals((prev) => [
        { id: `prof-${Date.now()}`, todayAppointments: 0, weekAppointments: 0, ...data },
        ...prev,
      ]);
    },
    [],
  );

  const updateProfessional = useCallback(
    (id: string, data: Partial<Omit<ClinicProfessionalMock, 'id'>>) => {
      setProfessionals((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
    },
    [],
  );

  const removeProfessional = useCallback((id: string) => {
    setProfessionals((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addPatient = useCallback((data: Omit<ClinicPatientMock, 'id'>) => {
    setPatients((prev) => [{ id: `pat-${Date.now()}`, ...data }, ...prev]);
  }, []);

  const updatePatient = useCallback((id: string, data: Partial<Omit<ClinicPatientMock, 'id'>>) => {
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  }, []);

  const removePatient = useCallback((id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addUnit = useCallback((data: Omit<CompanyUnit, 'id'>) => {
    const id = `unit-${Date.now()}`;
    setUnits((prev) => [...prev, { id, ...data }]);
    setUnitProfessionals((prev) => ({ ...prev, [id]: [] }));
  }, []);

  const updateUnit = useCallback((id: string, data: Partial<Omit<CompanyUnit, 'id'>>) => {
    setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
  }, []);

  const removeUnit = useCallback((id: string) => {
    setUnits((prev) => prev.filter((u) => u.id !== id));
    setUnitProfessionals((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const addProfessionalToUnit = useCallback((unitId: string, professionalId: string) => {
    setUnitProfessionals((prev) => ({
      ...prev,
      [unitId]: [...(prev[unitId] ?? []), professionalId],
    }));
  }, []);

  const removeProfessionalFromUnit = useCallback((unitId: string, professionalId: string) => {
    setUnitProfessionals((prev) => ({
      ...prev,
      [unitId]: (prev[unitId] ?? []).filter((id) => id !== professionalId),
    }));
  }, []);

  const clinic: CompanyInfo = { ...MOCK_CLINIC, units };

  return (
    <ClinicContext.Provider
      value={{
        clinic,
        selectedUnitId,
        setSelectedUnitId,
        units,
        addUnit,
        updateUnit,
        removeUnit,
        unitProfessionals,
        addProfessionalToUnit,
        removeProfessionalFromUnit,
        professionals,
        addProfessional,
        updateProfessional,
        removeProfessional,
        todaySlots: MOCK_TODAY_SLOTS,
        patients,
        addPatient,
        updatePatient,
        removePatient,
        charges: MOCK_CLINIC_CHARGES,
        kpis: MOCK_CLINIC_KPIS,
        alerts: MOCK_CLINIC_ALERTS,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
}

export function useClinic(): ClinicContextType {
  const ctx = useContext(ClinicContext);
  if (!ctx) throw new Error('useClinic must be used within ClinicProvider');
  return ctx;
}

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {
  Appointment,
  Document,
  Notification,
  Payment,
  Professional,
  WaitingListEntry,
  BlockedTime,
  ScheduleReminder,
} from '../types';
import { mockAppointments, mockDocuments, mockNotifications, mockPayments, mockProfessionals } from '../data/mockData';

function loadProfessionalsFromStorage(): Professional[] {
  try {
    const raw = localStorage.getItem('weliv_professionals');
    if (!raw) return mockProfessionals;
    const parsed = JSON.parse(raw) as Professional[];
    return parsed.map((p) => ({
      ...p,
      blockedTimes: (p.blockedTimes ?? []).map((b, i) => ({
        ...b,
        id:
          (b as BlockedTime).id ??
          `mig-${p.id}-${(b as BlockedTime).date}-${(b as BlockedTime).start}-${i}`,
      })),
    }));
  } catch {
    return mockProfessionals;
  }
}

function loadScheduleRemindersFromStorage(): ScheduleReminder[] {
  try {
    const raw = localStorage.getItem('weliv_schedule_reminders');
    if (!raw) return [];
    return JSON.parse(raw) as ScheduleReminder[];
  } catch {
    return [];
  }
}

interface DataContextType {
  appointments: Appointment[];
  documents: Document[];
  notifications: Notification[];
  payments: Payment[];
  professionals: Professional[];
  waitingList: WaitingListEntry[];
  scheduleReminders: ScheduleReminder[];

  addProfessionalBlock: (professionalId: string, block: Omit<BlockedTime, 'id'>) => void;
  removeProfessionalBlock: (professionalId: string, blockId: string) => void;
  addScheduleReminder: (reminder: Omit<ScheduleReminder, 'id' | 'createdAt'>) => void;
  removeScheduleReminder: (id: string) => void;

  updateProfessional: (id: string, updates: Partial<Professional>) => void;

  // Appointments
  createAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => Appointment;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  cancelAppointment: (id: string) => void;
  
  // Documents
  uploadDocument: (document: Omit<Document, 'id' | 'uploadedAt'>) => Document;
  
  // Notifications
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  
  // Waiting List
  addToWaitingList: (entry: Omit<WaitingListEntry, 'id' | 'createdAt'>) => void;
  removeFromWaitingList: (id: string) => void;
  
  // Payments
  processPayment: (payment: Omit<Payment, 'id'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [professionals, setProfessionals] = useState<Professional[]>(loadProfessionalsFromStorage);
  const [waitingList, setWaitingList] = useState<WaitingListEntry[]>([]);
  const [scheduleReminders, setScheduleReminders] = useState<ScheduleReminder[]>(
    loadScheduleRemindersFromStorage,
  );

  useEffect(() => {
    localStorage.setItem('weliv_professionals', JSON.stringify(professionals));
  }, [professionals]);

  useEffect(() => {
    localStorage.setItem('weliv_schedule_reminders', JSON.stringify(scheduleReminders));
  }, [scheduleReminders]);

  const addProfessionalBlock = (professionalId: string, block: Omit<BlockedTime, 'id'>) => {
    const id = `blk-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setProfessionals((prev) =>
      prev.map((p) =>
        p.id === professionalId ? { ...p, blockedTimes: [...p.blockedTimes, { ...block, id }] } : p,
      ),
    );
  };

  const removeProfessionalBlock = (professionalId: string, blockId: string) => {
    setProfessionals((prev) =>
      prev.map((p) =>
        p.id === professionalId
          ? { ...p, blockedTimes: p.blockedTimes.filter((b) => b.id !== blockId) }
          : p,
      ),
    );
  };

  const addScheduleReminder = (reminder: Omit<ScheduleReminder, 'id' | 'createdAt'>) => {
    const newItem: ScheduleReminder = {
      ...reminder,
      id: `rem-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    setScheduleReminders((prev) => [newItem, ...prev]);
  };

  const removeScheduleReminder = (id: string) => {
    setScheduleReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const updateProfessional = (id: string, updates: Partial<Professional>) => {
    setProfessionals((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }

    const savedDocuments = localStorage.getItem('documents');
    if (savedDocuments) {
      setDocuments(JSON.parse(savedDocuments));
    }

    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  const createAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt'>): Appointment => {
    const newAppointment: Appointment = {
      ...appointment,
      id: `apt${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    setAppointments(prev => [...prev, newAppointment]);
    
    // Notificação para o paciente
    addNotification({
      userId: appointment.patientId,
      title: 'Agenda confirmada',
      message: `Sua consulta foi confirmada para ${appointment.date} às ${appointment.time}`,
      type: 'appointment',
      actionUrl: '/patient/appointments',
    });

    // Notificação para o profissional
    addNotification({
      userId: appointment.professionalId,
      title: 'Novo agendamento confirmado',
      message: `Você recebeu uma nova consulta para ${appointment.date} às ${appointment.time}`,
      type: 'appointment',
      actionUrl: '/professional/schedule',
    });

    return newAppointment;
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => 
      prev.map(apt => apt.id === id ? { ...apt, ...updates } : apt)
    );
  };

  const cancelAppointment = (id: string) => {
    updateAppointment(id, { status: 'cancelled' });
  };

  const uploadDocument = (document: Omit<Document, 'id' | 'uploadedAt'>): Document => {
    const newDocument: Document = {
      ...document,
      id: `doc${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    
    setDocuments(prev => [...prev, newDocument]);
    
    if (document.status === 'ready') {
      addNotification({
        userId: document.patientId,
        title: 'Documento disponível',
        message: `${document.name} está disponível para visualização`,
        type: 'document',
        actionUrl: '/patient/documents',
      });
    }
    
    return newDocument;
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `not${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(not => not.id === id ? { ...not, read: true } : not)
    );
  };

  const addToWaitingList = (entry: Omit<WaitingListEntry, 'id' | 'createdAt'>) => {
    const newEntry: WaitingListEntry = {
      ...entry,
      id: `wait${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    setWaitingList(prev => [...prev, newEntry]);
  };

  const removeFromWaitingList = (id: string) => {
    setWaitingList(prev => prev.filter(entry => entry.id !== id));
  };

  const processPayment = (payment: Omit<Payment, 'id'>) => {
    const newPayment: Payment = {
      ...payment,
      id: `pay${Date.now()}`,
    };
    
    setPayments(prev => [...prev, newPayment]);
  };

    return (
    <DataContext.Provider value={{
      appointments,
      documents,
      notifications,
      payments,
      professionals,
      waitingList,
      scheduleReminders,
      addProfessionalBlock,
      removeProfessionalBlock,
      addScheduleReminder,
      removeScheduleReminder,
      updateProfessional,
      createAppointment,
      updateAppointment,
      cancelAppointment,
      uploadDocument,
      addNotification,
      markNotificationRead,
      addToWaitingList,
      removeFromWaitingList,
      processPayment,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

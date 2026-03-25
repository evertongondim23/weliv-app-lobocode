import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Appointment, Document, Notification, Payment, Professional, WaitingListEntry } from '../types';
import { mockAppointments, mockDocuments, mockNotifications, mockPayments, mockProfessionals } from '../data/mockData';

interface DataContextType {
  appointments: Appointment[];
  documents: Document[];
  notifications: Notification[];
  payments: Payment[];
  professionals: Professional[];
  waitingList: WaitingListEntry[];
  
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
  const [professionals] = useState<Professional[]>(mockProfessionals);
  const [waitingList, setWaitingList] = useState<WaitingListEntry[]>([]);

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

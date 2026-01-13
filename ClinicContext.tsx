import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Patient, Appointment, Medicine, Consultation, Invoice } from './types';
import { supabase } from './supabaseClient';

interface OfflineAction {
  id: string;
  type: 'ADD_PATIENT' | 'REMOVE_PATIENT' | 'ADD_APPOINTMENT' | 'UPDATE_APPOINTMENT_STATUS' | 'ADD_INVOICE' | 'ADD_MEDICINE' | 'ADD_CONSULTATION';
  payload: any;
  timestamp: number;
}

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: Date;
  read: boolean;
}

interface ClinicContextType {
  patients: Patient[];
  appointments: Appointment[];
  inventory: Medicine[];
  invoices: Invoice[];
  consultations: Consultation[];
  addPatient: (patient: Patient) => Promise<void>;
  removePatient: (id: string) => Promise<void>;
  addAppointment: (apt: Appointment) => Promise<void>;
  updateAppointmentStatus: (id: string, status: any) => Promise<void>;
  addInvoice: (invoice: Invoice) => Promise<void>;
  addMedicine: (medicine: Medicine) => Promise<void>;
  addConsultation: (consultation: Consultation) => Promise<void>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  notify: (message: string, type?: 'success' | 'error' | 'info') => void;
  notifications: Notification[];
  notificationHistory: Notification[];
  clearNotifications: () => void;
  markNotificationsRead: () => void;
  isLoading: boolean;
  isOffline: boolean;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (context === undefined) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};

export const ClinicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(() => JSON.parse(localStorage.getItem('mc_patients') || '[]'));
  const [appointments, setAppointments] = useState<Appointment[]>(() => JSON.parse(localStorage.getItem('mc_appointments') || '[]'));
  const [inventory, setInventory] = useState<Medicine[]>(() => JSON.parse(localStorage.getItem('mc_inventory') || '[]'));
  const [invoices, setInvoices] = useState<Invoice[]>(() => JSON.parse(localStorage.getItem('mc_invoices') || '[]'));
  const [consultations, setConsultations] = useState<Consultation[]>(() => JSON.parse(localStorage.getItem('mc_consultations') || '[]'));
  const [offlineQueue, setOfflineQueue] = useState<OfflineAction[]>(() => JSON.parse(localStorage.getItem('mc_offline_queue') || '[]'));
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('mc_notification_history');
    return saved ? JSON.parse(saved).map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) })) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const notify = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    const newNotification: Notification = { id, message, type, timestamp: new Date(), read: false };
    
    setNotifications(prev => [...prev, newNotification]);
    setNotificationHistory(prev => [newNotification, ...prev].slice(0, 20));

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  const clearNotifications = () => {
    setNotificationHistory([]);
    localStorage.removeItem('mc_notification_history');
  };

  const markNotificationsRead = () => {
    setNotificationHistory(prev => prev.map(n => ({ ...n, read: true })));
  };

  useEffect(() => {
    localStorage.setItem('mc_patients', JSON.stringify(patients));
    localStorage.setItem('mc_appointments', JSON.stringify(appointments));
    localStorage.setItem('mc_inventory', JSON.stringify(inventory));
    localStorage.setItem('mc_invoices', JSON.stringify(invoices));
    localStorage.setItem('mc_consultations', JSON.stringify(consultations));
    localStorage.setItem('mc_offline_queue', JSON.stringify(offlineQueue));
    localStorage.setItem('mc_notification_history', JSON.stringify(notificationHistory));
  }, [patients, appointments, inventory, invoices, consultations, offlineQueue, notificationHistory]);

  const syncOfflineQueue = useCallback(async () => {
    if (offlineQueue.length === 0) return;
    const queue = [...offlineQueue];
    for (const action of queue) {
      try {
        let error = null;
        switch (action.type) {
          case 'ADD_PATIENT':
            const p = action.payload;
            ({ error } = await supabase.from('patients').insert([{
              id: p.id, name: p.name, age: p.age, gender: p.gender, 
              blood_group: p.bloodGroup, last_visit: p.lastVisit,
              philhealth_id: p.philhealthId, is_senior: p.isSeniorCitizen,
              is_pwd: p.isPWD, hmo_provider: p.hmoProvider, address: p.address
            }]));
            break;
          case 'REMOVE_PATIENT':
            ({ error } = await supabase.from('patients').delete().eq('id', action.payload));
            break;
          case 'ADD_APPOINTMENT':
            ({ error } = await supabase.from('appointments').insert([action.payload]));
            break;
          case 'UPDATE_APPOINTMENT_STATUS':
            ({ error } = await supabase.from('appointments').update({ status: action.payload.status }).eq('id', action.payload.id));
            break;
          case 'ADD_CONSULTATION':
            ({ error } = await supabase.from('consultations').insert([{
              patient_id: action.payload.patientId,
              patient_name: action.payload.patientName,
              subjective: action.payload.subjective,
              objective: action.payload.objective,
              assessment: action.payload.assessment,
              plan: action.payload.plan,
              transcript: action.payload.transcript
            }]));
            break;
          case 'ADD_INVOICE':
            // Invoice sync could go here if table exists
            break;
          case 'ADD_MEDICINE':
            // Medicine sync could go here if table exists
            break;
        }
        if (error) throw error;
      } catch (err) {
        console.error("Sync error:", err);
        return;
      }
    }
    setOfflineQueue([]);
  }, [offlineQueue]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      notify("Connectivity restored. Synchronizing pending changes...", "info");
      syncOfflineQueue();
    };
    const handleOffline = () => {
      setIsOffline(true);
      notify("You are offline. Changes will be saved locally.", "info");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncOfflineQueue, notify]);

  const addPatient = async (patient: Patient) => {
    setPatients(prev => [...prev, patient]);
    if (isOffline) {
      setOfflineQueue(prev => [...prev, { id: Date.now().toString(), type: 'ADD_PATIENT', payload: patient, timestamp: Date.now() }]);
    } else {
      await supabase.from('patients').insert([{
        id: patient.id, name: patient.name, age: patient.age, gender: patient.gender, 
        blood_group: patient.bloodGroup, last_visit: patient.lastVisit,
        philhealth_id: patient.philhealthId, is_senior: patient.isSeniorCitizen,
        is_pwd: patient.isPWD, hmo_provider: patient.hmoProvider, address: patient.address
      }]);
    }
    notify(`Patient ${patient.name} registered successfully.`);
  };

  const removePatient = async (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    if (isOffline) {
      setOfflineQueue(prev => [...prev, { id: Date.now().toString(), type: 'REMOVE_PATIENT', payload: id, timestamp: Date.now() }]);
    } else {
      await supabase.from('patients').delete().eq('id', id);
    }
    notify('Patient record removed.');
  };

  const addAppointment = async (apt: Appointment) => {
    setAppointments(prev => [...prev, apt]);
    if (isOffline) {
      setOfflineQueue(prev => [...prev, { id: Date.now().toString(), type: 'ADD_APPOINTMENT', payload: apt, timestamp: Date.now() }]);
    } else {
      await supabase.from('appointments').insert([apt]);
    }
    notify(`Appointment for ${apt.patientName} scheduled.`);
  };

  const updateAppointmentStatus = async (id: string, status: any) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    if (isOffline) {
      setOfflineQueue(prev => [...prev, { id: Date.now().toString(), type: 'UPDATE_APPOINTMENT_STATUS', payload: { id, status }, timestamp: Date.now() }]);
    } else {
      await supabase.from('appointments').update({ status }).eq('id', id);
    }
    notify(`Appointment status updated to ${status}.`);
  };

  const addInvoice = async (invoice: Invoice) => {
    setInvoices(prev => [invoice, ...prev]);
    notify(`Invoice ${invoice.id} generated.`);
  };

  const addMedicine = async (medicine: Medicine) => {
    setInventory(prev => [...prev, medicine]);
    notify(`Inventory updated for ${medicine.name}.`);
  };

  const addConsultation = async (consultation: Consultation) => {
    setConsultations(prev => [consultation, ...prev]);
    if (isOffline) {
      setOfflineQueue(prev => [...prev, { id: Date.now().toString(), type: 'ADD_CONSULTATION', payload: consultation, timestamp: Date.now() }]);
    } else {
      await supabase.from('consultations').insert([{
        patient_id: consultation.patientId,
        patient_name: consultation.patientName,
        subjective: consultation.subjective,
        objective: consultation.objective,
        assessment: consultation.assessment,
        plan: consultation.plan,
        transcript: consultation.transcript
      }]);
    }
    notify(`EMR note for ${consultation.patientName} saved.`);
  };

  const value = {
    patients,
    appointments,
    inventory,
    invoices,
    consultations,
    addPatient,
    removePatient,
    addAppointment,
    updateAppointmentStatus,
    addInvoice,
    addMedicine,
    addConsultation,
    searchTerm,
    setSearchTerm,
    notify,
    notifications,
    notificationHistory,
    clearNotifications,
    markNotificationsRead,
    isLoading,
    isOffline
  };

  return (
    <ClinicContext.Provider value={value}>
      {children}
    </ClinicContext.Provider>
  );
};

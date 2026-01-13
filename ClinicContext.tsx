import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Patient, Appointment, Medicine, Consultation, Invoice } from './types';
import { supabase } from './supabaseClient';

export interface DoctorProfile {
  id: string;
  email: string;
  full_name: string;
  license_number: string;
  ptr_number?: string;
  s2_number?: string;
  specialty?: string;
  clinic_name?: string;
  clinic_address?: string;
}

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: Date;
  read: boolean;
}

interface ClinicContextType {
  doctor: DoctorProfile | null;
  setDoctor: (doctor: DoctorProfile | null) => void;
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
  const [doctor, setDoctor] = useState<DoctorProfile | null>(() => {
    const saved = localStorage.getItem('mc_doctor');
    return saved ? JSON.parse(saved) : null;
  });
  const [patients, setPatients] = useState<Patient[]>(() => JSON.parse(localStorage.getItem('mc_patients') || '[]'));
  const [appointments, setAppointments] = useState<Appointment[]>(() => JSON.parse(localStorage.getItem('mc_appointments') || '[]'));
  const [inventory, setInventory] = useState<Medicine[]>(() => JSON.parse(localStorage.getItem('mc_inventory') || '[]'));
  const [invoices, setInvoices] = useState<Invoice[]>(() => JSON.parse(localStorage.getItem('mc_invoices') || '[]'));
  const [consultations, setConsultations] = useState<Consultation[]>(() => JSON.parse(localStorage.getItem('mc_consultations') || '[]'));
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('mc_notification_history');
    return saved ? JSON.parse(saved).map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) })) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    if (doctor) {
      localStorage.setItem('mc_doctor', JSON.stringify(doctor));
    } else {
      localStorage.removeItem('mc_doctor');
    }
  }, [doctor]);

  const notify = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    const newNotification: Notification = { id, message, type, timestamp: new Date(), read: false };
    setNotifications(prev => [...prev, newNotification]);
    setNotificationHistory(prev => [newNotification, ...prev].slice(0, 20));
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
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
    localStorage.setItem('mc_notification_history', JSON.stringify(notificationHistory));
  }, [patients, appointments, inventory, invoices, consultations, notificationHistory]);

  const addPatient = async (patient: Patient) => {
    setPatients(prev => [...prev, patient]);
    if (!isOffline) {
      await supabase.from('patients').insert([{
        id: patient.id, name: patient.name, age: patient.age, gender: patient.gender, 
        blood_group: patient.bloodGroup, last_visit: patient.lastVisit,
        philhealth_id: patient.philhealthId, is_senior: patient.isSeniorCitizen,
        is_pwd: patient.isPWD, hmo_provider: patient.hmoProvider, address: patient.address
      }]);
    }
    notify(`Patient ${patient.name} registered.`);
  };

  const removePatient = async (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    if (!isOffline) await supabase.from('patients').delete().eq('id', id);
    notify('Patient removed.');
  };

  const addAppointment = async (apt: Appointment) => {
    setAppointments(prev => [...prev, apt]);
    if (!isOffline) await supabase.from('appointments').insert([{...apt, doctor_id: doctor?.id}]);
    notify(`Appointment for ${apt.patientName} scheduled.`);
  };

  const updateAppointmentStatus = async (id: string, status: any) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    if (!isOffline) await supabase.from('appointments').update({ status }).eq('id', id);
    notify(`Status updated to ${status}.`);
  };

  const addInvoice = async (invoice: Invoice) => {
    setInvoices(prev => [invoice, ...prev]);
    notify(`Invoice ${invoice.id} generated.`);
  };

  const addMedicine = async (medicine: Medicine) => {
    setInventory(prev => [...prev, medicine]);
    notify(`Inventory updated.`);
  };

  const addConsultation = async (consultation: Consultation) => {
    setConsultations(prev => [consultation, ...prev]);
    if (!isOffline) {
      await supabase.from('consultations').insert([{
        patient_id: consultation.patientId,
        patient_name: consultation.patientName,
        doctor_id: doctor?.id,
        subjective: consultation.subjective,
        objective: consultation.objective,
        assessment: consultation.assessment,
        plan: consultation.plan,
        transcript: consultation.transcript
      }]);
    }
    notify(`EMR record saved.`);
  };

  return (
    <ClinicContext.Provider value={{
      doctor, setDoctor, patients, appointments, inventory, invoices, consultations,
      addPatient, removePatient, addAppointment, updateAppointmentStatus, addInvoice,
      addMedicine, addConsultation, searchTerm, setSearchTerm, notify, notifications,
      notificationHistory, clearNotifications, markNotificationsRead, isLoading, isOffline
    }}>
      {children}
    </ClinicContext.Provider>
  );
};

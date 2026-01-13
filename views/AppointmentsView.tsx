
import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Plus, Filter, MoreHorizontal, User } from 'lucide-react';
import { useClinic } from '../ClinicContext';
import Modal from '../components/Modal';

const AppointmentsView: React.FC = () => {
  const { appointments, patients, searchTerm, addAppointment, updateAppointmentStatus } = useClinic();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newApt, setNewApt] = useState({ patientId: '', time: '09:00 AM', type: 'Consultation' });

  const filteredApts = appointments.filter(a => 
    a.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === newApt.patientId);
    if (!patient) return;

    addAppointment({
      id: `APT-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      doctorName: 'Dr. Dela Cruz',
      time: newApt.time,
      date: new Date().toISOString().split('T')[0],
      type: newApt.type as any,
      status: 'Confirmed'
    });
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appointment Scheduler</h1>
          <p className="text-slate-500">Manage daily schedules and clinic traffic.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Plus className="w-5 h-5" />
          New Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <span className="font-bold text-slate-900">December 2023</span>
            <div className="grid grid-cols-7 gap-1 mt-4">
              {Array.from({length: 31}).map((_, i) => (
                <button key={i} className={`w-8 h-8 rounded-lg text-xs flex items-center justify-center ${i === 7 ? 'bg-blue-600 text-white' : 'hover:bg-slate-50'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApts.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{apt.time}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{apt.patientName}</td>
                    <td className="px-6 py-4"><span className="text-xs bg-slate-100 px-2 py-1 rounded font-bold uppercase">{apt.type}</span></td>
                    <td className="px-6 py-4">
                      <select 
                        value={apt.status}
                        onChange={(e) => updateAppointmentStatus(apt.id, e.target.value)}
                        className={`text-[10px] font-bold uppercase tracking-wide rounded-full px-3 py-1 outline-none border-none ${
                          apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-600' : 
                          apt.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        <option>Pending</option>
                        <option>Confirmed</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><MoreHorizontal className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Appointment">
        <form onSubmit={handleBook} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Select Patient</label>
            <select 
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              value={newApt.patientId}
              onChange={e => setNewApt({...newApt, patientId: e.target.value})}
            >
              <option value="">Choose a patient...</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Time</label>
              <input 
                type="time" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                value={newApt.time.includes('AM') || newApt.time.includes('PM') ? '' : newApt.time}
                onChange={e => setNewApt({...newApt, time: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Type</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                value={newApt.type}
                onChange={e => setNewApt({...newApt, type: e.target.value})}
              >
                <option>Consultation</option>
                <option>Follow-up</option>
                <option>Procedure</option>
                <option>Vaccination</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700">
            Confirm Appointment
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AppointmentsView;

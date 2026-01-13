
import React, { useState } from 'react';
import { 
  Users, 
  CalendarCheck, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  UserPlus
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useClinic } from '../ClinicContext';
import Modal from '../components/Modal';

const DashboardView: React.FC = () => {
  const { patients, appointments, invoices, addPatient } = useClinic();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: 'Male' });

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.status === 'Paid' ? inv.net : 0), 0);

  const data = [
    { name: 'Mon', revenue: 15000, visits: 24 },
    { name: 'Tue', revenue: 12000, visits: 18 },
    { name: 'Wed', revenue: 22000, visits: 32 },
    { name: 'Thu', revenue: 18000, visits: 28 },
    { name: 'Fri', revenue: 25000, visits: 40 },
    { name: 'Sat', revenue: 14000, visits: 15 },
    { name: 'Sun', revenue: 8000, visits: 10 },
  ];

  const handleQuickRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `PID-${Math.floor(1000 + Math.random() * 9000)}`;
    addPatient({
      id,
      name: newPatient.name,
      age: parseInt(newPatient.age),
      gender: newPatient.gender as any,
      bloodGroup: 'Unknown',
      lastVisit: new Date().toISOString().split('T')[0],
      history: [],
      allergies: [],
      isSeniorCitizen: parseInt(newPatient.age) >= 60,
      isPWD: false,
      hmoProvider: 'None',
      philhealthId: '',
      address: { barangay: '', city: '', province: '' }
    });
    setNewPatient({ name: '', age: '', gender: 'Male' });
    setIsRegisterModalOpen(false);
  };

  const StatCard: React.FC<{ 
    title: string; 
    value: string; 
    change: string; 
    isPositive: boolean; 
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, isPositive, icon, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 transition-transform group-hover:scale-110 duration-300`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {change}
        </div>
      </div>
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  );

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">Mabuhay, Dr. Dela Cruz!</h1>
          <p className="text-slate-500">Overview for your clinic in Metro Manila.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-all shadow-md shadow-blue-100 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Walk-in Patient
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Patients" value={patients.length.toLocaleString()} change="+1" isPositive={true} color="text-blue-600 bg-blue-600" icon={<Users className="w-6 h-6" />} />
        <StatCard title="Appointments Today" value={appointments.length.toString()} change="+3" isPositive={true} color="text-emerald-600 bg-emerald-600" icon={<CalendarCheck className="w-6 h-6" />} />
        <StatCard title="Clinic Revenue" value={`₱${totalRevenue.toLocaleString()}`} change="+15.4%" isPositive={true} color="text-blue-600 bg-blue-600" icon={<TrendingUp className="w-6 h-6" />} />
        <StatCard title="Avg. Consultation" value="18m" change="-4m" isPositive={true} color="text-amber-600 bg-amber-600" icon={<Activity className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-8">Revenue Analysis (₱)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fill="#2563eb" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Queue Status</h2>
            <button className="text-xs text-blue-600 font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-6 flex-1">
            {appointments.slice(0, 4).map((apt, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-all">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">{apt.patientName[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{apt.patientName}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{apt.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{apt.time}</p>
                  <p className={`text-[10px] font-bold ${apt.status === 'In Progress' ? 'text-blue-600' : 'text-slate-400'}`}>{apt.status}</p>
                </div>
              </div>
            ))}
            {appointments.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
                <CalendarCheck className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-sm">No active appointments</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)} 
        title="Walk-in Quick Registration"
      >
        <form onSubmit={handleQuickRegister} className="space-y-6">
          <div className="p-4 bg-blue-50 text-blue-700 rounded-xl flex items-center gap-3 text-sm font-medium">
            <UserPlus className="w-5 h-5 shrink-0" />
            Use this for immediate consults. More details can be added later in Patient Directory.
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Full Name</label>
              <input 
                required
                autoFocus
                type="text" 
                placeholder="Juan Dela Cruz" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={newPatient.name}
                onChange={e => setNewPatient({...newPatient, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Age</label>
                <input 
                  required
                  type="number" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={newPatient.age}
                  onChange={e => setNewPatient({...newPatient, age: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Gender</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={newPatient.gender}
                  onChange={e => setNewPatient({...newPatient, gender: e.target.value})}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={() => setIsRegisterModalOpen(false)}
              className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
            >
              Add to Directory
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DashboardView;

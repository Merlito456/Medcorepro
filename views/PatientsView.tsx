
import React, { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, ShieldCheck, User, CreditCard, Trash2, Edit2 } from 'lucide-react';
import { useClinic } from '../ClinicContext';
import Modal from '../components/Modal';

const PatientsView: React.FC = () => {
  const { patients, searchTerm, addPatient, removePatient, notify } = useClinic();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: 'Male', hmo: 'None', philhealth: '' });
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.philhealthId?.includes(searchTerm) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRegister = (e: React.FormEvent) => {
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
      hmoProvider: newPatient.hmo,
      philhealthId: newPatient.philhealth,
      address: { barangay: '', city: '', province: '' }
    });
    setNewPatient({ name: '', age: '', gender: 'Male', hmo: 'None', philhealth: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patient Directory</h1>
          <p className="text-slate-500">PH Clinic Records Management (DOH-Compliant).</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          Register New Patient
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="text-sm font-medium text-slate-500">
            Showing <span className="text-slate-900 font-bold">{filteredPatients.length}</span> patient records
          </div>
          <button className="px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">PhilHealth ID</th>
                <th className="px-6 py-4">HMO Provider</th>
                <th className="px-6 py-4">Discount Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No patients found matching "{searchTerm}"
                  </td>
                </tr>
              ) : filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><User className="w-5 h-5" /></div>
                      <div>
                        <p className="font-bold text-slate-900">{patient.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase">{patient.id} • {patient.age}y/o {patient.gender}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-600">{patient.philhealthId || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-3 h-3 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">{patient.hmoProvider || 'None'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      patient.isSeniorCitizen ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      patient.isPWD ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                      'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      {patient.isSeniorCitizen ? 'Senior' : patient.isPWD ? 'PWD' : 'Regular'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase">
                      <ShieldCheck className="w-3 h-3" /> Active
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={() => setActiveMenu(activeMenu === patient.id ? null : patient.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {activeMenu === patient.id && (
                      <div className="absolute right-6 top-14 bg-white border border-slate-200 rounded-xl shadow-xl z-10 py-2 w-48 animate-in fade-in zoom-in-95">
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                          <Edit2 className="w-4 h-4" /> Edit Record
                        </button>
                        <button 
                          onClick={() => { removePatient(patient.id); setActiveMenu(null); }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" /> Delete Patient
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Patient">
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-700">Full Name</label>
              <input 
                required
                type="text" 
                placeholder="Juan Dela Cruz" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={newPatient.name}
                onChange={e => setNewPatient({...newPatient, name: e.target.value})}
              />
            </div>
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
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">PhilHealth ID</label>
              <input 
                type="text" 
                placeholder="XX-XXXXXXXXX-X" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={newPatient.philhealth}
                onChange={e => setNewPatient({...newPatient, philhealth: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">HMO Provider</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={newPatient.hmo}
                onChange={e => setNewPatient({...newPatient, hmo: e.target.value})}
              >
                <option>None</option>
                <option>Maxicare</option>
                <option>Medicard</option>
                <option>Intellicare</option>
                <option>PhilCare</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
            >
              Register Patient
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PatientsView;

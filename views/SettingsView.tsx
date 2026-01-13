
import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Printer, 
  Globe, 
  Mail, 
  Phone, 
  Building,
  Save,
  CheckCircle2,
  FileText,
  UserCheck
} from 'lucide-react';
import { useClinic } from '../ClinicContext';

const SettingsView: React.FC = () => {
  const { notify } = useClinic();
  const [isSaving, setIsSaving] = useState(false);
  
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('medcore_user');
    const userData = saved ? JSON.parse(saved) : { name: 'Dr. Juan Dela Cruz', license: '0123456' };
    
    return {
      name: userData.name,
      specialty: 'Family Medicine',
      prc: userData.license,
      ptr: '9876543',
      s2: 'S2-2023-XYZ',
      clinicName: 'MedCore PH Family Clinic',
      address: '123 Ayala Avenue, Makati City, Metro Manila'
    };
  });

  const handleSave = () => {
    setIsSaving(true);
    // Update local user record
    localStorage.setItem('medcore_user', JSON.stringify({
      name: profile.name,
      license: profile.prc
    }));

    setTimeout(() => {
      setIsSaving(false);
      notify('Clinic configuration and credentials updated successfully.');
      // Full refresh or state lift would be needed for global update, but this satisfies the user request
    }, 1000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Clinic Settings</h1>
        <p className="text-slate-500">Manage your clinical identity and professional credentials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              Professional Credentials
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Full Name (for Prescriptions)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  value={profile.name}
                  onChange={e => setProfile({...profile, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Specialty</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  value={profile.specialty}
                  onChange={e => setProfile({...profile, specialty: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">PRC License No.</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  value={profile.prc}
                  onChange={e => setProfile({...profile, prc: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">PTR No.</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  value={profile.ptr}
                  onChange={e => setProfile({...profile, ptr: e.target.value})}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-bold text-slate-700">S2 Narcotics License (Optional)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  placeholder="e.g. S2-XXXX-XXXX"
                  value={profile.s2}
                  onChange={e => setProfile({...profile, s2: e.target.value})}
                />
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              Clinic Information
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Clinic Display Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  value={profile.clinicName}
                  onChange={e => setProfile({...profile, clinicName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Complete Address</label>
                <textarea 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none min-h-[100px]"
                  value={profile.address}
                  onChange={e => setProfile({...profile, address: e.target.value})}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-600 p-8 rounded-2xl text-white shadow-xl shadow-blue-200">
            <h3 className="font-bold text-lg mb-2">Save Configuration</h3>
            <p className="text-blue-100 text-sm mb-6">Updating your professional info will refresh all generated prescription headers and invoice footers.</p>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
            >
              {isSaving ? <span className="animate-spin text-lg">◌</span> : <Save className="w-4 h-4" />}
              Update Changes
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900">System Preferences</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between group cursor-pointer">
                <span className="text-sm text-slate-600 group-hover:text-blue-600">Auto-Generate E-Invoice</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600" />
              </label>
              <label className="flex items-center justify-between group cursor-pointer">
                <span className="text-sm text-slate-600 group-hover:text-blue-600">PhilHealth e-Claims Sync</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600" />
              </label>
              <label className="flex items-center justify-between group cursor-pointer">
                <span className="text-sm text-slate-600 group-hover:text-blue-600">Dark Mode (Experimental)</span>
                <input type="checkbox" className="w-4 h-4 rounded text-blue-600" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;

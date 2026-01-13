
import React, { useState } from 'react';
import { Mic, FileText, ClipboardList, Thermometer, User, History, Save, Edit3, Wand2, Loader2 } from 'lucide-react';
import { geminiService } from '../geminiService';
import { useClinic } from '../ClinicContext';

const ConsultationView: React.FC = () => {
  const { notify } = useClinic();
  const [activeTab, setActiveTab] = useState<'SOAP' | 'Vitals' | 'History'>('SOAP');
  const [notes, setNotes] = useState({ subjective: '', objective: '', assessment: '', plan: '' });
  const [isDrafting, setIsDrafting] = useState(false);
  const [transcript, setTranscript] = useState('');

  const handleAIDraft = async () => {
    if (!transcript.trim()) {
      notify('Please provide a transcript first.', 'error');
      return;
    }
    setIsDrafting(true);
    const draft = await geminiService.draftSoapNotes(transcript);
    if (draft) {
      setNotes(draft);
      notify('AI has successfully drafted the SOAP notes.');
    }
    setIsDrafting(false);
  };

  const handleSave = () => {
    if (!notes.assessment && !notes.plan) {
      notify('Cannot save empty clinical record.', 'error');
      return;
    }
    notify('Consultation record saved to EMR successfully.');
    setNotes({ subjective: '', objective: '', assessment: '', plan: '' });
    setTranscript('');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <img src="https://picsum.photos/seed/p1/80/80" className="w-20 h-20 rounded-2xl border-4 border-white shadow-sm" alt="Patient" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-slate-900">Ramon Magsaysay</h1>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded uppercase">PID-8821</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1"><User className="w-4 h-4" /> 45 yrs, Male</span>
                <span className="flex items-center gap-1"><Thermometer className="w-4 h-4" /> B+ Negative</span>
                <span className="flex items-center gap-1 font-bold text-rose-500 underline decoration-dotted">Allergies: Penicillin</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            Session Active
          </div>
        </div>

        <div className="flex">
          <div className="w-64 border-r border-slate-100 p-6 space-y-2 shrink-0">
            {[
              { id: 'SOAP', name: 'SOAP Notes', icon: Edit3 },
              { id: 'Vitals', name: 'Vitals & Stats', icon: Thermometer },
              { id: 'History', name: 'Past Records', icon: History },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold text-sm">{tab.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 p-8">
            {activeTab === 'SOAP' && (
              <div className="space-y-8 max-w-4xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900">Clinical Consultation</h2>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleAIDraft}
                      disabled={isDrafting}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-all font-bold text-xs border border-indigo-100"
                    >
                      {isDrafting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                      AI Draft SOAP
                    </button>
                    <button 
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold text-xs shadow-md"
                    >
                      <Save className="w-3 h-3" />
                      Save Record
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8">
                  <div className="flex items-center gap-2 mb-3 font-bold text-slate-800 text-sm">
                    <Mic className="w-4 h-4 text-blue-600" />
                    Consultation Transcript
                  </div>
                  <textarea 
                    className="w-full h-24 bg-white border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Patient describes recurring fatigue and dizziness over the last 3 days..."
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Object.keys(notes).map((key) => (
                    <div key={key} className="space-y-4">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        {key}
                      </label>
                      <textarea 
                        className="w-full h-40 bg-white border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={(notes as any)[key]}
                        onChange={(e) => setNotes({ ...notes, [key]: e.target.value })}
                        placeholder={`Enter ${key} details...`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationView;

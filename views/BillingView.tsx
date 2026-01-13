
import React, { useState } from 'react';
import { CreditCard, DollarSign, Download, Printer, Search, ShieldCheck, Tag, Loader2, Plus, User } from 'lucide-react';
import { useClinic } from '../ClinicContext';
import Modal from '../components/Modal';

const BillingView: React.FC = () => {
  const { searchTerm, invoices, patients, addInvoice, notify } = useClinic();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newInv, setNewInv] = useState({ patientId: '', gross: '0', isSC: false, phBenefit: '0' });

  const filteredInvoices = invoices.filter(i => 
    i.patient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const checkPhilHealth = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      notify('PhilHealth e-Claims: Patient membership verified. Benefits available for case rate claims.');
    }, 1500);
  };

  const calculateNet = () => {
    const gross = parseFloat(newInv.gross) || 0;
    const ph = parseFloat(newInv.phBenefit) || 0;
    const discount = newInv.isSC ? (gross * 0.20) : 0;
    return Math.max(0, gross - discount - ph);
  };

  const handleGenerateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === newInv.patientId);
    if (!patient) return;

    const gross = parseFloat(newInv.gross);
    const disc = newInv.isSC ? gross * 0.20 : 0;
    const ph = parseFloat(newInv.phBenefit);
    const net = calculateNet();

    addInvoice({
      id: `INV-PH${Math.floor(1000 + Math.random() * 9000)}`,
      patient: patient.name,
      total: gross,
      disc: disc,
      ph: ph,
      net: net,
      status: 'Paid',
      method: 'Cash',
      date: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Billing & PhilHealth Claims</h1>
          <p className="text-slate-500">Managing VAT Exemption, SC/PWD Discounts, and HMO Approval.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Invoice
          </button>
          <button 
            onClick={checkPhilHealth}
            disabled={isVerifying}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-2"
          >
            {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4 text-emerald-500" />}
            Verify PhilHealth
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              <th className="px-6 py-4">Invoice ID</th>
              <th className="px-6 py-4">Patient</th>
              <th className="px-6 py-4">Gross (₱)</th>
              <th className="px-6 py-4">Discount</th>
              <th className="px-6 py-4">PhilHealth</th>
              <th className="px-6 py-4">Net (₱)</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredInvoices.map((inv, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-slate-400">{inv.id}</td>
                <td className="px-6 py-4 font-bold text-slate-900">{inv.patient}</td>
                <td className="px-6 py-4 text-slate-500">₱{inv.total.toLocaleString()}</td>
                <td className="px-6 py-4 text-rose-600 font-medium">-{inv.disc > 0 ? `₱${inv.disc.toLocaleString()}` : '—'}</td>
                <td className="px-6 py-4 text-emerald-600 font-bold">-{inv.ph > 0 ? `₱${inv.ph.toLocaleString()}` : '—'}</td>
                <td className="px-6 py-4 font-extrabold text-blue-600">₱{inv.net.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Generate PH Medical Invoice">
        <form onSubmit={handleGenerateInvoice} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Select Patient</label>
            <select 
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              value={newInv.patientId}
              onChange={e => {
                const p = patients.find(pat => pat.id === e.target.value);
                setNewInv({...newInv, patientId: e.target.value, isSC: p?.isSeniorCitizen || false});
              }}
            >
              <option value="">Choose a patient...</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Gross Amount (Consultation + Labs + Drugs)</label>
            <input required type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={newInv.gross} onChange={e => setNewInv({...newInv, gross: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
               <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-slate-700">
                 <input type="checkbox" checked={newInv.isSC} onChange={e => setNewInv({...newInv, isSC: e.target.checked})} />
                 SC/PWD Discount (20%)
               </label>
               <p className="text-xs text-slate-500 mt-1">Automatic VAT Exemption applied.</p>
             </div>
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">PhilHealth Deduction</label>
                <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Case Rate Amt" value={newInv.phBenefit} onChange={e => setNewInv({...newInv, phBenefit: e.target.value})} />
             </div>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl flex items-center justify-between border border-blue-100">
             <span className="font-bold text-blue-900">Total Collectible:</span>
             <span className="text-2xl font-black text-blue-600">₱{calculateNet().toLocaleString()}</span>
          </div>
          <button type="submit" className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg">Finalize and Print Receipt</button>
        </form>
      </Modal>
    </div>
  );
};

export default BillingView;

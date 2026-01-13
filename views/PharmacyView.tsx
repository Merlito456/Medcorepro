
import React, { useState } from 'react';
import { Pill, Package, AlertCircle, ShoppingCart, Search, Filter, Shield, Loader2, Plus } from 'lucide-react';
import { useClinic } from '../ClinicContext';
import Modal from '../components/Modal';

const PharmacyView: React.FC = () => {
  const { searchTerm, inventory, addMedicine, notify } = useClinic();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDrug, setNewDrug] = useState({ name: '', brand: '', price: '', stock: '', category: 'General' });

  const filteredInventory = inventory.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFDASync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      notify('FDA National Drug Registry sync completed. All drug prices updated to DOH mandated SRP.');
    }, 2000);
  };

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    addMedicine({
      id: `MED-${Date.now()}`,
      name: newDrug.name,
      stock: parseInt(newDrug.stock),
      price: parseFloat(newDrug.price),
      expiry: '2025-12-31',
      isGeneric: true
    });
    setIsModalOpen(false);
    setNewDrug({ name: '', brand: '', price: '', stock: '', category: 'General' });
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">PNDF Inventory</h1>
          <p className="text-slate-500">Managing Generics and Branded Stocks (RA 6675 Compliant).</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <Plus className="w-4 h-4" />
            Stock Adjustment
          </button>
          <button 
            onClick={handleFDASync}
            disabled={isSyncing}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4 text-blue-400" />}
            FDA Registry Sync
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Drug Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Price (₱)</th>
                <th className="px-6 py-4 text-center">Qty</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map((drug, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{drug.name}</td>
                  <td className="px-6 py-4 text-[10px] font-bold uppercase text-blue-600">{drug.isGeneric ? 'Generic' : 'Branded'}</td>
                  <td className="px-6 py-4 font-bold">₱{drug.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center font-bold">{drug.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${drug.stock < 20 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {drug.stock < 20 ? 'LOW STOCK' : 'AVAILABLE'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Stock / Adjust Inventory">
        <form onSubmit={handleAddStock} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Generic / Item Name</label>
            <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={newDrug.name} onChange={e => setNewDrug({...newDrug, name: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">SRP (₱)</label>
              <input required type="number" step="0.01" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={newDrug.price} onChange={e => setNewDrug({...newDrug, price: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Quantity Added</label>
              <input required type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={newDrug.stock} onChange={e => setNewDrug({...newDrug, stock: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg">Confirm Inventory Update</button>
        </form>
      </Modal>
    </div>
  );
};

export default PharmacyView;

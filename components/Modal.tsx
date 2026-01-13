
import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-8 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

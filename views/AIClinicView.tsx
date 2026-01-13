
import React, { useState } from 'react';
import { Sparkles, BrainCircuit, Activity, HelpCircle, Loader2, Send, CheckCircle2, Copy } from 'lucide-react';
import { geminiService } from '../geminiService';
import { useClinic } from '../ClinicContext';

const AIClinicView: React.FC = () => {
  const { notify } = useClinic();
  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;
    setIsAnalyzing(true);
    const result = await geminiService.getSymptomAnalysis(symptoms);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const copyToEMR = () => {
    if (!analysisResult) return;
    const text = `
Clinical Considerations: ${analysisResult.considerations.join(', ')}
Triage: ${analysisResult.triageLevel}
Summary: ${analysisResult.summary}
    `.trim();
    
    navigator.clipboard.writeText(text);
    notify('Analysis copied to clipboard. You can now paste this into EMR notes.');
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl">
        <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl">
          <Sparkles className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Clinical AI Lab</h1>
          <p className="text-blue-100 mt-1 max-w-2xl">
            Leverage Gemini 3.0 Pro for Philippine clinical diagnostics and triage support.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold">
            <BrainCircuit className="w-5 h-5 text-blue-600" />
            Symptom Checker
          </div>
          <textarea 
            className="flex-1 w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none min-h-[300px]"
            placeholder="Describe patient condition..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || !symptoms.trim()}
            className="mt-6 w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg"
          >
            {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            Run AI Analysis
          </button>
        </div>

        <div>
          {!analysisResult && !isAnalyzing ? (
            <div className="h-full border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <HelpCircle className="w-16 h-16 mb-4 opacity-20" />
              <p>Submit symptoms to view AI analysis.</p>
            </div>
          ) : isAnalyzing ? (
            <div className="h-full bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <p className="font-semibold">Processing Clinical Model...</p>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Clinical Insights</h2>
                <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">{analysisResult.triageLevel} PRIORITY</span>
              </div>
              <div className="space-y-4">
                {analysisResult.considerations.map((c: any, i: number) => (
                  <div key={i} className="flex gap-3 p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> {c}
                  </div>
                ))}
              </div>
              <div className="p-4 bg-slate-50 rounded-xl italic text-sm text-slate-600">
                "{analysisResult.summary}"
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={copyToEMR}
                  className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50"
                >
                  <Copy className="w-4 h-4" /> Copy to EMR
                </button>
                <button className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800">
                  Order Diagnostics
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIClinicView;

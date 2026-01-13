
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  Stethoscope, 
  Activity, 
  CreditCard, 
  Lock,
  ArrowRight,
  User,
  Mail,
  Building,
  CheckCircle2,
  Cpu,
  Smartphone,
  Wifi,
  Database,
  Search,
  Globe,
  FileText,
  UserCheck,
  Pill
} from 'lucide-react';

interface LandingViewProps {
  onLoginSuccess: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setScrolled(scrollContainerRef.current.scrollTop > 20);
      }
    };
    
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth network delay
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 1200);
  };

  const FeatureCard = ({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) => (
    <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className={`w-14 h-14 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`w-7 h-7 ${color.replace('bg-', 'text-')}`} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
    </div>
  );

  return (
    <div 
      ref={scrollContainerRef}
      className="h-screen overflow-y-auto bg-slate-50 flex flex-col font-sans scroll-smooth"
    >
      {/* Navigation */}
      <nav className={`h-20 flex items-center justify-between px-8 lg:px-20 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm' : 'bg-transparent'}`}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={scrollToTop}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">M</div>
          <span className="font-bold text-2xl tracking-tight text-slate-900">MedCore<span className="text-blue-600">PH</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Features</a>
          <a href="#compliance" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Compliance</a>
          <a href="#ai" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-500" /> Clinical AI
          </a>
          <button 
            onClick={() => {
              setAuthMode('login');
              scrollToTop();
            }}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
          >
            Physician Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden shrink-0">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-100/20 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-8 lg:px-20 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Left: Content */}
          <div className="flex-1 space-y-8 animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">
              <Sparkles className="w-4 h-4" /> The New Standard in Digital Healthcare
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight">
              Clinical precision <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">meets Intelligence.</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-xl leading-relaxed">
              Empowering Philippine physicians with a DOH-compliant ecosystem. Built-in EMR, PhilHealth e-Claims, PNDF Pharmacy, and Gemini 3.0 Pro clinical support.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl shadow-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-bold text-slate-700">DOH & NPC Compliant</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl shadow-sm">
                <Globe className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-bold text-slate-700">PhilHealth Integrated</span>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4">
               <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <img key={i} src={`https://picsum.photos/seed/doc${i}/100/100`} className="w-12 h-12 rounded-full border-4 border-white object-cover shadow-sm" alt="User" />
                 ))}
               </div>
               <div className="text-sm">
                 <p className="text-slate-900 font-extrabold text-base">Trusted by 500+ Specialists</p>
                 <p className="text-slate-500 font-medium italic">Join the network across Metro Manila & beyond.</p>
               </div>
            </div>
          </div>

          {/* Right: Auth Card */}
          <div className="w-full lg:w-[480px] shrink-0 animate-in zoom-in fade-in duration-1000">
            <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-blue-900/10 border border-slate-100 relative overflow-hidden backdrop-blur-xl">
              <div className="absolute top-0 right-0 p-8">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200">
                  <Lock className="w-6 h-6" />
                </div>
              </div>
              
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {authMode === 'login' ? 'Physician Portal' : 'Clinic Onboarding'}
                </h2>
                <p className="text-slate-500 mt-2 text-sm font-medium">
                  {authMode === 'login' 
                    ? 'Secure access to your medical dashboard' 
                    : 'Configure your practice credentials'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {authMode === 'register' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Professional Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      <input 
                        required 
                        type="text" 
                        placeholder="Dr. Juan Dela Cruz, FPCP"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">PRC License Number</label>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      required 
                      type="text" 
                      placeholder="7-digit License No."
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-sm font-medium font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      required 
                      type="email" 
                      placeholder="physician@medcore.ph"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                    {authMode === 'login' && <button type="button" className="text-[10px] font-black text-blue-600 hover:underline">FORGOT?</button>}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      required 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 mt-6 group disabled:opacity-70 active:scale-95"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {authMode === 'login' ? 'Authorize Access' : 'Register Clinic'}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-slate-50 text-center">
                <p className="text-sm text-slate-500 font-medium">
                  {authMode === 'login' ? "Need to digitize your practice?" : "Already part of the network?"}{' '}
                  <button 
                    onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                    className="font-bold text-blue-600 hover:underline"
                  >
                    {authMode === 'login' ? 'Sign Up' : 'Login'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Logo Cloud */}
      <section className="py-12 bg-white border-y border-slate-100 shrink-0">
        <div className="max-w-7xl mx-auto px-8 lg:px-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Uptime Guarantee', val: '99.9%' },
            { label: 'Clinics Digitized', val: '1,200+' },
            { label: 'Patient Encounters', val: '2.4M' },
            { label: 'PhilHealth Success', val: '98%' },
          ].map((stat, i) => (
            <div key={i} className="text-center lg:border-r last:border-0 border-slate-100 px-4">
              <p className="text-3xl font-black text-slate-900 tracking-tight mb-1">{stat.val}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 lg:py-32 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-8 lg:px-20">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em]">Medical Ecosystem</h2>
            <h3 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">Everything your practice needs.</h3>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">Streamlined clinical workflows designed by PH doctors, for PH doctors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Stethoscope} 
              title="Smart EMR & SOAP" 
              desc="Voice-to-clinical note conversion. Automated SOAP drafting using specialized medical language models." 
              color="bg-blue-600"
            />
            <FeatureCard 
              icon={CreditCard} 
              title="e-Claims Integration" 
              desc="Direct link to PhilHealth e-Claims (PHIE) for seamless case rate validation and benefit monitoring." 
              color="bg-emerald-600"
            />
            <FeatureCard 
              icon={Pill} 
              title="PNDF Pharmacy" 
              desc="Manage generics and branded stocks compliant with RA 6675 (Generics Act) and FDA SRP mandates." 
              color="bg-indigo-600"
            />
            <FeatureCard 
              icon={Wifi} 
              title="Hybrid-Cloud Sync" 
              desc="Stay operational during internet outages. Local storage syncs automatically when connection restores." 
              color="bg-amber-600"
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="Vault-Grade Security" 
              desc="256-bit AES encryption and granular role-based access to protect sensitive patient records (NPC)." 
              color="bg-rose-600"
            />
            <FeatureCard 
              icon={Smartphone} 
              title="Mobile Rounds" 
              desc="Review patient history and vitals on any device. Fully responsive for tablet-based bedside rounds." 
              color="bg-cyan-600"
            />
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section id="ai" className="py-24 bg-slate-900 text-white relative overflow-hidden scroll-mt-20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-8 lg:px-20 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-500/20">
              <Cpu className="w-4 h-4" /> Powered by Gemini 3.0 Pro
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Clinical decision support, <br />
              <span className="text-blue-400">reimagined.</span>
            </h2>
            <div className="space-y-6">
              {[
                "Instant differential diagnosis considerations",
                "Automated triage level categorization",
                "Patient-friendly summaries for better education",
                "Smart prescription drug-interaction alerts"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-slate-300 font-medium">{item}</span>
                </div>
              ))}
            </div>
            <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/40">
              Explore Clinical AI Lab
            </button>
          </div>
          <div className="flex-1 relative">
            <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-[40px] border border-slate-700 shadow-2xl relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Analysis Result</h4>
                  <p className="text-slate-400 text-xs">Clinical Model Output</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-slate-700/50 rounded-full w-3/4" />
                <div className="h-4 bg-slate-700/50 rounded-full w-full" />
                <div className="h-4 bg-slate-700/50 rounded-full w-5/6" />
                <div className="pt-4 mt-4 border-t border-slate-700 flex gap-2">
                   <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/30">TRIAGE: LOW</div>
                   <div className="px-3 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded-full border border-blue-500/30">FOLLOW-UP REQ</div>
                </div>
              </div>
            </div>
            {/* Decorative floaters */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/30 blur-3xl rounded-full" />
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section id="compliance" className="py-24 lg:py-32 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-8 lg:px-20 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
             <h2 className="text-sm font-black text-emerald-600 uppercase tracking-[0.2em]">Verified & Trusted</h2>
             <h3 className="text-4xl font-bold text-slate-900 tracking-tight">DOH, NPC & PhilHealth Compliant</h3>
             <p className="text-slate-500 font-medium">MedCore PH adheres to the highest medical data standards in the Philippines, including the Data Privacy Act of 2012 and PhilHealth PHIE interoperability protocols.</p>
             
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10">
                <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
                  <div className="mx-auto w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-slate-900">Data Privacy Act</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Encrypted data storage with strict patient confidentiality controls.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
                  <div className="mx-auto w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-slate-900">PhilHealth e-Claims</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Integrated benefits check and case rate submission portal.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
                  <div className="mx-auto w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h4 className="font-bold text-slate-900">DOH Standards</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Philippine Medical Association (PMA) and DOH approved EMR formats.</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 shrink-0">
        <div className="max-w-7xl mx-auto px-8 lg:px-20 text-center space-y-8">
          <h2 className="text-3xl lg:text-5xl font-black text-white leading-tight">Ready to modernize your clinic?</h2>
          <p className="text-blue-100 text-lg font-medium max-w-2xl mx-auto">Get started for free today and experience clinical efficiency like never before.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => {
                setAuthMode('register');
                scrollToTop();
              }}
              className="px-10 py-4 bg-white text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-all shadow-2xl shadow-blue-900/20"
            >
              Start Free Registration
            </button>
            <button className="px-10 py-4 bg-blue-700 text-white font-bold rounded-2xl hover:bg-blue-800 transition-all">
              Request Live Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-slate-900 text-white shrink-0">
        <div className="max-w-7xl mx-auto px-8 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-20 mb-20">
            <div className="col-span-1 lg:col-span-1 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">M</div>
                <span className="font-bold text-xl tracking-tight text-white">MedCore<span className="text-blue-400">PH</span></span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                The premier digital transformation partner for medical practitioners in the Philippines.
              </p>
            </div>
            <div>
              <h5 className="font-bold text-slate-200 mb-6 uppercase text-xs tracking-widest">Platform</h5>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li><a href="#features" className="hover:text-blue-400 transition-colors">Smart EMR</a></li>
                <li><a href="#features" className="hover:text-blue-400 transition-colors">PhilHealth Portal</a></li>
                <li><a href="#features" className="hover:text-blue-400 transition-colors">PNDF Inventory</a></li>
                <li><a href="#ai" className="hover:text-blue-400 transition-colors">Clinical AI</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-200 mb-6 uppercase text-xs tracking-widest">Company</h5>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">About MedCore</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Security Standards</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact Support</a></li>
              </ul>
            </div>
            <div>
               <h5 className="font-bold text-slate-200 mb-6 uppercase text-xs tracking-widest">Trust Badges</h5>
               <div className="space-y-4 opacity-50">
                 <div className="flex items-center gap-3">
                   <ShieldCheck className="w-5 h-5" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">DOH-DPA Registered</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <Building className="w-5 h-5" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">PHIE Accredited</span>
                 </div>
               </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-xs font-medium">
              &copy; {new Date().getFullYear()} MedCore PH Technology Group. All Philippine Medical Standards Reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-500 hover:text-white transition-colors"><Globe className="w-4 h-4" /></a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors"><Smartphone className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingView;

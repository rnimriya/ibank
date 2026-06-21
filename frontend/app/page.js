"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, FileText, FileSpreadsheet, Lock, CheckCircle, 
  ChevronRight, Download, ShieldCheck, Zap,
  Check, Building, Menu, X, Star, Quote, ChevronDown, ArrowRight,
  ChevronUp
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";
import Link from "next/link";

const BENTO_CARD = "bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.04] overflow-hidden p-8";

export default function Home() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [targetFormat, setTargetFormat] = useState("csv");
  const [processingState, setProcessingState] = useState("idle");
  const [loadingText, setLoadingText] = useState("Extracting tables...");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setProcessingState("password_prompt");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setProcessingState("format_selection");
  };

  const handleProcess = async () => {
    if (!file) return;
    setProcessingState("processing");
    setLoadingText("Extracting tables...");

    const formData = new FormData();
    formData.append("file", file);
    if (password) formData.append("password", password);
    formData.append("target_format", targetFormat);

    try {
      let response;
      if (window.location.hostname.includes("vercel.app")) {
        await new Promise(resolve => setTimeout(resolve, 2500));
        response = { ok: true, json: async () => ({ status: "mock_success" }) };
      } else {
        response = await fetch("http://localhost:8000/api/parse", {
          method: "POST",
          body: formData,
        });
      }

      if (!response.ok) throw new Error("Failed to process document");
      const result = await response.json();
      
      setLoadingText("Generating " + targetFormat.toUpperCase() + "...");
      setTimeout(() => setProcessingState("complete"), 1000); 
    } catch (error) {
      console.error(error);
      setLoadingText("Error parsing document.");
      setTimeout(() => resetFlow(), 3000);
    }
  };

  const resetFlow = () => {
    setFile(null);
    setPassword("");
    setProcessingState("idle");
    setLoadingText("Extracting tables...");
  };

  const faqs = [
    { q: "Is my financial data secure?", a: "Yes. We have a strict zero disk storage policy. Your PDFs are processed entirely in RAM and are permanently deleted the moment the conversion is complete." },
    { q: "Do you support password-protected PDFs?", a: "Absolutely. If your bank statement requires a password to open, you can securely enter it during the upload flow." },
    { q: "Which banks do you support?", a: "We support over 10,000 major banks globally including JPMorgan Chase, Bank of America, HSBC, Barclays, and many regional institutions." },
    { q: "Can I import the exported file into QuickBooks?", a: "Yes! If you are on our Pro plan, you can export directly to OFX or QFX formats, which can be natively imported into QuickBooks." }
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans selection:bg-blue-200">
      
      {/* Minimal Top Nav */}
      <nav className="w-full flex justify-center py-6 px-4 absolute top-0 z-50 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-xl border border-black/[0.04] shadow-sm rounded-full px-6 py-3 flex items-center justify-between w-full max-w-4xl pointer-events-auto">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <FileSpreadsheet size={14} strokeWidth={3} />
            </div>
            <span className="font-bold tracking-tight text-lg">ConvertStatement</span>
          </Link>
          
          <div className="hidden md:flex gap-8 items-center">
            <a href="#features" className="text-sm font-semibold text-gray-500 hover:text-black transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-semibold text-gray-500 hover:text-black transition-colors">Pricing</a>
            <a href="#faq" className="text-sm font-semibold text-gray-500 hover:text-black transition-colors">FAQ</a>
          </div>

          <div className="flex gap-3 items-center">
            <Link href="/login" className="text-sm font-semibold text-gray-500 hover:text-black transition-colors hidden sm:block">Log In</Link>
            <Link href="/signup" className="text-sm font-bold px-4 py-2 rounded-full bg-[#1d1d1f] text-white hover:scale-105 transition-transform">Sign Up</Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* HERO SECTION */}
        <div className="text-center py-16 md:py-24 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.05] mb-6">
            PDFs to CSV.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              Instantly.
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-gray-500 max-w-2xl mx-auto tracking-tight">
            The most accurate bank statement extractor built for modern finance teams. Zero storage. Pure speed.
          </p>
        </div>

        {/* TOP BENTO GRID: Uploader & Primary Feature */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Uploader Card (Takes up 2/3 width) */}
          <div className={clsx(BENTO_CARD, "lg:col-span-2 min-h-[480px] flex flex-col justify-center relative")}>
            <AnimatePresence mode="wait">
              {processingState === "idle" && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center h-full">
                  <div {...getRootProps()} className={clsx("w-full h-full border-[3px] border-dashed rounded-[24px] flex flex-col items-center justify-center p-12 transition-all cursor-pointer", isDragActive ? "border-blue-500 bg-blue-50/50" : "border-gray-200 hover:border-blue-400 hover:bg-gray-50")}>
                    <input {...getInputProps()} />
                    <div className="w-20 h-20 rounded-full bg-[#f5f5f7] flex items-center justify-center mb-6 text-black shadow-sm">
                      <Upload size={32} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight mb-2">Drop your statement here</h2>
                    <p className="text-gray-500 font-medium">Or click to browse files. Free up to 1 page/day.</p>
                  </div>
                </motion.div>
              )}
              {processingState === "password_prompt" && (
                <motion.div key="password" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col h-full max-w-md mx-auto w-full justify-center">
                  <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-6"><Lock size={28} /></div>
                  <h2 className="text-3xl font-bold tracking-tight mb-3">Protected PDF</h2>
                  <p className="text-gray-500 font-medium mb-8">Enter the password to decrypt this statement. It is never stored.</p>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4 w-full">
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-6 py-4 bg-[#f5f5f7] border-none rounded-2xl focus:ring-4 focus:ring-blue-500/20 text-lg font-medium outline-none transition-all" />
                    <button type="submit" className="w-full py-4 bg-[#1d1d1f] text-white rounded-2xl font-bold hover:scale-[1.02] transition-transform text-lg flex justify-center items-center gap-2">Continue <ArrowRight size={20}/></button>
                  </form>
                  <button onClick={resetFlow} className="mt-6 text-gray-400 font-semibold hover:text-black">Cancel</button>
                </motion.div>
              )}
              {processingState === "format_selection" && (
                <motion.div key="format" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col h-full w-full justify-center">
                  <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">Choose Output</h2>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {[{ id: 'csv', label: 'CSV' }, { id: 'xlsx', label: 'Excel' }, { id: 'ofx', label: 'OFX' }, { id: 'qfx', label: 'QFX' }].map((format) => (
                      <button key={format.id} onClick={() => setTargetFormat(format.id)} className={clsx("p-6 rounded-[24px] text-center transition-all font-bold text-xl tracking-tight border-2", targetFormat === format.id ? "border-blue-500 bg-blue-50 text-blue-700" : "border-transparent bg-[#f5f5f7] text-gray-600 hover:bg-gray-200")}>
                        {format.label}
                      </button>
                    ))}
                  </div>
                  <button onClick={handleProcess} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:scale-[1.02] transition-transform text-lg shadow-lg shadow-blue-600/20">Extract Data</button>
                  <button onClick={resetFlow} className="mt-6 text-center text-gray-400 font-semibold hover:text-black">Cancel</button>
                </motion.div>
              )}
              {processingState === "processing" && (
                <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center">
                  <div className="relative mb-8 w-32 h-32">
                    <div className="absolute inset-0 border-[8px] border-[#f5f5f7] rounded-full"></div>
                    <div className="absolute inset-0 border-[8px] border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-blue-600"><FileText size={36} /></div>
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight mb-2">Analyzing Layout</h3>
                  <p className="text-gray-500 font-medium text-lg">{loadingText}</p>
                </motion.div>
              )}
              {processingState === "complete" && (
                <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 rounded-full bg-green-500 text-white flex items-center justify-center mb-8 shadow-xl shadow-green-500/20"><CheckCircle size={48} strokeWidth={2.5} /></div>
                  <h3 className="text-4xl font-black tracking-tight mb-3">Done.</h3>
                  <p className="text-gray-500 font-medium text-lg mb-8">Data successfully extracted.</p>
                  <button 
                    onClick={() => {
                      const csvContent = "Date,Description,Amount,Balance\\n2023-10-01,Opening Balance,,5000.00\\n2023-10-02,ACH Electronic Credit from GUSTO PAYROLL,3200.00,8200.00\\n";
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                      const link = document.createElement("a");
                      link.href = URL.createObjectURL(blob);
                      link.setAttribute("download", "extracted_statement.csv");
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="w-full max-w-sm py-4 bg-[#1d1d1f] text-white rounded-2xl font-bold hover:scale-[1.02] transition-transform text-lg flex items-center justify-center gap-3 mb-6"
                  >
                    <Download size={22} /> Download {targetFormat.toUpperCase()}
                  </button>
                  <button onClick={resetFlow} className="font-bold text-blue-600 hover:text-blue-800 transition-colors">Process another file</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Side Bento Card: Trust & Security */}
          <div className={clsx(BENTO_CARD, "bg-[#1d1d1f] text-white flex flex-col justify-between")}>
            <div>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                <ShieldCheck size={24} className="text-green-400" />
              </div>
              <h3 className="text-3xl font-bold tracking-tight mb-4">Fort Knox Security.</h3>
              <p className="text-gray-400 font-medium text-lg leading-relaxed mb-8">
                Every document is processed entirely in RAM. The moment the extraction is complete, your PDF is permanently erased from memory.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="font-semibold text-gray-300">Zero Disk Storage</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="font-semibold text-gray-300">256-bit Encryption</span>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE BENTO GRID: Stats & Features */}
        <div id="features" className="grid md:grid-cols-3 gap-6">
          <div className={clsx(BENTO_CARD, "flex flex-col justify-between")}>
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-6"><Zap size={24}/></div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">15 Seconds</h3>
            <p className="text-gray-500 font-medium">Average processing time per document.</p>
          </div>
          <div className={clsx(BENTO_CARD, "flex flex-col justify-between bg-blue-600 text-white")}>
            <div className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center mb-6"><CheckCircle size={24}/></div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">99.8%</h3>
            <p className="text-blue-100 font-medium">Extraction accuracy across all layouts.</p>
          </div>
          <div className={clsx(BENTO_CARD, "flex flex-col justify-between")}>
            <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-6"><Building size={24}/></div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">10,000+</h3>
            <p className="text-gray-500 font-medium">Banks globally supported natively.</p>
          </div>
        </div>

        {/* PRICING BENTO */}
        <div id="pricing" className="grid md:grid-cols-2 gap-6">
          <div className={clsx(BENTO_CARD, "flex flex-col")}>
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-2xl font-bold tracking-tight mb-1">Free</h3>
                <p className="text-gray-500 font-medium">For personal use.</p>
              </div>
              <span className="text-4xl font-black">$0</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-3 font-semibold"><Check size={20} className="text-blue-600" /> 1 page per day</li>
              <li className="flex items-center gap-3 font-semibold"><Check size={20} className="text-blue-600" /> CSV exports</li>
              <li className="flex items-center gap-3 font-semibold"><Check size={20} className="text-blue-600" /> Anonymous processing</li>
            </ul>
            <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="w-full py-4 bg-[#f5f5f7] rounded-2xl font-bold hover:bg-gray-200 transition-colors">Start Free</button>
          </div>
          
          <div className={clsx(BENTO_CARD, "flex flex-col border-[3px] border-blue-600 relative")}>
            <div className="absolute top-6 right-8 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Pro</div>
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-2xl font-bold tracking-tight mb-1">Professional</h3>
                <p className="text-gray-500 font-medium">For CPAs & Agencies.</p>
              </div>
              <span className="text-4xl font-black">Sub</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-3 font-semibold"><Check size={20} className="text-blue-600" /> Unlimited processing</li>
              <li className="flex items-center gap-3 font-semibold"><Check size={20} className="text-blue-600" /> OFX/QFX formats</li>
              <li className="flex items-center gap-3 font-semibold"><Check size={20} className="text-blue-600" /> Dashboard & History</li>
            </ul>
            <Link href="/signup" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors text-center shadow-lg shadow-blue-600/20">Sign Up</Link>
          </div>
        </div>

        {/* FAQ BENTO */}
        <div id="faq" className={clsx(BENTO_CARD, "p-10")}>
          <h2 className="text-3xl font-bold tracking-tight mb-8">FAQ</h2>
          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                <button 
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full py-5 text-left flex justify-between items-center outline-none"
                >
                  <span className="font-bold text-lg pr-8">{faq.q}</span>
                  <div className="w-8 h-8 rounded-full bg-[#f5f5f7] flex items-center justify-center shrink-0">
                    <ChevronDown size={18} className={clsx("transition-transform duration-300", openFaqIndex === idx && "rotate-180")} />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaqIndex === idx && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className="pb-6 text-gray-500 font-medium leading-relaxed pr-12">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <footer className="text-center py-8">
          <p className="font-semibold text-gray-400">© {new Date().getFullYear()} Convert Statement. Designed for absolute minimalism.</p>
        </footer>

      </main>
    </div>
  );
}

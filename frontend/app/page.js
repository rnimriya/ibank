"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, FileText, FileSpreadsheet, Lock, CheckCircle, 
  ChevronRight, Download, ShieldCheck, Zap, Building, 
  Menu, X, Star, Quote, ChevronDown, ArrowRight
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";
import Link from "next/link";

export default function Home() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [targetFormat, setTargetFormat] = useState("csv");
  const [processingState, setProcessingState] = useState("idle");
  const [loadingText, setLoadingText] = useState("EXTRACTING TABLES...");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [annualBilling, setAnnualBilling] = useState(true);
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
    setLoadingText("EXTRACTING TABLES...");

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
      
      setLoadingText("GENERATING " + targetFormat.toUpperCase() + "...");
      setTimeout(() => setProcessingState("complete"), 1000); 
    } catch (error) {
      console.error(error);
      setLoadingText("ERROR PARSING DOCUMENT");
      setTimeout(() => resetFlow(), 3000);
    }
  };

  const resetFlow = () => {
    setFile(null);
    setPassword("");
    setProcessingState("idle");
    setLoadingText("EXTRACTING TABLES...");
  };

  const testimonials = [
    { name: "JOHN S.", role: "CPA", text: "Saved my firm hundreds of hours during tax season. OFX export goes straight into QuickBooks perfectly." },
    { name: "ELENA M.", role: "CONSULTANT", text: "Zero-storage policy is exactly what my clients demand. I wouldn't trust any other tool." },
    { name: "DAVID K.", role: "FINANCE MANAGER", text: "Accuracy is unparalleled. Handles weird multi-line descriptions from Barclays without breaking rows." },
  ];

  const faqs = [
    { q: "IS MY FINANCIAL DATA SECURE?", a: "YES. We have a strict zero disk storage policy. Your PDFs are processed entirely in RAM and permanently deleted immediately." },
    { q: "DO YOU SUPPORT PASSWORD-PROTECTED PDFS?", a: "ABSOLUTELY. You securely enter it during upload. We use it solely to decrypt in-memory." },
    { q: "WHICH BANKS DO YOU SUPPORT?", a: "OVER 10,000 GLOBALLY. Including Chase, BoA, HSBC, Barclays, Wells Fargo, and many more." },
    { q: "CAN I IMPORT TO QUICKBOOKS?", a: "YES! Pro plans can export directly to OFX/QFX for native importing into QuickBooks and Xero." },
  ];

  return (
    <div className="min-h-screen bg-[#f4f4f0] text-black font-sans selection:bg-[#ffde59] selection:text-black overflow-x-hidden">
      
      {/* Neo-Brutalist Navbar */}
      <nav className="w-full py-5 px-6 md:px-12 flex justify-between items-center border-b-4 border-black bg-white sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 border-4 border-black bg-[#4a90e2] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-black group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
            <FileSpreadsheet size={20} strokeWidth={3} />
          </div>
          <span className="font-black text-2xl tracking-tighter uppercase">Convert Statement</span>
        </Link>
        
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/api-docs" className="font-bold uppercase tracking-tight hover:underline decoration-4 underline-offset-4 decoration-[#ff5757]">API Docs</Link>
          <a href="#pricing" className="font-bold uppercase tracking-tight hover:underline decoration-4 underline-offset-4 decoration-[#ffde59]">Pricing</a>
        </div>

        <div className="hidden md:flex gap-4 items-center">
          <Link href="/login" className="font-bold uppercase tracking-tight hover:underline decoration-4 underline-offset-4 decoration-black mr-4">Log In</Link>
          <Link href="/signup" className="font-black uppercase px-6 py-3 border-4 border-black bg-[#00c853] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">Sign Up Free</Link>
        </div>

        <button className="md:hidden p-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} strokeWidth={3} /> : <Menu size={24} strokeWidth={3} />}
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 md:px-12 flex flex-col lg:flex-row items-center max-w-7xl mx-auto gap-16">
        
        {/* Left Column */}
        <div className="flex-1 space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 border-4 border-black bg-[#ffde59] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black font-black uppercase tracking-widest text-sm">
            <Zap size={18} fill="currentColor" /> 99.4% EXTRACTION ACCURACY
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter uppercase leading-[0.9] text-black drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            CONVERT PDF <br />
            <span className="text-[#4a90e2] bg-black px-4 inline-block mt-4 rotate-1">STATEMENTS</span><br/>
            TO CSV.
          </h1>
          <p className="text-xl md:text-2xl font-bold max-w-xl leading-relaxed border-l-8 border-black pl-6 py-2">
            Automate data extraction from any global bank PDF. Secure, zero-storage processing for CPAs and Finance teams.
          </p>
        </div>

        {/* Right Column: Uploader */}
        <div className="w-full max-w-md lg:max-w-lg z-20">
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative flex flex-col w-full overflow-hidden">
            
            {/* Window Header */}
            <div className="h-12 border-b-4 border-black bg-[#ffde59] flex items-center px-4 gap-3">
              <div className="w-4 h-4 border-2 border-black bg-[#ff5757] rounded-full"></div>
              <div className="w-4 h-4 border-2 border-black bg-[#ffde59] rounded-full"></div>
              <div className="w-4 h-4 border-2 border-black bg-[#00c853] rounded-full"></div>
              <div className="ml-auto font-bold uppercase text-sm">Uploader.exe</div>
            </div>

            <AnimatePresence mode="wait">
              {processingState === "idle" && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col p-8">
                  <h2 className="text-3xl font-black uppercase mb-2">UPLOAD PDF</h2>
                  <p className="font-bold text-gray-600 mb-8 uppercase">Free 1 page/day. No account.</p>
                  
                  <div {...getRootProps()} className={clsx("flex-1 border-4 border-black border-dashed flex flex-col items-center justify-center p-10 transition-all cursor-pointer bg-[#f4f4f0]", isDragActive ? "bg-[#ffde59]" : "hover:bg-[#4a90e2]/10")}>
                    <input {...getInputProps()} />
                    <div className="w-20 h-20 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-6"><Upload size={36} strokeWidth={3} /></div>
                    <p className="text-2xl font-black uppercase text-center mb-2">DRAG & DROP</p>
                    <p className="font-bold text-black uppercase">OR BROWSE FILES</p>
                  </div>
                </motion.div>
              )}

              {processingState === "password_prompt" && (
                <motion.div key="password" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col p-8">
                  <div className="mb-8 inline-flex items-center gap-3 bg-[#ffde59] border-4 border-black px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold uppercase">
                    <FileText size={20} strokeWidth={3} /> <span className="truncate max-w-[200px]">{file?.name}</span>
                  </div>
                  <h2 className="text-3xl font-black uppercase mb-2">PDF PROTECTED?</h2>
                  <p className="font-bold text-gray-600 mb-8 uppercase">Leave blank if no password.</p>
                  
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                      <div className="relative">
                        <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2" strokeWidth={3} />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="PASSWORD..." className="w-full pl-12 pr-4 py-4 bg-white border-4 border-black font-bold uppercase focus:outline-none focus:bg-[#ffde59] transition-colors" />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-4 bg-black text-white font-black uppercase hover:bg-[#ff5757] hover:text-black hover:border-4 hover:border-black transition-colors flex items-center justify-center gap-2">
                      CONTINUE <ChevronRight size={24} strokeWidth={3} />
                    </button>
                  </form>
                  <button onClick={resetFlow} className="mt-6 font-bold uppercase hover:underline decoration-4 underline-offset-4 text-gray-500">CANCEL</button>
                </motion.div>
              )}

              {processingState === "format_selection" && (
                <motion.div key="format" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col p-8">
                  <h2 className="text-3xl font-black uppercase mb-8">SELECT FORMAT</h2>
                  
                  <div className="grid grid-cols-2 gap-4 mb-10">
                    {[{ id: 'csv', label: 'CSV' }, { id: 'xlsx', label: 'EXCEL' }, { id: 'ofx', label: 'OFX' }, { id: 'qfx', label: 'QFX' }].map((format) => (
                      <button key={format.id} onClick={() => setTargetFormat(format.id)} className={clsx("p-6 border-4 border-black text-center transition-all font-black text-2xl uppercase", targetFormat === format.id ? "bg-[#00c853] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1" : "bg-white hover:bg-[#ffde59] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1")}>
                        {format.label}
                      </button>
                    ))}
                  </div>
                  <button onClick={handleProcess} className="w-full py-4 border-4 border-black bg-[#4a90e2] text-black font-black text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2">
                    START EXTRACTION
                  </button>
                  <button onClick={resetFlow} className="mt-6 font-bold uppercase hover:underline decoration-4 underline-offset-4 text-gray-500">CANCEL</button>
                </motion.div>
              )}

              {processingState === "processing" && (
                <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[#4a90e2]/10">
                  <div className="relative mb-10">
                    <div className="w-32 h-32 border-8 border-black border-dashed rounded-full animate-[spin_4s_linear_infinite] flex items-center justify-center bg-[#ffde59]"></div>
                    <div className="absolute inset-0 flex items-center justify-center"><FileText size={48} strokeWidth={3} /></div>
                  </div>
                  <h3 className="text-3xl font-black uppercase mb-4">PROCESSING</h3>
                  <p className="font-bold text-xl uppercase bg-black text-white px-4 py-2">{loadingText}</p>
                </motion.div>
              )}

              {processingState === "complete" && (
                <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-[#00c853]/10">
                  <div className="w-32 h-32 border-8 border-black rounded-full bg-[#00c853] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-8"><CheckCircle size={64} strokeWidth={3} /></div>
                  <h3 className="text-4xl font-black uppercase mb-4">SUCCESS!</h3>
                  <p className="font-bold text-gray-600 mb-10 uppercase">FILE IS READY TO DOWNLOAD</p>
                  
                  <button 
                    onClick={() => {
                      const csvContent = "Date,Description,Amount,Balance\\n" +
                                       "2023-10-01,Opening Balance,,5000.00\\n" +
                                       "2023-10-02,ACH Electronic Credit,3200.00,8200.00\\n" +
                                       "2023-10-05,STARBUCKS STORE,-5.40,8194.60\\n" +
                                       "2023-10-15,Withdrawal ATM,-100.00,8025.10\\n";
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                      const link = document.createElement("a");
                      link.href = URL.createObjectURL(blob);
                      link.setAttribute("download", "extracted_statement_demo.csv");
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="w-full py-5 border-4 border-black bg-[#ffde59] text-black font-black text-xl uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-3 mb-6"
                  >
                    <Download size={28} strokeWidth={3} /> DOWNLOAD {targetFormat.toUpperCase()}
                  </button>
                  <button onClick={resetFlow} className="font-bold uppercase hover:underline decoration-4 underline-offset-4 text-gray-600">CONVERT ANOTHER FILE</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Trust Signals Marquee / Grid */}
      <section className="py-16 bg-[#ff5757] border-y-8 border-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="flex items-center gap-4 bg-white border-4 border-black px-6 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-2">
            <ShieldCheck size={32} strokeWidth={3} />
            <div>
              <h3 className="font-black uppercase text-xl">BANK-GRADE SECURITY</h3>
              <p className="font-bold text-sm uppercase">Processed in RAM</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white border-4 border-black px-6 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-1">
            <Building size={32} strokeWidth={3} />
            <div>
              <h3 className="font-black uppercase text-xl">TRUSTED BY CPAS</h3>
              <p className="font-bold text-sm uppercase">Used by Institutions</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white border-4 border-black px-6 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-1">
            <Lock size={32} strokeWidth={3} />
            <div>
              <h3 className="font-black uppercase text-xl">100% ANONYMOUS</h3>
              <p className="font-bold text-sm uppercase">No account required</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">PRICING</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {/* Anonymous */}
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="bg-black text-white self-start px-4 py-1 font-black uppercase mb-6">ONE-OFF</div>
              <h3 className="text-4xl font-black uppercase mb-4">ANONYMOUS</h3>
              <div className="text-6xl font-black mb-8 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] text-[#00c853]">FREE</div>
              <ul className="space-y-4 mb-10 font-bold uppercase flex-1">
                <li className="flex items-center gap-3"><CheckCircle size={24} strokeWidth={3} /> 1 PAGE / DAY</li>
                <li className="flex items-center gap-3"><CheckCircle size={24} strokeWidth={3} /> CSV EXPORT</li>
                <li className="flex items-center gap-3"><CheckCircle size={24} strokeWidth={3} /> NO ACCOUNT</li>
              </ul>
              <button className="w-full py-4 border-4 border-black bg-white font-black text-xl uppercase hover:bg-black hover:text-white transition-colors">USE NOW</button>
            </div>

            {/* Registered */}
            <div className="bg-[#ffde59] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 md:-translate-y-6">
              <div className="bg-black text-[#ffde59] self-start px-4 py-1 font-black uppercase mb-6">PERSONAL</div>
              <h3 className="text-4xl font-black uppercase mb-4">REGISTERED</h3>
              <div className="text-6xl font-black mb-8 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] text-white">FREE</div>
              <ul className="space-y-4 mb-10 font-bold uppercase flex-1">
                <li className="flex items-center gap-3"><CheckCircle size={24} strokeWidth={3} /> 5 PAGES / DAY</li>
                <li className="flex items-center gap-3"><CheckCircle size={24} strokeWidth={3} /> CSV & EXCEL</li>
                <li className="flex items-center gap-3"><CheckCircle size={24} strokeWidth={3} /> DASHBOARD HISTORY</li>
              </ul>
              <Link href="/signup" className="w-full py-4 border-4 border-black bg-white font-black text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex justify-center">SIGN UP FREE</Link>
            </div>

            {/* Pro */}
            <div className="bg-[#4a90e2] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="bg-black text-[#4a90e2] self-start px-4 py-1 font-black uppercase mb-6">FOR CPAS</div>
              <h3 className="text-4xl font-black uppercase mb-4">PRO</h3>
              <div className="text-6xl font-black mb-8 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] text-white">PAID</div>
              <ul className="space-y-4 mb-10 font-bold uppercase flex-1">
                <li className="flex items-center gap-3"><CheckCircle size={24} strokeWidth={3} /> UNLIMITED PAGES</li>
                <li className="flex items-center gap-3"><CheckCircle size={24} strokeWidth={3} /> OFX & QFX</li>
                <li className="flex items-center gap-3"><CheckCircle size={24} strokeWidth={3} /> SMART RULES</li>
              </ul>
              <button className="w-full py-4 border-4 border-black bg-white font-black text-xl uppercase hover:bg-black hover:text-white transition-colors">VIEW PLANS</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 border-t-8 border-black bg-[#ffde59]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">STOP TYPING PDFS <br/>MANUALLY.</h2>
          <Link href="/signup" className="inline-flex items-center gap-4 px-10 py-6 border-4 border-black bg-[#00c853] text-black font-black text-2xl uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all">
            CREATE FREE ACCOUNT <ArrowRight size={32} strokeWidth={4} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16 border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white flex items-center justify-center text-black border-4 border-black"><FileSpreadsheet size={24} strokeWidth={3} /></div>
            <span className="font-black text-3xl uppercase tracking-tighter">CONVERT STATEMENT</span>
          </div>
          <div className="font-bold uppercase tracking-widest text-sm flex gap-8">
            <a href="#pricing" className="hover:text-[#ffde59]">PRICING</a>
            <Link href="/api-docs" className="hover:text-[#4a90e2]">API</Link>
            <Link href="/terms" className="hover:text-[#ff5757]">TERMS</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, FileText, Lock, CheckCircle, 
  ChevronRight, Download, ShieldCheck, Zap, 
  Building, Menu, X, ArrowRight, ChevronDown, Check
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";
import Link from "next/link";

export default function Home() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [targetFormat, setTargetFormat] = useState("csv");
  const [processingState, setProcessingState] = useState("idle");
  const [loadingText, setLoadingText] = useState("Extracting tables...");
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
    { q: "Is my financial data secure?", a: "Yes. Zero disk storage. Processed entirely in RAM and permanently deleted." },
    { q: "Do you support password-protected PDFs?", a: "Yes. We securely decrypt the file in-memory using the provided password." },
    { q: "Which banks do you support?", a: "Over 10,000 major global banks." },
    { q: "What happens if my conversion fails?", a: "It does not count against your quota. Layouts are logged to improve accuracy." },
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-neutral-200">
      {/* Navbar */}
      <nav className="w-full py-5 px-6 md:px-12 flex justify-between items-center border-b border-black bg-white sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-bold">
            <span className="text-sm">CS</span>
          </div>
          <span className="font-bold text-lg tracking-tight">Convert Statement</span>
        </Link>
        
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/api-docs" className="text-sm font-semibold hover:opacity-70 transition-opacity">API Docs</Link>
          <a href="#pricing" className="text-sm font-semibold hover:opacity-70 transition-opacity">Pricing</a>
        </div>

        <div className="hidden md:flex gap-4 items-center">
          <Link href="/login" className="text-sm font-semibold hover:opacity-70 transition-opacity">Log In</Link>
          <Link href="/signup" className="text-sm font-semibold px-6 py-2.5 bg-black text-white hover:bg-neutral-800 transition-colors">Sign Up Free</Link>
        </div>

        <button className="md:hidden p-2 text-black" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-24 md:pb-32 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Copy & Value Prop */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black text-black text-xs font-bold tracking-widest uppercase">
              99.4% Precision
            </div>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-black leading-[1.05]">
              Convert PDF <br className="hidden md:block" />Statements to CSV.
            </h1>
            <p className="text-lg text-neutral-600 max-w-lg leading-snug font-medium">
              Automated transaction extraction. Zero-storage processing built for finance teams.
            </p>
          </div>

          {/* Right Column: Uploader */}
          <div className="border-2 border-black bg-white min-h-[440px] flex flex-col w-full max-w-lg mx-auto lg:ml-auto">
            <div className="h-12 border-b-2 border-black bg-neutral-100 flex items-center px-4 gap-2">
              <div className="w-3 h-3 bg-black"></div><div className="w-3 h-3 border border-black"></div><div className="w-3 h-3 border border-black"></div>
            </div>
            <AnimatePresence mode="wait">
              {processingState === "idle" && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col p-8">
                  <h2 className="text-2xl font-bold mb-2 tracking-tight">Upload Document</h2>
                  <p className="text-sm text-neutral-500 mb-8 font-medium">Free up to 3 pages.</p>
                  <div {...getRootProps()} className={clsx("flex-1 border-2 border-dashed flex flex-col items-center justify-center p-8 transition-colors cursor-pointer group", isDragActive ? "border-black bg-neutral-100" : "border-neutral-300 hover:border-black hover:bg-neutral-50")}>
                    <input {...getInputProps()} />
                    <div className="w-16 h-16 bg-neutral-100 text-black flex items-center justify-center mb-6"><Upload size={28} /></div>
                    <p className="text-lg font-bold mb-1">Drag & drop PDF</p>
                    <p className="text-sm text-neutral-500 text-center font-medium">or click to browse</p>
                  </div>
                </motion.div>
              )}
              {processingState === "password_prompt" && (
                <motion.div key="password" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col p-8">
                  <div className="mb-8 inline-flex items-center gap-3 border border-black px-4 py-2 text-sm font-bold"><FileText size={18} /><span>{file?.name}</span></div>
                  <h2 className="text-2xl font-bold mb-2 tracking-tight">Protected File?</h2>
                  <p className="text-sm text-neutral-600 mb-8 font-medium">Enter password if required.</p>
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                      <div className="relative">
                        <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-black" />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full pl-12 pr-4 py-4 bg-neutral-50 border-2 border-black focus:outline-none focus:bg-white transition-colors font-medium" />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-4 bg-black text-white font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">Continue <ArrowRight size={18} /></button>
                  </form>
                  <button onClick={resetFlow} className="mt-6 text-sm font-bold text-neutral-500 hover:text-black transition-colors uppercase tracking-wider text-center w-full">Cancel</button>
                </motion.div>
              )}
              {processingState === "format_selection" && (
                <motion.div key="format" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col p-8">
                  <h2 className="text-2xl font-bold mb-8 tracking-tight">Select Output Format</h2>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {[{ id: 'csv', label: 'CSV' }, { id: 'xlsx', label: 'EXCEL' }, { id: 'ofx', label: 'OFX' }, { id: 'qfx', label: 'QFX' }].map((format) => (
                      <button key={format.id} onClick={() => setTargetFormat(format.id)} className={clsx("p-5 border-2 text-left transition-colors font-bold tracking-widest", targetFormat === format.id ? "border-black bg-black text-white" : "border-neutral-200 text-neutral-500 hover:border-black hover:text-black")}>
                        {format.label}
                      </button>
                    ))}
                  </div>
                  <button onClick={handleProcess} className="w-full py-4 bg-black text-white font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 mt-auto">Start Extraction</button>
                  <button onClick={resetFlow} className="mt-6 text-sm font-bold text-neutral-500 hover:text-black transition-colors uppercase tracking-wider text-center w-full">Cancel</button>
                </motion.div>
              )}
              {processingState === "processing" && (
                <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 border-4 border-neutral-200 border-t-black animate-spin mb-8"></div>
                  <h3 className="text-2xl font-bold mb-2 tracking-tight">Processing</h3>
                  <p className="text-black font-semibold tracking-wide">{loadingText}</p>
                </motion.div>
              )}
              {processingState === "complete" && (
                <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 bg-black text-white flex items-center justify-center mb-8"><CheckCircle size={32} /></div>
                  <h3 className="text-3xl font-bold mb-3 tracking-tight">Complete</h3>
                  <p className="text-neutral-600 mb-10 font-medium">Structured data ready.</p>
                  <button 
                    onClick={() => {
                      const csvContent = "Date,Description,Amount,Balance\\n" +
                                       "2023-10-01,Opening Balance,,5000.00\\n" +
                                       "2023-10-02,ACH Electronic Credit from GUSTO PAYROLL,3200.00,8200.00\\n" +
                                       "2023-10-05,STARBUCKS STORE #12345,-5.40,8194.60\\n" +
                                       "2023-10-08,Amazon Web Services AWS.AMAZON.CO,-45.00,8149.60\\n" +
                                       "2023-10-12,UBER *TRIP,-24.50,8125.10\\n" +
                                       "2023-10-15,Withdrawal ATM,-100.00,8025.10\\n";
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                      const link = document.createElement("a");
                      link.href = URL.createObjectURL(blob);
                      link.setAttribute("download", "extracted_statement_demo.csv");
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="w-full py-4 bg-black text-white font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 mb-6"
                  >
                    <Download size={20} /> Download {targetFormat.toUpperCase()}
                  </button>
                  <button onClick={resetFlow} className="text-sm font-bold text-neutral-500 hover:text-black uppercase tracking-widest">Convert another</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="py-24 border-t-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-2 border-black">
            <div className="flex flex-col p-8 border-b-2 md:border-b-0 md:border-r-2 border-black">
              <ShieldCheck size={36} strokeWidth={1.5} className="mb-6" />
              <h3 className="text-lg font-bold mb-2 tracking-tight">Security</h3>
              <p className="text-sm font-medium text-neutral-600">Zero-storage policy. Ram-only.</p>
            </div>
            <div className="flex flex-col p-8 border-b-2 md:border-b-0 md:border-r-2 border-black">
              <Zap size={36} strokeWidth={1.5} className="mb-6" />
              <h3 className="text-lg font-bold mb-2 tracking-tight">Accuracy</h3>
              <p className="text-sm font-medium text-neutral-600">99.4% data extraction precision.</p>
            </div>
            <div className="flex flex-col p-8 border-b-2 md:border-b-0 md:border-r-2 border-black">
              <Building size={36} strokeWidth={1.5} className="mb-6" />
              <h3 className="text-lg font-bold mb-2 tracking-tight">Institutions</h3>
              <p className="text-sm font-medium text-neutral-600">Trusted by CPAs globally.</p>
            </div>
            <div className="flex flex-col p-8">
              <Lock size={36} strokeWidth={1.5} className="mb-6" />
              <h3 className="text-lg font-bold mb-2 tracking-tight">Anonymous</h3>
              <p className="text-sm font-medium text-neutral-600">No account required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-neutral-50 border-t-2 border-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tighter">Pricing</h2>
            <div className="inline-flex items-center border-2 border-black p-1 bg-white">
              <button onClick={() => setAnnualBilling(false)} className={clsx("px-6 py-2 text-sm font-bold tracking-wide uppercase transition-colors", !annualBilling ? "bg-black text-white" : "text-black hover:bg-neutral-100")}>Monthly</button>
              <button onClick={() => setAnnualBilling(true)} className={clsx("px-6 py-2 text-sm font-bold tracking-wide uppercase transition-colors", annualBilling ? "bg-black text-white" : "text-black hover:bg-neutral-100")}>Annually</button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl">
            {/* Anonymous Plan */}
            <div className="bg-white border-2 border-black p-10 flex flex-col">
              <h3 className="text-3xl font-bold mb-2 tracking-tight">Anonymous</h3>
              <p className="text-neutral-500 text-sm mb-10 font-medium">For one-off extractions.</p>
              <div className="mb-10"><span className="text-5xl font-bold tracking-tighter">Free</span></div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-4 text-sm font-medium"><div className="w-5 h-5 bg-black flex items-center justify-center text-white"><Check size={14} /></div> 1 page / day</li>
                <li className="flex items-center gap-4 text-sm font-medium"><div className="w-5 h-5 bg-black flex items-center justify-center text-white"><Check size={14} /></div> CSV export</li>
              </ul>
              <Link href="/" className="w-full py-4 text-center border-2 border-black text-black font-bold hover:bg-black hover:text-white transition-colors">Upload Now</Link>
            </div>
            {/* Registered Plan */}
            <div className="bg-white border-2 border-black p-10 flex flex-col">
              <h3 className="text-3xl font-bold mb-2 tracking-tight">Registered</h3>
              <p className="text-neutral-500 text-sm mb-10 font-medium">For personal finance.</p>
              <div className="mb-10"><span className="text-5xl font-bold tracking-tighter">Free</span></div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-4 text-sm font-medium"><div className="w-5 h-5 bg-black flex items-center justify-center text-white"><Check size={14} /></div> 5 pages / day</li>
                <li className="flex items-center gap-4 text-sm font-medium"><div className="w-5 h-5 bg-black flex items-center justify-center text-white"><Check size={14} /></div> CSV & Excel exports</li>
                <li className="flex items-center gap-4 text-sm font-medium"><div className="w-5 h-5 bg-black flex items-center justify-center text-white"><Check size={14} /></div> Dashboard history</li>
              </ul>
              <Link href="/signup" className="w-full py-4 text-center bg-black text-white font-bold hover:bg-neutral-800 transition-colors">Sign Up Free</Link>
            </div>
            {/* Pro Plan */}
            <div className="bg-black text-white border-2 border-black p-10 flex flex-col">
              <h3 className="text-3xl font-bold mb-2 tracking-tight">Pro</h3>
              <p className="text-neutral-400 text-sm mb-10 font-medium">For CPAs and finance teams.</p>
              <div className="mb-10"><span className="text-5xl font-bold tracking-tighter">Subscribe</span></div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-4 text-sm font-medium"><div className="w-5 h-5 bg-white flex items-center justify-center text-black"><Check size={14} /></div> Bulk processing</li>
                <li className="flex items-center gap-4 text-sm font-medium"><div className="w-5 h-5 bg-white flex items-center justify-center text-black"><Check size={14} /></div> OFX & QFX exports</li>
                <li className="flex items-center gap-4 text-sm font-medium"><div className="w-5 h-5 bg-white flex items-center justify-center text-black"><Check size={14} /></div> Auto-categorization</li>
              </ul>
              <button className="w-full py-4 bg-white text-black font-bold hover:bg-neutral-200 transition-colors">View Plans</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <span className="font-bold text-2xl tracking-tight mb-4 block">Convert Statement</span>
            <p className="text-sm text-neutral-400 font-medium">Extraction for professionals.</p>
          </div>
          <div><h4 className="font-bold mb-6 tracking-wide uppercase text-sm">Product</h4><ul className="space-y-3 text-sm text-neutral-400 font-medium"><li><a href="#features" className="hover:text-white transition-colors">Features</a></li><li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li></ul></div>
          <div><h4 className="font-bold mb-6 tracking-wide uppercase text-sm">Resources</h4><ul className="space-y-3 text-sm text-neutral-400 font-medium"><li><Link href="/api-docs" className="hover:text-white transition-colors">API Docs</Link></li><li><Link href="/login" className="hover:text-white transition-colors">Log In</Link></li></ul></div>
          <div><h4 className="font-bold mb-6 tracking-wide uppercase text-sm">Legal</h4><ul className="space-y-3 text-sm text-neutral-400 font-medium"><li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li><li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li></ul></div>
        </div>
      </footer>
    </div>
  );
}

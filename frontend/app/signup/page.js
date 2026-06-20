"use client";

import { useState } from "react";
import Link from "next/link";
import { FileSpreadsheet, Mail, Lock, User, ArrowRight, CheckCircle } from "lucide-react";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-24">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white font-bold">
              <FileSpreadsheet size={18} />
            </div>
            <span className="font-bold text-xl text-slate-900">Convert Statement</span>
          </Link>

          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Create your account</h2>
          <p className="text-slate-600 mb-8">Start extracting PDF tables in 15 seconds. No credit card required.</p>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" required
                  value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Rahul Sharma"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Create a strong password"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-blue-700 text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-700/20 flex items-center justify-center gap-2">
              Create Account <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-6 text-xs text-slate-500 text-center">
            By signing up, you agree to our <a href="#" className="underline hover:text-slate-800">Terms of Service</a> and <a href="#" className="underline hover:text-slate-800">Privacy Policy</a>.
          </p>

          <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account? <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Right side - Benefits */}
      <div className="hidden lg:flex flex-1 bg-slate-100 flex-col justify-center px-16 relative">
        <div className="max-w-md mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 mb-8">What you get for free</h3>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <CheckCircle size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">3 Free Pages</h4>
                <p className="text-slate-600 text-sm mt-1">Convert up to 3 pages of any supported bank statement completely free to verify accuracy.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <CheckCircle size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Zero Data Storage</h4>
                <p className="text-slate-600 text-sm mt-1">We never store your PDFs or transaction data on our servers. Processing happens entirely in RAM.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <CheckCircle size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">CSV & Excel Exports</h4>
                <p className="text-slate-600 text-sm mt-1">Instantly download perfectly structured, clean spreadsheet files ready for your workflows.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

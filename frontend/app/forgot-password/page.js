"use client";

import { useState } from "react";
import Link from "next/link";
import { FileSpreadsheet, Mail, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-24">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white font-bold">
              <FileSpreadsheet size={18} />
            </div>
            <span className="font-bold text-xl text-slate-900">Convert Statement</span>
          </Link>

          {!submitted ? (
            <>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Reset password</h2>
              <p className="text-slate-600 mb-8">Enter your email address and we'll send you a link to reset your password.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="email" required
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full py-3 bg-blue-700 text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-700/20 flex items-center justify-center gap-2">
                  Send reset link <ArrowRight size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="text-center bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Check your email</h2>
              <p className="text-slate-600 mb-8">We've sent a password reset link to <strong>{email}</strong>.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Didn't receive the email? Click to resend.
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link href="/login" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft size={16} /> Back to log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { FileSpreadsheet, ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      <nav className="w-full py-4 px-6 md:px-12 flex items-center border-b border-slate-200 bg-white">
        <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-blue-700 font-medium transition-colors">
          <ArrowLeft size={18} /> Back to Home
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white font-bold">
            <FileSpreadsheet size={18} />
          </div>
          <span className="font-bold text-xl text-slate-900 hidden sm:inline">Convert Statement</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Terms of Service</h1>
        <p className="text-slate-500 mb-12">Last updated: June 20, 2026</p>

        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-p:text-slate-600">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Convert Statement, you agree to be bound by these Terms of Service. 
            If you disagree with any part of the terms, you do not have permission to access the service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Convert Statement provides software tools to extract data from financial PDF documents and convert them into structured formats like CSV, Excel, OFX, and QFX.
          </p>

          <h2>3. Subscriptions and Billing</h2>
          <p>
            Some aspects of the Service are billed on a subscription basis. You will be billed in advance on a recurring schedule. 
            You may cancel your subscription at any time, but no refunds will be issued for partial months.
          </p>

          <h2>4. User Responsibilities</h2>
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>Process illegally obtained financial documents.</li>
            <li>Attempt to reverse engineer the extraction engine or APIs.</li>
            <li>Share your account credentials with unauthorized users outside of permitted Agency Workspaces.</li>
          </ul>

          <h2>5. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of Convert Statement and its licensors.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            In no event shall Convert Statement, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
          <p>
            While we strive for 99.4% extraction accuracy, you are ultimately responsible for verifying the accuracy of the converted data before using it for tax, accounting, or legal purposes.
          </p>

          <h2>7. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at <a href="mailto:legal@convertstatement.com" className="text-blue-600 hover:underline">legal@convertstatement.com</a>.
          </p>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <p>© {new Date().getFullYear()} Convert Statement. All rights reserved.</p>
      </footer>
    </div>
  );
}

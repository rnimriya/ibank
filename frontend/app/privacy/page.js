"use client";

import Link from "next/link";
import { FileSpreadsheet, ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Privacy Policy</h1>
        <p className="text-slate-500 mb-12">Last updated: June 20, 2026</p>

        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-p:text-slate-600">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Convert Statement. We respect your privacy and are committed to protecting your personal and financial data. 
            This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and SaaS application.
          </p>

          <h2>2. Zero-Storage Policy</h2>
          <p>
            The core feature of our service is data extraction from bank statements. We strictly adhere to a <strong>Zero-Storage Policy</strong> for your documents. 
            When you upload a PDF for processing:
          </p>
          <ul>
            <li>The file is processed entirely in-memory (RAM).</li>
            <li>No part of the file, nor its extracted data, is saved to our disks or databases.</li>
            <li>Once the conversion is complete and the resulting file is downloaded, the memory is immediately cleared.</li>
          </ul>

          <h2>3. Information We Collect</h2>
          <p>We only collect the information necessary to provide and improve our services:</p>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, and encrypted passwords when you register.</li>
            <li><strong>Payment Information:</strong> Processed securely via our payment providers (e.g., Razorpay/Stripe). We do not store full credit card details.</li>
            <li><strong>Usage Data:</strong> Aggregated metrics such as the number of pages converted, error rates, and bank template success rates to improve our extraction engine.</li>
          </ul>

          <h2>4. How We Use Your Information</h2>
          <p>We use your account and usage information to:</p>
          <ul>
            <li>Manage your subscription and account access.</li>
            <li>Provide customer support.</li>
            <li>Improve the accuracy of our parsing engine by analyzing generic failure logs.</li>
          </ul>

          <h2>5. Data Security</h2>
          <p>
            We implement industry-standard security measures, including SSL/TLS encryption for all data transmission. 
            Our infrastructure is hosted on secure cloud providers with strict access controls.
          </p>

          <h2>6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@convertstatement.com" className="text-blue-600 hover:underline">privacy@convertstatement.com</a>.
          </p>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <p>© {new Date().getFullYear()} Convert Statement. All rights reserved.</p>
      </footer>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Key, Save, Shield, User } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500">Manage your account preferences and API keys.</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Profile
        </button>
        <button 
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'api' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          API Keys
        </button>
        <button 
          onClick={() => setActiveTab('integrations')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'integrations' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Integrations
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8">
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><User size={20} className="text-slate-400"/> Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                  <input type="text" defaultValue="Rahul Sharma" className="w-full px-4 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                  <input type="email" defaultValue="demo@convertstatement.com" disabled className="w-full px-4 py-2.5 bg-slate-50 text-slate-500 border border-slate-200 rounded-lg cursor-not-allowed" />
                  <p className="text-xs text-slate-400 mt-1.5">Contact support to change your email address.</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Shield size={20} className="text-slate-400"/> Security</h3>
              <div className="max-w-md space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                  <input type="password" placeholder="New strong password" className="w-full px-4 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button onClick={() => toast.success("Password updated securely.")} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-900 transition-colors">
                  Update Password
                </button>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button onClick={() => toast.success("Profile changes saved.")} className="flex items-center gap-2 bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-800 transition-colors shadow-sm">
                <Save size={18} /> Save Changes
              </button>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2"><Key size={20} className="text-slate-400"/> API Tokens</h3>
                <p className="text-sm text-slate-500">Use these tokens to access the Convert Statement API for automated workflows.</p>
              </div>
              <button onClick={() => toast.success("New API key generated!")} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors">
                Generate New Key
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900 text-sm">Production Key</p>
                <p className="text-xs font-mono text-slate-500 mt-1">sk_live_***************************8f2a</p>
                <p className="text-xs text-slate-400 mt-2">Created on May 15, 2026</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toast("API Key revoked.", { icon: "🚫" })} className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded text-xs font-semibold hover:bg-slate-50">Revoke</button>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900 text-sm">Development Key</p>
                <p className="text-xs font-mono text-slate-500 mt-1">sk_test_***************************4a91</p>
                <p className="text-xs text-slate-400 mt-2">Created on May 15, 2026</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toast("API Key revoked.", { icon: "🚫" })} className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded text-xs font-semibold hover:bg-slate-50">Revoke</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /><path d="M1 1h22v22H1z" fill="none" /></svg>
                Google Workspace
              </h3>
              <p className="text-sm text-slate-500">Connect your Google account to automatically sync parsed data directly to Google Sheets.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15.01l1.41 1.41L11 14.83V19h2v-4.17l1.59 1.59L16 15.01 12.01 11z"/></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Google Sheets Auto-Sync</h4>
                    <p className="text-sm text-slate-500 mt-1">Automatically create a new sheet for every parsed statement.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> Connected
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-sm text-slate-600">Currently syncing to: <strong className="text-slate-900">demo@convertstatement.com</strong></p>
                <div className="mt-4 flex gap-3">
                  <button onClick={() => toast("Opening Google Drive folder selector...")} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors">
                    Configure Target Folder
                  </button>
                  <button onClick={() => toast("Google account disconnected.", { icon: "🚫" })} className="px-4 py-2 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors">
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

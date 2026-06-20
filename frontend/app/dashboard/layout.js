"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FileSpreadsheet, LayoutDashboard, FileText, Settings, 
  CreditCard, LogOut, Upload, Menu, X, Users, Wand2, PieChart
} from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { Toaster } from "react-hot-toast";
import SignOutButton from "../../components/SignOutButton";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Conversions", href: "/dashboard/conversions", icon: FileText },
    { name: "Auto-Rules", href: "/dashboard/rules", icon: Wand2 },
    { name: "Insights", href: "/dashboard/insights", icon: PieChart },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Team (Agency)", href: "/dashboard/team", icon: Users },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Toaster position="top-right" />
      
      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={clsx(
        "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transition-transform lg:translate-x-0 lg:static lg:block flex flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold">
              <FileSpreadsheet size={18} />
            </div>
            <span className="font-bold text-lg">Convert Statement</span>
          </Link>
          <button className="ml-auto lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-blue-600/10 text-blue-400" : "hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800 rounded-xl p-4 mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Pro Plan</p>
            <div className="w-full bg-slate-700 h-2 rounded-full mb-2 overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: '45%' }}></div>
            </div>
            <p className="text-xs text-slate-300">135 / 300 pages used</p>
          </div>
          <SignOutButton className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
          <button className="lg:hidden text-slate-500 hover:text-slate-700" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          
          <div className="ml-auto flex items-center gap-4">
            <Link href="/" className="hidden sm:flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm shadow-blue-700/20">
              <Upload size={16} /> New Conversion
            </Link>
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm border border-slate-300">
              RS
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

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
    <div className="min-h-screen bg-[#fafafa] font-sans text-zinc-900 flex">
      <Toaster position="top-right" />
      
      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={clsx(
        "fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 text-zinc-400 transition-transform lg:translate-x-0 lg:static lg:block flex flex-col border-r border-white/10",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2.5 text-white group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <FileSpreadsheet size={16} />
            </div>
            <span className="font-extrabold tracking-tight text-lg">Convert Statement</span>
          </Link>
          <button className="ml-auto lg:hidden text-zinc-500 hover:text-white transition-colors" onClick={() => setSidebarOpen(false)}>
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
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                  isActive ? "bg-white/10 text-white shadow-sm" : "hover:bg-white/5 hover:text-zinc-200"
                )}
              >
                <Icon size={18} className={clsx(isActive ? "text-indigo-400" : "text-zinc-500")} />
                {item.name}
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="bg-zinc-900/50 rounded-2xl p-4 mb-4 border border-white/5">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pro Plan</p>
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">Active</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full mb-3 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full" style={{ width: '45%' }}></div>
            </div>
            <p className="text-xs text-zinc-400 font-medium">135 / 300 pages used</p>
          </div>
          <SignOutButton className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-zinc-500 hover:text-white transition-colors rounded-xl hover:bg-white/5" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-white/60 backdrop-blur-xl border-b border-zinc-200/50 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 sticky top-0 z-30">
          <button className="lg:hidden text-zinc-500 hover:text-zinc-900" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          
          <div className="ml-auto flex items-center gap-5">
            <Link href="/" className="hidden sm:flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
              <Upload size={16} /> New Conversion
            </Link>
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-xs ring-2 ring-white shadow-sm">
              RS
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}

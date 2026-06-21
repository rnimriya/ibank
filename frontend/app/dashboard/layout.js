"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FileSpreadsheet, LayoutDashboard, FileText, Settings, 
  CreditCard, Upload, Menu, X, Users, Wand2, PieChart
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
    <div className="min-h-screen bg-neutral-50 flex font-sans text-black selection:bg-neutral-200">
      <Toaster position="top-right" />
      
      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={clsx(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-black transition-transform lg:translate-x-0 lg:static lg:block flex flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-black">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-bold">
              <span className="text-sm">CS</span>
            </div>
            <span className="font-bold text-lg tracking-tight">Convert Statement</span>
          </Link>
          <button className="ml-auto lg:hidden text-black hover:text-neutral-600 transition-colors" onClick={() => setSidebarOpen(false)}>
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
                  "flex items-center gap-3 px-4 py-3 text-sm font-bold transition-colors tracking-wide",
                  isActive ? "bg-black text-white" : "text-neutral-500 hover:bg-neutral-100 hover:text-black"
                )}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-black">
          <div className="bg-neutral-50 border-2 border-black p-4 mb-4">
            <p className="text-xs font-bold uppercase tracking-widest mb-3">Pro Plan</p>
            <div className="w-full bg-neutral-200 h-2 mb-3">
              <div className="bg-black h-full" style={{ width: '45%' }}></div>
            </div>
            <p className="text-xs font-medium text-neutral-600">135 / 300 pages used</p>
          </div>
          <SignOutButton className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-neutral-500 hover:text-black transition-colors hover:bg-neutral-100 uppercase tracking-widest" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-black flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
          <button className="lg:hidden text-black hover:text-neutral-600 transition-colors" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          
          <div className="ml-auto flex items-center gap-6">
            <Link href="/" className="hidden sm:flex items-center gap-2 bg-black text-white px-5 py-2 text-sm font-bold hover:bg-neutral-800 transition-colors">
              <Upload size={16} /> New Extraction
            </Link>
            <div className="w-9 h-9 bg-neutral-100 flex items-center justify-center text-black font-bold text-sm border-2 border-black">
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

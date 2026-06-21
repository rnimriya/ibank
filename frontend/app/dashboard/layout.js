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
    { name: "DASHBOARD", href: "/dashboard", icon: LayoutDashboard },
    { name: "CONVERSIONS", href: "/dashboard/conversions", icon: FileText },
    { name: "AUTO-RULES", href: "/dashboard/rules", icon: Wand2 },
    { name: "INSIGHTS", href: "/dashboard/insights", icon: PieChart },
    { name: "BILLING", href: "/dashboard/billing", icon: CreditCard },
    { name: "TEAM", href: "/dashboard/team", icon: Users },
    { name: "SETTINGS", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f4f4f0] text-black font-sans selection:bg-[#ffde59] selection:text-black flex">
      <Toaster position="top-right" 
        toastOptions={{
          className: 'border-4 border-black font-bold uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
        }}
      />
      
      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={clsx(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white transition-transform lg:translate-x-0 lg:static lg:block flex flex-col border-r-4 border-black",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-20 flex items-center px-6 border-b-4 border-black bg-[#ffde59]">
          <Link href="/" className="flex items-center gap-3 text-black group">
            <div className="w-10 h-10 border-4 border-black bg-white flex items-center justify-center font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-0.5 transition-all">
              <FileSpreadsheet size={20} strokeWidth={3} />
            </div>
            <span className="font-black text-xl tracking-tighter uppercase">Convert Statement</span>
          </Link>
          <button className="ml-auto lg:hidden p-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white hover:bg-[#ff5757] transition-colors" onClick={() => setSidebarOpen(false)}>
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={clsx(
                  "flex items-center gap-4 px-4 py-3 border-4 text-sm font-black transition-all uppercase",
                  isActive 
                    ? "border-black bg-[#00c853] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1" 
                    : "border-transparent hover:border-black hover:bg-[#4a90e2]/10 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"
                )}
              >
                <Icon size={20} strokeWidth={3} />
                {item.name}
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t-4 border-black bg-[#f4f4f0]">
          <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-black uppercase">PRO PLAN</p>
              <span className="text-xs font-black bg-[#ffde59] border-2 border-black px-2 py-0.5">ACTIVE</span>
            </div>
            <div className="w-full bg-white border-2 border-black h-4 mb-2 overflow-hidden flex">
              <div className="bg-[#ff5757] h-full border-r-2 border-black" style={{ width: '45%' }}></div>
            </div>
            <p className="text-xs font-bold uppercase">135 / 300 PAGES USED</p>
          </div>
          <div className="border-4 border-black bg-white hover:bg-[#ff5757] hover:text-white transition-colors cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1">
             <SignOutButton className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-black uppercase" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 bg-white border-b-4 border-black flex items-center justify-between px-6 lg:px-10 shrink-0 sticky top-0 z-30">
          <button className="lg:hidden p-2 border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#ffde59] transition-colors" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} strokeWidth={3} />
          </button>
          
          <div className="ml-auto flex items-center gap-6">
            <Link href="/" className="hidden sm:flex items-center gap-2 bg-[#4a90e2] border-4 border-black text-black px-6 py-3 font-black text-sm uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
              <Upload size={18} strokeWidth={3} /> NEW CONVERSION
            </Link>
            <div className="w-12 h-12 border-4 border-black bg-[#ffde59] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-black font-black uppercase text-lg">
              RS
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-6xl mx-auto">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
}

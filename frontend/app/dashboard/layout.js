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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Conversions", href: "/dashboard/conversions", icon: FileText },
    { name: "Rules", href: "/dashboard/rules", icon: Wand2 },
    { name: "Insights", href: "/dashboard/insights", icon: PieChart },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7] font-sans text-[#1d1d1f]">
      <Toaster position="top-center" />
      
      {/* Floating Island Navigation */}
      <nav className="w-full flex justify-center py-6 px-4 sticky top-0 z-50 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-xl border border-black/[0.04] shadow-sm rounded-[24px] p-2 flex items-center justify-between w-full max-w-6xl pointer-events-auto">
          
          <div className="flex items-center gap-6 pl-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <FileSpreadsheet size={16} strokeWidth={3} />
              </div>
              <span className="font-bold tracking-tight text-lg hidden sm:block">ConvertStatement</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all",
                      isActive ? "bg-black text-white" : "text-gray-500 hover:text-black hover:bg-gray-100"
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 pr-2">
            <Link href="/" className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform shadow-md shadow-blue-600/20">
              <Upload size={16} /> New Convert
            </Link>
            
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-black font-bold text-sm border border-gray-200">
              RS
            </div>

            <button className="lg:hidden p-2 text-black" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white/80 backdrop-blur-xl flex flex-col p-6">
          <div className="flex justify-between items-center mb-12">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <FileSpreadsheet size={20} strokeWidth={3} />
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-gray-100 rounded-full">
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    "flex items-center gap-4 px-6 py-4 rounded-[24px] text-xl font-bold transition-all",
                    isActive ? "bg-black text-white" : "bg-gray-100 text-gray-500"
                  )}
                >
                  <Icon size={24} />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Main Content constraints */}
      <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 pb-24">
        {children}
      </main>
    </div>
  );
}

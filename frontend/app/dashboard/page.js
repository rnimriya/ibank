import { 
  FileSpreadsheet, Upload, Download, ArrowUpRight, 
  ArrowDownRight, CheckCircle, Clock, MoreVertical, FileText
} from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "../../lib/prisma";
import { redirect } from "next/navigation";
import DownloadButton from "../../components/DownloadButton";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscription: true,
      conversions: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const { subscription, conversions } = user;
  const pagesUsed = subscription?.pagesUsed || 0;
  const pagesLimit = subscription?.pagesLimit || 3;
  const usagePercentage = Math.min(100, Math.round((pagesUsed / pagesLimit) * 100));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-1">Welcome back, {user.name?.split(" ")[0] || "User"}</h1>
          <p className="text-sm font-medium text-zinc-500">Here's what's happening with your conversions today.</p>
        </div>
        <Link 
          href="/"
          className="flex items-center gap-2 bg-zinc-900 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10 hover:-translate-y-0.5"
        >
          <Upload size={18} /> Convert New PDF
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-[20px] p-6 border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-500 opacity-50"></div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50/80 flex items-center justify-center text-indigo-600 border border-indigo-100/50">
              <FileSpreadsheet size={24} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
              <ArrowUpRight size={14} /> {usagePercentage}%
            </span>
          </div>
          <h3 className="text-zinc-500 text-sm font-semibold relative z-10">Pages Converted</h3>
          <p className="text-4xl font-extrabold tracking-tight text-zinc-900 mt-2 relative z-10">{pagesUsed} <span className="text-base text-zinc-400 font-medium">/ {pagesLimit}</span></p>
        </div>

        <div className="bg-white rounded-[20px] p-6 border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500 opacity-50"></div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50/80 flex items-center justify-center text-emerald-600 border border-emerald-100/50">
              <CheckCircle size={24} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
              <ArrowUpRight size={14} /> 4%
            </span>
          </div>
          <h3 className="text-zinc-500 text-sm font-semibold relative z-10">Success Rate</h3>
          <p className="text-4xl font-extrabold tracking-tight text-zinc-900 mt-2 relative z-10">99.8%</p>
        </div>

        <div className="bg-white rounded-[20px] p-6 border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-50 rounded-full group-hover:scale-150 transition-transform duration-500 opacity-50"></div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-rose-50/80 flex items-center justify-center text-rose-600 border border-rose-100/50">
              <Clock size={24} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full">
              <ArrowDownRight size={14} /> 2s
            </span>
          </div>
          <h3 className="text-zinc-500 text-sm font-semibold relative z-10">Avg Processing Time</h3>
          <p className="text-4xl font-extrabold tracking-tight text-zinc-900 mt-2 relative z-10">12s</p>
        </div>
      </div>

      {/* Recent Conversions Table */}
      <div className="bg-white rounded-[20px] border border-zinc-200/60 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-100 flex justify-between items-center bg-white">
          <h2 className="text-lg font-bold text-zinc-900">Recent Conversions</h2>
          <Link href="/dashboard/conversions" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">View all</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50/50 text-zinc-500 border-b border-zinc-200/50">
              <tr>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">File Name</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Bank</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Pages</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Format</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {conversions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-zinc-500 font-medium">
                    No conversions yet. Head to the homepage to convert your first statement!
                  </td>
                </tr>
              ) : (
                conversions.map((conv) => {
                  const dateOptions = { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' };
                  const formattedDate = new Date(conv.createdAt).toLocaleDateString(undefined, dateOptions);
                  
                  return (
                    <tr key={conv.id} className="hover:bg-zinc-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shadow-sm">
                            <FileText size={16} />
                          </div>
                          <span className="font-bold text-zinc-900">{conv.fileName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-600 font-medium">{conv.bankName}</td>
                      <td className="px-6 py-4 text-zinc-600 font-medium">{conv.pagesProcessed}</td>
                      <td className="px-6 py-4 text-zinc-500 font-medium">{formattedDate}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-zinc-100 text-zinc-600 border border-zinc-200/50">
                          {conv.exportFormat}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <DownloadButton conversion={conv} className="p-2 text-zinc-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors" />
                          <button className="p-2 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

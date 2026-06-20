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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user.name?.split(" ")[0] || "User"}</h1>
          <p className="text-sm text-slate-500">Here's what's happening with your conversions today.</p>
        </div>
        <Link 
          href="/"
          className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm shadow-blue-700/20"
        >
          <Upload size={18} /> Convert New PDF
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <FileSpreadsheet size={20} />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={14} /> {usagePercentage}%
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Pages Converted</h3>
          <p className="text-3xl font-bold text-slate-900 mt-1">{pagesUsed} <span className="text-sm text-slate-400 font-normal">/ {pagesLimit}</span></p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
              <CheckCircle size={20} />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={14} /> 4%
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Success Rate</h3>
          <p className="text-3xl font-bold text-slate-900 mt-1">99.8%</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <Clock size={20} />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
              <ArrowDownRight size={14} /> 2s
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Avg Processing Time</h3>
          <p className="text-3xl font-bold text-slate-900 mt-1">12s</p>
        </div>
      </div>

      {/* Recent Conversions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">Recent Conversions</h2>
          <Link href="/dashboard/conversions" className="text-sm font-medium text-blue-600 hover:text-blue-700">View all</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold">File Name</th>
                <th className="px-6 py-3 font-semibold">Bank</th>
                <th className="px-6 py-3 font-semibold">Pages</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Format</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {conversions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    No conversions yet. Head to the homepage to convert your first statement!
                  </td>
                </tr>
              ) : (
                conversions.map((conv) => {
                  const dateOptions = { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' };
                  const formattedDate = new Date(conv.createdAt).toLocaleDateString(undefined, dateOptions);
                  
                  return (
                    <tr key={conv.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <FileText size={16} />
                          </div>
                          <span className="font-medium text-slate-800">{conv.fileName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{conv.bankName}</td>
                      <td className="px-6 py-4 text-slate-600">{conv.pagesProcessed}</td>
                      <td className="px-6 py-4 text-slate-500">{formattedDate}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                          {conv.exportFormat}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <DownloadButton conversion={conv} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors" />
                          <button className="p-1.5 text-slate-400 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors">
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

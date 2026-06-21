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
import clsx from "clsx";

const BENTO_CARD = "bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.04] p-8";

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
    <div className="space-y-8 mt-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Overview</h1>
          <p className="text-lg font-medium text-gray-500 tracking-tight">Welcome back, {user.name?.split(" ")[0] || "User"}. Here's your processing summary.</p>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={clsx(BENTO_CARD, "flex flex-col justify-between")}>
          <div className="flex justify-between items-start mb-8">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <FileSpreadsheet size={28} />
            </div>
            <span className="flex items-center gap-1 text-sm font-bold text-black bg-gray-100 px-3 py-1 rounded-full">
              <ArrowUpRight size={16} /> {usagePercentage}%
            </span>
          </div>
          <div>
            <h3 className="text-gray-500 font-semibold mb-1">Pages Converted</h3>
            <p className="text-5xl font-black tracking-tighter">{pagesUsed} <span className="text-2xl text-gray-400 font-bold">/ {pagesLimit}</span></p>
          </div>
        </div>

        <div className={clsx(BENTO_CARD, "flex flex-col justify-between")}>
          <div className="flex justify-between items-start mb-8">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <CheckCircle size={28} />
            </div>
            <span className="flex items-center gap-1 text-sm font-bold text-black bg-gray-100 px-3 py-1 rounded-full">
              <ArrowUpRight size={16} /> 4%
            </span>
          </div>
          <div>
            <h3 className="text-gray-500 font-semibold mb-1">Success Rate</h3>
            <p className="text-5xl font-black tracking-tighter">99.8%</p>
          </div>
        </div>

        <div className={clsx(BENTO_CARD, "flex flex-col justify-between")}>
          <div className="flex justify-between items-start mb-8">
            <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
              <Clock size={28} />
            </div>
            <span className="flex items-center gap-1 text-sm font-bold text-black bg-gray-100 px-3 py-1 rounded-full">
              <ArrowDownRight size={16} /> 2s
            </span>
          </div>
          <div>
            <h3 className="text-gray-500 font-semibold mb-1">Avg Processing Time</h3>
            <p className="text-5xl font-black tracking-tighter">12s</p>
          </div>
        </div>
      </div>

      {/* Recent Conversions Bento */}
      <div className={clsx(BENTO_CARD, "p-0 overflow-hidden")}>
        <div className="px-8 py-6 border-b border-black/[0.04] flex justify-between items-center bg-white">
          <h2 className="text-2xl font-bold tracking-tight">Recent Conversions</h2>
          <Link href="/dashboard/conversions" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-4 py-2 rounded-full">View all</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f5f5f7] text-gray-500">
              <tr>
                <th className="px-8 py-4 font-bold text-xs uppercase tracking-widest">File Name</th>
                <th className="px-8 py-4 font-bold text-xs uppercase tracking-widest">Bank</th>
                <th className="px-8 py-4 font-bold text-xs uppercase tracking-widest">Pages</th>
                <th className="px-8 py-4 font-bold text-xs uppercase tracking-widest">Date</th>
                <th className="px-8 py-4 font-bold text-xs uppercase tracking-widest">Format</th>
                <th className="px-8 py-4 font-bold text-xs uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {conversions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-16 text-center text-gray-500 font-medium text-lg">
                    No conversions yet. Head to the homepage to convert your first statement!
                  </td>
                </tr>
              ) : (
                conversions.map((conv) => {
                  const dateOptions = { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' };
                  const formattedDate = new Date(conv.createdAt).toLocaleDateString(undefined, dateOptions);
                  
                  return (
                    <tr key={conv.id} className="hover:bg-[#f5f5f7]/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <FileText size={20} />
                          </div>
                          <span className="font-bold text-lg">{conv.fileName}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-gray-600 font-semibold">{conv.bankName}</td>
                      <td className="px-8 py-6 text-gray-600 font-semibold">{conv.pagesProcessed}</td>
                      <td className="px-8 py-6 text-gray-500 font-semibold">{formattedDate}</td>
                      <td className="px-8 py-6">
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-black text-white">
                          {conv.exportFormat}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <DownloadButton conversion={conv} className="p-3 bg-gray-100 text-black hover:bg-blue-600 hover:text-white rounded-full transition-colors" />
                          <button className="p-3 bg-gray-100 text-black hover:bg-gray-200 rounded-full transition-colors">
                            <MoreVertical size={20} />
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

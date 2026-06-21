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
    <div className="space-y-8 font-sans text-black">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome, {user.name?.split(" ")[0] || "User"}</h1>
          <p className="text-sm font-medium text-neutral-500">Your recent extraction activity.</p>
        </div>
        <Link 
          href="/"
          className="flex items-center gap-2 bg-black text-white px-5 py-3 text-sm font-bold hover:bg-neutral-800 transition-colors"
        >
          <Upload size={16} /> New Extraction
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 border-2 border-black">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 bg-black flex items-center justify-center text-white">
              <FileSpreadsheet size={20} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-black border border-black px-2 py-1 uppercase tracking-widest bg-neutral-100">
              <ArrowUpRight size={14} /> {usagePercentage}%
            </span>
          </div>
          <h3 className="text-neutral-500 text-xs font-bold tracking-widest uppercase mb-1">Pages Converted</h3>
          <p className="text-4xl font-bold tracking-tighter">{pagesUsed} <span className="text-lg text-neutral-400 font-medium tracking-normal">/ {pagesLimit}</span></p>
        </div>

        <div className="bg-white p-6 border-2 border-black">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 bg-black flex items-center justify-center text-white">
              <CheckCircle size={20} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-black border border-black px-2 py-1 uppercase tracking-widest bg-neutral-100">
              <ArrowUpRight size={14} /> 4%
            </span>
          </div>
          <h3 className="text-neutral-500 text-xs font-bold tracking-widest uppercase mb-1">Success Rate</h3>
          <p className="text-4xl font-bold tracking-tighter">99.8%</p>
        </div>

        <div className="bg-white p-6 border-2 border-black">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 bg-black flex items-center justify-center text-white">
              <Clock size={20} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-black border border-black px-2 py-1 uppercase tracking-widest bg-neutral-100">
              <ArrowDownRight size={14} /> 2s
            </span>
          </div>
          <h3 className="text-neutral-500 text-xs font-bold tracking-widest uppercase mb-1">Avg Processing Time</h3>
          <p className="text-4xl font-bold tracking-tighter">12s</p>
        </div>
      </div>

      {/* Recent Conversions Table */}
      <div className="bg-white border-2 border-black overflow-hidden">
        <div className="px-6 py-5 border-b-2 border-black flex justify-between items-center bg-neutral-100">
          <h2 className="text-lg font-bold tracking-tight">Recent Extractions</h2>
          <Link href="/dashboard/conversions" className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-black transition-colors">View All</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-black border-b-2 border-black">
              <tr>
                <th className="px-6 py-4 font-bold tracking-widest uppercase text-xs">File Name</th>
                <th className="px-6 py-4 font-bold tracking-widest uppercase text-xs">Bank</th>
                <th className="px-6 py-4 font-bold tracking-widest uppercase text-xs">Pages</th>
                <th className="px-6 py-4 font-bold tracking-widest uppercase text-xs">Date</th>
                <th className="px-6 py-4 font-bold tracking-widest uppercase text-xs">Format</th>
                <th className="px-6 py-4 font-bold tracking-widest uppercase text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
              {conversions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-neutral-500 font-medium">
                    No extractions yet. Head to the homepage to convert your first statement.
                  </td>
                </tr>
              ) : (
                conversions.map((conv) => {
                  const dateOptions = { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' };
                  const formattedDate = new Date(conv.createdAt).toLocaleDateString(undefined, dateOptions);
                  
                  return (
                    <tr key={conv.id} className="hover:bg-neutral-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-neutral-100 border border-black flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
                            <FileText size={14} />
                          </div>
                          <span className="font-bold">{conv.fileName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-neutral-600">{conv.bankName}</td>
                      <td className="px-6 py-4 font-mono text-neutral-600">{conv.pagesProcessed}</td>
                      <td className="px-6 py-4 font-medium text-neutral-500">{formattedDate}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 border border-black bg-neutral-100 text-xs font-bold uppercase tracking-widest text-black">
                          {conv.exportFormat}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <DownloadButton conversion={conv} className="p-2 text-neutral-500 hover:text-white hover:bg-black border border-transparent hover:border-black transition-colors" />
                          <button className="p-2 text-neutral-500 hover:text-white hover:bg-black border border-transparent hover:border-black transition-colors">
                            <MoreVertical size={16} />
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

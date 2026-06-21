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
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-black mb-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            WELCOME BACK, {user.name?.split(" ")[0] || "USER"}
          </h1>
          <p className="text-lg font-bold uppercase bg-[#ffde59] border-2 border-black inline-block px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            HERE'S YOUR CONVERSION ACTIVITY TODAY.
          </p>
        </div>
        <Link 
          href="/"
          className="flex items-center gap-3 bg-[#00c853] border-4 border-black text-black px-8 py-4 font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <Upload size={24} strokeWidth={3} /> CONVERT NEW PDF
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div className="bg-[#4a90e2] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
          <div className="flex justify-between items-start mb-8">
            <div className="w-16 h-16 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <FileSpreadsheet size={32} strokeWidth={3} />
            </div>
            <span className="flex items-center gap-1 text-sm font-black uppercase bg-white border-4 border-black px-3 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <ArrowUpRight size={18} strokeWidth={3} /> {usagePercentage}%
            </span>
          </div>
          <h3 className="text-black text-xl font-black uppercase mb-1">PAGES CONVERTED</h3>
          <p className="text-6xl font-black tracking-tighter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] text-white">
            {pagesUsed} <span className="text-2xl text-black">/ {pagesLimit}</span>
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-[#00c853] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
          <div className="flex justify-between items-start mb-8">
            <div className="w-16 h-16 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CheckCircle size={32} strokeWidth={3} />
            </div>
            <span className="flex items-center gap-1 text-sm font-black uppercase bg-white border-4 border-black px-3 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <ArrowUpRight size={18} strokeWidth={3} /> 4%
            </span>
          </div>
          <h3 className="text-black text-xl font-black uppercase mb-1">SUCCESS RATE</h3>
          <p className="text-6xl font-black tracking-tighter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] text-white">
            99.8%
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-[#ff5757] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
          <div className="flex justify-between items-start mb-8">
            <div className="w-16 h-16 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Clock size={32} strokeWidth={3} />
            </div>
            <span className="flex items-center gap-1 text-sm font-black uppercase bg-white border-4 border-black px-3 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <ArrowDownRight size={18} strokeWidth={3} /> 2s
            </span>
          </div>
          <h3 className="text-black text-xl font-black uppercase mb-1">AVG. PROCESSING TIME</h3>
          <p className="text-6xl font-black tracking-tighter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] text-white">
            12s
          </p>
        </div>
      </div>

      {/* Recent Conversions Table */}
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="px-8 py-6 border-b-4 border-black flex justify-between items-center bg-[#ffde59]">
          <h2 className="text-2xl font-black uppercase tracking-tighter drop-shadow-[1px_1px_0px_rgba(0,0,0,1)] text-white mix-blend-difference">RECENT CONVERSIONS</h2>
          <Link href="/dashboard/conversions" className="text-sm font-black uppercase border-b-4 border-black hover:bg-black hover:text-white transition-colors">VIEW ALL</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-base whitespace-nowrap">
            <thead className="bg-white border-b-4 border-black text-black">
              <tr>
                <th className="px-8 py-5 font-black uppercase tracking-widest border-r-4 border-black">FILE NAME</th>
                <th className="px-8 py-5 font-black uppercase tracking-widest border-r-4 border-black">BANK</th>
                <th className="px-8 py-5 font-black uppercase tracking-widest border-r-4 border-black">PAGES</th>
                <th className="px-8 py-5 font-black uppercase tracking-widest border-r-4 border-black">DATE</th>
                <th className="px-8 py-5 font-black uppercase tracking-widest border-r-4 border-black">FORMAT</th>
                <th className="px-8 py-5 font-black uppercase tracking-widest text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-black">
              {conversions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-16 text-center text-xl font-black uppercase bg-[#f4f4f0]">
                    NO CONVERSIONS YET. HEAD TO THE HOMEPAGE TO CONVERT YOUR FIRST STATEMENT!
                  </td>
                </tr>
              ) : (
                conversions.map((conv) => {
                  const dateOptions = { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' };
                  const formattedDate = new Date(conv.createdAt).toLocaleDateString(undefined, dateOptions);
                  
                  return (
                    <tr key={conv.id} className="hover:bg-[#ffde59] transition-colors group">
                      <td className="px-8 py-6 border-r-4 border-black">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 border-2 border-black bg-white flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <FileText size={20} strokeWidth={3} />
                          </div>
                          <span className="font-black uppercase">{conv.fileName}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-bold uppercase border-r-4 border-black">{conv.bankName}</td>
                      <td className="px-8 py-6 font-black text-xl border-r-4 border-black">{conv.pagesProcessed}</td>
                      <td className="px-8 py-6 font-bold uppercase border-r-4 border-black">{formattedDate}</td>
                      <td className="px-8 py-6 border-r-4 border-black">
                        <span className="inline-flex items-center px-4 py-2 text-sm font-black uppercase bg-white border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          {conv.exportFormat}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right bg-[#f4f4f0] group-hover:bg-[#ffde59] transition-colors">
                        <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <DownloadButton conversion={conv} className="p-3 bg-white border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:bg-[#4a90e2] transition-all" />
                          <button className="p-3 bg-white border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:bg-[#ff5757] transition-all">
                            <MoreVertical size={20} strokeWidth={3} />
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

import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import prisma from "../../../lib/prisma";
import { redirect } from "next/navigation";
import { FileText, Download, MoreVertical, Search, Filter } from "lucide-react";
import DownloadButton from "../../../components/DownloadButton";
import ToastButton from "../../../components/ToastButton";

export default async function ConversionsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const conversions = await prisma.conversion.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">All Conversions</h1>
          <p className="text-sm text-slate-500">View and manage all your processed statements.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by file name or bank..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <ToastButton 
          message="Filter options are currently locked in MVP."
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
        >
          <Filter size={18} />
          Filters
        </ToastButton>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
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
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No conversions found.
                  </td>
                </tr>
              ) : (
                conversions.map((conv) => {
                  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' };
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
                          <ToastButton 
                            message="Additional options opened."
                            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors"
                          >
                            <MoreVertical size={18} />
                          </ToastButton>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center text-sm text-slate-500 bg-slate-50">
          <span>Showing {conversions.length} results</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

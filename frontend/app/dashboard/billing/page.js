import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import prisma from "../../../lib/prisma";
import { redirect } from "next/navigation";
import { CheckCircle, CreditCard, Download, FileText, Zap } from "lucide-react";
import ToastButton from "../../../components/ToastButton";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id }
  });

  if (!subscription) {
    redirect("/login");
  }

  const pagesUsed = subscription.pagesUsed;
  const pagesLimit = subscription.pagesLimit;
  const usagePercent = Math.min(100, Math.round((pagesUsed / pagesLimit) * 100));

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Billing & Subscription</h1>
        <p className="text-sm text-slate-500">Manage your plan, billing details, and view invoices.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Plan Card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-slate-900">{subscription.planType} Plan</h2>
                <span className="px-2.5 py-1 text-xs font-bold bg-blue-100 text-blue-700 rounded-full uppercase tracking-wider">Active</span>
              </div>
              <p className="text-slate-500 text-sm">Next billing date is <span className="font-medium text-slate-800">July 1, 2026</span></p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-slate-900">
                {subscription.planType === 'FREE' ? '$0' : '$49'}
              </span>
              <span className="text-slate-500">/mo</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-slate-700">Pages Usage</span>
              <span className="text-slate-500">{pagesUsed} / {pagesLimit} pages</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${usagePercent > 90 ? 'bg-red-500' : 'bg-blue-600'}`} 
                style={{ width: `${usagePercent}%` }}
              ></div>
            </div>
            {usagePercent > 90 && (
              <p className="text-xs text-red-500 mt-2 font-medium">You are approaching your monthly limit.</p>
            )}
          </div>

          <div className="flex gap-4">
            <ToastButton 
              message="Redirecting to Razorpay checkout..." 
              className="flex-1 bg-blue-700 text-white py-2.5 rounded-lg font-bold hover:bg-blue-800 transition-colors shadow-sm"
            >
              Upgrade Plan
            </ToastButton>
            <ToastButton 
              message="Opening subscription manager..." 
              className="flex-1 bg-white border border-slate-300 text-slate-700 py-2.5 rounded-lg font-bold hover:bg-slate-50 transition-colors"
            >
              Manage Subscription
            </ToastButton>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CreditCard size={18} /> Payment Method
          </h3>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-4 flex items-center gap-3">
            <div className="w-10 h-6 bg-slate-200 rounded flex items-center justify-center text-[10px] font-bold text-slate-500">VISA</div>
            <div>
              <p className="text-sm font-bold text-slate-900">•••• •••• •••• 4242</p>
              <p className="text-xs text-slate-500">Expires 12/28</p>
            </div>
          </div>
          <ToastButton 
            message="Securely opening payment details portal..." 
            className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Update payment method
          </ToastButton>
        </div>
      </div>

      {/* Invoice History */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-6">
        <div className="px-6 py-5 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">Invoice History</h2>
        </div>
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-3 font-semibold">Date</th>
              <th className="px-6 py-3 font-semibold">Amount</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {['June 1, 2026', 'May 1, 2026', 'April 1, 2026'].map((date, i) => (
              <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 text-slate-900 font-medium">{date}</td>
                <td className="px-6 py-4 text-slate-600">${subscription.planType === 'FREE' ? '0.00' : '49.00'}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700">
                    <CheckCircle size={12} /> Paid
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <ToastButton 
                    message="Downloading Invoice PDF..." 
                    className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 text-xs bg-blue-50 px-2 py-1 rounded"
                  >
                    <Download size={14} /> PDF
                  </ToastButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Users, UserPlus, Mail, Shield, MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";

export default function TeamPage() {
  const [members] = useState([
    { id: 1, name: "Rahul Sharma", email: "demo@convertstatement.com", role: "Owner", status: "Active" },
    { id: 2, name: "Priya Patel", email: "priya@convertstatement.com", role: "Admin", status: "Active" },
    { id: 3, name: "Amit Kumar", email: "amit@convertstatement.com", role: "Member", status: "Invited" },
  ]);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team Management</h1>
          <p className="text-sm text-slate-500">Manage your agency team members and their roles.</p>
        </div>
        <button onClick={() => toast.success("Invite sent successfully!")} className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm">
          <UserPlus size={18} /> Invite Member
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users size={20} className="text-slate-400" />
            Active Members ({members.length}/5)
          </h2>
        </div>
        
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
            <tr>
              <th className="px-6 py-3 font-semibold">User</th>
              <th className="px-6 py-3 font-semibold">Role</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Shield size={14} className={member.role === 'Owner' ? 'text-amber-500' : 'text-slate-400'} />
                    <span className="font-medium">{member.role}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                    member.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => toast("User options opened.")} className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
          <Mail size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 mb-1">Need more seats?</h3>
          <p className="text-sm text-slate-600 mb-3">Your current plan includes 5 team member seats. Upgrade to Business plan to unlock unlimited seats and advanced roles.</p>
          <button onClick={() => toast("Sales team notified. We will email you shortly.")} className="text-sm font-bold text-blue-700 hover:text-blue-800">Contact Sales &rarr;</button>
        </div>
      </div>
    </div>
  );
}

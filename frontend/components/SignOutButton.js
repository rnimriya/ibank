"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SignOutButton({ className }) {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/login' })} 
      className={className}
    >
      <LogOut size={18} />
      Sign out
    </button>
  );
}

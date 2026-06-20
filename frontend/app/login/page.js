"use client";

import { useState } from "react";
import Link from "next/link";
import { FileSpreadsheet, Mail, Lock, ArrowRight, Github, Quote } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-24">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white font-bold">
              <FileSpreadsheet size={18} />
            </div>
            <span className="font-bold text-xl text-slate-900">Convert Statement</span>
          </Link>

          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome back</h2>
          <p className="text-slate-600 mb-8">Sign in to manage your conversions and API keys.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3 bg-blue-700 text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-700/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : <>Sign In <ArrowRight size={18} /></>}
            </button>
            <button 
              type="button" 
              disabled={isLoading}
              onClick={async () => {
                setError("");
                setIsLoading(true);
                setEmail("demo@convertstatement.com");
                setPassword("demo123");
                
                try {
                  const res = await signIn("credentials", {
                    redirect: false,
                    email: "demo@convertstatement.com",
                    password: "demo123",
                  });
                  if (!res?.error) {
                    router.push("/dashboard");
                  } else {
                    setError("Demo login failed");
                  }
                } finally {
                  setIsLoading(false);
                }
              }}
              className="w-full py-3 bg-slate-100 text-slate-800 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Login as Demo User
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-slate-50 text-slate-500">Or continue with</span></div>
          </div>

          <div className="mt-6">
            <button className="w-full py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /><path d="M1 1h22v22H1z" fill="none" /></svg>
              Google
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600">
            Don't have an account? <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-500">Sign up free</Link>
          </p>
        </div>
      </div>

      {/* Right side - Image/Quote */}
      <div className="hidden lg:flex flex-1 bg-slate-900 text-white flex-col justify-center items-center px-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-3xl -ml-20 -mt-20"></div>
        <div className="relative z-10 max-w-lg">
          <Quote size={48} className="text-blue-500/50 mb-6" />
          <h3 className="text-3xl font-bold leading-tight mb-6">"Switching to Convert Statement reduced our manual data entry errors to zero. It's an indispensable tool for our firm."</h3>
          <p className="text-blue-200 font-medium">Rajiv T. — Lead Partner, RT Associates</p>
        </div>
      </div>
    </div>
  );
}

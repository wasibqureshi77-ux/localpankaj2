"use client";
import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react";

interface LoginFormProps {
  title: string;
  subtitle: string;
  redirectTo: string;
  requiredRole?: "USER" | "ADMIN" | "EDITOR" | "MANAGER";
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );
}

const loginStyles = {
  container: "w-full max-w-md bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-blue-100 border border-gray-100",
  header: "mb-10 text-center",
  title: "text-3xl font-extrabold text-gray-900 mb-2 tracking-tight",
  subtitle: "text-gray-500 font-medium",
  form: "space-y-6",
  label: "block text-sm font-bold text-gray-700 mb-1 leading-8",
  input: "w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition font-medium text-gray-950",
  button: "w-full py-5 bg-blue-600 text-white rounded-xl font-extrabold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-500/20 transform hover:-translate-y-1 flex items-center justify-center space-x-3"
};

const LoginFormContent = ({ title, subtitle, redirectTo, requiredRole }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        toast.error(res.error || "Authentication failed.");
        setLoading(false);
      } else {
        // Fetch session to verify role requirement
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();
        const userRole = session?.user?.role;

        // SEPARATE LOGIN ROLE ENFORCEMENT
        if (requiredRole) {
           if (requiredRole === "ADMIN" || requiredRole === "MANAGER") {
              if (userRole !== "ADMIN" && userRole !== "MANAGER") {
                 toast.error("Access Denied: Admin credentials required.");
                 setLoading(false);
                 return;
              }
           } else if (userRole !== requiredRole) {
              toast.error(`Access Denied: ${requiredRole} credentials required.`);
              setLoading(false);
              return;
           }
        }

        toast.success("Identity Verified. Redirecting...");
        
        // Final redirection based on intended purpose
        setTimeout(() => {
          if (callbackUrl) {
            window.location.href = callbackUrl;
          } else {
            window.location.href = redirectTo;
          }
        }, 300);
      }
    } catch (error) {
      toast.error("Critical identity sync error. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className={loginStyles.container}>
      <div className={loginStyles.header}>
        <h2 className={loginStyles.title}>{title}</h2>
        <p className={loginStyles.subtitle}>{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className={loginStyles.form}>
        <div>
          <label className={loginStyles.label}>Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              required
              className={loginStyles.input}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
           <div className="flex items-center justify-between mb-1">
             <label className={loginStyles.label}>Password</label>
             <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition">Forgot?</a>
           </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              required
              className={loginStyles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={loginStyles.button}
        >
          {loading ? (
             <Loader2 className="animate-spin" size={24} />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>
      
      {requiredRole === "USER" && (
        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-500 font-medium text-sm mb-4">New to Local Pankaj?</p>
            <button 
              onClick={() => router.push("/register")}
              className="text-blue-600 font-extrabold hover:text-blue-700 transition"
            >
              Create Your Free Account
            </button>
        </div>
      )}
    </div>
  );
};

const LoginForm = (props: LoginFormProps) => {
  return (
    <Suspense fallback={<div className={loginStyles.container}><LoadingSpinner/></div>}>
      <LoginFormContent {...props} />
    </Suspense>
  );
}

export default LoginForm;

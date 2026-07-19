"use client";

import { SignIn } from "@clerk/nextjs";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/logo.svg" alt="Tire&Wheel Mart" className="h-8 w-auto brightness-0 invert" />
            <span className="text-xl font-bold text-white">Admin</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Admin Portal</h1>
          <p className="text-slate-400">Sign in with your admin credentials</p>
        </div>
        <SignIn
          forceRedirectUrl="/admin"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-slate-800 border-slate-700 shadow-xl",
              headerTitle: "text-white",
              headerSubtitle: "text-slate-400",
              socialButtonsBlockButton: "bg-slate-700 border-slate-600 text-white hover:bg-slate-600",
              dividerLine: "bg-slate-700",
              dividerText: "text-slate-500",
              formFieldLabel: "text-slate-300",
              formFieldInput: "bg-slate-700 border-slate-600 text-white",
              formButtonPrimary: "bg-red-600 hover:bg-red-700 text-white",
              footerActionText: "text-slate-400",
              footerActionLink: "text-red-400 hover:text-red-300",
            },
          }}
        />
      </div>
    </div>
  );
}

"use client";

import { SignIn } from "@clerk/nextjs";

export default function POSLoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl font-bold text-white">POS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Point of Sale</h1>
          <p className="text-slate-500">Sign in to start selling</p>
        </div>
        <SignIn
          forceRedirectUrl="/pos"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-slate-900 border-slate-800 shadow-2xl",
              headerTitle: "text-white",
              headerSubtitle: "text-slate-500",
              socialButtonsBlockButton: "bg-slate-800 border-slate-700 text-white hover:bg-slate-700",
              dividerLine: "bg-slate-800",
              dividerText: "text-slate-600",
              formFieldLabel: "text-slate-400",
              formFieldInput: "bg-slate-800 border-slate-700 text-white text-lg",
              formButtonPrimary: "bg-emerald-600 hover:bg-emerald-700 text-white text-lg py-3",
              footerActionText: "text-slate-500",
              footerActionLink: "text-emerald-400 hover:text-emerald-300",
            },
          }}
        />
      </div>
    </div>
  );
}

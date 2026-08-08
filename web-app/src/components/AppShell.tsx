import React from "react";
import { Navbar } from "@/components/Navbar";

export function AppShell({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#1b4332] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <h1 className="font-serif text-3xl font-bold text-[#1b4332] border-b border-gray-200 pb-4">{title}</h1>
        {children}
      </main>
    </div>
  );
}

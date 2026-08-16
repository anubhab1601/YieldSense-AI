/**
 * YieldSense AI  -  Auth Layout
 *
 * Clean, minimal auth page wrapper.
 * No decorative blobs, no gradient backgrounds.
 */

import React from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12" style={{ zoom: "125%" }}>
      {/* Wrapper to shift both Logo and Auth Card upward together seamlessly */}
      <div className="w-full max-w-sm flex flex-col items-center" style={{ transform: "translateY(-3.5cm)" }}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-md bg-[#1a6b3c] flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1.5C7 1.5 2.5 4 2.5 8C2.5 10.5 4.5 12.5 7 12.5C9.5 12.5 11.5 10.5 11.5 8C11.5 4 7 1.5 7 1.5Z" fill="white" fillOpacity="0.9"/>
              <path d="M7 5V12.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-base font-semibold text-gray-900 dark:text-white">YieldSense AI</span>
        </Link>

        {/* Auth card */}
        <div className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-7 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import { AuthProvider } from "@/providers/AuthProvider";
import { KycGuard } from "@/providers/KycGuard";
import { I18nProvider } from "@/i18n";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BasisPilot — AI Co-Pilot for BASIS Students",
  description: "BasisPilot — 24/7 AI learning assistant covering Math, Science, Humanities tutoring, AP exam prep, college planning, and onboarding. Designed for BASIS International School students and families.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/logo-mark-filled.svg",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
    >
      <body
        className={inter.className}
        suppressHydrationWarning
      >
        <AuthProvider>
          <I18nProvider>
            <KycGuard>
              <NuqsAdapter>{children}</NuqsAdapter>
              <Toaster />
            </KycGuard>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

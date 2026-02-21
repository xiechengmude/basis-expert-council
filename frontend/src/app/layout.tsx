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
  title: "BasisPilot 贝领 — 专为贝赛思学生设计的 AI 学习助手",
  description: "BasisPilot 贝领 — 24/7 AI 学习助手，覆盖数学/科学/人文全科辅导、AP 课程备考、升学规划、新生衔接。专为 BASIS 国际学校学生和家庭设计。",
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

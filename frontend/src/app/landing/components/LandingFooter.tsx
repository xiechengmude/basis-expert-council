"use client";

interface Props {
  t: (key: string) => string;
}

export default function LandingFooter({ t }: Props) {
  return (
    <footer className="bg-slate-950 py-12 px-4 border-t border-white/5">
      <div className="max-w-7xl mx-auto text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-mark.svg"
          alt="BasisPilot"
          width={28}
          height={28}
          className="w-7 h-7 opacity-40 invert mx-auto"
        />
        <p className="mt-4 text-lg font-semibold text-white/90">BasisPilot</p>
        <p className="mt-2 text-sm text-slate-500">{t("footer_tagline")}</p>

        <div className="mt-8 border-t border-white/5" />

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <span>
            &copy; {new Date().getFullYear()} BasisPilot. All rights reserved.
          </span>
          <span>{t("footer_powered")}</span>
        </div>
      </div>
    </footer>
  );
}

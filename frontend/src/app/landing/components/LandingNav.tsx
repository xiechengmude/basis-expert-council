"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Globe, Menu, X } from "lucide-react";
import { LOCALE_LABELS, Locale } from "../i18n";

interface LandingNavProps {
  t: (key: string) => string;
  locale: string;
  setLocale: (l: any) => void;
  onLoginClick?: () => void;
}

const NAV_LINKS = [
  { key: "nav_features", href: "#features", id: "features" },
  { key: "nav_agents", href: "#agents", id: "agents" },
  { key: "nav_pricing", href: "#pricing", id: "pricing" },
  { key: "nav_faq", href: "#faq", id: "faq" },
];

export default function LandingNav({ t, locale, setLocale, onLoginClick }: LandingNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-locale-dropdown]")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-slate-950/80 backdrop-blur-xl border-white/[0.06] shadow-lg shadow-black/20"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <Link href="/landing" className="flex items-center gap-2.5 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-mark.svg"
              alt="BasisPilot logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-semibold text-lg text-white">
              BasisPilot
            </span>
          </Link>

          {/* Center: Nav links (desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ key, href, id }) => (
              <a
                key={key}
                href={href}
                onClick={(e) => handleNavClick(e, id)}
                className="px-4 py-2 rounded-full text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                {t(key)}
              </a>
            ))}
          </div>

          {/* Right: Language switcher + Login + Mobile hamburger */}
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="relative" data-locale-dropdown>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                <Globe size={16} />
                <span className="hidden sm:inline">
                  {LOCALE_LABELS[locale as Locale] ?? locale}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-slate-900 rounded-xl shadow-xl border border-white/10 py-1 z-50">
                  {(Object.entries(LOCALE_LABELS) as [Locale, string][]).map(
                    ([code, label]) => (
                      <button
                        key={code}
                        onClick={() => {
                          setLocale(code);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          locale === code
                            ? "bg-brand-500/20 text-brand-400 font-medium"
                            : "text-slate-300 hover:bg-white/[0.06]"
                        }`}
                      >
                        {label}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Assessment pill link (desktop) */}
            <Link
              href="/assessment"
              className="hidden md:inline-flex items-center rounded-full bg-brand-500/10 border border-brand-500/30 px-4 py-2 text-sm font-medium text-brand-400 hover:bg-brand-500/20 transition-colors"
            >
              {t("nav_assessment")}
            </Link>

            {/* Login button (desktop) */}
            {onLoginClick ? (
              <button
                onClick={onLoginClick}
                className="hidden md:inline-flex items-center rounded-full px-5 py-2 text-sm font-medium border border-white/20 text-white hover:bg-white/10 transition-colors"
              >
                {t("nav_login")}
              </button>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-flex items-center rounded-full px-5 py-2 text-sm font-medium border border-white/20 text-white hover:bg-white/10 transition-colors"
              >
                {t("nav_login")}
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-full text-white transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-950 flex flex-col pt-20 px-6 pb-8">
          {/* Close button at top-right */}
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 p-2 text-white rounded-full hover:bg-white/10"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>

          {/* Nav links */}
          <nav className="flex flex-col gap-1 mb-8">
            {NAV_LINKS.map(({ key, href, id }) => (
              <a
                key={key}
                href={href}
                onClick={(e) => handleNavClick(e, id)}
                className="px-4 py-3 text-lg font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors"
              >
                {t(key)}
              </a>
            ))}
          </nav>

          {/* Language selector */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 px-4">
              Language
            </p>
            <div className="grid grid-cols-2 gap-1">
              {(Object.entries(LOCALE_LABELS) as [Locale, string][]).map(
                ([code, label]) => (
                  <button
                    key={code}
                    onClick={() => {
                      setLocale(code);
                    }}
                    className={`text-left px-4 py-2.5 rounded-xl text-sm transition-colors ${
                      locale === code
                        ? "bg-brand-500/20 text-brand-400 font-medium"
                        : "text-slate-400 hover:bg-white/[0.06]"
                    }`}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Assessment pill link (mobile) */}
          <Link
            href="/assessment"
            onClick={() => setMobileOpen(false)}
            className="mx-4 text-center bg-brand-500/10 border border-brand-500/30 text-brand-400 rounded-full px-5 py-3 text-base font-medium"
          >
            {t("nav_assessment")}
          </Link>

          {/* Login button */}
          {onLoginClick ? (
            <button
              onClick={() => { setMobileOpen(false); onLoginClick(); }}
              className="mt-3 w-full text-center border border-white/20 text-white hover:bg-white/10 rounded-full px-5 py-3 text-base font-medium transition-colors"
            >
              {t("nav_login")}
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-3 w-full text-center border border-white/20 text-white hover:bg-white/10 rounded-full px-5 py-3 text-base font-medium transition-colors"
            >
              {t("nav_login")}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

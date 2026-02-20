"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Globe, Menu, X } from "lucide-react";
import { LOCALE_LABELS, Locale } from "../i18n";

interface LandingNavProps {
  t: (key: string) => string;
  locale: string;
  setLocale: (l: any) => void;
}

const NAV_LINKS = [
  { key: "nav_features", href: "#features", id: "features" },
  { key: "nav_agents", href: "#agents", id: "agents" },
  { key: "nav_pricing", href: "#pricing", id: "pricing" },
  { key: "nav_faq", href: "#faq", id: "faq" },
];

export default function LandingNav({ t, locale, setLocale }: LandingNavProps) {
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
          ? "bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-sm"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <Link href="/landing" className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/logo-mark.svg"
              alt="BasisPilot logo"
              width={32}
              height={32}
            />
            <span
              className={`font-semibold text-lg transition-colors duration-300 ${
                scrolled ? "text-brand-900" : "text-white"
              }`}
            >
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                  scrolled
                    ? "text-gray-600 hover:text-brand-600"
                    : "text-white/70 hover:text-white"
                }`}
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
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                  scrolled
                    ? "text-gray-600 hover:text-brand-600"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Globe size={16} />
                <span className="hidden sm:inline">
                  {LOCALE_LABELS[locale as Locale] ?? locale}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
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
                            ? "bg-brand-50 text-brand-600 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {label}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Login button (desktop) */}
            <Link
              href="/login"
              className={`hidden md:inline-flex items-center rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300 ${
                scrolled
                  ? "bg-brand-600 text-white hover:bg-brand-700"
                  : "border border-white/30 text-white hover:bg-white/10"
              }`}
            >
              {t("nav_login")}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className={`md:hidden p-2 rounded-full transition-colors duration-300 ${
                scrolled ? "text-gray-700" : "text-white"
              }`}
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white flex flex-col pt-20 px-6 pb-8">
          {/* Close button at top-right */}
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 p-2 text-gray-700 rounded-full hover:bg-gray-100"
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
                className="px-4 py-3 text-lg font-medium text-gray-700 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
              >
                {t(key)}
              </a>
            ))}
          </nav>

          {/* Language selector */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 px-4">
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
                        ? "bg-brand-50 text-brand-600 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Login button */}
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="w-full text-center bg-brand-600 text-white hover:bg-brand-700 rounded-full px-5 py-3 text-base font-medium transition-colors"
          >
            {t("nav_login")}
          </Link>
        </div>
      )}
    </nav>
  );
}

"use client";

import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  Users,
  Target,
  Check,
  Star,
  Sparkles,
  Clock,
  Globe,
  FileText,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  Zap,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const PRODUCTS = [
  {
    icon: BookOpen,
    title: "AI 学伴",
    features: ["24/7 学科答疑", "数学 / 科学 / 人文全科覆盖", "中英双语讲解"],
    color: "bg-teal-50",
    iconColor: "text-[#2F6868]",
    borderColor: "border-teal-200",
  },
  {
    icon: GraduationCap,
    title: "升学规划师",
    features: ["AP 选课策略", "GPA 管理", "大学申请指导"],
    color: "bg-amber-50",
    iconColor: "text-amber-700",
    borderColor: "border-amber-200",
  },
  {
    icon: Users,
    title: "新生衔接营",
    features: ["转学 / 入学适应", "2–4 周结构化课程", "全科预习"],
    color: "bg-blue-50",
    iconColor: "text-blue-700",
    borderColor: "border-blue-200",
  },
  {
    icon: Target,
    title: "AP 冲刺包",
    features: ["考前 FRQ 训练", "答题策略", "按科目售卖"],
    color: "bg-rose-50",
    iconColor: "text-rose-700",
    borderColor: "border-rose-200",
  },
];

const PRICING_TIERS = [
  {
    name: "免费试用",
    price: "0",
    unit: "",
    conversations: "5 次 / 天",
    subjects: "数学 + 科学",
    report: "无",
    popular: false,
  },
  {
    name: "基础会员",
    price: "299",
    unit: "/月",
    conversations: "50 次 / 天",
    subjects: "全科",
    report: "1 次评估",
    popular: true,
  },
  {
    name: "高级会员",
    price: "699",
    unit: "/月",
    conversations: "无限",
    subjects: "全科 + 规划",
    report: "学期报告",
    popular: false,
  },
  {
    name: "VIP 会员",
    price: "1,999",
    unit: "/月",
    conversations: "无限 + 优先",
    subjects: "全科 + 规划 + 人工",
    report: "月度报告",
    popular: false,
  },
];

const ADDONS = [
  { name: "新生衔接营 2 周", price: "¥1,999" },
  { name: "新生衔接营 4 周", price: "¥3,499" },
  { name: "AP 冲刺包 单科", price: "¥999" },
  { name: "AP 冲刺包 3 科套餐", price: "¥2,499" },
  { name: "学术评估报告", price: "¥499 / 次" },
  { name: "升学规划报告", price: "¥2,999 / 次" },
];

/* ------------------------------------------------------------------ */
/*  Smooth-scroll helper                                               */
/* ------------------------------------------------------------------ */

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 scroll-smooth">
      {/* ============================================================ */}
      {/*  Sticky Nav                                                   */}
      {/* ============================================================ */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <span className="text-lg font-bold tracking-tight text-[#2F6868]">
            BASIS 教育专家 AI
          </span>

          <div className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex">
            <button
              onClick={() => scrollTo("products")}
              className="transition hover:text-[#2F6868]"
            >
              产品
            </button>
            <button
              onClick={() => scrollTo("pricing")}
              className="transition hover:text-[#2F6868]"
            >
              价格
            </button>
            <button
              onClick={() => scrollTo("addons")}
              className="transition hover:text-[#2F6868]"
            >
              增值服务
            </button>
            <Link
              href="/login"
              className="rounded-full bg-[#2F6868] px-5 py-2 text-white transition hover:bg-[#245454]"
            >
              登录 / 注册
            </Link>
          </div>

          {/* Mobile CTA */}
          <Link
            href="/login"
            className="rounded-full bg-[#2F6868] px-4 py-1.5 text-sm font-medium text-white md:hidden"
          >
            登录
          </Link>
        </div>
      </nav>

      {/* ============================================================ */}
      {/*  Hero                                                         */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2F6868] via-[#357878] to-[#1e4e4e]">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-white/5" />

        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:py-40">
          <p className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm text-white/90 backdrop-blur">
            <Sparkles className="h-4 w-4" />
            专为贝赛思学生设计
          </p>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            BASIS 教育专家 AI
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
            24/7 AI 学习助手 —— AP 课程辅导 &middot; 升学规划 &middot;
            新生衔接 &middot; 学术评估
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-[#2F6868] shadow-lg transition hover:bg-gray-50 hover:shadow-xl"
            >
              免费体验
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              onClick={() => scrollTo("products")}
              className="inline-flex items-center gap-1 text-sm font-medium text-white/80 transition hover:text-white"
            >
              了解更多
              <ChevronDown className="h-4 w-4 animate-bounce" />
            </button>
          </div>

          {/* Trust signals */}
          <div className="mx-auto mt-16 flex max-w-md flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/60">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> 24/7 全天候
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="h-4 w-4" /> 中英双语
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> 安全可靠
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Product Cards                                                */}
      {/* ============================================================ */}
      <section
        id="products"
        className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
      >
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          四大核心产品
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-gray-500">
          覆盖 BASIS 学生从入学到申请的全周期学业需求
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className={`group relative rounded-2xl border ${p.borderColor} ${p.color} p-6 transition hover:-translate-y-1 hover:shadow-lg`}
              >
                <div
                  className={`mb-4 inline-flex rounded-xl bg-white p-3 shadow-sm ${p.iconColor}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {p.title}
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-gray-600">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2F6868]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Pricing                                                      */}
      {/* ============================================================ */}
      <section
        id="pricing"
        className="bg-gray-50 px-4 py-20 sm:px-6 sm:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            选择适合的方案
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-gray-500">
            从免费试用开始，随时升级解锁更多能力
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PRICING_TIERS.map((t) => (
              <div
                key={t.name}
                className={`relative flex flex-col rounded-2xl border bg-white p-6 transition hover:shadow-lg ${
                  t.popular
                    ? "border-[#2F6868] ring-2 ring-[#2F6868]/20"
                    : "border-gray-200"
                }`}
              >
                {t.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-[#2F6868] px-3 py-0.5 text-xs font-semibold text-white">
                    <Star className="h-3 w-3" /> 热门推荐
                  </span>
                )}

                <h3 className="text-lg font-semibold text-gray-900">
                  {t.name}
                </h3>

                <div className="mt-4 flex items-baseline gap-1">
                  {t.price === "0" ? (
                    <span className="text-3xl font-extrabold text-gray-900">
                      免费
                    </span>
                  ) : (
                    <>
                      <span className="text-sm font-medium text-gray-500">
                        ¥
                      </span>
                      <span className="text-3xl font-extrabold text-gray-900">
                        {t.price}
                      </span>
                      <span className="text-sm text-gray-500">{t.unit}</span>
                    </>
                  )}
                </div>

                <ul className="mt-6 flex-1 space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <Zap className="mt-0.5 h-4 w-4 shrink-0 text-[#2F6868]" />
                    对话：{t.conversations}
                  </li>
                  <li className="flex items-start gap-2">
                    <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-[#2F6868]" />
                    科目：{t.subjects}
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#2F6868]" />
                    报告：{t.report}
                  </li>
                </ul>

                <Link
                  href="/login"
                  className={`mt-6 block rounded-full py-2.5 text-center text-sm font-semibold transition ${
                    t.popular
                      ? "bg-[#2F6868] text-white hover:bg-[#245454]"
                      : "border border-[#2F6868] text-[#2F6868] hover:bg-[#2F6868] hover:text-white"
                  }`}
                >
                  {t.price === "0" ? "免费体验" : "立即开通"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Add-on Services                                              */}
      {/* ============================================================ */}
      <section
        id="addons"
        className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
      >
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          增值服务
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-gray-500">
          按需购买，灵活搭配，精准满足个性化需求
        </p>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ADDONS.map((a) => (
            <div
              key={a.name}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-6 py-5 transition hover:border-[#2F6868]/40 hover:shadow-md"
            >
              <span className="font-medium text-gray-900">{a.name}</span>
              <span className="whitespace-nowrap text-lg font-bold text-[#2F6868]">
                {a.price}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-[#2F6868] px-8 py-3 text-base font-semibold text-white shadow transition hover:bg-[#245454] hover:shadow-lg"
          >
            立即开通
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Footer                                                       */}
      {/* ============================================================ */}
      <footer className="border-t border-gray-100 bg-gray-50 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-base font-semibold text-gray-800">
            BASIS 教育专家 AI —— 让每个 BASIS 学生都有专属顾问
          </p>
          <p className="mt-3 text-sm text-gray-400">
            本平台为独立第三方教育工具，与 BASIS 学校无隶属关系
          </p>
          <p className="mt-4 text-xs text-gray-300">
            &copy; {new Date().getFullYear()} BASIS 教育专家 AI. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

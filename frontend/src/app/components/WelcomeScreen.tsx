"use client";

import React, { useState } from "react";
import { Users, GraduationCap, BookOpen } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface WelcomeScreenProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

interface ScenarioCard {
  title: string;
  description: string;
  prompt: string;
  icon: string;
}

const SCENARIOS: Record<string, ScenarioCard[]> = {
  parent: [
    {
      title: "入学备考",
      description: "制定 BASIS 入学准备方案，评估孩子当前水平",
      prompt:
        "我的孩子准备申请 BASIS，请帮我制定入学准备方案，包括需要达到的学术水平、英语能力要求、以及备考时间规划。",
      icon: "🎯",
    },
    {
      title: "成绩诊断",
      description: "评估学术水平，找出薄弱环节和提升方向",
      prompt:
        "请帮我评估孩子目前的学术水平，诊断各学科的优势和薄弱环节，并给出针对性的提升建议。",
      icon: "📊",
    },
    {
      title: "AP 选课",
      description: "根据孩子情况推荐最优 AP 选课组合",
      prompt:
        "孩子明年要选 AP 课程了，请根据他的学术兴趣和能力帮我推荐最合适的 AP 选课组合和备考策略。",
      icon: "📚",
    },
    {
      title: "保级方案",
      description: "面临 Academic Probation？紧急制定恢复计划",
      prompt:
        "孩子成绩下滑，面临 Academic Probation，请帮我评估当前情况并制定紧急恢复计划。",
      icon: "🆘",
    },
  ],
  student: [
    {
      title: "数学辅导",
      description: "Algebra, Calculus, Statistics — any math topic",
      prompt:
        "I need help with math. Can you help me understand the topic I'm struggling with and walk me through some practice problems?",
      icon: "🔢",
    },
    {
      title: "科学辅导",
      description: "Physics, Chemistry, Biology — lab reports & concepts",
      prompt:
        "I need help with science. Can you explain the concept I'm studying and help me prepare for my upcoming test?",
      icon: "🔬",
    },
    {
      title: "人文辅导",
      description: "English, History, Essay writing & analysis",
      prompt:
        "I need help with humanities. Can you help me with my reading analysis, essay structure, or historical argumentation?",
      icon: "📝",
    },
    {
      title: "AP 备考",
      description: "AP exam strategies, FRQ practice, review plans",
      prompt:
        "I'm preparing for my AP exam and need a study plan. Can you help me review key concepts and practice with sample questions?",
      icon: "🎓",
    },
  ],
  teacher: [
    {
      title: "教案生成",
      description: "生成符合 BASIS 标准的学科教案",
      prompt:
        "请帮我生成一份符合 BASIS 标准的教案，包括教学目标、课堂活动设计、评估方式和差异化教学策略。",
      icon: "📋",
    },
    {
      title: "EMI 教学法",
      description: "English as Medium of Instruction 教学指导",
      prompt:
        "请给我 EMI 教学法指导，帮助我在全英文教学环境下有效地传授学科知识，同时支持不同英语水平的学生。",
      icon: "🌐",
    },
  ],
};

const TAB_CONFIG = [
  { value: "parent", label: "家长", icon: Users },
  { value: "student", label: "学生", icon: GraduationCap },
  { value: "teacher", label: "教师", icon: BookOpen },
] as const;

export function WelcomeScreen({ onSendMessage, disabled }: WelcomeScreenProps) {
  const [activeTab, setActiveTab] = useState("parent");

  return (
    <div className="flex flex-col items-center px-4 py-8 sm:py-12">
      {/* Hero */}
      <div className="mb-8 text-center sm:mb-10">
        <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          BasisPilot · 贝领
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Your AI Co-Pilot Through BASIS — 学科辅导、选课规划、升学策略
        </p>
      </div>

      {/* Role Tabs + Scenario Cards */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full max-w-2xl"
      >
        <TabsList className="mx-auto mb-6 grid w-full max-w-sm grid-cols-3">
          {TAB_CONFIG.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="gap-1.5"
            >
              <Icon size={16} />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TAB_CONFIG.map(({ value }) => (
          <TabsContent key={value} value={value}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SCENARIOS[value].map((card) => (
                <button
                  key={card.title}
                  type="button"
                  disabled={disabled}
                  onClick={() => onSendMessage(card.prompt)}
                  className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-[#2F6868]/40 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="mt-0.5 text-xl leading-none">
                    {card.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-primary group-hover:text-[#2F6868]">
                      {card.title}
                    </h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

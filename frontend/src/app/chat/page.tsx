"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useQueryState } from "nuqs";
import { getConfig, saveConfig, StandaloneConfig } from "@/lib/config";
import { ConfigDialog } from "@/app/components/ConfigDialog";
import { Button } from "@/components/ui/button";
import { Assistant } from "@langchain/langgraph-sdk";
import Link from "next/link";
import { ClientProvider, useClient } from "@/providers/ClientProvider";
import { Settings, MessagesSquare, SquarePen, LogOut, Crown, UserCircle, ChevronDown, Globe, Loader2 } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useUser } from "@/app/hooks/useUser";
import { useI18n, LOCALE_LABELS, SUPPORTED_LOCALES } from "@/i18n";
import { QuotaBanner } from "@/app/components/QuotaBanner";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ThreadList } from "@/app/components/ThreadList";
import { ChatProvider } from "@/providers/ChatProvider";
import { ChatInterface } from "@/app/components/ChatInterface";

interface ChatPageInnerProps {
  config: StandaloneConfig;
  configDialogOpen: boolean;
  setConfigDialogOpen: (open: boolean) => void;
  handleSaveConfig: (config: StandaloneConfig) => void;
}

function ChatPageInner({
  config,
  configDialogOpen,
  setConfigDialogOpen,
  handleSaveConfig,
}: ChatPageInnerProps) {
  const client = useClient();
  const { user, signOut } = useAuth();
  const { profile, planName, quota, refreshQuota } = useUser();
  const { t, locale, setLocale } = useI18n();
  const [threadId, setThreadId] = useQueryState("threadId");
  const [sidebar, setSidebar] = useQueryState("sidebar");

  const [mutateThreads, setMutateThreads] = useState<(() => void) | null>(null);
  const [interruptCount, setInterruptCount] = useState(0);
  const [assistant, setAssistant] = useState<Assistant | null>(null);

  const fetchAssistant = useCallback(async () => {
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        config.assistantId
      );

    if (isUUID) {
      try {
        const data = await client.assistants.get(config.assistantId);
        setAssistant(data);
      } catch (error) {
        console.error("Failed to fetch assistant:", error);
        setAssistant({
          assistant_id: config.assistantId,
          graph_id: config.assistantId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          config: {},
          metadata: {},
          version: 1,
          name: "Assistant",
          context: {},
        });
      }
    } else {
      try {
        const assistants = await client.assistants.search({
          graphId: config.assistantId,
          limit: 100,
        });
        const defaultAssistant = assistants.find(
          (assistant) => assistant.metadata?.["created_by"] === "system"
        );
        if (defaultAssistant === undefined) {
          throw new Error("No default assistant found");
        }
        setAssistant(defaultAssistant);
      } catch (error) {
        console.error(
          "Failed to find default assistant from graph_id: try setting the assistant_id directly:",
          error
        );
        setAssistant({
          assistant_id: config.assistantId,
          graph_id: config.assistantId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          config: {},
          metadata: {},
          version: 1,
          name: config.assistantId,
          context: {},
        });
      }
    }
  }, [client, config.assistantId]);

  useEffect(() => {
    fetchAssistant();
  }, [fetchAssistant]);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = useCallback(async () => {
    localStorage.removeItem("basis-token");
    await signOut();
  }, [signOut]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [userMenuOpen]);

  return (
    <>
      <ConfigDialog
        open={configDialogOpen}
        onOpenChange={setConfigDialogOpen}
        onSave={handleSaveConfig}
        initialConfig={config}
      />
      <div className="flex h-screen flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
              <img src="/logo-mark.svg" alt="BasisPilot" className="h-7 w-7" />
              <h1 className="text-lg font-semibold sm:text-xl">{t("header.brand")}</h1>
            </Link>
            {!sidebar && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebar("1")}
                className="rounded-md border border-border bg-card p-3 text-foreground hover:bg-accent"
              >
                <MessagesSquare className="mr-2 h-4 w-4" />
                {t("header.conversations")}
                {interruptCount > 0 && (
                  <span className="ml-2 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] text-destructive-foreground">
                    {interruptCount}
                  </span>
                )}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Quota info — compact on mobile */}
            <div className="hidden sm:block">
              <QuotaBanner quota={quota} />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfigDialogOpen(true)}
              className="hidden sm:inline-flex"
            >
              <Settings className="mr-2 h-4 w-4" />
              {t("header.settings")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setThreadId(null)}
              disabled={!threadId}
              className="border-brand-600 bg-brand-600 text-white hover:bg-brand-600/80"
            >
              <SquarePen className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">{t("header.newChat")}</span>
            </Button>
            {user && (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-1.5 rounded-full border border-border px-2 py-1.5 transition-colors hover:bg-accent"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
                    {(profile?.user.nickname || user.phone || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden max-w-[100px] truncate text-sm text-foreground sm:inline">
                    {profile?.user.nickname || user.phone || user.email || t("menu.user_fallback")}
                  </span>
                  <ChevronDown className={`hidden h-3.5 w-3.5 text-muted-foreground transition-transform sm:block ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-1.5 w-52 rounded-xl border border-border bg-popover py-1 shadow-lg">
                    {/* User info header */}
                    <div className="border-b border-border px-3 py-2.5">
                      <p className="truncate text-sm font-medium text-foreground">
                        {profile?.user.nickname || t("menu.user_fallback")}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.phone || user.email || ""}
                      </p>
                      {profile && profile.subscription.plan !== "free" && (
                        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                          <Crown size={10} />
                          {planName}
                        </span>
                      )}
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <Link
                        href="/onboarding"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                      >
                        <UserCircle className="h-4 w-4 text-muted-foreground" />
                        {t("menu.profile")}
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          setConfigDialogOpen(true);
                        }}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent sm:hidden"
                      >
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        {t("menu.connectionSettings")}
                      </button>
                    </div>

                    {/* Language selector */}
                    <div className="border-t border-border py-1">
                      <div className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground">
                        <Globe className="h-4 w-4" />
                        {t("lang.label")}
                      </div>
                      <div className="px-3 pb-1">
                        {SUPPORTED_LOCALES.map((loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => {
                              setLocale(loc);
                              setUserMenuOpen(false);
                            }}
                            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent ${locale === loc ? "font-medium text-brand-600" : "text-foreground"}`}
                          >
                            <span className={`inline-block h-1.5 w-1.5 rounded-full ${locale === loc ? "bg-brand-600" : "bg-transparent"}`} />
                            {LOCALE_LABELS[loc]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-border py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleSignOut();
                        }}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        {t("menu.logout")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Mobile quota banner */}
        {quota && (quota.remaining <= 3 || quota.remaining === 0) && (
          <div className="border-b border-border px-4 py-1 sm:hidden">
            <QuotaBanner quota={quota} />
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup
            direction="horizontal"
            autoSaveId="standalone-chat"
          >
            {sidebar && (
              <>
                <ResizablePanel
                  id="thread-history"
                  order={1}
                  defaultSize={25}
                  minSize={20}
                  className="relative min-w-[300px]"
                >
                  <ThreadList
                    onThreadSelect={async (id) => {
                      await setThreadId(id);
                    }}
                    onMutateReady={(fn) => setMutateThreads(() => fn)}
                    onClose={() => setSidebar(null)}
                    onInterruptCountChange={setInterruptCount}
                  />
                </ResizablePanel>
                <ResizableHandle />
              </>
            )}

            <ResizablePanel
              id="chat"
              className="relative flex flex-col"
              order={2}
            >
              <ChatProvider
                activeAssistant={assistant}
                onHistoryRevalidate={() => {
                  mutateThreads?.();
                  refreshQuota();
                }}
                userId={user?.id}
              >
                <ChatInterface assistant={assistant} />
              </ChatProvider>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </>
  );
}

function ChatPageContent() {
  const { t } = useI18n();
  const [config, setConfig] = useState<StandaloneConfig | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [assistantId, setAssistantId] = useQueryState("assistantId");

  // On mount, check for saved config, otherwise show config dialog
  useEffect(() => {
    const savedConfig = getConfig();
    if (savedConfig) {
      setConfig(savedConfig);
      if (!assistantId) {
        setAssistantId(savedConfig.assistantId);
      }
    } else {
      setConfigDialogOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If config changes, update the assistantId
  useEffect(() => {
    if (config && !assistantId) {
      setAssistantId(config.assistantId);
    }
  }, [config, assistantId, setAssistantId]);

  const handleSaveConfig = useCallback((newConfig: StandaloneConfig) => {
    saveConfig(newConfig);
    setConfig(newConfig);
  }, []);

  const langsmithApiKey =
    config?.langsmithApiKey || process.env.NEXT_PUBLIC_LANGSMITH_API_KEY || "";

  if (!config) {
    return (
      <>
        <ConfigDialog
          open={configDialogOpen}
          onOpenChange={setConfigDialogOpen}
          onSave={handleSaveConfig}
        />
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <img src="/logo-mark.svg" alt="BasisPilot" className="mx-auto mb-3 h-10 w-10" />
            <h1 className="text-2xl font-bold">{t("header.brand")}</h1>
            <p className="mt-2 text-muted-foreground">
              {t("config.pleaseSetup")}
            </p>
            <Button
              onClick={() => setConfigDialogOpen(true)}
              className="mt-4"
            >
              {t("config.openConfig")}
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <ClientProvider
      deploymentUrl={config.deploymentUrl}
      apiKey={langsmithApiKey}
    >
      <ChatPageInner
        config={config}
        configDialogOpen={configDialogOpen}
        setConfigDialogOpen={setConfigDialogOpen}
        handleSaveConfig={handleSaveConfig}
      />
    </ClientProvider>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  );
}

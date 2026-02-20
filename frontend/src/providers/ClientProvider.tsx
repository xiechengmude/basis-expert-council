"use client";

import { createContext, useContext, useMemo, useEffect, useState, ReactNode } from "react";
import { Client } from "@langchain/langgraph-sdk";

interface ClientContextValue {
  client: Client;
}

const ClientContext = createContext<ClientContextValue | null>(null);

interface ClientProviderProps {
  children: ReactNode;
  deploymentUrl: string;
  apiKey: string;
}

/**
 * Get BASIS JWT from localStorage for authenticated API calls
 */
function getBasisToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("basis-token") || "";
}

export function ClientProvider({
  children,
  deploymentUrl,
  apiKey,
}: ClientProviderProps) {
  const [basisToken, setBasisToken] = useState("");

  useEffect(() => {
    setBasisToken(getBasisToken());

    // Listen for storage changes (e.g. login in another tab)
    const handler = () => setBasisToken(getBasisToken());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const client = useMemo(() => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
    };
    // Include BASIS JWT for auth/quota middleware
    if (basisToken) {
      headers["Authorization"] = `Bearer ${basisToken}`;
    }
    return new Client({
      apiUrl: deploymentUrl,
      defaultHeaders: headers,
    });
  }, [deploymentUrl, apiKey, basisToken]);

  const value = useMemo(() => ({ client }), [client]);

  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
}

export function useClient(): Client {
  const context = useContext(ClientContext);

  if (!context) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context.client;
}

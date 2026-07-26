"use client";

import { useState, useRef, useCallback } from "react";
import { Sparkles, X, Send, FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  INSET_GUTTER,
  RIGHT_SIDEBAR_WIDTH,
  CANVAS_TOP_OFFSET,
} from "@/lib/layout-constants";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface AiSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
}

const STARTER_CHIPS = [
  "Design an e-commerce backend",
  "Create a chat app architecture",
  "Build a CI/CD pipeline",
] as const;

export function AiSidebar({ isOpen, onClose }: AiSidebarProps) {
  const [activeTab, setActiveTab] = useState<string>("architect");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = useCallback((textToSend?: string) => {
    const text = (textToSend ?? inputText).trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text,
    };

    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "assistant",
      text: `Got it! Here is an architectural recommendation for "${text}":\n\n• API Gateway for ingress traffic\n• Event Bus (Kafka/NATS) for async events\n• PostgreSQL for persistent storage`,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInputText("");
  }, [inputText]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  return (
    <aside
      aria-label="AI Workspace"
      inert={!isOpen ? true : undefined}
      aria-hidden={!isOpen}
      className={cn(
        "fixed right-[10px] z-20 flex flex-col transition-transform duration-200 ease-out rounded-2xl overflow-hidden border border-surface-border shadow-2xl bg-surface/95 backdrop-blur-md",
        isOpen
          ? "translate-x-0"
          : "translate-x-[calc(100%+20px)] pointer-events-none"
      )}
      style={{
        top: CANVAS_TOP_OFFSET,
        bottom: INSET_GUTTER,
        width: RIGHT_SIDEBAR_WIDTH,
      }}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border bg-surface">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[rgba(100,87,249,0.12)] border border-[rgba(100,87,249,0.2)] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-ai-text" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h2 className="text-[13px] font-semibold text-copy-primary leading-none">
              AI Workspace
            </h2>
            <span className="text-[10px] text-copy-muted leading-none">
              Collaborate with Ghost AI
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Close AI Workspace"
          className="p-1 rounded-lg text-copy-muted hover:text-copy-primary hover:bg-subtle transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs Container */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="px-3 pt-2.5 pb-1 bg-surface border-b border-surface-border">
          <TabsList className="w-full grid grid-cols-2 bg-subtle p-1 rounded-xl h-9">
            <TabsTrigger
              value="architect"
              className="text-[12px] font-medium rounded-lg text-copy-muted data-[state=active]:bg-accent-dim data-[state=active]:text-brand transition-all"
            >
              AI Architect
            </TabsTrigger>
            <TabsTrigger
              value="specs"
              className="text-[12px] font-medium rounded-lg text-copy-muted data-[state=active]:bg-accent-dim data-[state=active]:text-brand transition-all"
            >
              Specs
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: AI Architect */}
        <TabsContent
          value="architect"
          className="flex-1 flex flex-col overflow-hidden m-0 p-0 outline-none"
        >
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
            {messages.length === 0 ? (
              <div className="my-auto flex flex-col items-center text-center p-4 gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[rgba(100,87,249,0.12)] border border-[rgba(100,87,249,0.25)] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-ai-text" />
                </div>
                <div className="flex flex-col gap-1 max-w-[240px]">
                  <span className="text-[13px] font-semibold text-copy-primary">
                    Ghost AI Architect
                  </span>
                  <p className="text-[11px] text-copy-muted leading-relaxed">
                    Ask Ghost AI to design system architectures, generate specs,
                    or analyze diagrams.
                  </p>
                </div>

                {/* Starter Chips */}
                <div className="flex flex-col gap-1.5 w-full mt-2">
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-copy-faint text-left px-1">
                    Starter Suggestions
                  </span>
                  {STARTER_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSendMessage(chip)}
                      className="text-left text-[12px] text-copy-secondary hover:text-copy-primary bg-subtle hover:bg-[#252530] border border-surface-border px-3 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "text-[12.5px] leading-relaxed rounded-2xl p-3 max-w-[88%] shadow-sm",
                    msg.sender === "user"
                      ? "ml-auto bg-accent-dim border border-brand/40 text-copy-primary rounded-tr-xs"
                      : "mr-auto bg-elevated border border-surface-border text-copy-secondary rounded-tl-xs whitespace-pre-wrap"
                  )}
                >
                  {msg.text}
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-surface-border bg-surface flex flex-col gap-2">
            <div className="relative flex items-end rounded-xl border border-surface-border bg-elevated focus-within:border-brand/60 transition-colors overflow-hidden">
              <Textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Ghost AI… (Enter to send)"
                className="w-full resize-none border-0 bg-transparent py-2.5 pl-3 pr-10 text-[12.5px] text-copy-primary placeholder:text-copy-faint focus-visible:ring-0 min-h-[72px] max-h-[160px]"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                aria-label="Send message"
                className="absolute right-2 bottom-2 p-1.5 rounded-lg bg-brand text-black font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand/90 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-[10px] text-copy-faint text-right px-1">
              Press Shift+Enter for new line
            </span>
          </div>
        </TabsContent>

        {/* Tab 2: Specs */}
        <TabsContent
          value="specs"
          className="flex-1 flex flex-col overflow-y-auto p-3.5 gap-3.5 m-0 outline-none"
        >
          <Button
            className="w-full bg-brand hover:bg-brand/90 text-black font-semibold text-[12px] h-9 rounded-xl shadow-md cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Generate Spec
          </Button>

          {/* Demo Spec Card */}
          <div className="bg-elevated border border-surface-border rounded-xl p-3.5 flex flex-col gap-3 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-subtle border border-surface-border flex items-center justify-center text-brand">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[12.5px] font-semibold text-copy-primary leading-none">
                    Architecture Spec v1.0
                  </span>
                  <span className="text-[10px] text-copy-faint mt-0.5">
                    Updated just now
                  </span>
                </div>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-subtle text-copy-muted border border-surface-border">
                Draft
              </span>
            </div>

            <p className="text-[11px] text-copy-secondary leading-relaxed">
              System architecture blueprint detailing microservices, API Gateway
              routing, and database schema mappings.
            </p>

            <Button
              disabled
              variant="outline"
              size="sm"
              className="w-full h-8 text-[11px] border-surface-border bg-subtle text-copy-muted cursor-not-allowed opacity-60"
            >
              <Download className="w-3 h-3 mr-1.5" />
              Download Spec
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  );
}

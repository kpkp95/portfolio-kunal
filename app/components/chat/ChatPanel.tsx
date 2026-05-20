"use client";

/**
 * components/chat/ChatPanel.tsx
 * The main chat panel component — expandable, scrollable conversation view.
 * Renders messages, suggested prompts, input field, and handles streaming.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IoClose, IoSend } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";
import { Message, SUGGESTED_PROMPTS } from "./types";
import ChatMessage from "./ChatMessage";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

/** Generate a simple unique ID for messages */
const genId = () => Math.random().toString(36).slice(2, 9);

/** Welcome message shown when no conversation has started */
const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! 👋 I'm Kunal's AI portfolio assistant. I can answer questions about his projects, skills, experience, and technologies.\n\nWhat would you like to know?",
  timestamp: new Date(),
};

export default function ChatPanel({ isOpen, onClose, isDarkMode }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  /**
   * Core send function — handles the full RAG streaming flow.
   */
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      // Cancel any in-flight request
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setError(null);
      setInput("");

      // Add user message
      const userMessage: Message = {
        id: genId(),
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      };

      // Add a placeholder streaming assistant message
      const assistantId = genId();
      const assistantPlaceholder: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
        isStreaming: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
      setIsLoading(true);

      try {
        // Build conversation history for the API (exclude welcome message)
        const history = messages
          .filter((m) => m.id !== "welcome")
          .map((m) => ({ role: m.role, content: m.content }));

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, history }),
          signal: abortRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        if (!response.body) {
          throw new Error("No response body");
        }

        // ── SSE Stream parsing ─────────────────────────────────────────────
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let fullContent = "";
        let sources: string[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? ""; // keep incomplete line in buffer

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6);
            if (!data) continue;

            try {
              const parsed = JSON.parse(data);

              if (parsed.type === "sources") {
                sources = parsed.sources;
              } else if (parsed.type === "token") {
                fullContent += parsed.content;
                // Update the streaming message with accumulated content
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: fullContent, isStreaming: true }
                      : m
                  )
                );
              } else if (parsed.type === "done") {
                // Finalize the message — stop streaming indicator
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? {
                          ...m,
                          content: fullContent,
                          isStreaming: false,
                          sources,
                        }
                      : m
                  )
                );
              }
            } catch {
              // Ignore malformed SSE lines
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;

        console.error("Chat error:", err);
        const errorMsg =
          "Sorry, something went wrong. Please try again or contact Kunal directly.";
        setError(errorMsg);

        // Replace placeholder with error message
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: errorMsg, isStreaming: false }
              : m
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages]
  );

  /** Handle keyboard: Enter sends, Shift+Enter adds newline */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  /** Auto-resize textarea as content grows */
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const showSuggestedPrompts = messages.length <= 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`
            fixed bottom-24 right-4 sm:right-6
            w-[calc(100vw-2rem)] sm:w-[420px]
            max-h-[80vh] sm:max-h-[600px]
            rounded-2xl shadow-2xl z-50
            flex flex-col overflow-hidden
            ${
              isDarkMode
                ? "bg-[#0d0017]/95 border border-white/10 backdrop-blur-xl"
                : "bg-white/95 border border-gray-200 backdrop-blur-xl shadow-purple-100/50"
            }
          `}
          style={{ boxShadow: isDarkMode ? "0 25px 60px rgba(120,0,200,0.25)" : "0 25px 60px rgba(120,0,200,0.15)" }}
        >
          {/* ── Header ──────────────────────────────────────────────────── */}
          <div
            className={`flex items-center justify-between px-5 py-4 border-b
              ${isDarkMode ? "border-white/10 bg-white/3" : "border-gray-100"}`}
          >
            <div className="flex items-center gap-3">
              {/* Animated AI badge */}
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <span className="text-white text-sm font-bold">AI</span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-current animate-pulse" />
              </div>
              <div>
                <p className={`font-semibold text-sm leading-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Portfolio Assistant
                </p>
                <p className={`text-xs ${isDarkMode ? "text-white/50" : "text-gray-400"}`}>
                  Ask me anything about Kunal
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Resume download shortcut */}
              <a
                href="/kunal_pandey_resume.pdf"
                download
                title="Download Resume"
                className={`p-2 rounded-lg transition hover:scale-110
                  ${isDarkMode ? "hover:bg-white/10 text-white/60 hover:text-white" : "hover:bg-gray-100 text-gray-400 hover:text-gray-700"}`}
              >
                <MdOutlineFileDownload size="1.2em" />
              </a>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition hover:scale-110
                  ${isDarkMode ? "hover:bg-white/10 text-white/60 hover:text-white" : "hover:bg-gray-100 text-gray-400 hover:text-gray-700"}`}
              >
                <IoClose size="1.2em" />
              </button>
            </div>
          </div>

          {/* ── Messages ────────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} isDarkMode={isDarkMode} />
            ))}

            {/* Error banner */}
            {error && (
              <div className="text-center text-xs text-red-400 bg-red-400/10 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {/* Auto-scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Suggested Prompts ───────────────────────────────────────── */}
          {showSuggestedPrompts && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`px-4 pb-3 border-t
                ${isDarkMode ? "border-white/5" : "border-gray-100"}`}
            >
              <p className={`text-xs mt-3 mb-2 ${isDarkMode ? "text-white/40" : "text-gray-400"}`}>
                Suggested questions
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    disabled={isLoading}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 hover:scale-105 active:scale-95
                      ${
                        isDarkMode
                          ? "border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400/50"
                          : "border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300"
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Input Area ──────────────────────────────────────────────── */}
          <div
            className={`px-4 py-3 border-t
              ${isDarkMode ? "border-white/10" : "border-gray-100"}`}
          >
            <div
              className={`flex items-end gap-2 rounded-xl border transition-all duration-200
                ${
                  isDarkMode
                    ? "bg-white/5 border-white/10 focus-within:border-purple-500/50 focus-within:bg-white/8"
                    : "bg-gray-50 border-gray-200 focus-within:border-purple-300 focus-within:bg-white"
                }`}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Kunal's projects, skills…"
                rows={1}
                disabled={isLoading}
                className={`flex-1 resize-none bg-transparent px-4 py-3 text-sm outline-none
                  placeholder:opacity-40 leading-relaxed
                  ${isDarkMode ? "text-white placeholder:text-white" : "text-gray-800 placeholder:text-gray-500"}
                  disabled:opacity-50`}
                style={{ maxHeight: "120px" }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={isLoading || !input.trim()}
                className={`mr-2 mb-2 p-2 rounded-lg transition-all duration-200
                  ${
                    input.trim() && !isLoading
                      ? "bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 active:scale-95"
                      : isDarkMode
                      ? "bg-white/5 text-white/30 cursor-not-allowed"
                      : "bg-gray-100 text-gray-300 cursor-not-allowed"
                  }`}
              >
                <IoSend size="1em" />
              </button>
            </div>
            <p className={`text-xs mt-2 text-center ${isDarkMode ? "text-white/25" : "text-gray-300"}`}>
              Answers based on Kunal&apos;s portfolio knowledge base
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

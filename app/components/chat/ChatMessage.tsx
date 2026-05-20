"use client";

/**
 * components/chat/ChatMessage.tsx
 * Renders a single chat message bubble — for both user and assistant.
 * Supports streaming text, source citations, and Markdown-like rendering.
 */

import React from "react";
import { Message } from "./types";

interface ChatMessageProps {
  message: Message;
  isDarkMode: boolean;
}

/**
 * Minimal inline Markdown renderer.
 * Handles: **bold**, `code`, bullet lines, line breaks.
 */
function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");

  return lines.map((line, lineIdx) => {
    // Render bullet points
    if (line.startsWith("- ") || line.startsWith("• ")) {
      const content = line.replace(/^[-•]\s+/, "");
      return (
        <li key={lineIdx} className="ml-4 list-disc text-sm leading-relaxed">
          {renderInline(content)}
        </li>
      );
    }

    // Render numbered lists
    if (/^\d+\.\s/.test(line)) {
      const content = line.replace(/^\d+\.\s/, "");
      return (
        <li key={lineIdx} className="ml-4 list-decimal text-sm leading-relaxed">
          {renderInline(content)}
        </li>
      );
    }

    // Empty line → spacer
    if (line.trim() === "") {
      return <br key={lineIdx} />;
    }

    // Regular paragraph line
    return (
      <p key={lineIdx} className="text-sm leading-relaxed">
        {renderInline(line)}
      </p>
    );
  });
}

/**
 * Render inline Markdown: **bold** and `code` spans.
 */
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="bg-black/20 dark:bg-white/10 px-1 py-0.5 rounded text-xs font-mono"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

/** Animated typing dots shown while streaming */
function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 ml-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

function formatSourceName(path: string): string {
  const file = path.split(/[\/\\]/).pop() || path;
  switch (file) {
    case "resume.txt": return "📄 Professional Resume";
    case "skills.txt": return "🛠️ Technical Skills";
    case "experience.txt": return "💼 Work History";
    case "project-details.txt": return "🚀 Featured Projects";
    case "portfolio_rag_knowledge_base_master_profile.md": return "📖 Master Profile";
    default: return `📄 ${file.replace(/\.(txt|md)$/, "")}`;
  }
}

export default function ChatMessage({ message, isDarkMode }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md
          ${
            isUser
              ? "bg-gradient-to-br from-purple-500 to-violet-600 text-white"
              : "bg-gradient-to-br from-[#2a004a] to-purple-700 text-white border border-purple-500/30"
          }`}
      >
        {isUser ? "You" : "AI"}
      </div>

      {/* Message bubble */}
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-sm
          ${
            isUser
              ? "bg-gradient-to-br from-purple-600 to-violet-700 text-white rounded-tr-sm"
              : isDarkMode
              ? "bg-white/5 border border-white/10 text-white/90 rounded-tl-sm"
              : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm"
          }`}
      >
        {/* Message content */}
        <div className="space-y-1">
          {message.isStreaming && message.content === "" ? (
            <TypingDots />
          ) : (
            <>
              {renderMarkdown(message.content)}
              {message.isStreaming && <TypingDots />}
            </>
          )}
        </div>

        {/* Source citations */}
        {!message.isStreaming && message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-2 border-t border-white/10">
            <p className="text-xs opacity-60 mb-1">Sources:</p>
            <div className="flex flex-wrap gap-1">
              {message.sources.map((source, i) => (
                <span
                  key={i}
                  className={`text-xs px-2 py-0.5 rounded-full
                    ${
                      isUser
                        ? "bg-white/20 text-white/80"
                        : isDarkMode
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "bg-purple-50 text-purple-700 border border-purple-200"
                    }`}
                >
                  {formatSourceName(source)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <p className={`text-xs mt-2 opacity-40 ${isUser ? "text-right" : "text-left"}`}>
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}

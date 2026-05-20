"use client";

/**
 * components/chat/ChatButton.tsx
 * Floating action button that toggles the chat panel.
 * Shows an unread indicator when the panel has not been opened yet.
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IoClose, IoChatbubbleEllipses } from "react-icons/io5";

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
  isDarkMode: boolean;
}

export default function ChatButton({ isOpen, onClick, isDarkMode }: ChatButtonProps) {
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  // Suppress the attention pulse after first open
  useEffect(() => {
    if (isOpen) {
      setHasBeenOpened(true);
      setShowPulse(false);
    }
  }, [isOpen]);

  // Show pulse after 3s delay to grab attention
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasBeenOpened) setShowPulse(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [hasBeenOpened]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.4, type: "spring", stiffness: 200 }}
      className="fixed bottom-6 right-4 sm:right-6 z-50"
    >
      {/* Attention pulse ring (shown once, before first open) */}
      {showPulse && !isOpen && (
        <span className="absolute inset-0 rounded-full animate-ping bg-purple-500/40 pointer-events-none" />
      )}

      {/* Tooltip label */}
      <AnimatePresence>
        {!isOpen && !hasBeenOpened && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ delay: 2 }}
            className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap
              text-xs px-3 py-1.5 rounded-full shadow-lg pointer-events-none
              ${
                isDarkMode
                  ? "bg-white/10 backdrop-blur-md text-white border border-white/20"
                  : "bg-white text-gray-700 border border-gray-200 shadow-gray-200/50"
              }`}
          >
            Ask me about Kunal ✨
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB button */}
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className={`
          relative w-14 h-14 rounded-full shadow-2xl
          flex items-center justify-center
          bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-700
          text-white border border-purple-400/30
          transition-shadow duration-300
          ${isOpen ? "shadow-purple-500/50" : "shadow-purple-500/30 hover:shadow-purple-500/60"}
        `}
        aria-label={isOpen ? "Close portfolio assistant" : "Open portfolio assistant"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <IoClose size="1.4em" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <IoChatbubbleEllipses size="1.4em" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* "AI" micro-label badge */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 bg-green-400 text-[9px] font-bold text-black px-1 py-0.5 rounded-full leading-none">
            AI
          </span>
        )}
      </motion.button>
    </motion.div>
  );
}

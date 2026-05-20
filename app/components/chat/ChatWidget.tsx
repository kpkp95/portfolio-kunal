"use client";

/**
 * components/chat/ChatWidget.tsx
 * Top-level chat widget — composes the ChatButton and ChatPanel.
 * This is the only component that needs to be added to page.js.
 */

import React, { useState } from "react";
import ChatButton from "./ChatButton";
import ChatPanel from "./ChatPanel";

interface ChatWidgetProps {
  isDarkMode: boolean;
}

export default function ChatWidget({ isDarkMode }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <ChatPanel isOpen={isOpen} onClose={handleClose} isDarkMode={isDarkMode} />
      <ChatButton isOpen={isOpen} onClick={handleToggle} isDarkMode={isDarkMode} />
    </>
  );
}

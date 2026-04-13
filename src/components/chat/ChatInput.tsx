"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Type a message...",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleInput() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }

  return (
    <div className="flex items-end gap-2 p-3 border-t border-border-default bg-surface-raised">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        maxLength={5000}
        className="flex-1 bg-surface-input border border-border-default rounded-comfortable px-3.5 py-2.5 text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-mizo-teal focus:ring-[3px] focus:ring-mizo-teal/20 transition-all resize-none min-h-[40px]"
      />
      <button
        type="button"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="shrink-0 h-10 w-10 flex items-center justify-center rounded-comfortable bg-mizo-red text-white hover:bg-mizo-red-hover active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none transition-all"
        aria-label="Send message"
      >
        <Send size={18} />
      </button>
    </div>
  );
}

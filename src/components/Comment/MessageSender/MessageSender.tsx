import { useState } from "react";

import { SendMessageIcon } from "@/components/icons/SendMessageIcon/SendMessageIcon";
import { InputLoading } from "@/components/InputLoading/InputLoading";
import { ReactionToolbar } from "./ReactionToolbar/ReactionToolbar";

import "./MessageSender.scss";

interface MessageSenderProps {
  onSend?: (text: string) => Promise<void> | void;
  disabled?: boolean;
}

export function MessageSender({ onSend, disabled = false }: MessageSenderProps) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const handleEmojiSelect = (emoji: string) => {
    setInput((prev) => prev + emoji);
  };

  const sendMessage = async () => {
    if (!input.trim() || sending || disabled) return;

    try {
      setSending(true);
      await onSend?.(input.trim());
      setInput("");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="message-sender-wrapper">
      <div className="message-sender">
        {sending || disabled ? (
          <div className="message-sender-sending">
            <InputLoading />
          </div>
        ) : (
          <>
            <ReactionToolbar onEmojiSelect={handleEmojiSelect} />
            <div className="message-sender-input-wrapper">
              <input
                type="text"
                name="message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Please type here"
                onKeyDown={handleKeyDown}
                className="message-sender-input"
              />
              <button className="message-sender-send-button" onClick={sendMessage}>
                <SendMessageIcon color={input.trim() ? "" : "#A5ADBA"} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

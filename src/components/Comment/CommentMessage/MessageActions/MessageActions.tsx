import clsx from "clsx";
import EmojiPicker, { EmojiClickData, EmojiStyle, Theme } from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import "./MessageActions.scss";

interface MessageActionsProps {
  onEmojiClick?: (emoji: string) => void;
  onThreadClick?: () => void;
  visible: boolean;
  ownMessage?: boolean;
  isReactionLoading?: boolean;
  disabled?: boolean;
}

export function MessageActions({
  onEmojiClick,
  onThreadClick,
  visible,
  ownMessage = false,
  isReactionLoading = false,
  disabled = false,
}: MessageActionsProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) {
      setShowEmojiPicker(false);
    }
  }, [visible]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleEmojiButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    // Prevent opening picker while reaction is loading or globally disabled
    if (isReactionLoading || disabled) return;

    if (!showEmojiPicker && emojiButtonRef.current) {
      const buttonRect = emojiButtonRef.current.getBoundingClientRect();
      const pickerWidth = 300;
      const pickerHeight = 350;

      // Detect Safari for specific adjustments
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

      let top = buttonRect.bottom + 4; // Start below the button
      let left = buttonRect.left;

      // For non-own messages (other users), adjust left positioning to ensure picker is visible
      if (!ownMessage) {
        left = buttonRect.right - pickerWidth;
        // If that would make it go off the left edge, position it at the button's left
        if (left < 16) {
          left = buttonRect.left;
        }
      }

      // Check if picker would go off-screen vertically
      if (top + pickerHeight > window.innerHeight) {
        top = buttonRect.top - pickerHeight - 4; // Place above the button
      }

      // Check if picker would go off-screen horizontally
      if (left + pickerWidth > window.innerWidth) {
        left = window.innerWidth - pickerWidth - 16; // Adjust to fit on screen
      }

      // Ensure minimum distance from edges
      top = Math.max(16, top);
      left = Math.max(16, left);

      if (isSafari) {
        // Add extra buffer for Safari's rendering quirks
        top = Math.max(20, top);
        left = Math.max(20, Math.min(left, window.innerWidth - pickerWidth - 20));
      }

      setPickerPosition({ top, left });
    }

    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    // Prevent multiple clicks while loading or globally disabled
    if (isReactionLoading || disabled) return;

    onEmojiClick?.(emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div
      className={clsx("message-actions", {
        visible,
        "own-message": ownMessage,
      })}
    >
      <div className="action-buttons">
        <button
          ref={emojiButtonRef}
          className="action-button emoji-button"
          onClick={handleEmojiButtonClick}
          disabled={isReactionLoading || disabled}
          title={disabled ? "Reactions disabled while loading" : isReactionLoading ? "Sending reaction..." : "Add reaction"}
        >
          {isReactionLoading ? "⏳" : "😊"}
        </button>

        {!!onThreadClick && (
          <button
            className="action-button thread-button"
            onClick={(event) => {
              event.stopPropagation();
              if (!disabled) {
                onThreadClick?.();
              }
            }}
            disabled={disabled}
            title={disabled ? "Replies disabled while loading" : "Reply in thread"}
          >
            💬
          </button>
        )}
      </div>

      {showEmojiPicker &&
        createPortal(
          <div
            ref={pickerRef}
            className="emoji-picker-fixed"
            style={{
              position: "fixed",
              top: pickerPosition.top,
              left: pickerPosition.left,
              zIndex: 99999,
              isolation: "isolate",
              transform: "translateZ(0)",
            }}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              width={300}
              height={350}
              theme={Theme.DARK}
              previewConfig={{
                showPreview: false,
              }}
              lazyLoadEmojis={true}
              searchDisabled={false}
              skinTonesDisabled={true}
              emojiStyle={EmojiStyle.NATIVE}
            />
          </div>,
          document.body
        )}
    </div>
  );
}

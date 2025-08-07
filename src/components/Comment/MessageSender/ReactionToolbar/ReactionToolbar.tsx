import { useState, useEffect } from "react";
import EmojiPicker, {
  EmojiClickData,
  Theme,
  EmojiStyle,
} from "emoji-picker-react";

import "./ReactionToolbar.scss";

interface ReactionToolbarProps {
  onEmojiSelect?: (emoji: string) => void;
}

export function ReactionToolbar({ onEmojiSelect }: ReactionToolbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [pickerKey, setPickerKey] = useState(0);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const expandButton = document.querySelector(
        'button[aria-label="Show all Emojis"]'
      );

      if (expandButton && !expandButton.hasAttribute("data-listener-added")) {
        expandButton.setAttribute("data-listener-added", "true");

        expandButton.addEventListener("click", () => {
          setIsExpanded(true);
        });
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect?.(emojiData.emoji);
  };

  const handleCloseClick = () => {
    setIsExpanded(false);
    setPickerKey((prev) => prev + 1);
  };

  return (
    <div className={`reaction-toolbar ${isExpanded ? "expanded" : ""} `}>
      {isExpanded && (
        <button className="close-picker-button" onClick={handleCloseClick}>
          ✕
        </button>
      )}
      <div>
        <EmojiPicker
          key={pickerKey}
          reactionsDefaultOpen={true}
          onEmojiClick={handleEmojiClick}
          theme={Theme.DARK}
          previewConfig={{
            showPreview: false,
          }}
          lazyLoadEmojis={true}
          searchDisabled={false}
          skinTonesDisabled={true}
          emojiStyle={EmojiStyle.NATIVE}
        />
      </div>
    </div>
  );
}

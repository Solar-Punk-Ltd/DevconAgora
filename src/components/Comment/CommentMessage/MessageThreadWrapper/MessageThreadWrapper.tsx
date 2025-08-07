import "./MessageThreadWrapper.scss";

interface MessageThreadWrapperProps {
  threadCount: number;
  onThreadClick?: () => void;
  disabled?: boolean;
}

export function MessageThreadWrapper({
  threadCount,
  onThreadClick,
  disabled = false,
}: MessageThreadWrapperProps) {
  if (threadCount === 0) {
    return null;
  }

  return (
    <div className="message-thread-wrapper">
      <button
        className="thread-reply-button"
        onClick={disabled ? undefined : onThreadClick || (() => {})}
        disabled={disabled}
        title={disabled ? "Replies disabled while loading" : undefined}
      >
        <span className="thread-icon">💬</span>
        <span className="thread-text">
          {threadCount} {threadCount === 1 ? "Reply" : "Replies"}
        </span>
      </button>
    </div>
  );
}

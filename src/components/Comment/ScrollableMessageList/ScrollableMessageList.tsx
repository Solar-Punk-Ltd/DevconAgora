import React, { useEffect, useRef } from "react";

import "./ScrollableMessageList.scss";

import { VisibleMessage } from "@/hooks/useSwarmComment";

interface ScrollableMessageListProps {
  items: VisibleMessage[];
  renderItem: (item: VisibleMessage) => React.ReactNode;
}

export function ScrollableMessageList({ items, renderItem }: ScrollableMessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousItemsLengthRef = useRef<number>(0);
  const lastScrolledItemsLengthRef = useRef<number>(0);
  const hasInitiallyScrolledRef = useRef<boolean>(false);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  const isNearBottom = () => {
    if (!containerRef.current) return true;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const threshold = 100; // pixels from bottom
    return scrollTop + clientHeight >= scrollHeight - threshold;
  };

  useEffect(() => {
    const count = items.length;
    const hasNewItems = count > previousItemsLengthRef.current;
    const isInitialRender = !hasInitiallyScrolledRef.current && count > 0;
    const shouldScroll = isInitialRender || (hasNewItems && isNearBottom());

    if (shouldScroll && count !== lastScrolledItemsLengthRef.current) {
      previousItemsLengthRef.current = count;
      lastScrolledItemsLengthRef.current = count;

      if (isInitialRender) {
        hasInitiallyScrolledRef.current = true;
      }

      requestAnimationFrame(() => {
        scrollToBottom();
      });
    } else if (hasNewItems) {
      previousItemsLengthRef.current = count;
    }
  }, [items]);

  return (
    <div className="comment-messages-container" ref={containerRef}>
      {items.map(renderItem)}
    </div>
  );
}

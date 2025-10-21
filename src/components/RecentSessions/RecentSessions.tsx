import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { STAGES_MAP } from "../../constants/categories";
import { ROUTES } from "../../constants/routes";
import { useGlobalState } from "../../contexts/global";
import { usePreload } from "../../hooks/usePreload";

import RecentSessionsItem from "./RecentSessionsItem/RecentSessionsItem";

import "./RecentSessions.scss";

const RecentSessions: React.FC = () => {
  const { recentSessions, talkActivity } = useGlobalState();
  const { calcTalksActivity } = usePreload();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setInitialScrollLeft(scrollLeft);
    setStartX(e.touches[0].clientX);
    setHasDragged(false);

    const isAtRightEnd = scrollLeft + clientWidth >= scrollWidth - 10;
    console.log("Touch start - isAtRightEnd:", isAtRightEnd, "scrollLeft:", scrollLeft, "clientWidth:", clientWidth, "scrollWidth:", scrollWidth); // Debug
    if (!isAtRightEnd) {
      setStartX(0);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;

    if (Math.abs(scrollLeft - initialScrollLeft) > 5) {
      setHasDragged(true);
    }

    if (startX === 0) return;

    const isAtRightEnd = scrollLeft + clientWidth >= scrollWidth - 10;
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;

    console.log("Touch move - diff:", diff, "isAtRightEnd:", isAtRightEnd); // Debug

    if (diff > 0 && isAtRightEnd) {
      console.log("Pull-to-refresh activated!");
      e.preventDefault();
      setPullDistance(Math.min(diff, 50));
      setHasDragged(true);
    }
  };

  const handleTouchEnd = async () => {
    await handlePullEnd(pullDistance);

    setTimeout(() => {
      setHasDragged(false);
    }, 100);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setInitialScrollLeft(scrollLeft);
    setHasDragged(false);

    const isAtRightEnd = scrollLeft + clientWidth >= scrollWidth - 10;

    if (isAtRightEnd) {
      setIsDragging(true);
      setStartX(e.clientX);
      e.preventDefault();
    } else {
      setIsDragging(true);
      setStartX(e.clientX);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || startX === 0) return;

      const { scrollLeft } = containerRef.current;

      if (Math.abs(scrollLeft - initialScrollLeft) > 5) {
        setHasDragged(true);
      }
    };

    const container = containerRef.current;
    if (container && (startX !== 0 || isDragging)) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [initialScrollLeft, startX, isDragging]);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !isDragging || startX === 0) return;

      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;

      if (Math.abs(scrollLeft - initialScrollLeft) > 5) {
        setHasDragged(true);
      }

      const isAtRightEnd = scrollLeft + clientWidth >= scrollWidth - 10;
      const currentX = e.clientX;
      const diff = startX - currentX;

      if (Math.abs(diff) > 5) {
        setHasDragged(true);
      }

      if (diff > 0 && isAtRightEnd) {
        e.preventDefault();
        setPullDistance(Math.min(diff, 51));
      }
    };

    const handleGlobalMouseUp = async () => {
      if (!isDragging) return;
      setIsDragging(false);
      await handlePullEnd(pullDistance);

      setTimeout(() => {
        setHasDragged(false);
      }, 100);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, startX, pullDistance, initialScrollLeft]);

  const handlePullEnd = async (currentPullDistance: number) => {
    if (currentPullDistance > 50 && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await calcTalksActivity();
      } catch (error) {
        console.error("Talks refresh failed:", error);
      } finally {
        setIsRefreshing(false);
      }
    }

    setStartX(0);
    setPullDistance(0);
    setIsDragging(false);
  };

  return (
    <div>
      <div className="recent-sessions">
        <div className="recent-sessions__title">Upcoming talks</div>
        <Link to={ROUTES.AGENDA}>
          <div className="recent-sessions__all">Agenda</div>
        </Link>
      </div>

      <div className="recent-sessions-container">
        <div
          ref={containerRef}
          className="recent-sessions__item-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          style={{
            transform: pullDistance > 0 ? `translateX(-${pullDistance}px)` : "none",
            transition: pullDistance === 0 ? "transform 0.2s ease-out" : "none",
            cursor: isDragging ? "grabbing" : "grab",
          }}
        >
          {recentSessions.map((session) => {
            return (
              <div
                key={session.id}
                onClick={(e) => {
                  console.log("Click attempt, hasDragged:", hasDragged);
                  if (hasDragged) {
                    console.log("Click prevented due to drag");
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                  }
                  console.log("Click allowed, navigating...");
                }}
              >
                <RecentSessionsItem
                  key={session.id}
                  id={session.id}
                  title={session.title}
                  stage={STAGES_MAP.get(session.slot_roomId || "") || ""}
                  activity={talkActivity.get(session.id) || 0}
                  disabled={hasDragged}
                />
              </div>
            );
          })}
        </div>

        {pullDistance > 0 && (
          <div
            className="horizontal-pull-refresh-indicator"
            style={{
              opacity: Math.min(pullDistance / 50, 1),
              transform: `translateX(${50 - pullDistance}px)`,
            }}
          >
            {isRefreshing ? <div className="spinner"></div> : pullDistance > 50 ? <div>↻ Release to refresh</div> : <div>→ Pull left to refresh</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentSessions;

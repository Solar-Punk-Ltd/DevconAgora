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
  const verticalContainerRef = useRef<HTMLDivElement>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);

  const [isVerticalRefreshing, setIsVerticalRefreshing] = useState(false);
  const [verticalPullDistance, setVerticalPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isVerticalDragging, setIsVerticalDragging] = useState(false);
  const [hasVerticalDragged, setHasVerticalDragged] = useState(false);
  const [initialScrollTop, setInitialScrollTop] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setInitialScrollLeft(scrollLeft);
    setStartX(e.touches[0].clientX);
    setHasDragged(false);

    const isAtRightEnd = scrollLeft + clientWidth >= scrollWidth - 10;

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

    if (diff > 0 && isAtRightEnd) {
      e.preventDefault();
      setPullDistance(Math.min(diff, 50));
      setHasDragged(true);
    }
  };

  const handleTouchEnd = async () => {
    await handlePullEnd(pullDistance);

    setTimeout(() => {
      setHasDragged(false);
    }, 200);
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
      }, 200);
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
        console.debug("Talks refresh failed:", error);
      } finally {
        setIsRefreshing(false);
      }
    }

    setStartX(0);
    setPullDistance(0);
    setIsDragging(false);
  };

  const handleVerticalTouchStart = (e: React.TouchEvent) => {
    if (!verticalContainerRef.current) {
      return;
    }

    const parentScrollTop = window.scrollY || document.documentElement.scrollTop;
    setInitialScrollTop(parentScrollTop);
    setStartY(e.touches[0].clientY);
    setHasVerticalDragged(false);

    if (parentScrollTop > 10) {
      setStartY(0);
    }
  };

  const handleVerticalTouchMove = (e: React.TouchEvent) => {
    if (!verticalContainerRef.current) return;

    const parentScrollTop = window.scrollY || document.documentElement.scrollTop;

    if (Math.abs(parentScrollTop - initialScrollTop) > 5) {
      setHasVerticalDragged(true);
    }

    if (startY === 0) {
      return;
    }

    const isAtTop = parentScrollTop <= 10;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;

    if (diff > 0 && isAtTop && Math.abs(diff) > 10) {
      e.preventDefault();
      e.stopPropagation();
      setVerticalPullDistance(Math.min(diff, 60));
      setHasVerticalDragged(true);
    }
  };

  const handleVerticalTouchEnd = async () => {
    await handleVerticalPullEnd(verticalPullDistance);

    setTimeout(() => {
      setHasVerticalDragged(false);
    }, 200);
  };

  const handleVerticalMouseDown = (e: React.MouseEvent) => {
    if (!verticalContainerRef.current) return;

    const parentScrollTop = window.scrollY || document.documentElement.scrollTop;
    setInitialScrollTop(parentScrollTop);
    setHasVerticalDragged(false);

    const isAtTop = parentScrollTop <= 10;

    if (isAtTop) {
      setIsVerticalDragging(true);
      setStartY(e.clientY);
      e.preventDefault();
    }
  };

  const handleVerticalPullEnd = async (currentVerticalPullDistance: number) => {
    if (currentVerticalPullDistance > 59 && !isVerticalRefreshing) {
      setIsVerticalRefreshing(true);
      try {
        await calcTalksActivity();
      } catch (error) {
      } finally {
        setIsVerticalRefreshing(false);
      }
    }

    setStartY(0);
    setVerticalPullDistance(0);
    setIsVerticalDragging(false);
  };

  useEffect(() => {
    const handleVerticalGlobalMouseMove = (e: MouseEvent) => {
      if (!verticalContainerRef.current || !isVerticalDragging || startY === 0) return;

      const parentScrollTop = window.scrollY || document.documentElement.scrollTop;

      if (Math.abs(parentScrollTop - initialScrollTop) > 5) {
        setHasVerticalDragged(true);
      }

      const isAtTop = parentScrollTop <= 10;
      const currentY = e.clientY;
      const diff = currentY - startY;

      if (Math.abs(diff) > 5) {
        setHasVerticalDragged(true);
      }

      if (diff > 0 && isAtTop) {
        e.preventDefault();
        setVerticalPullDistance(Math.min(diff, 60));
      }
    };

    const handleVerticalGlobalMouseUp = async () => {
      if (!isVerticalDragging) return;
      setIsVerticalDragging(false);
      await handleVerticalPullEnd(verticalPullDistance);

      setTimeout(() => {
        setHasVerticalDragged(false);
      }, 200);
    };

    if (isVerticalDragging) {
      document.addEventListener("mousemove", handleVerticalGlobalMouseMove);
      document.addEventListener("mouseup", handleVerticalGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleVerticalGlobalMouseMove);
      document.removeEventListener("mouseup", handleVerticalGlobalMouseUp);
    };
  }, [isVerticalDragging, startY, verticalPullDistance, initialScrollTop, isVerticalRefreshing]);

  return (
    <div className="recent-sessions-wrapper">
      <div className="recent-sessions">
        <div className="recent-sessions__title">Upcoming talks</div>
        <Link to={ROUTES.AGENDA}>
          <div className="recent-sessions__all">Agenda</div>
        </Link>
      </div>

      <div
        ref={verticalContainerRef}
        className="recent-sessions-vertical-wrapper"
        onTouchStart={handleVerticalTouchStart}
        onTouchMove={handleVerticalTouchMove}
        onTouchEnd={handleVerticalTouchEnd}
        onMouseDown={handleVerticalMouseDown}
        style={{
          transform: verticalPullDistance > 0 ? `translateY(${verticalPullDistance}px)` : "none",
          transition: verticalPullDistance === 0 ? "transform 0.2s ease-out" : "none",
          cursor: isVerticalDragging ? "grabbing" : "auto",
        }}
      >
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
                    if (hasDragged || hasVerticalDragged) {
                      e.preventDefault();
                      e.stopPropagation();
                      return;
                    }
                  }}
                >
                  <RecentSessionsItem
                    key={session.id}
                    id={session.id}
                    title={session.title}
                    stage={STAGES_MAP.get(session.slot_roomId || "") || ""}
                    activity={talkActivity.get(session.id) || 0}
                    disabled={hasDragged || hasVerticalDragged}
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
              {isRefreshing ? (
                <div className="spinner"></div>
              ) : pullDistance > 50 ? (
                <div>↻ Release to refresh</div>
              ) : (
                <div>→ Pull left to refresh</div>
              )}
            </div>
          )}
        </div>

        {verticalPullDistance > 0 && (
          <div
            className="vertical-pull-refresh-indicator recent-sessions-vertical-indicator"
            style={{
              opacity: Math.min(verticalPullDistance / 60, 1),
              transform: `translateY(${-60}px)`,
            }}
          >
            {isVerticalRefreshing ? (
              <div className="spinner"></div>
            ) : verticalPullDistance > 59 ? (
              <div>↻ Release to refresh</div>
            ) : (
              <div>↓ Pull down to refresh</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentSessions;

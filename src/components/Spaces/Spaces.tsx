import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "../../constants/routes";
import { Room } from "../../types/room";

import SpacesItem from "./SpacesItem/SpacesItem";

import "./Spaces.scss";
import { TEST_CATEGORY } from "@/constants/categories";

interface SpacesProps {
  list: Room[];
  onRefresh?: () => Promise<void>;
}

const Spaces: React.FC<SpacesProps> = ({ list, onRefresh }) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;

    if (containerRef.current.scrollTop === 0) {
      setStartY(e.touches[0].clientY);
      setHasDragged(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current || startY === 0) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;

    if (diff > 0 && containerRef.current.scrollTop === 0) {
      e.preventDefault();
      setPullDistance(Math.min(diff, 51));
      setHasDragged(true);
    }
  };

  const handleTouchEnd = async () => {
    await handlePullEnd(pullDistance);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    if (containerRef.current.scrollTop === 0) {
      setIsDragging(true);
      setStartY(e.clientY);
      setHasDragged(false);
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !isDragging || startY === 0) return;

    const currentY = e.clientY;
    const diff = currentY - startY;

    if (diff > 0 && containerRef.current.scrollTop === 0) {
      e.preventDefault();
      setPullDistance(Math.min(diff, 67));
      setHasDragged(true);
    }
  };

  const handleMouseUp = async () => {
    if (!isDragging) return;
    setIsDragging(false);
    await handlePullEnd(pullDistance);
  };

  const handleMouseLeave = async () => {
    if (!isDragging) return;
    setIsDragging(false);
    await handlePullEnd(pullDistance);
  };

  const handlePullEnd = async (currentPullDistance: number) => {
    if (currentPullDistance > 66 && onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
      } finally {
        setIsRefreshing(false);
      }
    }

    setStartY(0);
    setPullDistance(0);
  };

  return (
    <div>
      <div className="recent-rooms">
        <div className="recent-rooms__title">Buzz spaces</div>
      </div>

      {pullDistance > 0 && (
        <div
          className="pull-refresh-indicator"
          style={{
            opacity: Math.min(pullDistance / 66, 1),
            transform: `translateY(-${66 - pullDistance}px)`,
          }}
        >
          {isRefreshing ? <div className="spinner"></div> : pullDistance > 66 ? <div>↻ Release to refresh</div> : <div>↓ Pull down to refresh</div>}
        </div>
      )}
      <div
        ref={containerRef}
        className="spaces-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : "none",
          transition: pullDistance === 0 ? "transform 0.2s ease-out" : "none",
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        {list.map((room) => {
          if (room.topic === TEST_CATEGORY) return null;
          return (
            <div
              key={room.topic}
              onClick={(e) => {
                if (hasDragged) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                navigate(`${ROUTES.TALKS}/${room.topic}`);
              }}
            >
              <SpacesItem title={room.topic} numberOfActiveUsers={room.userCount || 0} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Spaces;

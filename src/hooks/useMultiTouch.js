import { useState, useRef, useCallback } from 'react';

export function useMultiTouch(onTouchMove, onTouchEnd) {
  const [touches, setTouches] = useState({});
  const touchesRef = useRef({});

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    const newTouches = {};
    for (let touch of e.changedTouches) {
      newTouches[touch.identifier] = {
        x: touch.clientX,
        y: touch.clientY,
        points: [{ x: touch.clientX, y: touch.clientY }],
      };
    }
    setTouches((prev) => {
      const updated = { ...prev, ...newTouches };
      touchesRef.current = updated;
      return updated;
    });
  }, []);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    const currentTouches = touchesRef.current;
    const updatedTouches = {};
    for (let touch of e.changedTouches) {
      const existing = currentTouches[touch.identifier];
      if (existing) {
        updatedTouches[touch.identifier] = {
          ...existing,
          x: touch.clientX,
          y: touch.clientY,
          points: [...existing.points, { x: touch.clientX, y: touch.clientY }],
        };
      }
    }
    setTouches((prev) => {
      const updated = { ...prev, ...updatedTouches };
      touchesRef.current = updated;
      return updated;
    });

    if (onTouchMove) {
      onTouchMove({ ...currentTouches, ...updatedTouches });
    }
  }, [onTouchMove]);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    const currentTouches = touchesRef.current;
    const endedTouches = {};
    for (let touch of e.changedTouches) {
      const existing = currentTouches[touch.identifier];
      if (existing) {
        endedTouches[touch.identifier] = existing;
      }
    }
    setTouches((prev) => {
      const next = { ...prev };
      for (let id of Object.keys(endedTouches)) {
        delete next[id];
      }
      touchesRef.current = next;
      return next;
    });

    if (onTouchEnd) {
      onTouchEnd(endedTouches);
    }
  }, [onTouchEnd]);

  const clearCanvas = useCallback(() => {
    setTouches({});
    touchesRef.current = {};
  }, []);

  return {
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    touches,
    clearCanvas,
  };
}

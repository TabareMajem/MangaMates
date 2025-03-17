"use client";

import { useSpring } from "@react-spring/web";
import { useState, useCallback } from "react";

export function useChartAnimation(initialZoom = 1) {
  const [zoom, setZoom] = useState(initialZoom);
  
  const [springs, api] = useSpring(() => ({
    scale: initialZoom,
    config: { tension: 300, friction: 20 }
  }));

  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(2, zoom + 0.1);
    setZoom(newZoom);
    api.start({ scale: newZoom });
  }, [zoom, api]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(0.5, zoom - 0.1);
    setZoom(newZoom);
    api.start({ scale: newZoom });
  }, [zoom, api]);

  const handleReset = useCallback(() => {
    setZoom(initialZoom);
    api.start({ scale: initialZoom });
  }, [initialZoom, api]);

  return {
    zoom,
    springs,
    handleZoomIn,
    handleZoomOut,
    handleReset
  };
}

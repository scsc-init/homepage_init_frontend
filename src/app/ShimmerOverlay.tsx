'use client';

import { useEffect, useRef } from 'react';
type ShimmerOverlayProps = {
  src: string;
  className?: string;
  width: number;
  height: number;
  onReady?: () => void;
};

export default function ShimmerOverlay({
  src,
  className,
  width,
  height,
  onReady,
}: ShimmerOverlayProps) {
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    onReadyRef.current?.();
  }, []);

  return (
    <div
      className={className}
      style={{ aspectRatio: `${width} / ${height}` }}
      data-hero-dots=""
      data-src={src}
      aria-hidden="true"
    />
  );
}

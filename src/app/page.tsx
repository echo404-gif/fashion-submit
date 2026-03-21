"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

const ICON_W = 120;
const ICON_H = 120; // approx height including label

interface IconPos { x: number; y: number }

const INITIAL_POSITIONS: IconPos[] = [
  { x: -200, y: -60 }, // relative to center
  { x:  -40, y: -60 },
  { x:  120, y: -60 },
];

const ICONS = [
  { img: "/icon-folder.png",  label: "Magazine Database",    href: "/database" },
  { img: "/icon-globe.png",   label: "Fashion Websites",     href: "/fashion-websites" },
  { img: "/icon-notepad.png", label: "Contact / 投稿助手",   href: "/submit" },
];

export default function Desktop() {
  const router = useRouter();

  // Absolute pixel positions (initialised after mount when window size is known)
  const [positions, setPositions] = useState<IconPos[] | null>(null);

  useEffect(() => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    setPositions(INITIAL_POSITIONS.map(({ x, y }) => ({ x: cx + x, y: cy + y })));
  }, []);

  // Drag state (kept in a ref to avoid re-renders during mousemove)
  const dragging = useRef<{
    idx: number;
    startMouseX: number;
    startMouseY: number;
    startIconX: number;
    startIconY: number;
    moved: boolean;
  } | null>(null);

  const onMouseDown = useCallback((e: React.MouseEvent, idx: number) => {
    if (!positions) return;
    e.preventDefault();
    dragging.current = {
      idx,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startIconX: positions[idx].x,
      startIconY: positions[idx].y,
      moved: false,
    };
  }, [positions]);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      const d = dragging.current;
      if (!d) return;
      const dx = e.clientX - d.startMouseX;
      const dy = e.clientY - d.startMouseY;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) d.moved = true;
      if (!d.moved) return;

      const maxX = window.innerWidth  - ICON_W;
      const maxY = window.innerHeight - ICON_H;
      const newX = Math.max(0, Math.min(maxX, d.startIconX + dx));
      const newY = Math.max(0, Math.min(maxY, d.startIconY + dy));

      setPositions((prev) => {
        if (!prev) return prev;
        const next = [...prev];
        next[d.idx] = { x: newX, y: newY };
        return next;
      });
    }

    function onMouseUp(e: MouseEvent) {
      const d = dragging.current;
      if (!d) return;
      if (!d.moved) {
        // treat as click — navigate
        router.push(ICONS[d.idx].href);
      }
      dragging.current = null;
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [router]);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* XP wallpaper */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url('/xp-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />

      {/* Desktop icons */}
      {positions && ICONS.map(({ img, label }, idx) => (
        <div
          key={label}
          onMouseDown={(e) => onMouseDown(e, idx)}
          style={{
            position: "absolute",
            left: positions[idx].x,
            top:  positions[idx].y,
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            padding: "12px",
            borderRadius: "2px",
            width: `${ICON_W}px`,
            opacity: dragging.current?.idx === idx && dragging.current?.moved ? 0.85 : 1,
          }}
        >
          <img
            src={img}
            alt={label}
            draggable={false}
            style={{ width: "80px", height: "80px", objectFit: "contain", imageRendering: "pixelated" }}
          />
          <span
            style={{
              fontSize: "13px",
              color: "#fff",
              textShadow: "1px 1px 2px black, 0 0 4px black",
              textAlign: "center",
              lineHeight: 1.3,
              padding: "1px 3px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

const ICON_W = 100;
const ICON_H = 110;

interface IconPos { x: number; y: number }

// Offsets from window center: calc(50% + offset)
// Icon 0: calc(50% - 180px), Icon 1: calc(50% - 50px), Icon 2: calc(50% + 80px)
const INITIAL_OFFSETS: IconPos[] = [
  { x: -180, y: -60 },
  { x:  -50, y: -60 }, // -ICON_W/2 so icon is centered
  { x:   80, y: -60 },
];

const ICONS = [
  { img: "/icon-folder.png",  label: "Magazine Database",    href: "/database" },
  { img: "/icon-globe.png",   label: "Fashion Websites",     href: "/fashion-websites" },
  { img: "/icon-notepad.png", label: "Contact / 投稿助手",   href: "/submit" },
];

type DragState =
  | { type: "icon"; clickedIdx: number; startMouseX: number; startMouseY: number; startPositions: IconPos[]; selectedIndices: number[]; moved: boolean }
  | { type: "select"; startMouseX: number; startMouseY: number }
  | null;

export default function Desktop() {
  const router = useRouter();
  const [positions, setPositions] = useState<IconPos[] | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [selBox, setSelBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  useEffect(() => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    setPositions(INITIAL_OFFSETS.map(({ x, y }) => ({ x: cx + x, y: cy + y })));
  }, []);

  const drag = useRef<DragState>(null);
  const posRef = useRef<IconPos[] | null>(null);
  const selRef = useRef<Set<number>>(new Set());

  useEffect(() => { posRef.current = positions; }, [positions]);
  useEffect(() => { selRef.current = selected; }, [selected]);

  const onIconMouseDown = useCallback((e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    e.stopPropagation(); // prevent background drag from starting
    const pos = posRef.current;
    if (!pos) return;

    const curSel = selRef.current;
    // Keep all selected if clicking an already-selected icon; otherwise select only this one
    const newSel = curSel.has(idx) ? new Set(curSel) : new Set([idx]);
    if (!curSel.has(idx)) setSelected(newSel);

    drag.current = {
      type: "icon",
      clickedIdx: idx,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startPositions: pos.map(p => ({ ...p })),
      selectedIndices: [...newSel],
      moved: false,
    };
  }, []);

  const onBgMouseDown = useCallback((e: React.MouseEvent) => {
    setSelected(new Set());
    drag.current = {
      type: "select",
      startMouseX: e.clientX,
      startMouseY: e.clientY,
    };
  }, []);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      const d = drag.current;
      if (!d) return;

      if (d.type === "select") {
        setSelBox({
          x: Math.min(d.startMouseX, e.clientX),
          y: Math.min(d.startMouseY, e.clientY),
          w: Math.abs(e.clientX - d.startMouseX),
          h: Math.abs(e.clientY - d.startMouseY),
        });
      } else if (d.type === "icon") {
        const dx = e.clientX - d.startMouseX;
        const dy = e.clientY - d.startMouseY;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) d.moved = true;
        if (!d.moved) return;

        const W = window.innerWidth;
        const H = window.innerHeight;

        // Compute the tightest allowed delta across all selected icons
        const sps = d.selectedIndices.map(i => d.startPositions[i]);
        const dxMin = -Math.min(...sps.map(p => p.x));
        const dxMax =  W - ICON_W - Math.max(...sps.map(p => p.x));
        const dyMin = -Math.min(...sps.map(p => p.y));
        const dyMax =  H - ICON_H - Math.max(...sps.map(p => p.y));
        const cdx = Math.max(dxMin, Math.min(dxMax, dx));
        const cdy = Math.max(dyMin, Math.min(dyMax, dy));

        setPositions(prev => {
          if (!prev) return prev;
          const next = [...prev];
          for (const i of d.selectedIndices) {
            next[i] = { x: d.startPositions[i].x + cdx, y: d.startPositions[i].y + cdy };
          }
          return next;
        });
      }
    }

    function onMouseUp(e: MouseEvent) {
      const d = drag.current;
      drag.current = null;
      if (!d) return;

      if (d.type === "select") {
        setSelBox(null);
        const x1 = Math.min(d.startMouseX, e.clientX);
        const y1 = Math.min(d.startMouseY, e.clientY);
        const x2 = Math.max(d.startMouseX, e.clientX);
        const y2 = Math.max(d.startMouseY, e.clientY);
        // Only commit selection if box is non-trivial
        if (x2 - x1 > 3 || y2 - y1 > 3) {
          const pos = posRef.current;
          if (pos) {
            const newSel = new Set<number>();
            pos.forEach((p, idx) => {
              if (p.x < x2 && p.x + ICON_W > x1 && p.y < y2 && p.y + ICON_H > y1) {
                newSel.add(idx);
              }
            });
            setSelected(newSel);
          }
        }
      } else if (d.type === "icon") {
        if (!d.moved) {
          router.push(ICONS[d.clickedIdx].href);
        }
      }
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
      onMouseDown={onBgMouseDown}
      style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", userSelect: "none" }}
    >
      {/* XP wallpaper */}
      <div
        style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundImage: "url('/xp-bg.jpg')",
          backgroundSize: "cover", backgroundPosition: "center",
          zIndex: 0, pointerEvents: "none",
        }}
      />

      {/* Icons */}
      {positions && ICONS.map(({ img, label }, idx) => {
        const isSel = selected.has(idx);
        return (
          <div
            key={label}
            onMouseDown={(e) => onIconMouseDown(e, idx)}
            style={{
              position: "absolute",
              left: positions[idx].x,
              top:  positions[idx].y,
              zIndex: isSel ? 2 : 1,
              width: `${ICON_W}px`, minWidth: `${ICON_W}px`,
              display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
              padding: "12px", borderRadius: "2px", boxSizing: "border-box",
              background: isSel ? "rgba(49,106,197,0.3)" : "transparent",
              border: isSel ? "1px solid rgba(49,106,197,0.7)" : "1px solid transparent",
            }}
          >
            <img
              src={img} alt={label} draggable={false}
              style={{ width: "80px", height: "80px", objectFit: "contain", imageRendering: "pixelated" }}
            />
            <span
              style={{
                fontSize: "13px", color: "#fff",
                textShadow: "1px 1px 2px black, 0 0 4px black",
                textAlign: "center", lineHeight: 1.3,
                padding: "1px 3px", width: "100%", boxSizing: "border-box",
                background: isSel ? "rgba(49,106,197,0.5)" : "transparent",
              }}
            >
              {label}
            </span>
          </div>
        );
      })}

      {/* Rubber-band selection box */}
      {selBox && selBox.w > 0 && selBox.h > 0 && (
        <div
          style={{
            position: "fixed",
            left: selBox.x, top: selBox.y, width: selBox.w, height: selBox.h,
            background: "rgba(49,106,197,0.2)",
            border: "1px solid rgba(49,106,197,0.8)",
            zIndex: 10, pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}

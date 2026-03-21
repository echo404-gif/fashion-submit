"use client";

import { useState, useMemo } from "react";
import {
  brands, magazines, difficultyConfig, regionLabels, formatLabels,
  difficulties, regions, pubTypes, styles, isChina,
  type Difficulty, type Region, type Format, type PubType, type Style,
} from "@/data/magazines";

const BG       = "#f4f3f0";
const BDR      = "#e2e0db";
const BDR_MID  = "#ccc9c2";

const SEL: React.CSSProperties = {
  padding: "8px 28px 8px 12px",
  border: `1px solid ${BDR_MID}`,
  background: BG,
  fontSize: "11px",
  letterSpacing: "0.05em",
  outline: "none",
  cursor: "pointer",
  borderRadius: "2px",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23888'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
};

const INPUT: React.CSSProperties = {
  padding: "8px 12px",
  border: `1px solid ${BDR_MID}`,
  background: BG,
  fontSize: "11px",
  letterSpacing: "0.05em",
  outline: "none",
  borderRadius: "2px",
};

// Badge style per difficulty
const badgeConfig: Record<Difficulty, { bg: string; color: string; border: string }> = {
  顶级极难: { bg: "#f0efed", color: "#1a1917", border: "#1a1917" },
  极难:     { bg: "#fdf0ef", color: "#c9302c", border: "#c9302c" },
  较难:     { bg: "#fef3ec", color: "#d96425", border: "#d96425" },
  中等:     { bg: "#fefae8", color: "#b8860b", border: "#b8860b" },
  较易:     { bg: "#edf7f1", color: "#2a7a45", border: "#2a7a45" },
};

// ── Search URLs ───────────────────────────────────────────────────────
const xhsUrl = (q: string) => `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(q)}&source=web_explore_feed`;
const igUrl  = (handle: string) => `https://instagram.com/${handle}`;

export default function Home() {
  const [search, setSearch]                 = useState("");
  const [selDifficulty, setSelDifficulty]   = useState<Difficulty | "">("");
  const [selRegion, setSelRegion]           = useState<Region | "">("");
  const [selFormat, setSelFormat]           = useState<Format | "">("");
  const [selPubType, setSelPubType]         = useState<PubType | "">("");
  const [selStyle, setSelStyle]             = useState<Style | "">("");

  const filtered = useMemo(() => magazines.filter((m) => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (selDifficulty && m.difficulty !== selDifficulty) return false;
    if (selRegion && m.region !== selRegion) return false;
    if (selFormat && m.format !== selFormat) return false;
    if (selPubType && m.pubType !== selPubType) return false;
    if (selStyle && m.style !== selStyle) return false;
    return true;
  }), [search, selDifficulty, selRegion, selFormat, selPubType, selStyle]);

  const hasFilter = search || selDifficulty || selRegion || selFormat || selPubType || selStyle;
  const clearAll = () => { setSearch(""); setSelDifficulty(""); setSelRegion(""); setSelFormat(""); setSelPubType(""); setSelStyle(""); };

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#000", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

      {/* ── Header ── */}
      <header style={{ borderBottom: `1px solid ${BDR}`, padding: "44px clamp(16px, 5vw, 48px) 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 12px", color: "#aaa" }}>
              Fashion Magazine Submission Platform
            </p>
            <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: "300", letterSpacing: "-0.025em", margin: 0, lineHeight: 1 }}>
              Magazine Database
            </h1>
            <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", margin: "12px 0 0", color: "#bbb" }}>
              {magazines.length} Publications · {regions.length} Regions
            </p>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════
          主品牌区块
      ════════════════════════════════════════════════════════════════ */}
      <section style={{ borderBottom: `1px solid ${BDR}`, padding: "36px clamp(16px, 5vw, 48px) 40px", background: "#ffffff" }}>
        <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 24px", color: "#888" }}>
          主品牌 · Global Brands
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {brands.map((b) => (
            <BrandChip key={b.name} b={b} />
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          Filters
      ════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: "20px clamp(16px, 5vw, 48px)", borderBottom: `1px solid ${BDR}`, display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="text" placeholder="Search…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...INPUT, minWidth: "160px", flex: "1", maxWidth: "220px" }}
        />
        <select value={selDifficulty} onChange={(e) => setSelDifficulty(e.target.value as Difficulty | "")} style={SEL}>
          <option value="">ALL LEVELS</option>
          {difficulties.map((d) => <option key={d} value={d}>{difficultyConfig[d].label}</option>)}
        </select>
        <select value={selRegion} onChange={(e) => setSelRegion(e.target.value as Region | "")} style={SEL}>
          <option value="">ALL REGIONS</option>
          {regions.map((r) => <option key={r} value={r}>{regionLabels[r]}</option>)}
        </select>
        <select value={selFormat} onChange={(e) => setSelFormat(e.target.value as Format | "")} style={SEL}>
          <option value="">ALL FORMATS</option>
          <option value="hybrid">{formatLabels.hybrid}</option>
          <option value="digital">{formatLabels.digital}</option>
        </select>
        <select value={selPubType} onChange={(e) => setSelPubType(e.target.value as PubType | "")} style={SEL}>
          <option value="">ALL TYPES</option>
          {pubTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={selStyle} onChange={(e) => setSelStyle(e.target.value as Style | "")} style={SEL}>
          <option value="">ALL STYLES</option>
          {styles.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <span style={{ fontSize: "11px", color: "#aaa", letterSpacing: "0.1em", marginLeft: "auto", whiteSpace: "nowrap" }}>
          {filtered.length} / {magazines.length}
        </span>
        {hasFilter && (
          <button onClick={clearAll} style={{ padding: "8px 16px", border: "1px solid #000", background: "#000", color: "#fff", fontSize: "11px", letterSpacing: "0.1em", cursor: "pointer", borderRadius: "2px" }}>
            Clear
          </button>
        )}
      </div>

      {/* Difficulty filter chips */}
      <div style={{ padding: "12px clamp(16px, 5vw, 48px)", borderBottom: `1px solid ${BDR}`, display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#999", marginRight: "4px", whiteSpace: "nowrap" }}>
          按难度筛选
        </span>
        {difficulties.map((d) => {
          const cfg = difficultyConfig[d];
          const count = magazines.filter((m) => m.difficulty === d).length;
          const isActive = selDifficulty === d;
          return (
            <button
              key={d}
              onClick={() => setSelDifficulty(isActive ? "" : d)}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                background: isActive ? BG : "transparent",
                border: `1px solid ${isActive ? BDR_MID : BDR}`,
                borderRadius: "99px",
                cursor: "pointer",
                padding: "5px 10px",
                opacity: selDifficulty && !isActive ? 0.4 : 1,
                transition: "opacity 0.15s, background 0.15s",
              }}
            >
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: cfg.color, display: "block", flexShrink: 0 }} />
              <span style={{ fontSize: "11px", letterSpacing: "0.05em" }}>{cfg.label} · {count}</span>
            </button>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          Magazine Grid
      ════════════════════════════════════════════════════════════════ */}
      <main style={{ padding: "clamp(16px, 5vw, 48px)" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#bbb" }}>
            <p style={{ fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase" }}>No results</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))", gap: "10px" }}>
            {filtered.map((mag) => {
              const cfg = difficultyConfig[mag.difficulty];
              const badge = badgeConfig[mag.difficulty];
              const china = isChina(mag.region);
              const cnName = mag.cnSearchName ?? mag.name;
              return (
                <div
                  key={mag.name}
                  style={{
                    border: `1px solid ${BDR}`,
                    borderRadius: "4px",
                    display: "flex",
                    flexDirection: "column",
                    background: "#fff",
                    transition: "box-shadow 0.15s, transform 0.15s, border-color 0.15s",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.boxShadow = "0 4px 18px rgba(0,0,0,0.07)";
                    el.style.transform = "translateY(-2px)";
                    el.style.borderColor = BDR_MID;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.boxShadow = "none";
                    el.style.transform = "translateY(0)";
                    el.style.borderColor = BDR;
                  }}
                >
                  {/* Difficulty bar */}
                  <div style={{ height: "4px", background: cfg.color }} />

                  <div style={{ padding: "18px 20px 18px", display: "flex", flexDirection: "column", gap: "11px", flex: 1 }}>

                    {/* Row 1: difficulty badge + region */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                      <span style={{
                        fontSize: "10px", letterSpacing: "0.1em", padding: "2px 7px",
                        border: `1px solid ${badge.border}`,
                        background: badge.bg,
                        color: badge.color,
                        whiteSpace: "nowrap", flexShrink: 0,
                        borderRadius: "2px",
                      }}>
                        {cfg.label}
                      </span>
                      <span style={{ fontSize: "13px", fontWeight: "400", color: "#222", whiteSpace: "nowrap", textAlign: "right", lineHeight: 1.3, letterSpacing: "0.01em" }}>
                        {regionLabels[mag.region]}
                      </span>
                    </div>

                    {/* Name */}
                    <h2 style={{ fontSize: "17px", fontWeight: "300", letterSpacing: "-0.01em", margin: 0, lineHeight: 1.3 }}>
                      {mag.name}
                    </h2>

                    {/* Tags */}
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                      <Tag label={formatLabels[mag.format]} />
                      <Tag label={mag.pubType} dark />
                      <Tag label={mag.style} />
                    </div>

                    {/* Buttons */}
                    <div style={{ marginTop: "auto", paddingTop: "6px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {mag.website   && <LinkBtn href={mag.website} label="官网 →" primary />}
                      {mag.instagram && <LinkBtn href={igUrl(mag.instagram)} label="IG →" />}
                      {china && <>
                        <LinkBtn href={xhsUrl(cnName)} label="小红书" accent="#E1306C" />
                      </>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${BDR}`, padding: "20px clamp(16px, 5vw, 48px)", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#ccc" }}>Magazine Submission Platform</span>
        <span style={{ fontSize: "10px", color: "#ddd" }}>{new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────

function BrandChip({ b }: { b: typeof brands[0] }) {
  return (
    <div
      style={{
        padding: "7px 11px",
        border: `1px solid ${BDR}`,
        borderRadius: "2px",
        background: BG,
        transition: "background 0.12s, color 0.12s",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "#000"; (e.currentTarget as HTMLDivElement).style.color = "#fff"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = BG; (e.currentTarget as HTMLDivElement).style.color = ""; }}
    >
      <h3 style={{ fontSize: "14px", fontWeight: "300", letterSpacing: "-0.01em", margin: 0, lineHeight: 1.2 }}>
        {b.name}
      </h3>
      <div style={{ display: "flex", gap: "6px" }}>
        <LinkBtn href={b.website}          label="官网 →" primary />
        <LinkBtn href={igUrl(b.instagram)} label="IG →" />
      </div>
    </div>
  );
}

function Tag({ label, dark }: { label: string; dark?: boolean }) {
  return (
    <span style={{
      fontSize: "10px", letterSpacing: "0.06em",
      padding: "2px 7px", border: "1px solid",
      borderColor: dark ? "#333" : BDR,
      background: dark ? "#000" : "transparent",
      color: dark ? "#fff" : "#999",
      whiteSpace: "nowrap",
      borderRadius: "2px",
    }}>
      {label}
    </span>
  );
}

function LinkBtn({ href, label, primary, accent }: { href: string; label: string; primary?: boolean; accent?: string }) {
  const base = accent ?? (primary ? "#000" : "#aaa");
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      style={{ display: "inline-block", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 11px", border: `1px solid ${base}`, color: base, textDecoration: "none", transition: "all 0.12s", whiteSpace: "nowrap", borderRadius: "2px" }}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = base; el.style.color = "#fff"; }}
      onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "transparent"; el.style.color = base; }}
    >
      {label}
    </a>
  );
}

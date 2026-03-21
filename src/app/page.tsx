"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  brands, magazines, difficultyConfig, regionLabels, formatLabels,
  difficulties, regions, pubTypes, styles, isChina,
  type Difficulty, type Region, type Format, type PubType, type Style,
} from "@/data/magazines";

const SEL: React.CSSProperties = {
  padding: "8px 12px", border: "1px solid #000", background: "transparent",
  fontSize: "11px", letterSpacing: "0.05em", outline: "none", cursor: "pointer",
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
    <div style={{ minHeight: "100vh", background: "#fff", color: "#000", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

      {/* ── Header ── */}
      <header style={{ borderBottom: "1px solid #000", padding: "44px clamp(16px, 5vw, 48px) 28px" }}>
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
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <FashionWebsitesBtn />
            <SubmitBtn />
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════
          主品牌区块
      ════════════════════════════════════════════════════════════════ */}
      <section style={{ borderBottom: "2px solid #000", padding: "36px clamp(16px, 5vw, 48px) 40px", background: "#fafafa" }}>
        <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 24px", color: "#888" }}>
          主品牌 · Global Brands
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))", gap: "1px", border: "1px solid #ddd" }}>
          {brands.map((b) => (
            <div
              key={b.name}
              style={{ padding: "18px 20px", borderRight: "1px solid #ddd", borderBottom: "1px solid #ddd", background: "#fafafa", transition: "background 0.1s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0f0")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fafafa")}
            >
              <h3 style={{ fontSize: "15px", fontWeight: "300", letterSpacing: "-0.01em", margin: "0 0 14px", lineHeight: 1.2 }}>
                {b.name}
              </h3>
              <div style={{ display: "flex", gap: "6px" }}>
                <LinkBtn href={b.website}       label="官网 →" primary />
                <LinkBtn href={igUrl(b.instagram)} label="IG →" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          Filters
      ════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: "20px clamp(16px, 5vw, 48px)", borderBottom: "1px solid #e0e0e0", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="text" placeholder="Search…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...SEL, minWidth: "160px", flex: "1", maxWidth: "220px" }}
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
          <button onClick={clearAll} style={{ padding: "8px 16px", border: "1px solid #000", background: "#000", color: "#fff", fontSize: "11px", letterSpacing: "0.1em", cursor: "pointer" }}>
            Clear
          </button>
        )}
      </div>

      {/* Difficulty legend */}
      <div style={{ padding: "12px clamp(16px, 5vw, 48px)", borderBottom: "1px solid #f0f0f0", display: "flex", gap: "22px", flexWrap: "wrap" }}>
        {difficulties.map((d) => {
          const cfg = difficultyConfig[d];
          const count = magazines.filter((m) => m.difficulty === d).length;
          return (
            <button key={d} onClick={() => setSelDifficulty(selDifficulty === d ? "" : d)} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", padding: "2px 0", opacity: selDifficulty && selDifficulty !== d ? 0.22 : 1, transition: "opacity 0.15s" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: cfg.color, display: "block" }} />
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))", border: "1px solid #000" }}>
            {filtered.map((mag) => {
              const cfg = difficultyConfig[mag.difficulty];
              const china = isChina(mag.region);
              const cnName = mag.cnSearchName ?? mag.name;
              return (
                <div
                  key={mag.name}
                  style={{ borderRight: "1px solid #000", borderBottom: "1px solid #000", display: "flex", flexDirection: "column", background: "#fff", transition: "background 0.12s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8f8f8")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                >
                  {/* Difficulty bar */}
                  <div style={{ height: "4px", background: cfg.color }} />

                  <div style={{ padding: "18px 20px 18px", display: "flex", flexDirection: "column", gap: "11px", flex: 1 }}>

                    {/* Row 1: difficulty badge + region */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                      <span style={{ fontSize: "9px", letterSpacing: "0.1em", padding: "2px 7px", border: `1px solid ${cfg.color}`, color: cfg.color, whiteSpace: "nowrap", flexShrink: 0 }}>
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
      <footer style={{ borderTop: "1px solid #ebebeb", padding: "20px clamp(16px, 5vw, 48px)", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#ccc" }}>Magazine Submission Platform</span>
        <span style={{ fontSize: "10px", color: "#ddd" }}>{new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────

function FashionWebsitesBtn() {
  return (
    <Link
      href="/fashion-websites"
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-end",
        textDecoration: "none",
        padding: "14px 18px",
        border: "1px solid #F5D4CF",
        background: "#FDF6F0",
        flexShrink: 0,
        transition: "background 0.12s, border-color 0.12s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.background = "#FCE8E4";
        el.style.borderColor = "#D48888";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.background = "#FDF6F0";
        el.style.borderColor = "#F5D4CF";
      }}
    >
      <span style={{ fontFamily: "'Arial Black', 'Helvetica Neue', Arial, sans-serif", fontWeight: 900, fontSize: "13px", letterSpacing: "-0.02em", textTransform: "lowercase", color: "#C46060", lineHeight: 1 }}>
        fashion websites
      </span>
      <span style={{ fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#B07070", marginTop: "5px" }}>
        11 resources →
      </span>
    </Link>
  );
}

function SubmitBtn() {
  return (
    <Link
      href="/submit"
      style={{
        display: "inline-flex", flexDirection: "column", alignItems: "flex-end",
        textDecoration: "none", padding: "14px 18px",
        border: "1px solid #000", background: "#000", flexShrink: 0,
        transition: "background 0.12s",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#222"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#000"; }}
    >
      <span style={{ fontSize: "13px", fontWeight: "300", letterSpacing: "0.04em", color: "#fff", lineHeight: 1 }}>
        Contact / 投稿助手
      </span>
      <span style={{ fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginTop: "5px" }}>
        Submission →
      </span>
    </Link>
  );
}

function Tag({ label, dark }: { label: string; dark?: boolean }) {
  return (
    <span style={{
      fontSize: "9px", letterSpacing: "0.06em",
      padding: "2px 7px", border: "1px solid",
      borderColor: dark ? "#333" : "#ddd",
      background: dark ? "#000" : "transparent",
      color: dark ? "#fff" : "#999",
      whiteSpace: "nowrap",
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
      style={{ display: "inline-block", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 11px", border: `1px solid ${base}`, color: base, textDecoration: "none", transition: "all 0.12s", whiteSpace: "nowrap" }}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = base; el.style.color = "#fff"; }}
      onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "transparent"; el.style.color = base; }}
    >
      {label}
    </a>
  );
}

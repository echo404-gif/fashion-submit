"use client";

import Link from "next/link";

const BG        = "#f4f3f0";
const CARD_BG   = "#ffffff";
const CARD_BDR  = "#e2e0db";
const TEXT_DARK = "#000000";
const TEXT_MID  = "#333333";
const TEXT_SOFT = "#999999";

const BRAT: React.CSSProperties = {
  fontFamily: "'Arial Black', 'Helvetica Neue', Arial, sans-serif",
  fontWeight: 900,
  textTransform: "lowercase",
  letterSpacing: "-0.02em",
};

interface Site {
  name: string;
  desc: string;
  url: string;
}

interface Category {
  label: string;
  sites: Site[];
}

const categories: Category[] = [
  {
    label: "database",
    sites: [
      { name: "Models.com",                   desc: "时装行业模特与创意人才权威资讯平台",             url: "https://models.com" },
      { name: "FMD",                           desc: "全球最大时尚数据库，涵盖模特、品牌、杂志与秀场档案", url: "https://www.fashionmodeldirectory.com" },
    ],
  },
  {
    label: "media",
    sites: [
      { name: "SHOWstudio",  desc: "Nick Knight 创立的先锋时尚影像与内容平台",  url: "https://www.showstudio.com" },
      { name: "The Impression", desc: "聚焦时装创意与广告的专业行业媒体",        url: "https://theimpression.com" },
      { name: "Hypebae",     desc: "面向女性的潮流街头时尚与文化资讯平台",        url: "https://hypebae.com" },
      { name: "NOWRE",       desc: "中国领先的潮流文化与街头时尚媒体",            url: "https://nowre.com" },
    ],
  },
  {
    label: "forum",
    sites: [
      { name: "The Fashion Spot", desc: "历史最悠久的时尚行业专业论坛社区", url: "https://www.thefashionspot.com" },
    ],
  },
  {
    label: "industry news",
    sites: [
      { name: "Business of Fashion", desc: "全球时尚商业权威媒体，深度行业分析与新闻", url: "https://www.businessoffashion.com" },
      { name: "Vogue Business",      desc: "Vogue 旗下专注时尚行业商业趋势的媒体",   url: "https://www.voguebusiness.com" },
      { name: "WWD",                 desc: "时装行业最权威的每日新闻媒体",            url: "https://wwd.com" },
    ],
  },
  {
    label: "runway archive",
    sites: [
      { name: "Vogue Runway", desc: "Vogue 旗下最完整的历届秀场图片与评论数据库", url: "https://www.vogue.com/fashion-shows" },
    ],
  },
];

export default function FashionWebsites() {
  return (
    <div style={{ minHeight: "100vh", background: BG, color: TEXT_DARK, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

      {/* Header */}
      <header style={{ borderBottom: `1px solid ${CARD_BDR}`, padding: "44px 48px 32px", background: BG }}>
        <Link
          href="/database"
          style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: TEXT_SOFT, textDecoration: "none", display: "inline-block", marginBottom: "20px" }}
        >
          ← back
        </Link>
        <h1 style={{ ...BRAT, fontSize: "clamp(32px, 6vw, 64px)", margin: 0, lineHeight: 0.95, color: TEXT_DARK }}>
          fashion websites
        </h1>
        <p style={{ fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", margin: "14px 0 0", color: TEXT_SOFT }}>
          {categories.reduce((n, c) => n + c.sites.length, 0)} resources · {categories.length} categories
        </p>
      </header>

      {/* Categories */}
      <main style={{ padding: "48px" }}>
        {categories.map((cat) => (
          <section key={cat.label} style={{ marginBottom: "52px" }}>
            {/* Category heading */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              <h2 style={{ ...BRAT, fontSize: "clamp(18px, 2.5vw, 26px)", margin: 0, color: TEXT_DARK }}>
                {cat.label}
              </h2>
              <div style={{ flex: 1, height: "1px", background: CARD_BDR }} />
              <span style={{ fontSize: "10px", letterSpacing: "0.1em", color: TEXT_SOFT, whiteSpace: "nowrap" }}>
                {cat.sites.length} site{cat.sites.length > 1 ? "s" : ""}
              </span>
            </div>

            {/* Site cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
              {cat.sites.map((site) => (
                <SiteCard key={site.name} site={site} />
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${CARD_BDR}`, padding: "20px 48px", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: TEXT_SOFT }}>Fashion Magazine Submission Platform</span>
        <span style={{ fontSize: "10px", color: TEXT_SOFT }}>{new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}

function SiteCard({ site }: { site: Site }) {
  return (
    <div
      style={{
        background: CARD_BG,
        border: `1px solid ${CARD_BDR}`,
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        transition: "box-shadow 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      <h3 style={{ ...BRAT, fontSize: "17px", margin: 0, color: TEXT_DARK, lineHeight: 1.1 }}>
        {site.name}
      </h3>
      <p style={{ fontSize: "12px", lineHeight: 1.6, color: TEXT_MID, margin: 0, flex: 1 }}>
        {site.desc}
      </p>
      <a
        href={site.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          alignSelf: "flex-start",
          fontSize: "9px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          padding: "6px 14px",
          background: "#ffffff",
          color: "#000000",
          textDecoration: "none",
          border: "1px solid #000000",
          transition: "background 0.12s, color 0.12s",
          fontWeight: 700,
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.background = "#000000";
          el.style.color = "#ffffff";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.background = "#ffffff";
          el.style.color = "#000000";
        }}
      >
        visit →
      </a>
    </div>
  );
}

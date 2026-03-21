"use client";

import { useState } from "react";
import Link from "next/link";
import {
  magazines, brands, difficultyConfig, regionLabels, isChina, regions,
  type Magazine, type Brand, type Region,
} from "@/data/magazines";
import { AIRecommend } from "./AIRecommend";

// ── Submission data ────────────────────────────────────────────────────────────
interface SubInfo { emails?: string[]; emailNote?: string; form?: string }

const SUB: Record<string, SubInfo> = {
  // 🇺🇸 US
  "V Magazine":         { emails: ["submissions@vmagazine.com"],    emailNote: "非官方确认" },
  "Interview":          { emails: ["contact@crystalball.media"] },
  "Document Journal":   { emails: ["office@documentjournal.com"] },
  "Office":             { emails: ["info@officemagazine.net"] },
  // 🇬🇧 UK
  "i-D":                { emails: ["photography@i-d.co"] },
  "AnOther Magazine":   { emails: ["violet.conroy@dazedmedia.com", "george.pistachio@dazedmedia.com"] },
  "The Face":           { emails: ["hello@wastedtalent.com"] },
  "Luncheon":           { emails: ["contact@luncheonmagazine.com"] },
  "Wonderland":         { emails: ["print@wonderlandmagazine.com"] },
  "Hunger":             { emails: ["editorial@rankin.co.uk"] },
  "Hero":               { emails: ["hero@hero-magazine.com"] },
  "Teeth":              { emails: ["submissions@teethmag.net"] },
  "Dazed":              { form: "https://www.dazeddigital.com/submissions" },
  // 🇫🇷 France
  "Numéro":             { emails: ["contact@numero.com"] },
  "Purple":             { emails: ["inquire@purple.fr"],            emailNote: "非官方确认" },
  // 🇮🇹 Italy
  "Grazia Italy":       { emails: ["contact@reworldmediaitalia.com"] },
  "Lampoon":            { emails: ["info@lampoon.it"] },
  // 🇩🇪 Germany
  "032c":               { emails: ["office@032c.com"] },
  // 🇳🇱 Netherlands
  "Fantastic Man":      { emails: ["office@fantasticman.com"] },
  // 🇭🇰 HK
  "Harper's Bazaar HK": { emails: ["editorial@harpersbazaar.com.hk"] },
  // 🇨🇳 China
  "NOWNESS":            { form: "https://www.nowness.com/contributor" },
  "NOWNESS China":      { form: "https://www.nowness.cn/become-a-contributor" },
  // 🌍 Global
  "Re-Edition":         { emails: ["office@re-editionmagazine.com"] },
  "System":             { emails: ["info@system-magazine.com"] },
  "Perfect Magazine":   { emails: ["digital@theperfectmagazine.com"] },
  "Twin":               { emails: ["becky@twinfactory.co.uk", "susanna@twinfactory.co.uk"] },
  "Novembre":           { emails: ["contact@novembremagazine.com"] },
  "Cake":               { emails: ["hello@cake-mag.com"] },
  "Schön!":             { emails: ["submissions@schonmagazine.com"] },
  "Nasty Magazine":     { emails: ["submissions@nastymagazine.com"] },
  "PUSS PUSS":          { emails: ["info@pusspussmagazine.com"] },
  "SICKY":              { emails: ["hello@sickymag.com"] },
  // 🌟 Global Brands
  "Grazia":             { emails: ["submissions@graziamagazine.com"] },
};

function hasNoPublicMethod(m: Magazine) {
  const s = SUB[m.name];
  return !s?.emails?.length && !s?.form;
}

function brandAsMag(b: Brand): Magazine {
  return {
    name: b.name,
    difficulty: "顶级极难",
    region: "Global",
    format: "hybrid",
    pubType: "综合",
    style: "主流时装",
    website: b.website,
    instagram: b.instagram,
  };
}

// ── Role → English map ─────────────────────────────────────────────────────────
const ROLE_EN: Record<string, string> = {
  摄影师: "photographer", 造型师: "stylist", 艺术家: "artist",
  创意指导: "creative director", 搭配师: "wardrobe stylist", 化妆师: "makeup artist",
  发型师: "hair stylist", 灯光师: "lighting director", 后期制作: "retoucher",
  AI创作者: "AI creative", 制片: "producer", 导演: "director", 其他: "creative",
};

// ── Email & DM generators ──────────────────────────────────────────────────────
type Lang = "english" | "chinese" | "bilingual";

function genEmail(mag: Magazine, info: FormInfo, lang: Lang): { subject: string; body: string } {
  const roleEn = info.roles.map(r => ROLE_EN[r] ?? r).join(" / ") || "creative";
  const roleCn = info.roles.join(" / ") || "创意工作者";
  const kwEn   = info.workTypes.join(", ") || "visual art";
  const kwCn   = info.workTypes.join("、") || "视觉创作";
  const concept = info.description.trim() || "[一句话概括主题]";
  const conceptEn = info.description.trim() || "[one-sentence concept]";
  const pfLine = info.portfolio ? info.portfolio : "[Instagram / 作品集链接]";
  const pfLineEn = info.portfolio ? info.portfolio : "[Instagram / Portfolio Link]";

  const subCn = `投稿申请 | [项目名称] | [你的名字]`;
  const subEn = `Submission | [Project Title] | [Your Name]`;
  const subBi = `投稿申请 | Submission | [项目名称 Project Title] | [你的名字 Your Name]`;

  const bodyCn = `尊敬的编辑老师，您好：

我是[你的名字/艺名]，${roleCn}。冒昧来信，向贵刊投稿我的作品项目《[项目名称]》。

该项目围绕${concept}展开，整体风格与内容涉及${kwCn}等元素。我认为该项目与贵刊关注的视觉取向和内容方向具有一定契合度，因此希望有机会供您审阅。

本次投稿随信附上：
1. 作品预览/低清PDF
2. 项目简介
3. 团队名单与署名信息
4. 个人简介/作品集链接（如有）

若贵刊感兴趣，我可以进一步提供高清图片、完整项目说明、独家发布信息或其他所需材料。

非常感谢您在繁忙工作中阅读这封邮件，期待您的回复。

祝好
[你的名字]
${roleCn}
[邮箱]
${pfLine}
[电话，可选]`;

  const bodyEn = `Dear Editor,

My name is [Your Name], and I am a ${roleEn}. I am writing to submit my project, "[Project Title]," for your consideration.

This project explores ${conceptEn}, with visual references including ${kwEn}. I believe the work may resonate with ${mag.name}'s visual and editorial interests, so I would be honored to share it with you.

Attached to this email, you will find:
· A preview selection / low-res PDF
· A short project statement
· Full team credits
· My portfolio / website link (if applicable)

Should the project be of interest, I would be happy to provide high-resolution images, exclusive details, or any additional materials you may need.

Thank you very much for your time and consideration. I look forward to hearing from you.

Best regards,
[Your Name]
${roleEn}
[Email]
${pfLineEn}
[Phone, optional]`;

  const bodyBi = `尊敬的编辑老师，您好：

我是[你的名字]，${roleCn}。冒昧来信，向贵刊投稿我的作品项目《[项目名称]》。

该项目主要围绕${concept}展开，视觉上涉及${kwCn}等元素。我认为该项目与贵刊的视觉取向和内容关注具有一定契合度，因此希望能提交给您审阅。

随信附上作品预览、项目简介、团队署名及相关链接。如您感兴趣，我也可以进一步提供高清图片、完整说明或独家发布信息。

感谢您的阅读，期待您的回复。

---

Dear Editor,

My name is [Your Name], and I am a ${roleEn}. I am writing to submit my project, "[Project Title]," for your consideration.

The project explores ${conceptEn}, with visual elements related to ${kwEn}. I believe it may align well with ${mag.name}'s visual direction and editorial interests.

Attached are a preview selection, a short project statement, full credits, and relevant links. If the project is of interest, I would be happy to provide high-resolution images, further details, or exclusive materials.

Thank you very much for your time and consideration. I look forward to hearing from you.

此致
敬礼 / Best regards,
[你的名字 Your Name]
${roleCn} / ${roleEn}
[邮箱 Email]
${pfLine}`;

  if (lang === "english")  return { subject: subEn, body: bodyEn };
  if (lang === "chinese")  return { subject: subCn, body: bodyCn };
  return { subject: subBi, body: bodyBi };
}

function genDM(mag: Magazine, info: FormInfo, lang: Lang): string {
  const roleEn = info.roles.map(r => ROLE_EN[r] ?? r).join(" / ") || "creative";
  const roleCn = info.roles.join(" / ") || "创意工作者";
  const concept = info.description.trim() || "[一句话主题]";
  const conceptEn = info.description.trim() || "[one-line concept]";

  const cn = `您好，我是[你的名字]，一名${roleCn}。近期完成了一个关于${concept}的项目，感觉和你们的视觉方向很契合，想问问是否接受作品投稿/feature submission？如果方便的话，我可以把 preview 和项目简介发到你们邮箱，或直接发给您查看。谢谢。`;

  const en = `Hi, my name is [Your Name], and I'm a ${roleEn}. I recently completed a project about ${conceptEn}, and I feel it could align well with your visual direction. I wanted to ask whether you are open to submissions or features at the moment. I'd be happy to send a preview and short project description by email or here if easier. Thank you.`;

  const bi = `您好，我是[你的名字]，一名${roleCn}。我最近完成了一个关于${concept}的项目，觉得可能和你们的视觉方向比较契合，想问问目前是否接受投稿？如果方便，我可以把作品预览和项目简介发到邮箱或私信给您。谢谢。

Hi, I'm [Your Name], a ${roleEn}. I recently completed a project about ${conceptEn}, and I thought it might fit your visual direction. I wanted to ask if you're currently open to submissions. I'd be happy to send a preview and short description by email or via DM. Thank you.`;

  if (lang === "english") return en;
  if (lang === "chinese") return cn;
  return bi;
}

// ── Constants ──────────────────────────────────────────────────────────────────
const ROLES = [
  "摄影师", "造型师", "艺术家", "创意指导", "搭配师", "化妆师",
  "发型师", "灯光师", "后期制作", "AI创作者", "制片", "导演", "其他",
];
const WORK_TYPES = [
  "Fashion Editorial", "Beauty Editorial", "Still Life", "Portrait",
  "Accessories & Jewelry", "Conceptual & Artistic", "Fashion Film",
];

// ── Types ──────────────────────────────────────────────────────────────────────
interface FormInfo {
  roles: string[];
  workTypes: string[];
  description: string;
  portfolio: string;
}

type Step = 1 | 2 | 3 | 4;

// ── Shared styles ──────────────────────────────────────────────────────────────
const INPUT: React.CSSProperties = {
  padding: "9px 12px", border: "1px solid #ccc", background: "transparent",
  fontSize: "12px", letterSpacing: "0.03em", outline: "none", width: "100%",
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", color: "#000",
};
const SEL: React.CSSProperties = { ...INPUT, cursor: "pointer" };

const STEP_LABELS: [Step, string][] = [
  [1, "选择杂志"], [2, "投稿方式"], [3, "填写信息"], [4, "开始投稿"],
];

// ── Main component ─────────────────────────────────────────────────────────────
export default function Submit() {
  const [step, setStep]           = useState<Step>(1);
  const [selectedMags, setSelectedMags] = useState<Magazine[]>([]);
  const [search, setSearch]       = useState("");
  const [filterRegion, setFilterRegion] = useState<Region | "">("");
  const [formInfo, setFormInfo]   = useState<FormInfo>({
    roles: [], workTypes: [], description: "", portfolio: "",
  });

  // ── Step 1 helpers ──
  const filtered = magazines.filter(m => {
    if (filterRegion && m.region !== filterRegion) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleMag = (m: Magazine) =>
    setSelectedMags(prev =>
      prev.some(x => x.name === m.name)
        ? prev.filter(x => x.name !== m.name)
        : [...prev, m]
    );

  const isSelected = (m: Magazine) => selectedMags.some(x => x.name === m.name);

  // ── Step 3 helpers ──
  const toggleRole = (r: string) =>
    setFormInfo(f => ({
      ...f, roles: f.roles.includes(r) ? f.roles.filter(x => x !== r) : [...f.roles, r],
    }));

  const toggleType = (t: string) =>
    setFormInfo(f => ({
      ...f, workTypes: f.workTypes.includes(t) ? f.workTypes.filter(x => x !== t) : [...f.workTypes, t],
    }));

  const canNext3 = formInfo.roles.length > 0 && formInfo.workTypes.length > 0;

  // ── Step 4 state ──
  const [qIdx, setQIdx]               = useState(0);
  const [method, setMethod]           = useState<"email" | "form" | "social" | null>(null);
  const [emailLang, setEmailLang]     = useState<Lang | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody]       = useState("");
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [copiedAddr, setCopiedAddr]   = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [dmLang, setDMLang]           = useState<Lang | null>(null);
  const [editDM, setEditDM]           = useState("");
  const [copiedDM, setCopiedDM]       = useState(false);

  const curMag = selectedMags[qIdx] ?? null;

  const enterStep4 = () => { setQIdx(0); setMethod(null); setEmailLang(null); setEditSubject(""); setEditBody(""); setEmailConfirmed(false); setDMLang(null); setEditDM(""); setStep(4); };

  const resetSub = () => { setMethod(null); setEmailLang(null); setEditSubject(""); setEditBody(""); setEmailConfirmed(false); setDMLang(null); setEditDM(""); };

  const nextMag = () => {
    if (qIdx < selectedMags.length - 1) { setQIdx(i => i + 1); resetSub(); }
    else setStep(3); // back to start — could also go to a "done" state
  };

  const pickEmailLang = (lang: Lang) => {
    if (!curMag) return;
    const { subject, body } = genEmail(curMag, formInfo, lang);
    setEmailLang(lang); setEditSubject(subject); setEditBody(body); setEmailConfirmed(false);
  };

  const pickDMLang = (lang: Lang) => {
    if (!curMag) return;
    setDMLang(lang); setEditDM(genDM(curMag, formInfo, lang));
  };

  const copyText = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true); setTimeout(() => setter(false), 2000);
  };

  const xhsUrl = (name: string) =>
    `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(name)}&source=web_explore_feed`;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#000", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

      {/* Header */}
      <header style={{ borderBottom: "1px solid #000", padding: "36px clamp(16px, 5vw, 48px) 24px" }}>
        <Link href="/database" style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", textDecoration: "none", display: "inline-block", marginBottom: "16px" }}>
          ← Magazine Database
        </Link>
        <h1 style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: "300", letterSpacing: "-0.025em", margin: 0 }}>
          Contact / 投稿助手
        </h1>
        <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", margin: "10px 0 0", color: "#bbb" }}>
          Submission Assistant
        </p>
      </header>

      {/* Step indicator */}
      <style>{`@media (max-width: 600px) { .submit-step-label { display: none !important; } .submit-step-sep { margin: 0 8px !important; } }`}</style>
      <div style={{ padding: "16px clamp(16px, 5vw, 48px)", borderBottom: "1px solid #e8e8e8", display: "flex", gap: "0", flexWrap: "nowrap", overflowX: "auto" }}>
        {STEP_LABELS.map(([n, label], i) => {
          const done   = n < step;
          const active = n === step;
          return (
            <div key={n} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              <button
                onClick={() => done && setStep(n)}
                style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", cursor: done ? "pointer" : "default", padding: "4px 0", opacity: n > step ? 0.3 : 1 }}
              >
                <span style={{
                  width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", fontWeight: "600",
                  background: active || done ? "#000" : "transparent",
                  color: active || done ? "#fff" : "#000",
                  border: !active && !done ? "1px solid #bbb" : "none",
                }}>
                  {done ? "✓" : n}
                </span>
                <span className="submit-step-label" style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: active ? "600" : "400", color: active ? "#000" : "#999", whiteSpace: "nowrap" }}>
                  {label}
                </span>
              </button>
              {i < STEP_LABELS.length - 1 && (
                <span className="submit-step-sep" style={{ margin: "0 16px", color: "#ddd", userSelect: "none" }}>—</span>
              )}
            </div>
          );
        })}
      </div>

      <main style={{ maxWidth: "1360px", margin: "0 auto", padding: "clamp(20px, 5vw, 48px)" }}>

        {/* ═══════════════════════ STEP 1 ═══════════════════════ */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Section header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <SLabel>01 · 选择投稿杂志</SLabel>
              <span style={{ fontSize: "10px", color: "#aaa", letterSpacing: "0.05em" }}>
                已选 {selectedMags.length} 本
              </span>
            </div>

            {/* AI recommendation */}
            <AIRecommend magazines={magazines} onSelectMag={toggleMag} />

            {/* 主品牌 section */}
            <div style={{ border: "1px solid #e8e8e8", overflow: "hidden" }}>
              <div style={{ padding: "8px 16px", background: "#fafafa", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#888" }}>主品牌 · Global Brands</span>
                <span style={{ fontSize: "10px", color: "#bbb" }}>{brands.length} brands</span>
              </div>
              {brands.map((b, i) => {
                const m   = brandAsMag(b);
                const sel = isSelected(m);
                const s   = SUB[b.name];
                return (
                  <div
                    key={b.name}
                    onClick={() => toggleMag(m)}
                    style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "10px 16px", cursor: "pointer",
                      borderBottom: i < brands.length - 1 ? "1px solid #f4f4f4" : "none",
                      background: sel ? "#f8f8f8" : "#fff",
                      transition: "background 0.08s",
                    }}
                    onMouseEnter={e => { if (!sel) e.currentTarget.style.background = "#fafafa"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = sel ? "#f8f8f8" : "#fff"; }}
                  >
                    <span style={{
                      width: "15px", height: "15px", border: `1px solid ${sel ? "#000" : "#ccc"}`,
                      borderRadius: "2px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                      background: sel ? "#000" : "transparent", color: "#fff", fontSize: "9px",
                    }}>
                      {sel ? "✓" : ""}
                    </span>
                    <span style={{ fontSize: "13px", flex: 1, letterSpacing: "-0.01em", fontWeight: "500" }}>{b.name}</span>
                    <div style={{ display: "flex", gap: "3px", flexShrink: 0 }}>
                      {s?.emails?.length ? (
                        <span style={{ fontSize: "9px", padding: "1px 5px", border: "1px solid #ddd", color: "#888" }}>📧</span>
                      ) : null}
                      {s?.form ? (
                        <span style={{ fontSize: "9px", padding: "1px 5px", border: "1px solid #ddd", color: "#888" }}>📋</span>
                      ) : null}
                      <span style={{ fontSize: "9px", padding: "1px 5px", border: "1px solid #ddd", color: "#888" }}>📱</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <input
                style={{ ...INPUT, flex: 1, minWidth: "140px", maxWidth: "220px" }}
                placeholder="搜索杂志名…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select
                style={{ ...SEL, width: "auto", minWidth: "150px" }}
                value={filterRegion}
                onChange={e => setFilterRegion(e.target.value as Region | "")}
              >
                <option value="">ALL REGIONS</option>
                {regions.map(r => <option key={r} value={r}>{regionLabels[r]}</option>)}
              </select>
              {(search || filterRegion) && (
                <button
                  onClick={() => { setSearch(""); setFilterRegion(""); }}
                  style={{ padding: "8px 14px", border: "1px solid #000", background: "#000", color: "#fff", fontSize: "11px", letterSpacing: "0.06em", cursor: "pointer" }}
                >
                  Clear
                </button>
              )}
              <span style={{ fontSize: "11px", color: "#aaa", alignSelf: "center", marginLeft: "auto" }}>
                {filtered.length} / {magazines.length}
              </span>
            </div>

            {/* Magazine list */}
            <div style={{ border: "1px solid #e8e8e8", maxHeight: "460px", overflowY: "auto" }}>
              {filtered.length === 0 && (
                <div style={{ padding: "32px", textAlign: "center", color: "#bbb", fontSize: "12px" }}>无匹配结果</div>
              )}
              {filtered.map((m, i) => {
                const sel = isSelected(m);
                const cfg = difficultyConfig[m.difficulty];
                const s   = SUB[m.name];
                return (
                  <div
                    key={m.name}
                    onClick={() => toggleMag(m)}
                    style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "10px 16px", cursor: "pointer",
                      borderBottom: i < filtered.length - 1 ? "1px solid #f4f4f4" : "none",
                      background: sel ? "#f8f8f8" : "#fff",
                      transition: "background 0.08s",
                    }}
                    onMouseEnter={e => { if (!sel) e.currentTarget.style.background = "#fafafa"; }}
                    onMouseLeave={e => { if (!sel) e.currentTarget.style.background = sel ? "#f8f8f8" : "#fff"; }}
                  >
                    {/* Checkbox */}
                    <span style={{
                      width: "15px", height: "15px", border: `1px solid ${sel ? "#000" : "#ccc"}`,
                      borderRadius: "2px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                      background: sel ? "#000" : "transparent", color: "#fff", fontSize: "9px",
                    }}>
                      {sel ? "✓" : ""}
                    </span>
                    {/* Difficulty dot */}
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
                    {/* Name */}
                    <span style={{ fontSize: "13px", flex: 1, letterSpacing: "-0.01em" }}>{m.name}</span>
                    {/* Region */}
                    <span style={{ fontSize: "11px", color: "#bbb", whiteSpace: "nowrap" }}>{regionLabels[m.region]}</span>
                    {/* Method badges */}
                    <div style={{ display: "flex", gap: "3px", flexShrink: 0 }}>
                      {s?.emails?.length && (
                        <span style={{ fontSize: "9px", padding: "1px 5px", border: "1px solid #ddd", color: "#888", letterSpacing: "0.02em" }}>📧</span>
                      )}
                      {s?.form && (
                        <span style={{ fontSize: "9px", padding: "1px 5px", border: "1px solid #ddd", color: "#888" }}>📋</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected tags */}
            {selectedMags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {selectedMags.map(m => (
                  <span
                    key={m.name}
                    style={{ fontSize: "11px", padding: "4px 8px 4px 11px", border: "1px solid #000", display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    {m.name}
                    <button
                      onClick={e => { e.stopPropagation(); toggleMag(m); }}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: "13px", lineHeight: 1, color: "#777" }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <StepNav
              onNext={() => setStep(2)}
              nextDisabled={selectedMags.length === 0}
              hideBack
            />
          </div>
        )}

        {/* ═══════════════════════ STEP 2 ═══════════════════════ */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <SLabel>02 · 投稿方式</SLabel>
            <p style={{ fontSize: "12px", color: "#777", lineHeight: 1.75, margin: 0 }}>
              以下是所选杂志的可用投稿方式，确认后进入下一步填写投稿信息。
            </p>

            {selectedMags.map(m => {
              const s      = SUB[m.name];
              const noPub  = hasNoPublicMethod(m);
              const china  = isChina(m.region);
              const cfg    = difficultyConfig[m.difficulty];
              return (
                <div key={m.name} style={{ border: "1px solid #e8e8e8", overflow: "hidden" }}>
                  {/* Card header */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 16px", borderBottom: "1px solid #f0f0f0", background: "#fafafa" }}>
                    <span style={{ width: "3px", alignSelf: "stretch", background: cfg.color, flexShrink: 0 }} />
                    <span style={{ fontSize: "14px", fontWeight: "400", flex: 1, letterSpacing: "-0.01em" }}>{m.name}</span>
                    <span style={{ fontSize: "10px", color: "#bbb", whiteSpace: "nowrap" }}>{regionLabels[m.region]}</span>
                  </div>

                  {/* Methods */}
                  <div style={{ padding: "12px 16px 14px", display: "flex", flexDirection: "column", gap: "9px" }}>

                    {/* Email rows */}
                    {s?.emails?.map(addr => (
                      <div key={addr} style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <MethodBadge>📧 邮箱投稿</MethodBadge>
                        <span style={{ fontSize: "11px", color: "#444", fontFamily: "monospace", letterSpacing: "0.01em" }}>{addr}</span>
                        {s.emailNote && (
                          <span style={{ fontSize: "10px", color: "#aaa", fontStyle: "italic" }}>{s.emailNote}</span>
                        )}
                      </div>
                    ))}

                    {/* Form row */}
                    {s?.form && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <MethodBadge>📋 表单投稿</MethodBadge>
                        <a
                          href={s.form} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: "11px", color: "#555", textDecoration: "none", letterSpacing: "0.01em" }}
                          onClick={e => e.stopPropagation()}
                        >
                          {s.form} ↗
                        </a>
                      </div>
                    )}

                    {/* Social row — always shown */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <MethodBadge>📱 社媒 DM</MethodBadge>
                      <span style={{ fontSize: "11px", color: "#aaa" }}>
                        {china ? "Instagram · 小红书" : "Instagram"}
                      </span>
                    </div>

                    {/* No public method warning */}
                    {noPub && (
                      <p style={{ fontSize: "11px", color: "#D97706", margin: "2px 0 0", lineHeight: 1.5 }}>
                        ⚠️ 无公开投稿邮箱或表单，建议通过社交媒体联系
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            <StepNav onBack={() => setStep(1)} onNext={() => setStep(3)} />
          </div>
        )}

        {/* ═══════════════════════ STEP 3 ═══════════════════════ */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            <SLabel>03 · 填写投稿信息</SLabel>

            {/* Roles */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <FieldLabel>职业身份（可多选）</FieldLabel>
                {formInfo.roles.length > 0 && (
                  <span style={{ fontSize: "10px", color: "#aaa" }}>已选 {formInfo.roles.length} 项</span>
                )}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {ROLES.map(r => (
                  <CheckPill key={r} active={formInfo.roles.includes(r)} onClick={() => toggleRole(r)}>
                    {r}
                  </CheckPill>
                ))}
              </div>
            </div>

            {/* Work types */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <FieldLabel>作品类型（可多选）</FieldLabel>
                {formInfo.workTypes.length > 0 && (
                  <span style={{ fontSize: "10px", color: "#aaa" }}>已选 {formInfo.workTypes.length} 项</span>
                )}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {WORK_TYPES.map(t => (
                  <CheckPill key={t} active={formInfo.workTypes.includes(t)} onClick={() => toggleType(t)}>
                    {t}
                  </CheckPill>
                ))}
              </div>
            </div>

            {/* Description */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <FieldLabel>作品描述（选填）</FieldLabel>
              <textarea
                rows={4}
                placeholder="简要描述你的作品风格、概念或创作背景…"
                value={formInfo.description}
                onChange={e => setFormInfo(f => ({ ...f, description: e.target.value }))}
                style={{ ...INPUT, resize: "vertical", lineHeight: 1.75, height: "100px" }}
              />
            </div>

            {/* Portfolio */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <FieldLabel>作品集链接（选填）</FieldLabel>
              <input
                style={INPUT}
                placeholder="https://yourportfolio.com"
                value={formInfo.portfolio}
                onChange={e => setFormInfo(f => ({ ...f, portfolio: e.target.value }))}
              />
            </div>

            <StepNav
              onBack={() => setStep(2)}
              onNext={enterStep4}
              nextDisabled={!canNext3}
              nextLabel="进入投稿 →"
            />
          </div>
        )}

        {/* ═══════════════════════ STEP 4 ═══════════════════════ */}
        {step === 4 && curMag && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <SLabel>04 · 开始投稿</SLabel>
              <span style={{ fontSize: "10px", color: "#aaa", letterSpacing: "0.06em" }}>
                {qIdx + 1} / {selectedMags.length}
              </span>
            </div>

            {/* Current magazine card */}
            <div style={{ border: "1px solid #000", padding: "14px 18px", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ width: "4px", height: "28px", background: difficultyConfig[curMag.difficulty].color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "16px", fontWeight: "300", letterSpacing: "-0.01em" }}>{curMag.name}</div>
                <div style={{ fontSize: "10px", color: "#aaa", marginTop: "3px" }}>{regionLabels[curMag.region]}</div>
              </div>
              {hasNoPublicMethod(curMag) && (
                <span style={{ fontSize: "10px", color: "#D97706" }}>⚠️ 无公开投稿方式</span>
              )}
            </div>

            {/* ── Method picker ── */}
            {!method && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <FieldLabel>选择投稿方式：</FieldLabel>
                {SUB[curMag.name]?.emails?.length && (
                  <MethodCard
                    icon="📧" title="邮箱投稿"
                    desc={SUB[curMag.name]!.emails!.join(" · ")}
                    note={SUB[curMag.name]!.emailNote}
                    onClick={() => setMethod("email")}
                  />
                )}
                {SUB[curMag.name]?.form && (
                  <MethodCard icon="📋" title="表单投稿" desc={SUB[curMag.name]!.form!} onClick={() => setMethod("form")} />
                )}
                <MethodCard
                  icon="📱" title="社交媒体 DM"
                  desc={isChina(curMag.region) ? "Instagram · 小红书" : "Instagram"}
                  onClick={() => setMethod("social")}
                />
                {hasNoPublicMethod(curMag) && (
                  <p style={{ fontSize: "11px", color: "#777", margin: "4px 0 0", lineHeight: 1.6 }}>
                    该杂志暂无公开邮箱或表单，建议通过社交媒体联系编辑团队。
                  </p>
                )}
              </div>
            )}

            {/* ══════════ A: EMAIL ══════════ */}
            {method === "email" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <BackToMethod onClick={() => { setMethod(null); setEmailLang(null); }} />

                {/* Email address card(s) */}
                {SUB[curMag.name]?.emails?.map((addr, i) => (
                  <div key={addr} style={{ display: "flex", alignItems: "center", gap: "12px", border: "1px solid #e8e8e8", background: "#fafafa", padding: "10px 14px" }}>
                    <span style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", flexShrink: 0 }}>
                      {SUB[curMag.name]!.emails!.length > 1 ? `投稿邮箱 ${i + 1}` : "投稿邮箱"}
                    </span>
                    <div style={{ width: "1px", height: "14px", background: "#e0e0e0", flexShrink: 0 }} />
                    <span style={{ fontSize: "12px", flex: 1, fontFamily: "monospace", color: "#222" }}>{addr}</span>
                    {SUB[curMag.name]!.emailNote && (
                      <span style={{ fontSize: "10px", color: "#aaa", fontStyle: "italic", flexShrink: 0 }}>{SUB[curMag.name]!.emailNote}</span>
                    )}
                    <CopyBtn
                      copied={copiedAddr}
                      onCopy={() => copyText(addr, setCopiedAddr)}
                    />
                  </div>
                ))}

                {/* Language picker */}
                {!emailLang && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <FieldLabel>选择邮件语言：</FieldLabel>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {(["english", "chinese", "bilingual"] as Lang[]).map(l => (
                        <Btn key={l} onClick={() => pickEmailLang(l)}>
                          {l === "english" ? "纯英文" : l === "chinese" ? "纯中文" : "中英双语"}
                        </Btn>
                      ))}
                    </div>
                  </div>
                )}

                {/* Editor */}
                {emailLang && !emailConfirmed && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <FieldLabel>编辑邮件内容：</FieldLabel>
                      <button onClick={() => setEmailLang(null)} style={{ fontSize: "10px", color: "#aaa", background: "none", border: "none", cursor: "pointer" }}>← 重新选择语言</button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <FieldLabel>邮件标题</FieldLabel>
                      <input style={INPUT} value={editSubject} onChange={e => setEditSubject(e.target.value)} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <FieldLabel>邮件正文</FieldLabel>
                      <textarea
                        value={editBody} onChange={e => setEditBody(e.target.value)}
                        style={{ ...INPUT, resize: "vertical", lineHeight: 1.8, height: "340px", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                      />
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <Btn primary onClick={() => setEmailConfirmed(true)}>确认发送 →</Btn>
                      <Btn onClick={() => setEmailLang(null)}>返回修改</Btn>
                    </div>
                  </div>
                )}

                {/* Confirmed send */}
                {emailLang && emailConfirmed && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ padding: "12px 16px", border: "1px solid #22c55e", background: "#f0fdf4" }}>
                      <p style={{ fontSize: "12px", color: "#15803d", margin: 0 }}>✓ 邮件已确认，可复制或在邮件客户端中打开发送</p>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button
                        onClick={() => copyText(`Subject: ${editSubject}\n\n${editBody}`, setCopiedEmail)}
                        style={{ padding: "10px 20px", border: "1px solid #000", background: copiedEmail ? "#22c55e" : "transparent", color: copiedEmail ? "#fff" : "#000", fontSize: "10px", letterSpacing: "0.1em", cursor: "pointer", transition: "all 0.1s" }}
                      >
                        {copiedEmail ? "✓ 已复制" : "复制邮件内容"}
                      </button>
                      <button
                        onClick={() => window.open(`mailto:${SUB[curMag.name]?.emails?.[0] ?? ""}?subject=${encodeURIComponent(editSubject)}&body=${encodeURIComponent(editBody)}`)}
                        style={{ padding: "10px 20px", border: "1px solid #000", background: "#000", color: "#fff", fontSize: "10px", letterSpacing: "0.1em", cursor: "pointer" }}
                      >
                        在邮件客户端中打开 →
                      </button>
                      <button
                        onClick={() => setEmailConfirmed(false)}
                        style={{ padding: "10px 20px", border: "1px solid #ccc", background: "transparent", color: "#666", fontSize: "10px", letterSpacing: "0.1em", cursor: "pointer" }}
                      >
                        返回修改
                      </button>
                    </div>
                    {selectedMags.length > 1 && (
                      <Btn primary onClick={nextMag}>
                        {qIdx < selectedMags.length - 1 ? `下一本：${selectedMags[qIdx + 1].name} →` : "完成全部投稿 →"}
                      </Btn>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ══════════ B: FORM ══════════ */}
            {method === "form" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <BackToMethod onClick={() => setMethod(null)} />
                <div style={{ border: "1px solid #e8e8e8", padding: "20px 18px" }}>
                  <p style={{ fontSize: "12px", color: "#555", margin: "0 0 14px", lineHeight: 1.7 }}>
                    点击下方按钮跳转至 <strong>{curMag.name}</strong> 官网投稿表单页面：
                  </p>
                  <a
                    href={SUB[curMag.name]!.form}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-block", padding: "11px 24px", border: "1px solid #000", background: "#000", color: "#fff", fontSize: "11px", letterSpacing: "0.1em", textDecoration: "none" }}
                  >
                    前往投稿表单 ↗
                  </a>
                </div>
                {selectedMags.length > 1 && (
                  <Btn primary onClick={nextMag}>
                    {qIdx < selectedMags.length - 1 ? `下一本：${selectedMags[qIdx + 1].name} →` : "完成全部投稿 →"}
                  </Btn>
                )}
              </div>
            )}

            {/* ══════════ C: SOCIAL DM ══════════ */}
            {method === "social" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <BackToMethod onClick={() => { setMethod(null); setDMLang(null); }} />

                {/* Language picker */}
                {!dmLang && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <FieldLabel>选择 DM 语言：</FieldLabel>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {(["english", "chinese", "bilingual"] as Lang[]).map(l => (
                        <Btn key={l} onClick={() => pickDMLang(l)}>
                          {l === "english" ? "纯英文" : l === "chinese" ? "纯中文" : "中英双语"}
                        </Btn>
                      ))}
                    </div>
                  </div>
                )}

                {/* DM editor */}
                {dmLang && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <FieldLabel>编辑 DM 文案：</FieldLabel>
                      <button onClick={() => setDMLang(null)} style={{ fontSize: "10px", color: "#aaa", background: "none", border: "none", cursor: "pointer" }}>← 重新选择语言</button>
                    </div>
                    <textarea
                      value={editDM} onChange={e => setEditDM(e.target.value)}
                      style={{ ...INPUT, resize: "vertical", lineHeight: 1.8, height: "220px", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                    />
                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button
                        onClick={() => copyText(editDM, setCopiedDM)}
                        style={{ padding: "10px 20px", border: "1px solid #000", background: copiedDM ? "#22c55e" : "transparent", color: copiedDM ? "#fff" : "#000", fontSize: "10px", letterSpacing: "0.1em", cursor: "pointer", transition: "all 0.1s" }}
                      >
                        {copiedDM ? "✓ 已复制" : "一键复制文案"}
                      </button>
                      {curMag.instagram && (
                        <a
                          href={`https://instagram.com/${curMag.instagram}`}
                          target="_blank" rel="noopener noreferrer"
                          style={{ padding: "10px 20px", border: "1px solid #000", background: "#000", color: "#fff", fontSize: "10px", letterSpacing: "0.1em", textDecoration: "none" }}
                        >
                          跳转 IG →
                        </a>
                      )}
                      {isChina(curMag.region) && curMag.cnSearchName && (
                        <a
                          href={xhsUrl(curMag.cnSearchName)}
                          target="_blank" rel="noopener noreferrer"
                          style={{ padding: "10px 20px", border: "1px solid #E1306C", color: "#E1306C", fontSize: "10px", letterSpacing: "0.1em", textDecoration: "none" }}
                        >
                          跳转小红书 →
                        </a>
                      )}
                    </div>
                    {selectedMags.length > 1 && (
                      <Btn primary onClick={nextMag}>
                        {qIdx < selectedMags.length - 1 ? `下一本：${selectedMags[qIdx + 1].name} →` : "完成全部投稿 →"}
                      </Btn>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Back to step 3 */}
            <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "16px" }}>
              <button onClick={() => setStep(3)} style={{ fontSize: "10px", color: "#aaa", background: "none", border: "none", cursor: "pointer" }}>
                ← 返回修改投稿信息
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #ebebeb", padding: "20px clamp(16px, 5vw, 48px)", display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
        <span style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#ccc" }}>Magazine Submission Platform</span>
        <span style={{ fontSize: "10px", color: "#ddd" }}>{new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", margin: 0, fontWeight: "600" }}>
      {children}
    </h2>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#888", margin: 0 }}>
      {children}
    </p>
  );
}

function MethodBadge({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: "10px", padding: "2px 8px", border: "1px solid #ddd", color: "#666", whiteSpace: "nowrap", flexShrink: 0 }}>
      {children}
    </span>
  );
}

function MethodCard({ icon, title, desc, note, onClick }: { icon: string; title: string; desc: string; note?: string; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{ border: "1px solid #e8e8e8", padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "14px", transition: "background 0.08s" }}
      onMouseEnter={e => (e.currentTarget.style.background = "#fafafa")}
      onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
    >
      <span style={{ fontSize: "20px", flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "13px", fontWeight: "500", marginBottom: "3px" }}>{title}</div>
        <div style={{ fontSize: "11px", color: "#777", fontFamily: desc.includes("@") || desc.startsWith("http") ? "monospace" : "inherit" }}>{desc}</div>
        {note && <div style={{ fontSize: "10px", color: "#aaa", fontStyle: "italic", marginTop: "2px" }}>{note}</div>}
      </div>
      <span style={{ fontSize: "16px", color: "#ccc" }}>›</span>
    </div>
  );
}

function BackToMethod({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ fontSize: "10px", color: "#aaa", background: "none", border: "none", cursor: "pointer", padding: 0, alignSelf: "flex-start" }}>
      ← 返回选择投稿方式
    </button>
  );
}

function CopyBtn({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  return (
    <button
      onClick={onCopy}
      style={{ padding: "4px 10px", border: "1px solid", cursor: "pointer", flexShrink: 0, fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", background: copied ? "#22c55e" : "transparent", color: copied ? "#fff" : "#555", borderColor: copied ? "#22c55e" : "#ccc", transition: "all 0.15s" }}
    >
      {copied ? "已复制 ✓" : "复制"}
    </button>
  );
}

function Btn({ children, onClick, primary, disabled }: { children: React.ReactNode; onClick?: () => void; primary?: boolean; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ padding: "10px 22px", border: "1px solid", borderColor: disabled ? "#e0e0e0" : "#000", background: disabled ? "#e0e0e0" : primary ? "#000" : "transparent", color: disabled ? "#bbb" : primary ? "#fff" : "#000", fontSize: "11px", letterSpacing: "0.08em", cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.1s" }}
    >
      {children}
    </button>
  );
}

function CheckPill({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: "7px",
        padding: "8px 14px", border: "1px solid", cursor: "pointer",
        fontSize: "12px", letterSpacing: "0.03em",
        background: active ? "#000" : "transparent",
        color: active ? "#fff" : "#000",
        borderColor: active ? "#000" : "#ccc",
        transition: "all 0.1s",
      }}
    >
      <span style={{
        width: "12px", height: "12px",
        border: `1px solid ${active ? "#fff" : "#bbb"}`,
        borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, fontSize: "9px",
        color: active ? "#fff" : "transparent",
        background: active ? "rgba(255,255,255,0.2)" : "transparent",
      }}>
        {active ? "✓" : ""}
      </span>
      {children}
    </button>
  );
}

function StepNav({
  onBack, onNext, nextDisabled, hideBack, hideNext, nextLabel,
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
  hideBack?: boolean;
  hideNext?: boolean;
  nextLabel?: string;
}) {
  return (
    <div style={{ display: "flex", gap: "10px", paddingTop: "8px" }}>
      {!hideBack && onBack && (
        <button
          onClick={onBack}
          style={{ padding: "11px 24px", border: "1px solid #ccc", background: "transparent", color: "#666", fontSize: "11px", letterSpacing: "0.08em", cursor: "pointer" }}
        >
          ← 上一步
        </button>
      )}
      {!hideNext && onNext && (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          style={{
            padding: "11px 26px", border: "1px solid",
            borderColor: nextDisabled ? "#e0e0e0" : "#000",
            background: nextDisabled ? "#e0e0e0" : "#000",
            color: nextDisabled ? "#bbb" : "#fff",
            fontSize: "11px", letterSpacing: "0.08em",
            cursor: nextDisabled ? "not-allowed" : "pointer",
          }}
        >
          {nextLabel ?? "下一步 →"}
        </button>
      )}
    </div>
  );
}

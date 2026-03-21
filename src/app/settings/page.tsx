"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Provider = "anthropic" | "openai" | "google";

const PROVIDERS: { key: Provider; label: string; storageKey: string }[] = [
  { key: "anthropic", label: "Anthropic (Claude)", storageKey: "ai_key_anthropic" },
  { key: "openai",    label: "OpenAI (ChatGPT)",   storageKey: "ai_key_openai" },
  { key: "google",    label: "Google (Gemini)",    storageKey: "ai_key_google" },
];

export default function SettingsPage() {
  const [keys, setKeys] = useState<Record<Provider, string>>({ anthropic: "", openai: "", google: "" });
  const [show, setShow] = useState<Record<Provider, boolean>>({ anthropic: false, openai: false, google: false });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loaded = { anthropic: "", openai: "", google: "" } as Record<Provider, string>;
    for (const p of PROVIDERS) {
      loaded[p.key] = localStorage.getItem(p.storageKey) ?? "";
    }
    setKeys(loaded);
  }, []);

  function handleSave() {
    for (const p of PROVIDERS) {
      if (keys[p.key]) {
        localStorage.setItem(p.storageKey, keys[p.key]);
      } else {
        localStorage.removeItem(p.storageKey);
      }
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "48px 24px" }}>
        <Link
          href="/submit"
          style={{ fontSize: "11px", letterSpacing: "0.08em", color: "#888", textDecoration: "none", display: "inline-block", marginBottom: "32px" }}
        >
          ← Contact / 投稿助手
        </Link>

        <h1 style={{ fontSize: "18px", fontWeight: "600", letterSpacing: "0.06em", marginBottom: "8px" }}>
          API Key 设置
        </h1>
        <p style={{ fontSize: "12px", color: "#888", marginBottom: "32px", lineHeight: 1.6 }}>
          Key 仅保存在您的本地浏览器中，不会上传至服务器。
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {PROVIDERS.map((p) => (
            <div key={p.key}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: "500", letterSpacing: "0.04em" }}>{p.label}</label>
                {keys[p.key] && (
                  <span style={{ fontSize: "9px", letterSpacing: "0.12em", padding: "2px 7px", background: "#000", color: "#fff" }}>
                    已配置
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", background: "#fafafa" }}>
                <input
                  type={show[p.key] ? "text" : "password"}
                  placeholder={`输入 ${p.label} API Key`}
                  value={keys[p.key]}
                  onChange={(e) => setKeys((prev) => ({ ...prev, [p.key]: e.target.value }))}
                  style={{ flex: 1, border: "none", background: "transparent", padding: "10px 12px", fontSize: "12px", outline: "none", fontFamily: "monospace" }}
                />
                <button
                  onClick={() => setShow((prev) => ({ ...prev, [p.key]: !prev[p.key] }))}
                  style={{ padding: "10px 12px", border: "none", background: "transparent", cursor: "pointer", fontSize: "11px", color: "#888" }}
                >
                  {show[p.key] ? "隐藏" : "显示"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "32px", display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={handleSave}
            style={{ padding: "10px 28px", background: "#000", color: "#fff", border: "none", fontSize: "11px", letterSpacing: "0.1em", cursor: "pointer" }}
          >
            保存
          </button>
          {saved && (
            <span style={{ fontSize: "12px", color: "#2e7d32" }}>✓ 已保存</span>
          )}
        </div>

        <p style={{ fontSize: "11px", color: "#aaa", marginTop: "32px", lineHeight: 1.7, borderTop: "1px solid #f0f0f0", paddingTop: "24px" }}>
          安全说明：API Key 通过 HTTPS 传输，仅在本次请求中转发给对应 AI 服务商，服务器不做任何记录或存储。
        </p>
      </div>
    </div>
  );
}

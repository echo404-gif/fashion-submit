"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { type Magazine } from "@/data/magazines";

type Provider = "anthropic" | "openai" | "google";
type Mode = "image" | "text";

interface ModelConfig {
  provider: Provider;
  label: string;
  modelId: string;
  free: boolean;
  group: string;
}

const MODELS: ModelConfig[] = [
  { provider: "openai",    label: "GPT-5.4",             modelId: "gpt-5.4",                    free: false, group: "ChatGPT" },
  { provider: "openai",    label: "GPT-5.4 mini",        modelId: "gpt-5.4-mini",               free: false, group: "ChatGPT" },
  { provider: "openai",    label: "GPT-5.4 nano",        modelId: "gpt-5.4-nano",               free: true,  group: "ChatGPT" },
  { provider: "google",    label: "Gemini 3.1 Pro",      modelId: "gemini-3.1-pro",             free: false, group: "Gemini" },
  { provider: "google",    label: "Gemini 3.1 Flash-Lite",modelId: "gemini-3.1-flash-lite",     free: false, group: "Gemini" },
  { provider: "google",    label: "Gemini 3 Flash",      modelId: "gemini-3-flash",             free: true,  group: "Gemini" },
  { provider: "google",    label: "Gemini 2.5 Pro",      modelId: "gemini-2.5-pro",             free: false, group: "Gemini" },
  { provider: "google",    label: "Gemini 2.5 Flash",    modelId: "gemini-2.5-flash",           free: false, group: "Gemini" },
  { provider: "google",    label: "Gemini 2.5 Flash-Lite",modelId: "gemini-2.5-flash-lite",     free: true,  group: "Gemini" },
  { provider: "anthropic", label: "Claude Opus 4.6",     modelId: "claude-opus-4-6",            free: false, group: "Claude" },
  { provider: "anthropic", label: "Claude Sonnet 4.6",   modelId: "claude-sonnet-4-6",          free: false, group: "Claude" },
  { provider: "anthropic", label: "Claude Haiku 4.5",    modelId: "claude-haiku-4-5-20251001",  free: true,  group: "Claude" },
];

const GROUPS = ["ChatGPT", "Gemini", "Claude"];

interface Rec { name: string; reason: string }

function difficultyColor(d: string) {
  if (d === "顶级极难") return "#111";
  if (d === "极难") return "#555";
  if (d === "较难") return "#888";
  if (d === "中等") return "#aaa";
  return "#ccc";
}

export function AIRecommend({ magazines, onSelectMag }: { magazines: Magazine[]; onSelectMag: (m: Magazine) => void }) {
  const [selModel, setSelModel] = useState<ModelConfig>(MODELS[2]); // default: free model
  const [mode, setMode] = useState<Mode>("image");
  const [textInput, setTextInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recs, setRecs] = useState<Rec[] | null>(null);
  const [rawResp, setRawResp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageFile(file: File) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("仅支持 JPG / PNG / WEBP 格式");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setError(null);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  }

  async function handleAnalyze() {
    const apiKey = localStorage.getItem(`ai_key_${selModel.provider}`) ?? "";
    if (!apiKey) {
      setError(`请先在设置中配置 ${selModel.group} API Key`);
      return;
    }
    if (mode === "image" && !imageFile) {
      setError("请先上传图片");
      return;
    }
    if (mode === "text" && !textInput.trim()) {
      setError("请输入文字描述");
      return;
    }

    setLoading(true);
    setError(null);
    setRecs(null);
    setRawResp(null);

    try {
      const magList = magazines.map((m) => m.name).join("、");
      const prompt =
        mode === "image"
          ? `你是一位专业的时尚杂志编辑顾问。请分析这组作品的视觉风格、美学倾向和叙事特征，并从以下杂志列表中推荐3-5本最适合投稿的杂志：${magList}。请用JSON格式返回：[{"name":"杂志名","reason":"100字以内推荐原因"}]`
          : `你是一位专业的时尚杂志编辑顾问。用户描述了自己的创作风格如下：${textInput.trim()}。请从以下杂志列表中推荐3-5本最适合投稿的杂志：${magList}。请用JSON格式返回：[{"name":"杂志名","reason":"100字以内推荐原因"}]`;

      let imageBase64: string | undefined;
      let imageMime: string | undefined;

      if (mode === "image" && imageFile && imagePreview) {
        const b64 = imagePreview.split(",")[1];
        imageBase64 = b64;
        imageMime = imageFile.type;
      }

      const res = await fetch("/api/ai-recommend", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          provider: selModel.provider,
          model: selModel.modelId,
          apiKey,
          prompt,
          imageBase64,
          imageMime,
        }),
      });

      const data = await res.json();

      if (data.error) {
        const msg = data.error as string;
        if (msg.includes("401") || msg.toLowerCase().includes("auth") || msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("api key")) {
          setError("API Key 无效，请检查设置");
        } else {
          setError(msg);
        }
        return;
      }

      const text: string = data.text ?? "";
      setRawResp(text);

      const match = text.match(/\[[\s\S]*?\]/);
      if (match) {
        try {
          const parsed = JSON.parse(match[0]) as Rec[];
          setRecs(parsed);
        } catch {
          setRecs(null);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "请求失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ border: "1px solid #000", background: "#fff" }}>
      {/* Header */}
      <div style={{ background: "#000", color: "#fff", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "12px", fontWeight: "500", letterSpacing: "0.06em" }}>✨ AI 智能推荐</span>
        <Link href="/settings" style={{ fontSize: "10px", letterSpacing: "0.08em", color: "#aaa", textDecoration: "none" }}>
          设置 API Key →
        </Link>
      </div>

      <div style={{ padding: "16px" }}>
        {/* Model selector */}
        <div style={{ marginBottom: "14px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "0.1em", color: "#888", marginBottom: "8px", textTransform: "uppercase" }}>选择模型</div>
          {GROUPS.map((group) => (
            <div key={group} style={{ marginBottom: "8px" }}>
              <div style={{ fontSize: "10px", color: "#aaa", marginBottom: "4px" }}>{group}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {MODELS.filter((m) => m.group === group).map((m) => {
                  const active = selModel.modelId === m.modelId;
                  return (
                    <button
                      key={m.modelId}
                      onClick={() => setSelModel(m)}
                      style={{
                        position: "relative",
                        padding: "5px 10px",
                        fontSize: "11px",
                        border: `1px solid ${active ? "#000" : "#ddd"}`,
                        background: active ? "#000" : "#fff",
                        color: active ? "#fff" : "#333",
                        cursor: "pointer",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {m.label}
                      <span style={{
                        position: "absolute", top: -6, right: -4,
                        fontSize: "7px", letterSpacing: "0.08em",
                        padding: "1px 4px",
                        background: m.free ? "#2e7d32" : "#555",
                        color: "#fff",
                      }}>
                        {m.free ? "FREE" : "PRO"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Mode tabs */}
        <div style={{ display: "flex", border: "1px solid #e0e0e0", marginBottom: "14px" }}>
          {(["image", "text"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1, padding: "8px", fontSize: "11px", border: "none",
                background: mode === m ? "#000" : "#fff",
                color: mode === m ? "#fff" : "#555",
                cursor: "pointer", letterSpacing: "0.04em",
              }}
            >
              {m === "image" ? "📷 上传图片" : "✍️ 文字描述"}
            </button>
          ))}
        </div>

        {/* Image upload */}
        {mode === "image" && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: "1px dashed #ccc", padding: "20px", marginBottom: "14px",
              textAlign: "center", cursor: "pointer", background: "#fafafa",
              minHeight: "100px", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="preview" style={{ maxHeight: "160px", maxWidth: "100%", objectFit: "contain" }} />
            ) : (
              <>
                <span style={{ fontSize: "24px" }}>📷</span>
                <span style={{ fontSize: "11px", color: "#888" }}>拖拽或点击上传图片（JPG / PNG / WEBP）</span>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }}
            />
          </div>
        )}

        {/* Text input */}
        {mode === "text" && (
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="描述你的创作风格、作品主题、视觉倾向…"
            rows={4}
            style={{
              width: "100%", boxSizing: "border-box", padding: "10px 12px",
              border: "1px solid #e0e0e0", fontSize: "12px", resize: "vertical",
              fontFamily: "inherit", marginBottom: "14px", outline: "none",
            }}
          />
        )}

        {/* Analyze button */}
        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            width: "100%", padding: "10px", background: loading ? "#555" : "#000",
            color: "#fff", border: "none", fontSize: "12px", letterSpacing: "0.08em",
            cursor: loading ? "default" : "pointer", display: "flex",
            alignItems: "center", justifyContent: "center", gap: "8px",
          }}
        >
          {loading ? (
            <>
              <span style={{ display: "inline-block", width: "12px", height: "12px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              分析中…
            </>
          ) : "✨ 开始分析"}
        </button>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        {/* Error */}
        {error && (
          <div style={{ marginTop: "12px", border: "1px solid #f44336", padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#c62828" }}>{error}</span>
            <button onClick={handleAnalyze} style={{ fontSize: "10px", letterSpacing: "0.06em", border: "1px solid #c62828", background: "transparent", color: "#c62828", padding: "3px 8px", cursor: "pointer" }}>
              重试
            </button>
          </div>
        )}

        {/* Results */}
        {recs && recs.length > 0 && (
          <div style={{ marginTop: "16px" }}>
            <div style={{ fontSize: "10px", letterSpacing: "0.1em", color: "#888", marginBottom: "10px", textTransform: "uppercase" }}>推荐结果</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {recs.map((rec) => {
                const mag = magazines.find((m) => m.name === rec.name);
                return (
                  <div key={rec.name} style={{ border: "1px solid #e8e8e8", padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <span style={{ fontSize: "13px", fontWeight: "500" }}>{rec.name}</span>
                      {mag && (
                        <>
                          <span style={{ fontSize: "9px", padding: "2px 6px", background: difficultyColor(mag.difficulty), color: "#fff", letterSpacing: "0.06em" }}>
                            {mag.difficulty}
                          </span>
                          <span style={{ fontSize: "10px", color: "#888" }}>{mag.region}</span>
                        </>
                      )}
                    </div>
                    <p style={{ fontSize: "11px", color: "#555", margin: "0 0 10px", lineHeight: 1.6 }}>{rec.reason}</p>
                    {mag && (
                      <button
                        onClick={() => onSelectMag(mag)}
                        style={{ fontSize: "10px", letterSpacing: "0.08em", padding: "4px 10px", border: "1px solid #000", background: "transparent", cursor: "pointer" }}
                      >
                        选择投稿 →
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Fallback raw response */}
        {rawResp && (!recs || recs.length === 0) && (
          <div style={{ marginTop: "16px" }}>
            <div style={{ fontSize: "10px", letterSpacing: "0.1em", color: "#888", marginBottom: "6px", textTransform: "uppercase" }}>AI 回复（解析失败）</div>
            <pre style={{ fontSize: "11px", color: "#555", background: "#f8f8f8", padding: "12px", whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0 }}>
              {rawResp}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

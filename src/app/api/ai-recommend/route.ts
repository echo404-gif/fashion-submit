import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { provider, model, apiKey, prompt, imageBase64, imageMime } = await req.json();

  if (!provider || !model || !apiKey || !prompt) {
    return NextResponse.json({ error: "缺少必要参数" }, { status: 400 });
  }

  try {
    if (provider === "anthropic") {
      const content: unknown[] = [];
      if (imageBase64 && imageMime) {
        content.push({ type: "image", source: { type: "base64", media_type: imageMime, data: imageBase64 } });
      }
      content.push({ type: "text", text: prompt });

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({ model, max_tokens: 1200, messages: [{ role: "user", content }] }),
      });
      const data = await res.json();
      if (!res.ok) {
        return NextResponse.json({ error: data.error?.message ?? `Anthropic error ${res.status}` }, { status: res.status });
      }
      return NextResponse.json({ text: data.content[0].text });
    }

    if (provider === "openai") {
      const content: unknown[] = [];
      if (imageBase64 && imageMime) {
        content.push({ type: "image_url", image_url: { url: `data:${imageMime};base64,${imageBase64}` } });
      }
      content.push({ type: "text", text: prompt });

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ model, max_tokens: 1200, messages: [{ role: "user", content }] }),
      });
      const data = await res.json();
      if (!res.ok) {
        return NextResponse.json({ error: data.error?.message ?? `OpenAI error ${res.status}` }, { status: res.status });
      }
      return NextResponse.json({ text: data.choices[0].message.content });
    }

    if (provider === "google") {
      const parts: unknown[] = [];
      if (imageBase64 && imageMime) {
        parts.push({ inlineData: { mimeType: imageMime, data: imageBase64 } });
      }
      parts.push({ text: prompt });

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ contents: [{ parts }] }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        return NextResponse.json({ error: data.error?.message ?? `Google error ${res.status}` }, { status: res.status });
      }
      return NextResponse.json({ text: data.candidates[0].content.parts[0].text });
    }

    return NextResponse.json({ error: `未知 provider: ${provider}` }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "未知错误" }, { status: 500 });
  }
}

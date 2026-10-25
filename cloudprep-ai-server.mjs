// CloudPrep AI: static host + secure AI proxy for the Study Buddy.
// Node 18+, no dependencies. The API key stays in this process and is never sent to the browser.
//
//   ANTHROPIC_API_KEY=sk-ant-... node cloudprep-ai-server.mjs
//
// Put cloudprep-ai.html in the same folder. The server serves it at / and points it at /api/study-buddy,
// so the page and the API share one origin (no CORS setup needed).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT) || 8787;
const KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.AI_MODEL || "claude-sonnet-5-5";
const UPSTREAM = process.env.ANTHROPIC_API_URL || "https://api.anthropic.com/v1/messages";
const ORIGIN = process.env.ALLOWED_ORIGIN || ""; // only needed if the page is hosted on a different origin
const RATE = Number(process.env.RATE_PER_MIN) || 15; // requests per IP per minute
const dir = path.dirname(fileURLToPath(import.meta.url));

const SYSTEM = `You are the CloudPrep AI Study Buddy for beginners preparing for Microsoft Azure Fundamentals (AZ-900). Ground answers in the AZ-900 skill areas (cloud concepts; Azure architecture and services; Azure management and governance) and in official Microsoft Learn and Azure documentation. Never invent features, prices, limits or exam content; if unsure, say so in the caveat field. Use simple language. Analogies must use everyday African contexts (mobile money, hospitals, schools, online shops, electricity supply) and must be clearly simplified, never presented as how Azure works. Write an ORIGINAL knowledge check and never reproduce real exam questions. Reply with ONLY one JSON object (no markdown) with these keys: title (string), simple (string, 2 to 4 sentences), analogy (string), azureExample (string), realLife (string, a short practical scenario), terms (array of 2 to 4 objects, each with term and definition strings), check (object with question string, options array of exactly 4 strings, answerIndex integer 0 to 3, explanation string), topic (one of: models, benefits, regions, core, cost, governance), caveat (string, may be empty). If the question is not about cloud computing or Azure fundamentals, reply with a JSON object whose only keys are offTopic (true) and message (a short string).`;

const hits = new Map();
const limited = (ip) => {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE;
};
const json = (res, code, obj, headers = {}) => {
  res.writeHead(code, { "Content-Type": "application/json", ...headers });
  res.end(JSON.stringify(obj));
};

http
  .createServer(async (req, res) => {
    const cors = ORIGIN
      ? { "Access-Control-Allow-Origin": ORIGIN, "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "POST, OPTIONS", Vary: "Origin" }
      : {};
    if (req.method === "OPTIONS") { res.writeHead(204, cors); return res.end(); }

    if (req.method === "GET" && (req.url === "/" || req.url === "/cloudprep-ai.html")) {
      try {
        const html = fs.readFileSync(path.join(dir, "cloudprep-ai.html"), "utf8").replace('aiEndpoint:""', 'aiEndpoint:"/api/study-buddy"');
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        return res.end(html);
      } catch {
        return json(res, 404, { error: "cloudprep-ai.html not found next to this file" });
      }
    }
    if (req.method === "GET" && req.url === "/api/health") return json(res, 200, { ok: true, configured: Boolean(KEY) });

    if (req.method === "POST" && req.url === "/api/study-buddy") {
      if (!KEY) return json(res, 503, { error: "not_configured", message: "ANTHROPIC_API_KEY is not set on the server." }, cors);
      if (limited(req.socket.remoteAddress)) return json(res, 429, { error: "rate_limited" }, cors);
      let body = "";
      for await (const chunk of req) {
        body += chunk;
        if (body.length > 4000) return json(res, 413, { error: "too_large" }, cors);
      }
      let input;
      try { input = JSON.parse(body); } catch { return json(res, 400, { error: "bad_json" }, cors); }
      const question = String(input.question || "").trim().slice(0, 300);
      if (question.length < 3) return json(res, 400, { error: "question_too_short" }, cors);
      try {
        const upstream = await fetch(UPSTREAM, {
          method: "POST",
          headers: { "content-type": "application/json", "x-api-key": KEY, "anthropic-version": "2023-06-01" },
          body: JSON.stringify({ model: MODEL, max_tokens: 1800, system: SYSTEM, messages: [{ role: "user", content: `Learner question: ${question}` }] }),
          signal: AbortSignal.timeout(55000),
        });
        if (!upstream.ok) return json(res, 502, { error: "upstream_error", status: upstream.status }, cors);
        const data = await upstream.json();
        const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim()
          .replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
        let out;
        try { out = JSON.parse(text); } catch { return json(res, 502, { error: "invalid_model_output" }, cors); }
        return json(res, 200, out, cors);
      } catch {
        return json(res, 504, { error: "upstream_unreachable" }, cors);
      }
    }
    json(res, 404, { error: "not_found" }, cors);
  })
  .listen(PORT, () => console.log(`CloudPrep AI on http://localhost:${PORT}  (AI ${KEY ? "configured" : "NOT configured: set ANTHROPIC_API_KEY"})`));

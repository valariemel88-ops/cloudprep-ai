# CloudPrep AI: Study Buddy AI setup

The Study Buddy works in three ways. It never pretends: the page always says which one is active.

| Mode | When | What the learner sees |
|---|---|---|
| **Curated** | No AI available | Clearly labelled "Curated explanation · not AI" for 12 supported topics (cloud models, IaaS/PaaS/SaaS, shared responsibility, scalability and elasticity, regions and zones, compute, storage, networking, pricing, security, governance, Well-Architected) |
| **Claude account** | Page published as a claude.ai Artifact | AI answers via the viewer's own Claude account (permission asked on first use, uses their Claude usage) |
| **Your server** | You self-host with the included server | AI answers through your own API key, kept server-side |

## Option A: self-host with your own API key

You need Node 18 or newer and an Anthropic API key from https://console.anthropic.com.

1. Put `cloudprep-ai.html` and `cloudprep-ai-server.mjs` in one folder.
2. Run:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key node cloudprep-ai-server.mjs
   ```
3. Open http://localhost:8787. The server serves the page and points it at `/api/study-buddy` automatically.

### Environment variables

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | yes | none | Your API key. Never put it in the HTML. |
| `AI_MODEL` | no | `claude-sonnet-5-5` | Model used for answers |
| `PORT` | no | `8787` | Port to listen on |
| `RATE_PER_MIN` | no | `15` | Requests per IP per minute |
| `ALLOWED_ORIGIN` | no | none | Only if the page is hosted on a different origin (enables CORS for that origin) |

If the key is missing, the server answers `503 not_configured` and the page shows a clear error instead of an AI answer.

### Hosting the page elsewhere

If the HTML is on another host, set `ALLOWED_ORIGIN=https://your-site` on the server and change `aiEndpoint:""` in the page's `CONFIG` to the full server URL, for example `https://api.your-site/api/study-buddy`.

## Option B: Claude Artifact

When the page is published as a claude.ai Artifact it declares the `sample` capability. No setup is needed, but the viewer is asked for permission and their own Claude usage is spent. Declining means no AI answers (the page says so).

## Security notes

- The key lives only in the server environment. The browser sends the question and receives JSON.
- The server caps question length, rate-limits per IP and never forwards raw upstream errors.
- The page validates every AI response and discards malformed ones.
- Published Artifact pages can't call other hosts, so Option A needs the page hosted on your own server.
- AI output can be wrong. Every answer links to the official AZ-900 study guide on Microsoft Learn.

CloudPrep AI is an independent learning tool. It is not affiliated with or endorsed by Microsoft.

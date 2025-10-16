# SaveMyChat - Export AI Conversations

## What It Does
Free tool to export AI conversations from ChatGPT, Claude, Perplexity and more to PDF, Markdown, or TXT format. Perfect for archiving, documentation, or sharing AI conversations.

**Input:** Share URL from supported platforms
**Output:** Downloadable file in PDF, MD, or TXT format

**Supported Platforms:**
- ✅ ChatGPT (OpenAI)
- ✅ Claude (Anthropic)
- ✅ Perplexity AI
- 🔜 Twitter/X threads
- 🔜 Reddit threads
- 🔜 More platforms coming soon

---

## Current Version: Script (Node.js + Puppeteer)

### How It Works
1. Takes a ChatGPT share URL
2. Uses Puppeteer to load the page
3. Extracts all conversation messages (user + assistant)
4. Formats as Markdown with timestamps
5. Saves as `.md` file locally

### Requirements
- Node.js installed
- Puppeteer package

### Installation
```bash
npm install puppeteer
```

### Usage
```bash
node export-chatgpt-convo.js
```

**Edit the URL in the script:**
```javascript
const url = 'https://chatgpt.com/share/YOUR-SHARE-ID-HERE';
```

**Output:**
- `chatgpt-export-[timestamp].md` file in current directory

---

## Planned: Web App Version

### Features
**Free Tool - No Signup Required**

**User Flow:**
1. Visit website
2. Paste ChatGPT share URL
3. Click "Export"
4. Choose format:
   - **Markdown (.md)** - For developers, plain text with formatting
   - **Text (.txt)** - Plain text, no formatting
   - **PDF (.pdf)** - For sharing, professional format
5. Download file instantly

**Tech Stack:**
- **Frontend:** Next.js or plain HTML/JS
- **Backend:** Serverless function (Puppeteer)
- **Conversion:**
  - MD/TXT: Native JS
  - PDF: jsPDF or Puppeteer PDF export

---

## Where to Host (Free Options)

### Option 1: Vercel (Recommended)
**Best For:** Next.js app with serverless functions

**Pros:**
- ✅ Free tier (100GB bandwidth/month)
- ✅ Serverless functions included
- ✅ Auto SSL/CDN
- ✅ Easy deployment (connect GitHub)
- ✅ Fast global edge network

**Cons:**
- ⚠️ Puppeteer needs special setup (use `chrome-aws-lambda`)

**Setup:**
```bash
npm install chrome-aws-lambda puppeteer-core
```

**Deploy:**
```bash
vercel --prod
```

**Cost:** $0/month (free tier)

---

### Option 2: Cloudflare Pages + Workers
**Best For:** Static frontend + serverless backend

**Pros:**
- ✅ Completely free (unlimited bandwidth)
- ✅ Fast global CDN
- ✅ Workers for backend logic
- ✅ No credit card required

**Cons:**
- ⚠️ Workers have 10ms CPU limit (free tier)
- ⚠️ Puppeteer might be too heavy (use Cloudflare Browser Rendering API)

**Deploy:**
```bash
npx wrangler pages deploy
```

**Cost:** $0/month (free tier)

---

### Option 3: Railway
**Best For:** Full backend with Puppeteer

**Pros:**
- ✅ $5 free credit/month
- ✅ Supports Puppeteer natively
- ✅ Easy Docker deployment
- ✅ Persistent storage

**Cons:**
- ⚠️ May exceed free tier with heavy usage

**Deploy:** Connect GitHub repo, auto-deploys

**Cost:** $0-5/month (free $5 credit)

---

### Option 4: Render
**Best For:** Simple backend API

**Pros:**
- ✅ Free tier (750 hrs/month)
- ✅ Supports Node.js + Puppeteer
- ✅ Auto SSL
- ✅ Easy GitHub deploy

**Cons:**
- ⚠️ Free tier spins down after 15 mins inactivity (slow first load)

**Deploy:** Connect GitHub, choose "Web Service"

**Cost:** $0/month (free tier)

---

### Option 5: Fly.io
**Best For:** Docker-based apps with Puppeteer

**Pros:**
- ✅ Free tier (3 VMs, 160GB bandwidth/month)
- ✅ Full Docker support (easy Puppeteer)
- ✅ Global deployment
- ✅ Persistent storage

**Cons:**
- ⚠️ Slightly more setup than Vercel

**Deploy:**
```bash
fly launch
fly deploy
```

**Cost:** $0/month (free tier)

---

## Recommended Stack for Free Hosting

### Best Option: Vercel + Chrome AWS Lambda

**Why:**
- Frontend hosted on Vercel (free, fast)
- Serverless function for export (built-in)
- Use `chrome-aws-lambda` for Puppeteer (optimized for serverless)

**Architecture:**
```
Frontend (Vercel Pages)
  ↓
User pastes URL → Submit
  ↓
API Route (/api/export)
  ↓
Puppeteer (chrome-aws-lambda)
  ↓
Extract conversation
  ↓
Convert to MD/TXT/PDF
  ↓
Return download link
```

**Tech Stack:**
- **Frontend:** Next.js (React) or plain HTML/JS
- **Backend:** Vercel serverless function (`/api/export.js`)
- **Puppeteer:** `chrome-aws-lambda` + `puppeteer-core`
- **PDF:** `jsPDF` or Puppeteer PDF export

**Deployment:**
1. Push to GitHub
2. Connect to Vercel
3. Auto-deploy on push
4. Done!

**Cost:** $0/month (stays free unless >100GB bandwidth)

---

## Alternative: Cloudflare Pages + Browser Rendering API

**Why:**
- 100% free (no limits)
- Uses Cloudflare's Browser Rendering API (no Puppeteer needed)
- Ultra-fast global CDN

**Architecture:**
```
Frontend (Cloudflare Pages)
  ↓
User pastes URL → Submit
  ↓
Cloudflare Worker (/api/export)
  ↓
Browser Rendering API
  ↓
Extract conversation
  ↓
Convert to MD/TXT/PDF
  ↓
Return download link
```

**Cost:** $0/month (truly unlimited)

**Note:** Browser Rendering API requires paid Workers plan ($5/month), so **Vercel is better for free**.

---

## Monetization Ideas (Future)

### Freemium Model
- **Free:** 5 exports/day, MD/TXT only
- **Pro ($5/month):** Unlimited exports, PDF included, batch export, API access

### Pay-Per-Use
- **Free:** First 10 exports
- **Paid:** $0.50 per export after (or $2/month unlimited)

### API Tier
- **Free:** 100 API calls/month
- **Paid:** $10/month for 10,000 calls

---

## File Structure (Future Web App)

```
chatgpt-exporter/
├── public/
│   ├── index.html          (landing page)
│   ├── styles.css          (styling)
│   └── app.js              (frontend logic)
├── api/
│   └── export.js           (serverless function)
├── lib/
│   ├── scraper.js          (Puppeteer logic)
│   └── converter.js        (MD/TXT/PDF conversion)
├── package.json
└── README.md
```

---

## Current Script Details

**File:** `export-chatgpt-convo.js`

**What It Does:**
1. Opens ChatGPT share URL in headless browser
2. Waits for conversation to load
3. Extracts all messages (role + content)
4. Formats as Markdown:
   ```
   **User:**
   [message content]

   **Assistant:**
   [message content]
   ```
5. Saves to `chatgpt-export-[timestamp].md`

**Limitations:**
- Manual URL editing (need to change in code)
- Markdown only (no TXT/PDF)
- Local execution (not web-based)

---

## Next Steps to Build Web App

### Phase 1: Basic Web Version (1-2 days)
- [ ] Create simple HTML form (paste URL, click export)
- [ ] Build serverless function (`/api/export.js`)
- [ ] Integrate Puppeteer (chrome-aws-lambda)
- [ ] Output Markdown only
- [ ] Deploy to Vercel

### Phase 2: Multi-Format Export (1 day)
- [ ] Add TXT conversion (strip markdown)
- [ ] Add PDF conversion (jsPDF or Puppeteer)
- [ ] Add format selector (MD/TXT/PDF radio buttons)

### Phase 3: Polish (1 day)
- [ ] Add loading spinner
- [ ] Error handling (invalid URL, rate limits)
- [ ] Analytics (track usage)
- [ ] SEO optimization

### Phase 4: Monetization (Optional)
- [ ] Add usage limits (5 exports/day free)
- [ ] Stripe integration for Pro tier
- [ ] User accounts (optional)

**Total Build Time:** 3-5 days for MVP

---

## Marketing Ideas

**SEO Keywords:**
- "ChatGPT conversation exporter"
- "Download ChatGPT chat"
- "Export ChatGPT to PDF"
- "Save ChatGPT conversation"

**Distribution:**
- Post on Reddit (r/ChatGPT, r/OpenAI)
- Product Hunt launch
- Twitter thread (show demo)
- HackerNews "Show HN"

**Potential Reach:** 10K-50K users/month (based on search volume)

---

## Example Landing Page Copy

**Headline:**
"Export Any ChatGPT Conversation in Seconds"

**Subheadline:**
"Download shared ChatGPT chats as Markdown, TXT, or PDF. Free, fast, no signup required."

**CTA:**
[Paste ChatGPT Share URL] → [Export to MD/TXT/PDF]

**Features:**
- ✅ No signup required
- ✅ Instant download
- ✅ 3 formats (MD, TXT, PDF)
- ✅ Free forever

---

## Summary

**Current:** Node.js script (manual, local)
**Future:** Free web app hosted on Vercel
**Formats:** Markdown, TXT, PDF
**Cost to Host:** $0/month (Vercel free tier)
**Build Time:** 3-5 days for MVP
**Monetization:** Optional freemium ($5/month Pro tier)

**Recommended Hosting:** Vercel (easiest, free, fast)

---

**Next Steps:**
1. Test current script with multiple ChatGPT URLs
2. Build simple web UI (HTML form + submit)
3. Create serverless API route
4. Deploy to Vercel
5. Share on Reddit/Twitter

Ready to convert this into a free tool! 🚀

---

## Latest Updates

### SEO Audit Completed (October 15, 2025)

**Full SEO audit report available:** See `SEO-AUDIT-REPORT.md`

**Key Findings:**
- ✅ **HIGH POTENTIAL** for 10,000+ monthly visitors via SEO
- Market size: 100M+ ChatGPT users, 5.8B monthly visits to chatgpt.com
- Competition: Mostly browser extensions (weak SEO), few web-based tools
- Strategy: Programmatic SEO with 51+ landing pages targeting long-tail keywords
- Timeline: 6-12 months to reach 10K visitors (with consistent content publishing)

**Primary Keyword Opportunities:**
- "chatgpt export" (10K-15K monthly searches)
- "export chatgpt conversation" (5K-8K)
- "chatgpt to pdf" (8K-10K)
- "save chatgpt chat" (5K-7K)
- "claude export" (2K-3K) - Low competition
- "perplexity export" (1K-2K) - Low competition

**Competitive Advantage:**
- Web-based tool (better SEO than extensions)
- Multi-platform support (ChatGPT + Claude + Perplexity)
- Content-first strategy (competitors have minimal content)
- Freemium model (lower barrier to entry)

**Recommended Next Steps:**
1. Set up Google Search Console + Analytics
2. Create 5-10 platform-specific landing pages
3. Launch on Product Hunt, Reddit, HackerNews
4. Build programmatic SEO pages (51+ pages)
5. Publish 2-3 blog posts/week (how-to guides)
6. Submit to AI tool directories

**Revenue Potential (Conservative):**
- 10K visitors/mo × 40% tool usage = 4K users
- 2% conversion to paid ($5/mo) = 80 paid users
- Monthly Recurring Revenue: $400/mo ($4,800/year)
- At 25K visitors: $1K-2K MRR ($12K-24K/year)

**See full report for:**
- Detailed competitor analysis
- 100+ keyword opportunities
- Programmatic SEO templates
- Month-by-month roadmap
- Technical SEO checklist
- Backlink strategy

---

## Project Configuration

**Current Tech Stack:**
- Node.js + Express server
- Puppeteer for web scraping
- Plain HTML/CSS/JS frontend
- Formats: MD, TXT, PDF (planned)

**Current Status:**
- ✅ Basic web UI built (index.html)
- ✅ Express server running (port 3000)
- ✅ ChatGPT export working (Markdown)
- 🔜 PDF export (in progress)
- 🔜 Claude support (planned)
- 🔜 Perplexity support (planned)

**Local Development:**
```bash
npm start  # Runs server on http://localhost:3000
```

**Deployment Plan:**
- Platform: Vercel (recommended) or Cloudflare Pages
- Backend: Serverless functions
- Cost: $0/month (free tier)

**Files:**
- `server.js` - Express backend
- `public/index.html` - Landing page
- `public/app.js` - Frontend logic
- `public/style.css` - Styling
- `export-chatgpt-convo.js` - Original script (deprecated)

---

## Session Notes

**Last Session:** October 15, 2025
- Completed comprehensive SEO audit
- Identified 10K+ visitor potential via programmatic SEO
- Analyzed competitor landscape (ChatGPT Exporter: 60K users)
- Created keyword research (100+ opportunities)
- Defined content strategy (51+ programmatic pages)
- Outlined 12-month roadmap to 10K visitors

**Preview URL (Local):**
http://localhost:3000

**Next Session TODO:**
1. Set up Google Search Console + Analytics
2. Optimize homepage meta tags for SEO
3. Create XML sitemap
4. Build first 5 landing pages (/export/chatgpt, /export/claude, etc.)
5. Submit to 10 AI tool directories
6. Launch on Product Hunt

---

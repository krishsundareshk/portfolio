# Rechita Nityashree — MBA Portfolio Website

A personal Business Strategy & Marketing Intelligence Platform.  
Dark-themed, professional, animated — grows as you add markdown content.

---

## Folder Structure

```
portfolio/
├── index.html                     ← Home page
├── css/
│   └── style.css                  ← All styling (dark theme, animations)
├── js/
│   ├── main.js                    ← Search, animations, markdown rendering
│   ├── content-index.js           ← ⭐ YOU UPDATE THIS every time you add content
│   └── shell.js                   ← (utility, not needed directly)
├── pages/
│   ├── companies.html             ← Company analyses listing
│   ├── cases.html                 ← Case studies listing
│   ├── ceo.html                   ← CEO For A Day listing
│   ├── comparisons.html           ← Comparisons listing
│   ├── company/
│   │   ├── _template.html         ← Copy this for each new company
│   │   └── zomato.html            ← Example company page
│   ├── case/
│   │   └── _template.html         ← Copy this for each new case study
│   ├── ceo-page/
│   │   └── _template.html         ← Copy this for each CEO scenario
│   └── comparison/
│       ├── _template.html         ← Copy this for each comparison
│       └── zomato-vs-swiggy.html  ← Example comparison page
├── content/
│   ├── company-analyses/
│   │   └── zomato.md              ← Example company markdown
│   ├── case-studies/              ← Add your case study .md files here
│   ├── ceo-scenarios/             ← Add your CEO scenario .md files here
│   └── comparisons/
│       └── zomato-vs-swiggy.md    ← Example comparison markdown
└── assets/
    └── rechita-resume.pdf         ← ⭐ PUT YOUR RESUME PDF HERE
```

---

## How to Run

### Option A — VS Code (Recommended)

1. Install [VS Code](https://code.visualstudio.com/)
2. Install the **Live Server** extension (by Ritwick Dey)
3. Open the `portfolio/` folder in VS Code
4. Right-click `index.html` → **Open with Live Server**
5. Your browser opens at `http://127.0.0.1:5500`

### Option B — Python (No install needed if Python is on your computer)

```bash
cd portfolio
python3 -m http.server 8000
# Open http://localhost:8000 in your browser
```

### Option C — Node.js

```bash
cd portfolio
npx serve .
# Follow the URL it gives you
```

> ⚠️ **Do NOT open index.html directly** by double-clicking — it must run through a local server because it loads markdown files via `fetch()`. Double-clicking gives a CORS error.

---

## Adding New Content (Step-by-Step)

### Step 1 — Write your markdown file

Create a `.md` file in the right content folder.  
**Every file must start with front matter:**

```markdown
---
title: Your Page Title
excerpt: One or two sentence summary shown on listing cards.
tags: Strategy, Marketing, Branding
date: 2025-08-01
---

Your content starts here...
```

The rest of the file is regular markdown. You can use:
- `##` for section headings
- `###` for sub-headings  
- `**bold**` for emphasis
- `> blockquote` for key quotes
- Tables (they'll be styled automatically)
- Bullet lists

**SWOT tables get special treatment:** If you include a markdown table with columns named `Strengths`, `Weaknesses`, `Opportunities`, `Threats` — it automatically renders as a visual 2×2 SWOT grid.

---

### Step 2 — Create an HTML page for it

**Copy the right template:**

| Content Type | Copy from | Save to |
|---|---|---|
| Company Analysis | `pages/company/_template.html` | `pages/company/your-company.html` |
| Case Study | `pages/case/_template.html` | `pages/case/your-case.html` |
| CEO For A Day | `pages/ceo-page/_template.html` | `pages/ceo-page/company-name.html` |
| Comparison | `pages/comparison/_template.html` | `pages/comparison/co1-vs-co2.html` |

**Then edit the copy:**  
Change the `data-md` attribute to point to your markdown file.

For a company page:
```html
<!-- Change this: -->
<body data-page="company-analysis" data-md="../../content/company-analyses/FILENAME.md">

<!-- To this (example): -->
<body data-page="company-analysis" data-md="../../content/company-analyses/nykaa.md">
```

Also update the `<title>` tag at the top.

---

### Step 3 — Update the content index

Open `js/content-index.js` and add your entry to `window.CONTENT_INDEX`:

```javascript
{
  type:    "Company Analysis",         // Must match exactly: "Company Analysis" | "Case Study" | "CEO For A Day" | "Comparison"
  title:   "Nykaa — D2C Beauty Strategy",
  excerpt: "How Nykaa built India's dominant beauty platform through content, community, and creator marketing.",
  tags:    ["Retail", "Branding", "Growth", "Strategy"],
  file:    "pages/company/nykaa.html",  // Path from the root (where index.html is)
  date:    "2025-08-15"
},
```

That's it. The card appears on the listing page, shows up in search, and the tag filters work automatically.

---

## Markdown Format Guide

### Company Analysis

```markdown
---
title: Company Name — Short Tagline
excerpt: 1-2 sentence summary.
tags: Branding, Strategy, Growth
date: 2025-08-01
---

## Company Overview
**Company:** Name  
**Industry:** Sector  
**Founded:** Year  
**Headquarters:** City

## Business Model
...

## Marketing Strategy
### Segmentation
### Targeting
### Positioning

## Customer Acquisition
## Customer Retention
## Competitive Advantage

## SWOT Analysis
| Strengths | Weaknesses | Opportunities | Threats |
|---|---|---|---|
| Point 1 | Point 1 | Point 1 | Point 1 |

## Strategic Lessons
```

### Case Study

```markdown
---
title: Case Title
excerpt: Problem summary.
tags: Strategy, Consulting
date: 2025-08-01
---

## Problem Statement
## Background
## Market Situation
## Root Cause Analysis
## Strategic Options
## Recommended Solution
## Risks
## Expected Impact
## Conclusion
```

### CEO For A Day

```markdown
---
title: If I Were CEO of [Company]
excerpt: Summary of the strategic challenge.
tags: Leadership, Strategy
date: 2025-08-01
---

## Current Situation
## Key Problems
## Opportunities

## First 30 Days
## First 90 Days
## First 12 Months

## Strategic Initiatives
## Risks
## Success Metrics
## Final Recommendation
```

### Comparison

```markdown
---
title: Company A vs Company B — Subtitle
excerpt: What this comparison covers.
tags: Strategy, Branding
date: 2025-08-01
---

## Overview
## Business Model Comparison
| Dimension | Company A | Company B |
|---|---|---|

## Marketing Strategy Comparison
## Positioning Comparison
## Customer Acquisition Comparison
## Customer Retention Comparison
## Competitive Advantage Comparison
## Strategic Takeaways
## Final Summary
```

---

## Resume

Place your resume PDF at:
```
assets/rechita-resume.pdf
```

The "Download Resume" button on the home page links to this file automatically.

---

## Customising

### Change your name or tagline
Edit `index.html` — look for the hero section text.

### Add more tags to filters
In each listing page (`pages/companies.html`, etc.), add a new button:
```html
<button class="tag-btn" data-tag="YourNewTag">YourNewTag</button>
```

### Change the gold accent colour
In `css/style.css`, change `--gold: #C9A84C;` to any hex colour.

---

## Hosting for Free (When Ready to Go Live)

**Netlify (easiest):**
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your `portfolio/` folder onto the deploy zone
3. You get a live URL instantly

**GitHub Pages:**
1. Push to a GitHub repo
2. Settings → Pages → Deploy from branch (main)
3. Live at `yourusername.github.io/portfolio`

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Blank page / content not loading | Must run via local server, not file:// |
| SWOT table not converting | Column headers must be exactly: Strengths, Weaknesses, Opportunities, Threats |
| Card not appearing | Check content-index.js — file path must be from root, not from pages/ |
| Search not finding content | Search reads from content-index.js — make sure entry is added |
| Resume download not working | Place PDF at assets/rechita-resume.pdf |

#!/usr/bin/env node
'use strict';

const fs   = require('fs');
const path = require('path');
const { marked } = require('marked');

// ── CONFIG ──────────────────────────────────────────────────────────
const ROOT     = __dirname;
const CONTENT  = path.join(ROOT, 'content');
const BASE_URL = 'https://abahziz0.github.io';
const TYPES    = ['blog', 'works', 'gallery'];

const LISTING_META = {
  blog:    { title: 'Blog',    desc: 'Writing on code, design, and ideas.' },
  works:   { title: 'Works',   desc: 'Projects and things I\'ve built.' },
  gallery: { title: 'Gallery', desc: 'Photos, sketches, and visual work.' },
};

// ── SHARED CSS ───────────────────────────────────────────────────────
const CSS = `
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#F5EEE6;
  --nav-bg:#E5D4C5;
  --text:#3D1C08;
  --dim:#8A6040;
  --accent:#8B3A0A;
  --orange:#F97316;
  --border:#D8CCBC;
  --card:#EDE4D8;
  --font:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Arial,sans-serif;
}
html,body{background:var(--bg);color:var(--text);font-family:var(--font);font-size:16px;line-height:1.6}

/* ── NAV ── */
nav.site-nav{
  position:sticky;top:0;
  background:var(--nav-bg);
  border-bottom:1px solid var(--border);
  height:48px;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 24px;
  z-index:100;
}
.nav-left{display:flex;align-items:center;gap:24px}
.nav-logo{
  width:28px;height:28px;background:var(--orange);border-radius:5px;
  display:flex;align-items:center;justify-content:center;
  color:#fff;font-weight:800;font-size:13px;text-decoration:none;flex-shrink:0;
}
.nav-links{display:flex;gap:20px}
.nav-links a{color:var(--text);text-decoration:none;font-size:14px;font-weight:500}
.nav-links a:hover,.nav-links a.active{color:var(--accent);text-decoration:underline}
.nav-back a{
  color:var(--accent);text-decoration:none;font-size:13px;
  border:1px solid var(--border);border-radius:4px;padding:4px 11px;
}
.nav-back a:hover{background:var(--card)}

/* ── LAYOUT ── */
main{max-width:720px;margin:0 auto;padding:52px 24px 88px}

/* ── POST ── */
.post-title{font-size:2rem;font-weight:700;line-height:1.2;margin-bottom:14px}
.post-meta{font-size:13px;color:var(--dim);display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-bottom:24px}
.tags{display:flex;gap:6px;flex-wrap:wrap}
.tag{font-size:12px;padding:2px 8px;background:var(--card);border:1px solid var(--border);border-radius:3px;color:var(--accent);font-weight:500}
.post-body{font-size:16px;line-height:1.78;color:var(--text)}
.post-body h1,.post-body h2,.post-body h3,.post-body h4{margin:2em 0 0.55em;line-height:1.3;font-weight:700}
.post-body h1{font-size:1.75rem}
.post-body h2{font-size:1.35rem;border-bottom:1px solid var(--border);padding-bottom:.3em}
.post-body h3{font-size:1.1rem}
.post-body p{margin-bottom:1.25em}
.post-body a{color:var(--accent)}
.post-body ul,.post-body ol{margin:0 0 1.25em 1.5em}
.post-body li{margin-bottom:.3em}
.post-body code{
  font-family:'SF Mono','Fira Code','Cascadia Code',monospace;
  background:var(--card);border:1px solid var(--border);
  border-radius:3px;padding:.1em .4em;font-size:.875em
}
.post-body pre{
  background:var(--card);border:1px solid var(--border);
  border-radius:6px;padding:16px 20px;overflow-x:auto;margin-bottom:1.25em
}
.post-body pre code{background:none;border:none;padding:0}
.post-body blockquote{border-left:3px solid var(--orange);padding-left:16px;color:var(--dim);margin:1.25em 0}
.post-body hr{border:none;border-top:1px solid var(--border);margin:2em 0}
.post-body img{max-width:100%;border-radius:6px;border:1px solid var(--border)}
.post-body table{width:100%;border-collapse:collapse;margin-bottom:1.25em;font-size:14px}
.post-body th{text-align:left;border-bottom:2px solid var(--border);padding:8px 12px;font-weight:600}
.post-body td{border-bottom:1px solid var(--border);padding:8px 12px;color:var(--dim)}

/* ── PREV / NEXT ── */
.post-nav{
  display:grid;grid-template-columns:1fr 1fr;gap:12px;
  margin-top:52px;border-top:1px solid var(--border);padding-top:32px
}
.post-nav a{
  display:block;padding:14px 16px;
  background:var(--card);border:1px solid var(--border);border-radius:7px;
  text-decoration:none;color:var(--text)
}
.post-nav a:hover{border-color:var(--accent)}
.pn-label{font-size:11px;color:var(--dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:5px}
.pn-title{font-size:14px;font-weight:500}
.post-nav .next{text-align:right}
.post-nav .placeholder{display:block}

/* ── LISTING ── */
.listing-header{margin-bottom:40px}
.listing-title{font-size:2rem;font-weight:700;margin-bottom:8px}
.listing-desc{font-size:15px;color:var(--dim)}
.listing-grid{display:flex;flex-direction:column;gap:14px}
.listing-card{
  display:block;padding:20px 22px;
  background:var(--card);border:1px solid var(--border);border-radius:8px;
  text-decoration:none;color:var(--text)
}
.listing-card:hover{border-color:var(--accent)}
.lc-title{font-size:1.05rem;font-weight:600;margin-bottom:6px}
.lc-meta{font-size:13px;color:var(--dim);display:flex;gap:14px;flex-wrap:wrap;margin-bottom:8px}
.lc-excerpt{font-size:14px;color:var(--dim);line-height:1.6}
.listing-empty{color:var(--dim);font-size:15px;margin-top:16px}

/* ── RESPONSIVE ── */
@media(max-width:600px){
  nav.site-nav{padding:0 16px}
  .nav-links{gap:14px}
  main{padding:32px 16px 64px}
  .post-title,.listing-title{font-size:1.5rem}
  .post-nav{grid-template-columns:1fr}
}
`;

// ── HELPERS ─────────────────────────────────────────────────────────

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };

  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const ci = line.indexOf(':');
    if (ci === -1) continue;
    const key = line.slice(0, ci).trim();
    const raw = line.slice(ci + 1).trim();
    if (raw.startsWith('[')) {
      try { meta[key] = JSON.parse(raw); }
      catch { meta[key] = raw.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')); }
    } else {
      meta[key] = raw.replace(/^["']|["']$/g, '');
    }
  }
  return { meta, body: m[2] };
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function ensure(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

// ── TEMPLATES ────────────────────────────────────────────────────────

function navHtml(active) {
  const link = (type, label) =>
    `<a href="${BASE_URL}/${type}/"${active === type ? ' class="active"' : ''}>${label}</a>`;

  return `<nav class="site-nav" aria-label="Site navigation">
  <div class="nav-left">
    <a class="nav-logo" href="${BASE_URL}/" title="Back to portfolio">A</a>
    <div class="nav-links">
      ${link('blog',    'Blog')}
      ${link('works',   'Works')}
      ${link('gallery', 'Gallery')}
    </div>
  </div>
  <div class="nav-back"><a href="${BASE_URL}/">← Portfolio</a></div>
</nav>`;
}

function tagsHtml(tags) {
  if (!tags || !tags.length) return '';
  return `<div class="tags">${tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>`;
}

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function postPage({ meta, html, type, prev, next }) {
  const prevLink = prev
    ? `<a class="prev" href="${BASE_URL}/${type}/${prev.slug}/">
        <div class="pn-label">← Previous</div>
        <div class="pn-title">${esc(prev.title)}</div>
      </a>`
    : `<span class="placeholder"></span>`;
  const nextLink = next
    ? `<a class="next" href="${BASE_URL}/${type}/${next.slug}/">
        <div class="pn-label">Next →</div>
        <div class="pn-title">${esc(next.title)}</div>
      </a>`
    : `<span class="placeholder"></span>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(meta.title || 'Post')} — Abdul Aziz</title>
${meta.excerpt ? `<meta name="description" content="${esc(meta.excerpt)}">` : ''}
<style>${CSS}</style>
</head>
<body>
${navHtml(type)}
<main>
  <article>
    <h1 class="post-title">${esc(meta.title || '')}</h1>
    <div class="post-meta">
      ${meta.date ? `<time datetime="${esc(meta.date)}">${fmtDate(meta.date)}</time>` : ''}
      ${tagsHtml(meta.tags)}
    </div>
    <div class="post-body">${html}</div>
  </article>
  <nav class="post-nav" aria-label="Post navigation">
    ${prevLink}
    ${nextLink}
  </nav>
</main>
</body>
</html>`;
}

function listingPage({ type, posts }) {
  const { title, desc } = LISTING_META[type];

  const cards = posts.map(p => {
    const tagPart = p.meta.tags && p.meta.tags.length
      ? `<span>${p.meta.tags.map(esc).join(', ')}</span>` : '';
    return `<a class="listing-card" href="${BASE_URL}/${type}/${p.slug}/">
      <div class="lc-title">${esc(p.meta.title || p.slug)}</div>
      <div class="lc-meta">
        ${p.meta.date ? `<time datetime="${esc(p.meta.date)}">${fmtDate(p.meta.date)}</time>` : ''}
        ${tagPart}
      </div>
      ${p.meta.excerpt ? `<div class="lc-excerpt">${esc(p.meta.excerpt)}</div>` : ''}
    </a>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)} — Abdul Aziz</title>
<meta name="description" content="${esc(desc)}">
<style>${CSS}</style>
</head>
<body>
${navHtml(type)}
<main>
  <div class="listing-header">
    <h1 class="listing-title">${esc(title)}</h1>
    <p class="listing-desc">${esc(desc)}</p>
  </div>
  <div class="listing-grid">
    ${posts.length ? cards : '<p class="listing-empty">Nothing here yet.</p>'}
  </div>
</main>
</body>
</html>`;
}

// ── READ POSTS ────────────────────────────────────────────────────────

function readPosts(type) {
  const dir = path.join(CONTENT, type);
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf8');
      const { meta, body } = parseFrontmatter(raw);
      const slug = meta.slug || slugify(path.basename(f, '.md'));
      return { meta, body, slug, file: f };
    })
    .sort((a, b) => {
      const da = a.meta.date ? new Date(a.meta.date) : 0;
      const db = b.meta.date ? new Date(b.meta.date) : 0;
      return db - da; // newest first
    });
}

// ── BUILD ────────────────────────────────────────────────────────────

let generated = 0;

for (const type of TYPES) {
  const posts = readPosts(type);
  const outDir = path.join(ROOT, type);
  ensure(outDir);

  // Individual pages
  posts.forEach((post, i) => {
    const prev = posts[i + 1] ? { slug: posts[i + 1].slug, title: posts[i + 1].meta.title || posts[i + 1].slug } : null;
    const next = posts[i - 1] ? { slug: posts[i - 1].slug, title: posts[i - 1].meta.title || posts[i - 1].slug } : null;
    const html = marked(post.body);
    const dir  = path.join(outDir, post.slug);
    ensure(dir);
    fs.writeFileSync(path.join(dir, 'index.html'), postPage({ meta: post.meta, html, type, prev, next }));
    console.log(`  ✓  ${type}/${post.slug}/index.html`);
    generated++;
  });

  // Listing page
  fs.writeFileSync(path.join(outDir, 'index.html'), listingPage({ type, posts }));
  console.log(`  ✓  ${type}/index.html`);
  generated++;
}

console.log(`\nDone — ${generated} file${generated !== 1 ? 's' : ''} written.`);

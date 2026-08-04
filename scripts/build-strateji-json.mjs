#!/usr/bin/env node
/* dokumanlar.json (HTML detay) -> recursive sections JSON + manifest.json
   __handAuthored dosyaları EZMEZ. HTML -> blocks; blocks -> tek "Genel Bakış" section. */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcPath = join(root, "strateji/data/dokumanlar.json");
const outDir = join(root, "strateji/data/docs");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&#10094;/g, "«").replace(/&#10095;/g, "»").replace(/&hellip;/g, "…").replace(/&nbsp;/g, " ");
const inline = (s) => decode(String(s).replace(/<b>(.*?)<\/b>/gs, "**$1**").replace(/<\/?[^>]+>/g, "").trim());

function htmlToBlocks(html) {
  const blocks = [];
  const re = /<p>(.*?)<\/p>|<ul>(.*?)<\/ul>|<ol>(.*?)<\/ol>/gs;
  let m;
  while ((m = re.exec(html))) {
    if (m[1] !== undefined) { const t = inline(m[1]); if (t) blocks.push({ type: "paragraph", text: t }); }
    else {
      const listHtml = m[2] !== undefined ? m[2] : m[3]; const ordered = m[3] !== undefined; const items = [];
      const li = /<li>(.*?)<\/li>/gs; let x; while ((x = li.exec(listHtml))) { const t = inline(x[1]); if (t) items.push(t); }
      if (items.length) blocks.push({ type: "list", ordered, items });
    }
  }
  if (!blocks.length) { const t = inline(html); if (t) blocks.push({ type: "paragraph", text: t }); }
  return blocks;
}

const slug = (t) => String(t).toLowerCase()
  .replace(/[çğıöşü]/g, (c) => ({ "ç": "c", "ğ": "g", "ı": "i", "ö": "o", "ş": "s", "ü": "u" }[c]))
  .replace(/[·•]/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "bolum";
function splitBlocksToSections(blocks) {
  const secs = []; let cur = null; const used = new Set();
  const push = (title) => { let id = slug(title); let n = 2; while (used.has(id)) id = slug(title) + "-" + n++; used.add(id); cur = { id, title, blocks: [] }; secs.push(cur); };
  for (const b of blocks) {
    if (b.type === "heading" && b.level === 2) push(b.text);
    else { if (!cur) push("Genel Bakış"); cur.blocks.push(b); }
  }
  return secs.length ? secs : [{ id: "genel", title: "Genel Bakış", blocks }];
}

const docs = JSON.parse(readFileSync(srcPath, "utf8"));
const manifest = { version: "3", updated: "2026-08-04", docs: [] };
const mEntry = (o, file) => ({ id: o.id, icon: o.icon, baslik: o.baslik, ozet: o.ozet, amac: o.amac || o.ozet, status: o.status, kritikKPI: o.kritikKPI, file });

for (const d of docs) {
  const file = `${d.id}.json`;
  const outPath = join(outDir, file);
  const existing = existsSync(outPath) ? JSON.parse(readFileSync(outPath, "utf8")) : null;
  if (existing && existing.__handAuthored) {
    if (!existing.sections && Array.isArray(existing.blocks)) { // legacy blocks -> sections
      const up = { ...existing, sections: splitBlocksToSections(existing.blocks) }; delete up.blocks;
      writeFileSync(outPath, JSON.stringify(up, null, 2) + "\n", "utf8");
      manifest.docs.push(mEntry(up, file));
    } else manifest.docs.push(mEntry(existing, file));
    continue;
  }
  const doc = { id: d.id, icon: d.icon, baslik: d.baslik, ozet: d.ozet, amac: d.ozet, sections: [{ id: "genel", title: "Genel Bakış", summary: d.ozet, blocks: htmlToBlocks(d.detay) }] };
  writeFileSync(outPath, JSON.stringify(doc, null, 2) + "\n", "utf8");
  manifest.docs.push({ id: d.id, icon: d.icon, baslik: d.baslik, ozet: d.ozet, amac: d.ozet, file });
}

writeFileSync(join(root, "strateji/data/manifest.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`OK: ${manifest.docs.length} doküman (sections) -> docs/*.json + manifest.json`);

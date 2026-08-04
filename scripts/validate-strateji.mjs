#!/usr/bin/env node
/* TEST-FIRST: docs/*.json şema + ham HTML yok + placeholder yok + section id benzersiz (recursive) + manifest parity.
   Ayrıca kanal derinlik AUDIT'i (soft rapor). Hard hatada exit 1. */
import Ajv from "ajv";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "strateji/data");
const docsDir = join(dataDir, "docs");
const schema = JSON.parse(readFileSync(join(dataDir, "schema/doc.schema.json"), "utf8"));
const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

const CHANNEL_DOC_IDS = ["05a", "05b", "05c", "05d", "05e", "05f", "05g", "05h", "05i", "05j", "05k", "05l", "05m"];
const CHANNEL_REQUIRED = ["yonetici-ozeti", "is-gerekcesi", "mevcut-durum", "hedef-kitle", "funnel-gorevi", "teknik-onkosul", "hesap-yetki", "kurulum", "kampanya-mimarisi", "tracking", "veri-sozlugu", "butce", "kpi", "test-backlog", "scale-pause-kill", "kvkk-risk", "plan-30-60-90", "raci", "bagimliliklar", "kaynaklar"];
const PLACEHOLDER = /detay\s+(sonra|eklenecek)|sonra eklenecek|içerik doldurulacak|\bhazırlanıyor\b|lorem ipsum|\bplaceholder\b|yer tutucu|faz\s*2['’]?de doldur/i;

const collectIds = (secs, out = []) => { for (const s of secs || []) { out.push(s.id); if (s.sections) collectIds(s.sections, out); } return out; };
const collectSecIds = (secs, out = new Set()) => { for (const s of secs || []) { out.add(s.id); if (s.sections) collectSecIds(s.sections, out); } return out; };

let hard = 0;
const shallow = [];
const files = readdirSync(docsDir).filter((f) => f.endsWith(".json")).sort();
const docIds = new Set();

for (const f of files) {
  const raw = readFileSync(join(docsDir, f), "utf8");
  if (/<\/?(p|ul|ol|li|div|span|table|h[1-6])\b/i.test(raw)) { console.error(`✗ ${f}: ham HTML tag (yasak)`); hard++; }
  if (PLACEHOLDER.test(raw)) { console.error(`✗ ${f}: placeholder ifade`); hard++; }
  const doc = JSON.parse(raw);
  if (docIds.has(doc.id)) { console.error(`✗ ${f}: doküman id tekrarı ${doc.id}`); hard++; }
  docIds.add(doc.id);
  if (!validate(doc)) { hard++; console.error(`✗ ${f} (${doc.id}) şema:`); for (const e of validate.errors.slice(0, 6)) console.error(`   ${e.instancePath} ${e.message}`); }
  const ids = collectIds(doc.sections);
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  if (dup.length) { console.error(`✗ ${f}: section id tekrarı: ${[...new Set(dup)].join(",")}`); hard++; }
  // AUDIT (soft): kanal derinliği
  if (CHANNEL_DOC_IDS.includes(doc.id)) {
    const have = collectSecIds(doc.sections);
    const missing = CHANNEL_REQUIRED.filter((r) => !have.has(r));
    if (missing.length) shallow.push({ id: doc.id, baslik: doc.baslik, eksik: missing.length });
  }
}

const manifest = JSON.parse(readFileSync(join(dataDir, "manifest.json"), "utf8"));
for (const m of manifest.docs) if (!docIds.has(m.id)) { console.error(`✗ manifest: ${m.id} doc yok`); hard++; }

console.log(`\n— HARD GATE —`);
if (hard) { console.error(`✗ BAŞARISIZ: ${hard} hard hata (şema/HTML/placeholder/id/manifest)`); }
else console.log(`✓ HARD OK — ${files.length} doküman: şema geçerli, ham HTML yok, placeholder yok, section id benzersiz, manifest parity.`);

console.log(`\n— DERİNLİK AUDIT (soft) — kanal başına 20 zorunlu bölümden eksik:`);
if (!shallow.length) console.log("  ✓ tüm kanallar tam derinlikte");
else for (const s of shallow) console.log(`  • ${s.id} ${s.baslik}: ${s.eksik} bölüm eksik (derinleştirilecek)`);

process.exit(hard ? 1 : 0);

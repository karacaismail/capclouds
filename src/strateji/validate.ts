/* Hafif runtime doğrulama (JSON Schema eşdeğeri) — recursive sections + block. */
import type { Doc, Section, Block } from "./types";
import { BLOCK_TYPES } from "./types";

export interface ValidationError { docId?: string; path: string; message: string; }

const needStr = (obj: any, key: string, path: string, errs: ValidationError[]) => {
  if (typeof obj?.[key] !== "string" || !obj[key].length) errs.push({ path: `${path}.${key}`, message: "zorunlu string eksik" });
};

export function validateBlock(b: any, path: string, errs: ValidationError[]) {
  if (!b || typeof b !== "object" || !BLOCK_TYPES.includes(b.type)) { errs.push({ path, message: `geçersiz blok: ${b?.type}` }); return; }
  const B = b as Block;
  switch (B.type) {
    case "heading": needStr(b, "text", path, errs); if (![2, 3, 4].includes(b.level)) errs.push({ path: `${path}.level`, message: "2|3|4" }); break;
    case "paragraph": case "callout": needStr(b, "text", path, errs); break;
    case "list": if (!b.items?.length) errs.push({ path: `${path}.items`, message: "boş" }); break;
    case "table": if (!Array.isArray(b.headers) || !Array.isArray(b.rows)) errs.push({ path, message: "headers/rows" }); break;
    case "evidence": case "kpi": case "risk": if (!(b.items || b.rows)?.length) errs.push({ path, message: "boş" }); break;
    case "decision": needStr(b, "gate", path, errs); needStr(b, "rationale", path, errs); break;
    case "gate": needStr(b, "question", path, errs); needStr(b, "pass", path, errs); needStr(b, "fail", path, errs); break;
    case "eca": needStr(b, "event", path, errs); needStr(b, "condition", path, errs); needStr(b, "action", path, errs); break;
    case "timeline": if (!b.items?.length) errs.push({ path: `${path}.items`, message: "boş" }); break;
    case "chartReference": needStr(b, "chartId", path, errs); needStr(b, "title", path, errs); break;
    case "sources": if (!Array.isArray(b.sources)) errs.push({ path: `${path}.sources`, message: "dizi" }); break;
  }
}

function validateSection(s: any, path: string, ids: Set<string>, errs: ValidationError[]) {
  if (!s || typeof s !== "object") { errs.push({ path, message: "geçersiz bölüm" }); return; }
  needStr(s, "id", path, errs); needStr(s, "title", path, errs);
  if (typeof s.id === "string") { if (ids.has(s.id)) errs.push({ path: `${path}.id`, message: `id tekrarı: ${s.id}` }); ids.add(s.id); }
  (s.blocks as Block[] | undefined)?.forEach((b, i) => validateBlock(b, `${path}.blocks[${i}]`, errs));
  (s.sections as Section[] | undefined)?.forEach((c, i) => validateSection(c, `${path}/${c?.id || i}`, ids, errs));
  if (!s.blocks?.length && !s.sections?.length) errs.push({ path, message: "bölümde içerik (blocks veya sections) yok" });
}

export function validateDoc(d: any): ValidationError[] {
  const errs: ValidationError[] = [];
  ["id", "icon", "baslik", "ozet"].forEach((k) => needStr(d, k, "doc", errs));
  if (!Array.isArray(d?.sections) || !d.sections.length) errs.push({ path: "doc.sections", message: "en az bir bölüm" });
  else { const ids = new Set<string>(); d.sections.forEach((s: any, i: number) => validateSection(s, `sections[${i}]`, ids, errs)); }
  return errs.map((e) => ({ ...e, docId: typeof d?.id === "string" ? d.id : "?" }));
}

export function validateAll(docs: any[]): { ok: boolean; errors: ValidationError[] } {
  const errors = docs.flatMap(validateDoc);
  const ids = docs.map((d) => d?.id);
  ids.forEach((id, i) => { if (id && ids.indexOf(id) !== i) errors.push({ docId: id, path: "doc.id", message: "doküman id tekrarı" }); });
  return { ok: errors.length === 0, errors };
}

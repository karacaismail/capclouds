/* ============================================================
   KANONİK STRATEJİ VERİ MODELİ — recursive sections + structured block
   Kural: tek kanonik kaynak JSON; ham HTML YASAK; UI en fazla 3 seviye render eder.
   ============================================================ */

export type Confidence = "fact" | "estimate" | "assumption" | "unknown";
export type GateStatus = "GO" | "CONDITIONAL_GO" | "HOLD" | "NO_GO";

export interface Source {
  id: string; title: string; url?: string; publishedDate?: string; accessedDate?: string;
}
export interface EvidenceItem {
  claim: string; confidence: Confidence; sourceId?: string;
  low?: string; base?: string; high?: string; formula?: string; note?: string;
}
export interface KpiRow { metric: string; baseline: string; target: string; frequency?: string; owner?: string; }
export interface RiskRow { risk: string; signal: string; mitigation: string; severity?: "low" | "med" | "high"; }

/* ---- Structured block birliği ---- */
export type Block =
  | { type: "heading"; level: 2 | 3 | 4; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string; datasetId?: string }
  | { type: "callout"; variant?: "info" | "warn" | "ok" | "bad"; title?: string; text: string }
  | { type: "evidence"; title?: string; items: EvidenceItem[] }
  | { type: "decision"; gate: GateStatus; rationale: string; condition?: string; owner?: string; deadline?: string; reopen?: string }
  | { type: "kpi"; title?: string; rows: KpiRow[] }
  | { type: "gate"; id: string; question: string; pass: string; fail: string }
  | { type: "eca"; id?: string; event: string; condition: string; action: string }
  | { type: "risk"; title?: string; rows: RiskRow[] }
  | { type: "timeline"; items: { when: string; what: string; owner?: string }[] }
  | { type: "chartReference"; chartId: string; title: string; note?: string; datasetId?: string; mount?: boolean }
  | { type: "sources"; title?: string; sources: Source[] };

export type BlockType = Block["type"];

/** Recursive bölüm. Yaprak seviyede blocks; ara seviyede sections. */
export interface Section {
  id: string;         // doküman içinde benzersiz (kebab)
  title: string;
  summary?: string;   // bölümün karar sorusu / kısa özet
  status?: GateStatus;
  blocks?: Block[];
  sections?: Section[];
}

export interface Doc {
  id: string;
  icon: string;
  baslik: string;
  ozet: string;         // 1-2 cümle (başlıkta görünür)
  amac?: string;        // tek cümlelik amaç (başlıkta görünür)
  status?: GateStatus;  // durum rozeti
  kritikKPI?: string;   // kritik KPI (başlıkta görünür)
  owner?: string;
  decisionOwner?: string;
  layer?: "hazirlik" | "icra";
  sections: Section[];
}

export interface ManifestEntry { id: string; icon: string; baslik: string; ozet: string; amac?: string; status?: GateStatus; kritikKPI?: string; file: string; }
export interface Manifest { version: string; updated: string; docs: ManifestEntry[]; }

export const BLOCK_TYPES: BlockType[] = [
  "heading", "paragraph", "list", "table", "callout", "evidence",
  "decision", "kpi", "gate", "eca", "risk", "timeline", "chartReference", "sources",
];

/** Kanal dokümanları için zorunlu Seviye-2 bölüm id'leri */
export const CHANNEL_SECTION_IDS = [
  "yonetici-ozeti", "is-gerekcesi", "mevcut-durum", "hedef-kitle", "funnel-gorevi",
  "teknik-onkosul", "hesap-yetki", "kurulum", "kampanya-mimarisi", "tracking",
  "veri-sozlugu", "butce", "kpi", "test-backlog", "scale-pause-kill",
  "kvkk-risk", "plan-30-60-90", "raci", "bagimliliklar", "kaynaklar",
];
export const CHANNEL_DOC_IDS = [
  "05a", "05b", "05c", "05d", "05e", "05f", "05g", "05h", "05i", "05j", "05k", "05l", "05m",
];

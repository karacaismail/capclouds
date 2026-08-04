/* Structured block + recursive section -> nested accordion HTML (güvenli üretim).
   Grafik/tablo verisi strateji.ts'te .chart-mount / .chart-table üzerinden bağlanır. */
import type { Block, Section, Confidence, GateStatus } from "./types";

const esc = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const inl = (s: unknown) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

const confBadge: Record<Confidence, string> = {
  fact: '<span class="chip badge-ok">Kanıt</span>', estimate: '<span class="chip" style="background:#e2eff6;color:#2f6e97">Tahmin</span>',
  assumption: '<span class="chip badge-warn">Varsayım</span>', unknown: '<span class="chip badge-bad">Bilinmiyor</span>',
};
const gateBadge: Record<GateStatus, string> = {
  GO: '<span class="chip badge-ok">GO</span>', CONDITIONAL_GO: '<span class="chip badge-warn">CONDITIONAL GO</span>',
  HOLD: '<span class="chip" style="background:#e2eff6;color:#2f6e97">HOLD</span>', NO_GO: '<span class="chip badge-bad">NO-GO</span>',
};
const calloutCls: Record<string, string> = { info: "bg-cloud-50 border-cloud-200", warn: "bg-warn/10 border-warn/30", ok: "bg-ok/10 border-ok/30", bad: "bg-bad/10 border-bad/30" };
const sevCls: Record<string, string> = { low: "badge-ok", med: "badge-warn", high: "badge-bad" };

function table(headers: string[], rows: string[][], caption?: string, datasetId?: string): string {
  return `<div class="table-scroll mt-2"${datasetId ? ` data-dataset="${esc(datasetId)}"` : ""}><table class="tbl">
    <thead><tr>${headers.map((h) => `<th>${inl(h)}</th>`).join("")}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td${i === 0 ? ' class="font-bold"' : ""}>${inl(c)}</td>`).join("")}</tr>`).join("")}</tbody>
  </table>${caption ? `<div class="text-espresso-400 text-[0.9rem] mt-1">${inl(caption)}</div>` : ""}</div>`;
}

export function renderBlock(b: Block): string {
  switch (b.type) {
    case "heading": { const sz = b.level === 2 ? "text-[1.15rem]" : b.level === 3 ? "text-[1.05rem]" : "text-[1rem]"; return `<h${b.level} class="${sz} font-black text-espresso-900 mt-3 first:mt-0">${inl(b.text)}</h${b.level}>`; }
    case "paragraph": return `<p class="mt-2 text-espresso-700">${inl(b.text)}</p>`;
    case "list": return `<${b.ordered ? "ol" : "ul"} class="mt-2 ${b.ordered ? "list-decimal" : "list-disc"} pl-5 space-y-1">${b.items.map((i) => `<li>${inl(i)}</li>`).join("")}</${b.ordered ? "ol" : "ul"}>`;
    case "table": return table(b.headers, b.rows, b.caption, b.datasetId);
    case "callout": return `<div class="mt-3 rounded-xl2 border p-3 ${calloutCls[b.variant || "info"]}">${b.title ? `<div class="font-bold text-espresso-900">${inl(b.title)}</div>` : ""}<div class="text-espresso-700">${inl(b.text)}</div></div>`;
    case "evidence": return `<div class="mt-3">${b.title ? `<div class="font-bold text-espresso-900 mb-1">${inl(b.title)}</div>` : ""}${table(["İddia", "Güven", "Düşük", "Baz", "Yüksek", "Kaynak"], b.items.map((e) => [e.claim, "", e.low || "—", e.base || "—", e.high || "—", e.sourceId || "—"]))}<div class="flex flex-wrap gap-2 mt-2">${b.items.map((e) => `${confBadge[e.confidence]}<span class="text-espresso-500 text-[0.95rem]">${inl(e.claim)}${e.formula ? ` · <i>${inl(e.formula)}</i>` : ""}</span>`).join(" ")}</div></div>`;
    case "kpi": return `<div class="mt-3">${b.title ? `<div class="font-bold text-espresso-900 mb-1">${inl(b.title)}</div>` : ""}${table(["Metrik", "Baseline", "Hedef", "Sıklık", "Owner"], b.rows.map((k) => [k.metric, k.baseline, k.target, k.frequency || "—", k.owner || "—"]))}</div>`;
    case "risk": return `<div class="mt-3">${b.title ? `<div class="font-bold text-espresso-900 mb-1">${inl(b.title)}</div>` : ""}${table(["Risk", "Erken uyarı", "Önlem"], b.rows.map((r) => [r.risk, r.signal, r.mitigation]))}<div class="flex flex-wrap gap-2 mt-1">${b.rows.filter((r) => r.severity).map((r) => `<span class="chip ${sevCls[r.severity!]}">${inl(r.risk)}</span>`).join("")}</div></div>`;
    case "decision": return `<div class="mt-3 rounded-xl2 border border-espresso-200 p-3 bg-espresso-50/50"><div class="flex items-center gap-2">${gateBadge[b.gate]}<span class="font-bold text-espresso-900">Karar</span></div><p class="mt-1 text-espresso-700">${inl(b.rationale)}</p>${b.condition ? `<p class="text-espresso-600 text-[0.98rem]"><b>Koşul:</b> ${inl(b.condition)}</p>` : ""}${b.owner ? `<p class="text-espresso-600 text-[0.98rem]"><b>Owner:</b> ${inl(b.owner)}${b.deadline ? ` · <b>Son tarih:</b> ${inl(b.deadline)}` : ""}</p>` : ""}${b.reopen ? `<p class="text-espresso-600 text-[0.98rem]"><b>Yeniden açılma:</b> ${inl(b.reopen)}</p>` : ""}</div>`;
    case "gate": return `<div class="mt-3 rounded-xl2 border border-cloud-200 bg-cloud-50 p-3"><div class="font-bold text-cloud-700">Kapı ${inl(b.id)}</div><p class="mt-1 text-espresso-800">${inl(b.question)}</p><p class="text-ok text-[0.98rem]"><b>Geçer:</b> ${inl(b.pass)}</p><p class="text-bad text-[0.98rem]"><b>Geçmez:</b> ${inl(b.fail)}</p></div>`;
    case "eca": return `<div class="mt-3 rounded-xl2 border border-espresso-200 p-3"><div class="font-bold text-espresso-900">ECA${b.id ? ` · ${inl(b.id)}` : ""}</div><p class="text-espresso-700 text-[0.98rem]"><b>Event:</b> ${inl(b.event)}</p><p class="text-espresso-700 text-[0.98rem]"><b>Condition:</b> ${inl(b.condition)}</p><p class="text-espresso-700 text-[0.98rem]"><b>Action:</b> ${inl(b.action)}</p></div>`;
    case "timeline": return `<div class="mt-3 space-y-1.5">${b.items.map((t) => `<div class="flex gap-3"><span class="shrink-0 font-bold text-cloud-600 min-w-[84px]">${inl(t.when)}</span><span class="text-espresso-700">${inl(t.what)}${t.owner ? ` <span class="text-espresso-400">(${inl(t.owner)})</span>` : ""}</span></div>`).join("")}</div>`;
    case "chartReference": return `<div class="mt-3 rounded-xl2 border border-espresso-100 bg-white p-3"><div class="font-bold text-espresso-900 flex items-center gap-2"><i class="ph ph-chart-line-up"></i> ${inl(b.title)}</div>${b.note ? `<div class="text-espresso-500 text-[0.95rem]">${inl(b.note)}</div>` : ""}<div class="chart-mount mt-2 w-full" data-chart="${esc(b.chartId)}" style="height:240px"></div><div class="chart-table" data-chart="${esc(b.chartId)}"></div></div>`;
    case "sources": return `<div class="mt-3">${b.title ? `<div class="font-bold text-espresso-900 mb-1">${inl(b.title)}</div>` : ""}<ol class="list-decimal pl-5 space-y-1 text-[0.98rem] text-espresso-600">${b.sources.map((s) => `<li>${s.url ? `<a class="text-cloud-600 underline" href="${esc(s.url)}" target="_blank" rel="noopener">${inl(s.title)}</a>` : inl(s.title)}${s.publishedDate ? ` · ${inl(s.publishedDate)}` : ""}${s.accessedDate ? ` (erişim ${inl(s.accessedDate)})` : ""}</li>`).join("")}</ol></div>`;
    default: return "";
  }
}
export const renderBlocks = (blocks: Block[] = []) => blocks.map(renderBlock).join("");

/** Bir bölüm grubunu nested accordion olarak üretir. level: 2 veya 3. */
export function renderSections(sections: Section[], parentPath: string, level: 2 | 3): string {
  if (!sections?.length) return "";
  const items = sections.map((s) => {
    const path = `${parentPath}/${s.id}`;
    const itemId = path.replace(/\//g, "__");
    const inner = (level < 3 && s.sections?.length)
      ? renderBlocks(s.blocks) + renderSections(s.sections, path, 3)
      : renderBlocks(s.blocks) + renderBlocks((s.sections || []).flatMap((x) => x.blocks || [])); // 3'ten derini düzleştir
    return `<div class="acc-item acc-l${level}" id="${itemId}" data-hashpath="${esc(path)}">
      <button type="button" id="head-${itemId}" class="acc-head acc-head-sub" aria-expanded="false" aria-controls="panel-${itemId}">
        <span class="min-w-0 flex-1"><span class="block font-bold acc-sub-title">${inl(s.title)}</span>${s.summary ? `<span class="block text-espresso-400 text-[0.92rem]">${inl(s.summary)}</span>` : ""}</span>
        <i class="ph ph-caret-down acc-caret text-espresso-400 shrink-0"></i>
      </button>
      <div id="panel-${itemId}" role="region" aria-labelledby="head-${itemId}" class="acc-panel" hidden><div class="acc-inner">${inner}</div></div>
    </div>`;
  }).join("");
  return `<div class="acc-group acc-group-l${level}">${items}</div>`;
}

/** Doküman gövdesi = Seviye-2 bölüm accordion grubu. */
export const renderDocBody = (docPath: string, sections: Section[]) => renderSections(sections, docPath, 2);

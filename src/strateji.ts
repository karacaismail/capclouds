import "@phosphor-icons/web/regular";
import "./style.css";
import * as echarts from "echarts/core";
import { BarChart, PieChart, FunnelChart } from "echarts/charts";
import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import * as S from "./strateji-data";
import manifest from "../strateji/data/manifest.json";
import { renderDocBody, renderBlocks } from "./strateji/render";
import { validateAll } from "./strateji/validate";
import type { Doc } from "./strateji/types";
import { staticData, fetchLive, optionFor, tableRowsFor, CHART_META, type DataSet } from "./strateji/charts";
const docModules = import.meta.glob("../strateji/data/docs/*.json", { eager: true }) as Record<string, { default: Doc }>;

echarts.use([BarChart, PieChart, FunnelChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

const SID = "18HI2tVtR0aUHzhFIlm9JxcBNTEYeAu2WmxonDQmi4bU";
const GID = "657059198";
const STATUS_TR: Record<string, string> = { GO: "GO", CONDITIONAL_GO: "CONDITIONAL GO", HOLD: "HOLD", NO_GO: "NO-GO" };
const STATUS_CLS: Record<string, string> = { GO: "badge-ok", CONDITIONAL_GO: "badge-warn", HOLD: "bg-cloud-100 text-cloud-700", NO_GO: "badge-bad" };

/* ---------------- DOKÜMANLAR (kanonik JSON) ---------------- */
const docsById: Record<string, Doc> = {};
for (const mod of Object.values(docModules)) { const d = mod.default; docsById[d.id] = d; }
const vres = validateAll(Object.values(docsById));
if (!vres.ok) console.warn("[strateji] JSON doğrulama HATASI:", vres.errors);
else console.info("[strateji] JSON doğrulama OK —", Object.keys(docsById).length, "doküman");

/* ---------------- ACCORDION (L1 + recursive body) ---------------- */
const dl = document.getElementById("doclist");
if (dl) {
  const order = (manifest as { docs: { id: string; icon: string; baslik: string; ozet: string; amac?: string; status?: string; kritikKPI?: string }[] }).docs;
  dl.innerHTML = order.map((m) => {
    const d = docsById[m.id];
    const path = `dok-${m.id}`;
    const body = d ? renderDocBody(path, d.sections) : `<p class="text-bad p-4">İçerik yüklenemedi.</p>`;
    const statusChip = m.status ? `<span class="chip ${STATUS_CLS[m.status] || "bg-espresso-50"} text-[0.85rem] shrink-0">${STATUS_TR[m.status] || m.status}</span>` : "";
    const kpiChip = m.kritikKPI ? `<span class="text-espresso-400 text-[0.85rem] hidden xs:inline shrink-0">${m.kritikKPI}</span>` : "";
    return `
    <div class="acc-item acc-l1 card !p-0 overflow-hidden" id="${path}" data-hashpath="${path}">
      <button type="button" id="head-${path}" class="acc-head w-full flex items-center gap-3 p-4 text-left" aria-expanded="false" aria-controls="panel-${path}">
        <span class="grid place-items-center w-10 h-10 shrink-0 rounded-xl2 bg-espresso-50 text-espresso-700 text-[1.3rem]"><i class="ph ${m.icon}"></i></span>
        <span class="min-w-0 flex-1">
          <span class="block font-bold text-[1.05rem]">${m.baslik}</span>
          <span class="block text-espresso-400 text-[0.95rem]">${m.amac || m.ozet}</span>
        </span>
        ${statusChip}${kpiChip}
        <i class="ph ph-caret-down acc-caret text-espresso-400 text-[1.25rem] shrink-0"></i>
      </button>
      <div id="panel-${path}" role="region" aria-labelledby="head-${path}" class="acc-panel px-3 pb-3" hidden><div class="acc-inner acc-inner-l1 pt-2 border-t border-espresso-100">${body}</div></div>
    </div>`;
  }).join("");

  initAccordion(dl);
}

/* ---------------- GRAFİK GALERİSİ (#charts) ---------------- */
const chartsWrap = document.getElementById("charts");
if (chartsWrap) {
  chartsWrap.innerHTML = CHART_META.map((m) => `
    <div class="card !p-5">
      <div class="flex items-center gap-2 text-espresso-800"><i class="ph ${m.icon} text-[1.4rem]"></i><span class="font-black text-[1.15rem]">${m.title}</span></div>
      <div class="text-espresso-500 text-[0.98rem] mt-0.5" data-sub="${m.id}"></div>
      <div class="chart-mount mt-3 w-full" data-chart="${m.id}" style="height:260px"></div>
      <div class="chart-table" data-chart="${m.id}"></div>
    </div>`).join("") +
    `<div class="card !p-5"><div class="flex items-center gap-2 text-espresso-800"><i class="ph ph-gauge text-[1.4rem]"></i><span class="font-black text-[1.15rem]">KPI Hedefleri (çeyreklik)</span></div>
      ${renderBlocks([{ type: "kpi", rows: S.kpi.map((k) => ({ metric: k.metrik, baseline: k.simdi, target: `${k.ceyrek1} → ${k.ceyrek2} → ${k.yil}`, frequency: "Çeyreklik" })) }])}</div>`;
}

/* ---------------- GRAFİK MOUNT (galeri + accordion, tek instance) ---------------- */
const charts = new Map<HTMLElement, echarts.ECharts>();
let CURRENT: DataSet = staticData();
function tableHtml(id: string, D: DataSet): string {
  const t = tableRowsFor(id, D);
  if (!t) return "";
  return `<div class="table-scroll mt-2"><table class="tbl"><thead><tr>${t.headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${t.rows.map((r) => `<tr>${r.map((c, i) => `<td${i === 0 ? ' class="font-bold"' : ""}>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
function ensureChart(el: HTMLElement) {
  const id = el.dataset.chart!;
  if (!charts.has(el)) {
    const opt = optionFor(id, CURRENT);
    if (!opt) { el.innerHTML = `<div class="grid place-items-center h-full text-espresso-400">veri yok</div>`; return; }
    const inst = echarts.init(el, undefined, { renderer: "canvas" });
    inst.setOption(opt);
    charts.set(el, inst);
    // eşli tablo (varsa)
    const tbl = el.parentElement?.querySelector<HTMLElement>(`.chart-table[data-chart="${id}"]`);
    if (tbl && !tbl.dataset.filled) { tbl.innerHTML = tableHtml(id, CURRENT); tbl.dataset.filled = "1"; }
  }
  charts.get(el)!.resize();
}
function ensureVisibleCharts(scope: ParentNode = document) {
  scope.querySelectorAll<HTMLElement>(".chart-mount").forEach((el) => { if (el.offsetParent !== null) ensureChart(el); });
}
function refreshCharts(D: DataSet) {
  CURRENT = D;
  charts.forEach((inst, el) => { const opt = optionFor(el.dataset.chart!, D); if (opt) inst.setOption(opt); });
  document.querySelectorAll<HTMLElement>(".chart-table").forEach((t) => { t.innerHTML = tableHtml(t.dataset.chart!, D); t.dataset.filled = "1"; });
  document.querySelectorAll<HTMLElement>("[data-sub]").forEach((s) => { const m = CHART_META.find((x) => x.id === s.dataset.sub); if (m) s.textContent = m.sub(D); });
}
ensureVisibleCharts(); // galeri
refreshCharts(CURRENT);
let rt: number | undefined;
window.addEventListener("resize", () => { clearTimeout(rt); rt = window.setTimeout(() => { charts.forEach((c) => c.resize()); }, 150); });

/* ---------------- CANLI VERİ ---------------- */
function setStatus(live: boolean) {
  const el = document.getElementById("veri-durum"); if (!el) return;
  const t = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  el.innerHTML = live ? `<span class="chip badge-ok"><i class="ph ph-cloud-check"></i> Google Sheets'ten canlı</span> <span class="text-espresso-400">· ${t}</span>` : `<span class="chip badge-warn"><i class="ph ph-cloud-slash"></i> Yerel yedek</span>`;
}
async function refresh() {
  const btn = document.getElementById("yenile-btn"); btn?.setAttribute("disabled", "true");
  const live = await fetchLive(SID, GID);
  refreshCharts(live || staticData());
  setStatus(!!live);
  btn?.removeAttribute("disabled");
}
document.getElementById("yenile-btn")?.addEventListener("click", refresh);
refresh();
setInterval(refresh, 60000);

/* ============================================================
   Generic NESTED ACCORDION controller (sibling-exclusive her seviye)
   ============================================================ */
function initAccordion(root: HTMLElement) {
  const head = (it: Element) => it.querySelector<HTMLElement>(":scope > .acc-head")!;
  const panel = (it: Element) => it.querySelector<HTMLElement>(":scope > .acc-panel")!;
  const isOpen = (it: Element) => !panel(it).hasAttribute("hidden");
  const closeItem = (it: Element) => {
    panel(it).setAttribute("hidden", "");
    head(it).setAttribute("aria-expanded", "false");
    it.classList.remove("acc-open");
    it.querySelectorAll<HTMLElement>(".acc-item.acc-open").forEach((d) => { // torun temizliği
      const p = d.querySelector<HTMLElement>(":scope > .acc-panel"); if (p) p.setAttribute("hidden", "");
      const h = d.querySelector<HTMLElement>(":scope > .acc-head"); if (h) h.setAttribute("aria-expanded", "false");
      d.classList.remove("acc-open");
    });
  };
  const openItem = (it: Element) => {
    for (const sib of Array.from(it.parentElement!.children)) if (sib !== it && sib.classList.contains("acc-item")) closeItem(sib);
    panel(it).removeAttribute("hidden");
    head(it).setAttribute("aria-expanded", "true");
    it.classList.add("acc-open");
    try { history.replaceState(null, "", "#" + (it as HTMLElement).dataset.hashpath); } catch {}
    ensureVisibleCharts(panel(it));
    requestAnimationFrame(() => ensureVisibleCharts(panel(it)));
  };
  const siblingHeads = (h: HTMLElement) => {
    const it = h.closest(".acc-item")!;
    return Array.from(it.parentElement!.children).filter((c) => c.classList.contains("acc-item")).map((c) => c.querySelector<HTMLElement>(":scope > .acc-head")!);
  };
  root.addEventListener("click", (e) => {
    const h = (e.target as HTMLElement).closest<HTMLElement>(".acc-head");
    if (!h || !root.contains(h)) return;
    const it = h.closest(".acc-item")!;
    if (isOpen(it)) { closeItem(it); h.focus(); } else openItem(it);
  });
  root.addEventListener("keydown", (e) => {
    const h = (e.target as HTMLElement).closest<HTMLElement>(".acc-head");
    if (!h) return;
    const hs = siblingHeads(h); const i = hs.indexOf(h);
    if (e.key === "ArrowDown") { e.preventDefault(); hs[(i + 1) % hs.length].focus(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); hs[(i - 1 + hs.length) % hs.length].focus(); }
    else if (e.key === "Home") { e.preventDefault(); hs[0].focus(); }
    else if (e.key === "End") { e.preventDefault(); hs[hs.length - 1].focus(); }
  });
  const openByHash = () => {
    const path = decodeURIComponent(location.hash.slice(1)); if (!path) return;
    const target = root.querySelector<HTMLElement>(`[data-hashpath="${(window.CSS && CSS.escape) ? CSS.escape(path) : path}"]`);
    if (!target) return;
    const chain: Element[] = [];
    let cur: Element | null = target;
    while (cur && cur.classList.contains("acc-item")) { chain.unshift(cur); cur = cur.parentElement?.closest(".acc-item") || null; }
    chain.forEach(openItem);
    head(target).scrollIntoView({ behavior: "smooth", block: "start" });
  };
  window.addEventListener("hashchange", openByHash);
  openByHash();
  // "bağlı grafik" butonu vs. chart-mount zaten panel açılınca mount olur
}

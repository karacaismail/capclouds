import "@phosphor-icons/web/regular";
import "./style.css";
import * as echarts from "echarts/core";
import { BarChart, PieChart, FunnelChart } from "echarts/charts";
import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import * as S from "./strateji-data";
import dokumanlar from "../strateji/data/dokumanlar.json";

echarts.use([BarChart, PieChart, FunnelChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

const SID = "18HI2tVtR0aUHzhFIlm9JxcBNTEYeAu2WmxonDQmi4bU";
const GID = "657059198"; // CANLI VERİ (grafik kaynağı)
const REPO = "https://github.com/karacaismail/capclouds/blob/main/strateji/";
const INK = "#2a1e16", MUT = "#6f4e37", LINE = "#e6dccb", COFFEE = "#6f4e37";
const PALETTE = ["#6f4e37", "#8c6440", "#5ba6cb", "#d9902a", "#2e9e6b", "#2f6e97", "#b7a793"];
const GANTT_RENK = ["#d1523f", "#d9902a", "#5ba6cb", "#2e9e6b", "#6f4e37", "#241a13", "#8c6440"];
const { TRY, NUM } = S;

/* ---------- DOKÜMAN LİSTESİ (JSON tabanlı, accordion) ---------- */
interface Dok { id: string; icon: string; baslik: string; ozet: string; detay: string; }
const dl = document.getElementById("doclist");
if (dl) {
  dl.innerHTML = (dokumanlar as Dok[]).map((d, idx) => `
    <div class="acc-item card !p-0 overflow-hidden" data-idx="${idx}">
      <button type="button" class="acc-head w-full flex items-center gap-3 p-4 text-left" aria-expanded="false">
        <span class="grid place-items-center w-10 h-10 shrink-0 rounded-xl2 bg-espresso-50 text-espresso-700 text-[1.3rem]"><i class="ph ${d.icon}"></i></span>
        <span class="min-w-0 flex-1">
          <span class="block font-bold text-[1.05rem]">${d.baslik}</span>
          <span class="block text-espresso-400 text-[0.95rem]">${d.ozet}</span>
        </span>
        <i class="ph ph-caret-down acc-caret text-espresso-400 text-[1.25rem] shrink-0"></i>
      </button>
      <div class="acc-panel px-4 pb-4" hidden>
        <div class="acc-detay pt-3 border-t border-espresso-100 text-espresso-700">${d.detay}</div>
      </div>
    </div>`).join("");

  const items = Array.from(dl.querySelectorAll<HTMLElement>(".acc-item"));
  const closeAll = () => items.forEach((it) => {
    it.querySelector(".acc-panel")!.setAttribute("hidden", "");
    it.querySelector(".acc-head")!.setAttribute("aria-expanded", "false");
    it.classList.remove("acc-open");
  });
  items.forEach((it) => {
    it.querySelector(".acc-head")!.addEventListener("click", () => {
      const panel = it.querySelector(".acc-panel")!;
      const isOpen = !panel.hasAttribute("hidden");
      closeAll();
      if (!isOpen) {
        panel.removeAttribute("hidden");
        it.querySelector(".acc-head")!.setAttribute("aria-expanded", "true");
        it.classList.add("acc-open");
      }
    });
  });
}

/* ---------- VERİ MODELİ ---------- */
interface Row { label: string; amount: number; note?: string }
interface Tier { label: string; kisi: number; not: string }
interface Kanal { ad: string; pay: number }
interface Gantt { ad: string; basla: number; sure: number; renk: string }
interface DataSet { yatirim: Row[]; isletme: Row[]; diger: Row[]; pazar: Tier[]; kanal: Kanal[]; gantt: Gantt[] }

function staticData(): DataSet {
  return {
    yatirim: S.yatirim.map(i => ({ label: i.label, amount: i.amount })),
    isletme: S.isletme.map(i => ({ label: i.label, amount: i.amount })),
    diger: S.digerKalemler.map(i => ({ label: i.label, amount: i.amount, note: i.note })),
    pazar: S.pazarKatman.map(k => ({ label: k.label, kisi: k.kisi, not: k.not })),
    kanal: S.kanalPay.map(k => ({ ad: k.ad, pay: k.pay })),
    gantt: S.ganttGorevler.map(g => ({ ad: g.ad, basla: g.basla, sure: g.sure, renk: g.renk })),
  };
}

async function fetchLive(): Promise<DataSet | null> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SID}/gviz/tq?tqx=out:json&gid=${GID}&headers=1&t=${Date.now()}`;
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();
    const a = text.indexOf("{"), b = text.lastIndexOf("}");
    const json = JSON.parse(text.slice(a, b + 1));
    const rows: any[][] = json.table.rows.map((r: any) => (r.c || []).map((c: any) => (c ? c.v : null)));
    const g: Record<string, { etiket: string; deger: number; ekstra: string }[]> = {};
    for (const r of rows) {
      const grup = r[0]; if (!grup) continue;
      (g[grup] ||= []).push({ etiket: String(r[1] ?? ""), deger: Number(r[2] ?? 0), ekstra: String(r[3] ?? "") });
    }
    if (!g.yatirim?.length || !g.pazar?.length) return null;
    return {
      yatirim: g.yatirim.map(x => ({ label: x.etiket, amount: x.deger })),
      isletme: (g.isletme || []).map(x => ({ label: x.etiket, amount: x.deger })),
      diger: (g.diger || []).map(x => ({ label: x.etiket, amount: x.deger, note: x.ekstra })),
      pazar: g.pazar.map(x => ({ label: x.etiket, kisi: x.deger, not: x.ekstra })),
      kanal: (g.kanal || []).map(x => ({ ad: x.etiket, pay: x.deger })),
      gantt: (g.gantt || []).map((x, i) => ({ ad: x.etiket, basla: x.deger, sure: Number(x.ekstra || 0), renk: GANTT_RENK[i % GANTT_RENK.length] })),
    };
  } catch { return null; }
}

/* ---------- TABLO + GRAFİK ---------- */
const baseTextStyle = { fontFamily: "Roboto, sans-serif", color: INK };
const sum = (a: Row[]) => a.reduce((s, i) => s + i.amount, 0);
function tbl(headers: string[], rows: string[][]) {
  return `<div class="table-scroll mt-3"><table class="tbl"><thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
    <tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td${i === 0 ? ' class="font-bold"' : ""}>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
type Block = { icon: string; title: string; sub: string; id: string; option: any; table: string };

function buildBlocks(D: DataSet): Block[] {
  const B: Block[] = [];
  const yatTop = sum(D.yatirim), isTop = sum(D.isletme), digTop = sum(D.diger), yillik = isTop * 12;

  B.push({ icon: "ph-wrench", title: "Yatırım Harcamaları (tek seferlik)", sub: `Toplam: ${TRY(yatTop)}`, id: "c-yatirim",
    option: { textStyle: baseTextStyle, grid: { left: 4, right: 16, top: 8, bottom: 4, containLabel: true },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: (v: number) => TRY(v) },
      xAxis: { type: "value", axisLabel: { color: MUT, formatter: (v: number) => v / 1000 + "B" }, splitLine: { lineStyle: { color: LINE } } },
      yAxis: { type: "category", data: D.yatirim.map(i => i.label).reverse(), axisLabel: { color: INK, fontSize: 11, width: 120, overflow: "truncate" } },
      series: [{ type: "bar", data: D.yatirim.map(i => i.amount).reverse(), itemStyle: { color: COFFEE, borderRadius: [0, 5, 5, 0] }, barWidth: "58%" }] },
    table: tbl(["Kalem", "Tutar"], D.yatirim.map(i => [i.label, TRY(i.amount)]).concat([["Toplam", TRY(yatTop)]])) });

  B.push({ icon: "ph-repeat", title: "Aylık İşletme Giderleri", sub: `Aylık: ${TRY(isTop)} · Yıllık: ${TRY(yillik)}`, id: "c-isletme",
    option: { textStyle: baseTextStyle, color: PALETTE, tooltip: { trigger: "item", valueFormatter: (v: number) => TRY(v) },
      legend: { bottom: 0, textStyle: { color: MUT, fontSize: 11 }, type: "scroll" },
      series: [{ type: "pie", radius: ["42%", "68%"], center: ["50%", "44%"], avoidLabelOverlap: true, itemStyle: { borderColor: "#fff", borderWidth: 2 }, label: { show: false }, data: D.isletme.map(i => ({ name: i.label, value: i.amount })) }] },
    table: tbl(["Kalem", "Aylık"], D.isletme.map(i => [i.label, TRY(i.amount)]).concat([["Aylık toplam", TRY(isTop)]])) });

  B.push({ icon: "ph-chart-bar", title: "1. Yıl Maliyet Özeti (reklam hariç)", sub: `1. yıl toplam: ${TRY(yatTop + yillik + digTop)}`, id: "c-yil",
    option: { textStyle: baseTextStyle, grid: { left: 4, right: 16, top: 10, bottom: 4, containLabel: true },
      tooltip: { trigger: "axis", valueFormatter: (v: number) => TRY(v) },
      xAxis: { type: "category", data: ["Yatırım\n(tek sefer)", "Yıllık\nişletme", "Diğer\nkalemler"], axisLabel: { color: INK, fontSize: 11 } },
      yAxis: { type: "value", axisLabel: { color: MUT, formatter: (v: number) => v / 1000 + "B" }, splitLine: { lineStyle: { color: LINE } } },
      series: [{ type: "bar", data: [{ value: yatTop, itemStyle: { color: "#8c6440" } }, { value: yillik, itemStyle: { color: "#6f4e37" } }, { value: digTop, itemStyle: { color: "#5ba6cb" } }], barWidth: "48%", itemStyle: { borderRadius: [5, 5, 0, 0] } }] },
    table: tbl(["Kalem", "Tutar"], [["Yatırım (tek seferlik)", TRY(yatTop)], ["Yıllık işletme (12 ay)", TRY(yillik)], ["Diğer gerekli kalemler", TRY(digTop)], ["1. yıl toplam", TRY(yatTop + yillik + digTop)]]) });

  B.push({ icon: "ph-wallet", title: "Diğer Gerekli Kalemler", sub: "Yatırım/işletme dışı", id: "c-diger",
    option: { textStyle: baseTextStyle, grid: { left: 4, right: 16, top: 8, bottom: 4, containLabel: true },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: (v: number) => TRY(v) },
      xAxis: { type: "value", axisLabel: { color: MUT, formatter: (v: number) => v / 1000 + "B" }, splitLine: { lineStyle: { color: LINE } } },
      yAxis: { type: "category", data: D.diger.map(i => i.label).reverse(), axisLabel: { color: INK, fontSize: 11, width: 120, overflow: "truncate" } },
      series: [{ type: "bar", data: D.diger.map(i => i.amount).reverse(), itemStyle: { color: "#5ba6cb", borderRadius: [0, 5, 5, 0] }, barWidth: "58%" }] },
    table: tbl(["Kalem", "Tutar", "Not"], D.diger.map(i => [i.label, TRY(i.amount), i.note || ""])) });

  B.push({ icon: "ph-funnel", title: "Pazar Büyüklüğü (dijital)", sub: "En geniş kitleden gerçekçi hedefe", id: "c-pazar",
    option: { textStyle: baseTextStyle, tooltip: { trigger: "item", formatter: (p: any) => `${p.name}<br/><b>${NUM(p.value)} kişi</b>` },
      series: [{ type: "funnel", top: 6, bottom: 6, left: "6%", right: "6%", minSize: "38%", maxSize: "100%", sort: "descending", gap: 3, label: { position: "inside", color: "#fff", fontSize: 11 }, data: D.pazar.map((k, idx) => ({ name: k.label, value: k.kisi, itemStyle: { color: ["#8c6440", "#6f4e37", "#241a13"][idx % 3] } })) }] },
    table: tbl(["Katman", "Kişi", "Tanım"], D.pazar.map(k => [k.label, NUM(k.kisi), k.not])) });

  const gr = D.gantt;
  B.push({ icon: "ph-calendar-check", title: "12 Aylık Yol Haritası (Gantt)", sub: "Eyl 2026 → Ağu 2027", id: "c-gantt",
    option: { textStyle: baseTextStyle, grid: { left: 4, right: 12, top: 24, bottom: 4, containLabel: true },
      tooltip: { trigger: "item", formatter: (p: any) => p.seriesName === "süre" ? `${gr[gr.length - 1 - p.dataIndex].ad}<br/>${p.value} ay` : "" },
      xAxis: { type: "value", min: 0, max: 12, interval: 1, position: "top", axisLabel: { color: MUT, fontSize: 10, formatter: (v: number) => S.ganttAylar[v] || "" }, splitLine: { lineStyle: { color: LINE } } },
      yAxis: { type: "category", data: gr.map(g => g.ad).reverse(), axisLabel: { color: INK, fontSize: 10, width: 120, overflow: "truncate" } },
      series: [
        { name: "ofis", type: "bar", stack: "t", itemStyle: { color: "transparent" }, data: gr.map(g => g.basla).reverse(), silent: true },
        { name: "süre", type: "bar", stack: "t", barWidth: "55%", data: gr.map(g => ({ value: g.sure, itemStyle: { color: g.renk, borderRadius: 4 } })).reverse() },
      ] },
    table: tbl(["Görev", "Başlangıç", "Süre"], gr.map(g => [g.ad, S.ganttAylar[g.basla] + " 2026", g.sure + " ay"])) });

  B.push({ icon: "ph-chart-donut", title: "Aylık Reklam Bütçe Dağılımı", sub: "Kanal payları", id: "c-kanal",
    option: { textStyle: baseTextStyle, color: PALETTE, tooltip: { trigger: "item", formatter: (p: any) => `${p.name}<br/><b>%${p.value}</b>` },
      legend: { bottom: 0, textStyle: { color: MUT, fontSize: 11 }, type: "scroll" },
      series: [{ type: "pie", radius: "62%", center: ["50%", "44%"], itemStyle: { borderColor: "#fff", borderWidth: 2 }, label: { show: false }, data: D.kanal.map(k => ({ name: k.ad, value: k.pay })) }] },
    table: tbl(["Kanal", "Pay"], D.kanal.map(k => [k.ad, "%" + k.pay])) });

  return B;
}

/* ---------- RENDER ---------- */
let charts: echarts.ECharts[] = [];
function render(D: DataSet) {
  const wrap = document.getElementById("charts");
  if (!wrap) return;
  charts.forEach(c => c.dispose());
  charts = [];
  const blocks = buildBlocks(D);
  wrap.innerHTML = blocks.map(b => `
    <div class="card !p-5">
      <div class="flex items-center gap-2 text-espresso-800"><i class="ph ${b.icon} text-[1.4rem]"></i><span class="font-black text-[1.15rem]">${b.title}</span></div>
      <div class="text-espresso-500 text-[0.98rem] mt-0.5">${b.sub}</div>
      <div id="${b.id}" class="mt-3 w-full" style="height:260px"></div>${b.table}
    </div>`).join("") +
    `<div class="card !p-5"><div class="flex items-center gap-2 text-espresso-800"><i class="ph ph-gauge text-[1.4rem]"></i><span class="font-black text-[1.15rem]">KPI Hedefleri (çeyreklik)</span></div>
      ${tbl(["Metrik", "Şimdi", "Çeyrek 1", "Çeyrek 2", "Yıl sonu"], S.kpi.map(k => [k.metrik, k.simdi, k.ceyrek1, k.ceyrek2, k.yil]))}</div>`;
  for (const b of blocks) {
    const el = document.getElementById(b.id);
    if (!el) continue;
    const c = echarts.init(el, undefined, { renderer: "canvas" });
    c.setOption(b.option);
    charts.push(c);
  }
}
let rt: number | undefined;
window.addEventListener("resize", () => { clearTimeout(rt); rt = window.setTimeout(() => charts.forEach(c => c.resize()), 150); });

/* ---------- CANLI AKIŞ ---------- */
function setStatus(live: boolean) {
  const el = document.getElementById("veri-durum");
  if (!el) return;
  const time = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  el.innerHTML = live
    ? `<span class="chip badge-ok"><i class="ph ph-cloud-check"></i> Google Sheets'ten canlı</span> <span class="text-espresso-400">· ${time}</span>`
    : `<span class="chip badge-warn"><i class="ph ph-cloud-slash"></i> Yerel yedek (sheet okunamadı)</span>`;
}
async function refresh() {
  const btn = document.getElementById("yenile-btn");
  if (btn) btn.setAttribute("disabled", "true");
  const live = await fetchLive();
  render(live || staticData());
  setStatus(!!live);
  if (btn) btn.removeAttribute("disabled");
}
document.getElementById("yenile-btn")?.addEventListener("click", refresh);
render(staticData()); // anında göster
refresh(); // canlıyı çek
setInterval(refresh, 60000); // 60 sn'de bir tazele

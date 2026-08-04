import "@phosphor-icons/web/regular";
import "./style.css";
import * as echarts from "echarts/core";
import { BarChart, PieChart, FunnelChart } from "echarts/charts";
import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import {
  yatirim, isletme, digerKalemler, sum, pazarKatman,
  ganttAylar, ganttGorevler, kanalPay, kpi, TRY, NUM,
} from "./strateji-data";

echarts.use([BarChart, PieChart, FunnelChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

const REPO = "https://github.com/karacaismail/capclouds/blob/main/strateji/";
const INK = "#2a1e16", MUT = "#6f4e37", LINE = "#e6dccb", COFFEE = "#6f4e37";
const PALETTE = ["#6f4e37", "#8c6440", "#5ba6cb", "#d9902a", "#2e9e6b", "#2f6e97", "#b7a793"];

/* ---------------- DOKÜMAN LİSTESİ ---------------- */
const docs = [
  ["ph-list-checks", "00 · Yönetici Özeti", "00-yonetici-ozeti.md"],
  ["ph-compass", "01 · Vizyon · Misyon · Değerler", "01-vizyon-misyon-degerler.md"],
  ["ph-tree-structure", "02 · Organizasyon · İK · İş Akışları", "02-organizasyon-ik-is-akislari.md"],
  ["ph-chart-pie-slice", "03 · Pazar Analizi", "03-pazar-analizi.md"],
  ["ph-users-three", "04 · Rakip & Rekabet Analizi", "04-rakip-analizi.md"],
  ["ph-megaphone", "05 · Dijital Pazarlama Stratejisi", "05-dijital-pazarlama-stratejisi.md"],
  ["ph-magnifying-glass", "05a · SEO", "kanallar/seo.md"],
  ["ph-stack", "05b · Programatik SEO", "kanallar/programatik-seo.md"],
  ["ph-google-logo", "05c · Google Ads", "kanallar/google-ads.md"],
  ["ph-meta-logo", "05d · Meta Business + Pixel", "kanallar/meta-business-pixel.md"],
  ["ph-tiktok-logo", "05e · TikTok", "kanallar/tiktok.md"],
  ["ph-chart-line", "05f · Yandex Metrica", "kanallar/yandex-metrica.md"],
  ["ph-fire", "05g · Hotjar / Clarity", "kanallar/hotjar.md"],
  ["ph-arrows-clockwise", "05h · Criteo", "kanallar/criteo.md"],
  ["ph-broadcast", "05i · AdRoll", "kanallar/adroll.md"],
  ["ph-target", "05j · Remarketing", "kanallar/remarketing.md"],
  ["ph-tag", "05k · Google Tag Manager", "kanallar/google-tag-manager.md"],
  ["ph-shopping-cart", "05l · WooCommerce & Web UI", "kanallar/woocommerce-web-ui.md"],
  ["ph-palette", "05m · Marka Kimliği (sıfırdan)", "kanallar/marka-kimligi.md"],
  ["ph-coins", "06 · Finansal Plan", "06-finansal-plan.md"],
  ["ph-warning-diamond", "07 · Gap & Bilinmeyen-Bilinmeyenler", "07-gap-analizi-unknown-unknowns.md"],
  ["ph-calendar-check", "08 · Zaman Planı & Gantt", "08-zaman-plani-gantt.md"],
  ["ph-shield-check", "09 · Durum Tespiti (Due Diligence)", "09-durum-tespiti-due-diligence.md"],
];
const dl = document.getElementById("doclist");
if (dl) dl.innerHTML = docs.map(([i, t, f]) =>
  `<a class="card !p-4 flex items-center gap-3 hover:border-espresso-400 transition-colors" href="${REPO}${f}" target="_blank" rel="noopener">
    <span class="grid place-items-center w-10 h-10 shrink-0 rounded-xl2 bg-espresso-50 text-espresso-700 text-[1.3rem]"><i class="ph ${i}"></i></span>
    <span class="font-bold text-[1.05rem] min-w-0 flex-1">${t}</span><i class="ph ph-arrow-right text-espresso-400"></i></a>`).join("");

/* ---------------- YARDIMCILAR ---------------- */
const baseTextStyle = { fontFamily: "Roboto, sans-serif", color: INK };
function tbl(headers: string[], rows: string[][]): string {
  return `<div class="table-scroll mt-3"><table class="tbl"><thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
    <tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td${i === 0 ? ' class="font-bold"' : ""}>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
type Block = { icon: string; title: string; sub: string; id: string; option: any; table: string };
const blocks: Block[] = [];

/* 1) YATIRIM (yatay bar) */
blocks.push({
  icon: "ph-wrench", title: "Yatırım Harcamaları (tek seferlik)", sub: `Toplam: ${TRY(sum(yatirim))}`,
  id: "c-yatirim",
  option: {
    textStyle: baseTextStyle, grid: { left: 4, right: 16, top: 8, bottom: 4, containLabel: true },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: (v: number) => TRY(v) },
    xAxis: { type: "value", axisLabel: { color: MUT, formatter: (v: number) => (v / 1000) + "B" }, splitLine: { lineStyle: { color: LINE } } },
    yAxis: { type: "category", data: yatirim.map(i => i.label).reverse(), axisLabel: { color: INK, fontSize: 11, width: 120, overflow: "truncate" } },
    series: [{ type: "bar", data: yatirim.map(i => i.amount).reverse(), itemStyle: { color: COFFEE, borderRadius: [0, 5, 5, 0] }, barWidth: "58%" }],
  },
  table: tbl(["Kalem", "Tutar"], yatirim.map(i => [i.label, TRY(i.amount)]).concat([["Toplam", TRY(sum(yatirim))]])),
});

/* 2) İŞLETME aylık (doughnut) */
blocks.push({
  icon: "ph-repeat", title: "Aylık İşletme Giderleri", sub: `Aylık toplam: ${TRY(sum(isletme))} · Yıllık: ${TRY(sum(isletme) * 12)}`,
  id: "c-isletme",
  option: {
    textStyle: baseTextStyle, color: PALETTE,
    tooltip: { trigger: "item", valueFormatter: (v: number) => TRY(v) },
    legend: { bottom: 0, textStyle: { color: MUT, fontSize: 11 }, type: "scroll" },
    series: [{ type: "pie", radius: ["42%", "68%"], center: ["50%", "44%"], avoidLabelOverlap: true,
      itemStyle: { borderColor: "#fff", borderWidth: 2 }, label: { show: false },
      data: isletme.map(i => ({ name: i.label, value: i.amount })) }],
  },
  table: tbl(["Kalem", "Aylık"], isletme.map(i => [i.label, TRY(i.amount)]).concat([["Aylık toplam", TRY(sum(isletme))]])),
});

/* 3) 1. YIL ÖZETİ (bar) */
const yillikIsletme = sum(isletme) * 12, digerTop = sum(digerKalemler), yatTop = sum(yatirim);
blocks.push({
  icon: "ph-chart-bar", title: "1. Yıl Maliyet Özeti (reklam hariç)", sub: `1. yıl toplam: ${TRY(yatTop + yillikIsletme + digerTop)}`,
  id: "c-yil",
  option: {
    textStyle: baseTextStyle, grid: { left: 4, right: 16, top: 10, bottom: 4, containLabel: true },
    tooltip: { trigger: "axis", valueFormatter: (v: number) => TRY(v) },
    xAxis: { type: "category", data: ["Yatırım\n(tek sefer)", "Yıllık\nişletme", "Diğer\nkalemler"], axisLabel: { color: INK, fontSize: 11 } },
    yAxis: { type: "value", axisLabel: { color: MUT, formatter: (v: number) => (v / 1000) + "B" }, splitLine: { lineStyle: { color: LINE } } },
    series: [{ type: "bar", data: [
      { value: yatTop, itemStyle: { color: "#8c6440" } },
      { value: yillikIsletme, itemStyle: { color: "#6f4e37" } },
      { value: digerTop, itemStyle: { color: "#5ba6cb" } },
    ], barWidth: "48%", itemStyle: { borderRadius: [5, 5, 0, 0] } }],
  },
  table: tbl(["Kalem", "Tutar"], [
    ["Yatırım (tek seferlik)", TRY(yatTop)], ["Yıllık işletme (12 ay)", TRY(yillikIsletme)],
    ["Diğer gerekli kalemler", TRY(digerTop)], ["1. yıl toplam", TRY(yatTop + yillikIsletme + digerTop)],
  ]),
});

/* 4) DİĞER KALEMLER (bar) */
blocks.push({
  icon: "ph-wallet", title: "Diğer Gerekli Kalemler", sub: "Yatırım/işletme dışı; sağlıklı başlangıç için",
  id: "c-diger",
  option: {
    textStyle: baseTextStyle, grid: { left: 4, right: 16, top: 8, bottom: 4, containLabel: true },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: (v: number) => TRY(v) },
    xAxis: { type: "value", axisLabel: { color: MUT, formatter: (v: number) => (v / 1000) + "B" }, splitLine: { lineStyle: { color: LINE } } },
    yAxis: { type: "category", data: digerKalemler.map(i => i.label).reverse(), axisLabel: { color: INK, fontSize: 11, width: 120, overflow: "truncate" } },
    series: [{ type: "bar", data: digerKalemler.map(i => i.amount).reverse(), itemStyle: { color: "#5ba6cb", borderRadius: [0, 5, 5, 0] }, barWidth: "58%" }],
  },
  table: tbl(["Kalem", "Tutar", "Not"], digerKalemler.map(i => [i.label, TRY(i.amount), i.note || ""])),
});

/* 5) PAZAR HUNİSİ (funnel) */
blocks.push({
  icon: "ph-funnel", title: "Pazar Büyüklüğü (dijital)", sub: "En geniş kitleden gerçekçi hedefe",
  id: "c-pazar",
  option: {
    textStyle: baseTextStyle, color: ["#8c6440", "#6f4e37", "#241a13"],
    tooltip: { trigger: "item", formatter: (p: any) => `${p.name}<br/><b>${NUM(p.value)} kişi</b>` },
    series: [{ type: "funnel", top: 6, bottom: 6, left: "6%", right: "6%", minSize: "38%", maxSize: "100%",
      sort: "descending", gap: 3, label: { position: "inside", color: "#fff", fontSize: 11, formatter: (p: any) => `${p.name}` },
      data: pazarKatman.map((k, idx) => ({ name: k.label, value: k.kisi, itemStyle: { color: ["#8c6440", "#6f4e37", "#241a13"][idx] } })) }],
  },
  table: tbl(["Katman", "Kişi", "Tanım"], pazarKatman.map(k => [k.label, NUM(k.kisi), k.not])),
});

/* 6) GANTT (yığılmış yatay bar) */
blocks.push({
  icon: "ph-calendar-check", title: "12 Aylık Yol Haritası (Gantt)", sub: "Eyl 2026 → Ağu 2027",
  id: "c-gantt",
  option: {
    textStyle: baseTextStyle, grid: { left: 4, right: 12, top: 24, bottom: 4, containLabel: true },
    tooltip: { trigger: "item", formatter: (p: any) => p.seriesName === "süre" ? `${ganttGorevler[ganttGorevler.length - 1 - p.dataIndex].ad}<br/>${p.value} ay` : "" },
    xAxis: { type: "value", min: 0, max: 12, interval: 1, position: "top",
      axisLabel: { color: MUT, fontSize: 10, formatter: (v: number) => ganttAylar[v] || "" }, splitLine: { lineStyle: { color: LINE } } },
    yAxis: { type: "category", data: ganttGorevler.map(g => g.ad).reverse(), axisLabel: { color: INK, fontSize: 10, width: 120, overflow: "truncate" } },
    series: [
      { name: "ofis", type: "bar", stack: "t", itemStyle: { color: "transparent" }, data: ganttGorevler.map(g => g.basla).reverse(), silent: true },
      { name: "süre", type: "bar", stack: "t", barWidth: "55%",
        data: ganttGorevler.map(g => ({ value: g.sure, itemStyle: { color: g.renk, borderRadius: 4 } })).reverse() },
    ],
  },
  table: tbl(["Görev", "Başlangıç", "Süre"], ganttGorevler.map(g => [g.ad, ganttAylar[g.basla] + " 2026", g.sure + " ay"])),
});

/* 7) KANAL PAY (pie) */
blocks.push({
  icon: "ph-chart-donut", title: "Aylık Reklam Bütçe Dağılımı", sub: "Kanal payları (örnek)",
  id: "c-kanal",
  option: {
    textStyle: baseTextStyle, color: PALETTE,
    tooltip: { trigger: "item", formatter: (p: any) => `${p.name}<br/><b>%${p.value}</b>` },
    legend: { bottom: 0, textStyle: { color: MUT, fontSize: 11 }, type: "scroll" },
    series: [{ type: "pie", radius: "62%", center: ["50%", "44%"], itemStyle: { borderColor: "#fff", borderWidth: 2 },
      label: { show: false }, data: kanalPay.map(k => ({ name: k.ad, value: k.pay })) }],
  },
  table: tbl(["Kanal", "Pay"], kanalPay.map(k => [k.ad, "%" + k.pay])),
});

/* ---- RENDER + KPI tablosu ---- */
const wrap = document.getElementById("charts");
if (wrap) {
  wrap.innerHTML = blocks.map(b => `
    <div class="card !p-5">
      <div class="flex items-center gap-2 text-espresso-800"><i class="ph ${b.icon} text-[1.4rem]"></i>
        <span class="font-black text-[1.15rem]">${b.title}</span></div>
      <div class="text-espresso-500 text-[0.98rem] mt-0.5">${b.sub}</div>
      <div id="${b.id}" class="mt-3 w-full" style="height:260px"></div>
      ${b.table}
    </div>`).join("") +
    `<div class="card !p-5">
      <div class="flex items-center gap-2 text-espresso-800"><i class="ph ph-gauge text-[1.4rem]"></i>
        <span class="font-black text-[1.15rem]">KPI Hedefleri (çeyreklik)</span></div>
      ${tbl(["Metrik", "Şimdi", "Çeyrek 1", "Çeyrek 2", "Yıl sonu"], kpi.map(k => [k.metrik, k.simdi, k.ceyrek1, k.ceyrek2, k.yil]))}
    </div>`;

  const charts: echarts.ECharts[] = [];
  for (const b of blocks) {
    const el = document.getElementById(b.id);
    if (!el) continue;
    const c = echarts.init(el, undefined, { renderer: "canvas" });
    c.setOption(b.option);
    charts.push(c);
  }
  let t: number | undefined;
  window.addEventListener("resize", () => {
    clearTimeout(t);
    t = window.setTimeout(() => charts.forEach(c => c.resize()), 150);
  });
}

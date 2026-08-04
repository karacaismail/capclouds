/* Yeniden kullanılabilir grafik + tablo fabrikası. chartId -> ECharts option / tablo.
   Aynı datasetId hem galeride hem accordion içinde tutarlı gösterilir (ayrı DOM, ayrı instance, aynı option). */
import * as S from "../strateji-data";
const { TRY, NUM } = S;

const INK = "#2a1e16", MUT = "#6f4e37", LINE = "#e6dccb", COFFEE = "#6f4e37";
const PALETTE = ["#6f4e37", "#8c6440", "#5ba6cb", "#d9902a", "#2e9e6b", "#2f6e97", "#b7a793"];
const GANTT_RENK = ["#d1523f", "#d9902a", "#5ba6cb", "#2e9e6b", "#6f4e37", "#241a13", "#8c6440"];
const base = { fontFamily: "Roboto, sans-serif", color: INK };

export interface Row { label: string; amount: number; note?: string }
export interface Tier { label: string; kisi: number; not: string }
export interface Kanal { ad: string; pay: number }
export interface Gantt { ad: string; basla: number; sure: number; renk: string }
export interface DataSet { yatirim: Row[]; isletme: Row[]; diger: Row[]; pazar: Tier[]; kanal: Kanal[]; gantt: Gantt[] }

export function staticData(): DataSet {
  return {
    yatirim: S.yatirim.map((i) => ({ label: i.label, amount: i.amount })),
    isletme: S.isletme.map((i) => ({ label: i.label, amount: i.amount })),
    diger: S.digerKalemler.map((i) => ({ label: i.label, amount: i.amount, note: i.note })),
    pazar: S.pazarKatman.map((k) => ({ label: k.label, kisi: k.kisi, not: k.not })),
    kanal: S.kanalPay.map((k) => ({ ad: k.ad, pay: k.pay })),
    gantt: S.ganttGorevler.map((g) => ({ ad: g.ad, basla: g.basla, sure: g.sure, renk: g.renk })),
  };
}

export async function fetchLive(sid: string, gid: string): Promise<DataSet | null> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${sid}/gviz/tq?tqx=out:json&gid=${gid}&headers=1&t=${Date.now()}`;
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();
    const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
    const rows: any[][] = json.table.rows.map((r: any) => (r.c || []).map((c: any) => (c ? c.v : null)));
    const g: Record<string, { etiket: string; deger: number; ekstra: string }[]> = {};
    for (const r of rows) { const grup = r[0]; if (!grup) continue; (g[grup] ||= []).push({ etiket: String(r[1] ?? ""), deger: Number(r[2] ?? 0), ekstra: String(r[3] ?? "") }); }
    if (!g.yatirim?.length || !g.pazar?.length) return null;
    return {
      yatirim: g.yatirim.map((x) => ({ label: x.etiket, amount: x.deger })),
      isletme: (g.isletme || []).map((x) => ({ label: x.etiket, amount: x.deger })),
      diger: (g.diger || []).map((x) => ({ label: x.etiket, amount: x.deger, note: x.ekstra })),
      pazar: g.pazar.map((x) => ({ label: x.etiket, kisi: x.deger, not: x.ekstra })),
      kanal: (g.kanal || []).map((x) => ({ ad: x.etiket, pay: x.deger })),
      gantt: (g.gantt || []).map((x, i) => ({ ad: x.etiket, basla: x.deger, sure: Number(x.ekstra || 0), renk: GANTT_RENK[i % GANTT_RENK.length] })),
    };
  } catch { return null; }
}

const sum = (a: Row[]) => a.reduce((s, i) => s + i.amount, 0);

export interface ChartMeta { id: string; icon: string; title: string; sub: (D: DataSet) => string; }
export const CHART_META: ChartMeta[] = [
  { id: "c-yatirim", icon: "ph-wrench", title: "Yatırım Harcamaları (tek seferlik)", sub: (D) => `Toplam: ${TRY(sum(D.yatirim))}` },
  { id: "c-isletme", icon: "ph-repeat", title: "Aylık İşletme Giderleri", sub: (D) => `Aylık: ${TRY(sum(D.isletme))} · Yıllık: ${TRY(sum(D.isletme) * 12)}` },
  { id: "c-yil", icon: "ph-chart-bar", title: "1. Yıl Maliyet Özeti (reklam hariç)", sub: (D) => `1. yıl: ${TRY(sum(D.yatirim) + sum(D.isletme) * 12 + sum(D.diger))}` },
  { id: "c-diger", icon: "ph-wallet", title: "Diğer Gerekli Kalemler", sub: () => "Yatırım/işletme dışı" },
  { id: "c-pazar", icon: "ph-funnel", title: "Pazar Büyüklüğü (dijital)", sub: () => "En geniş kitleden gerçekçi hedefe" },
  { id: "c-gantt", icon: "ph-calendar-check", title: "12 Aylık Yol Haritası (Gantt)", sub: () => "Eyl 2026 → Ağu 2027" },
  { id: "c-kanal", icon: "ph-chart-donut", title: "Aylık Reklam Bütçe Dağılımı", sub: () => "Kanal payları" },
];
export const chartMeta = (id: string) => CHART_META.find((m) => m.id === id);

export function optionFor(id: string, D: DataSet): any | null {
  switch (id) {
    case "c-yatirim": return { textStyle: base, grid: { left: 4, right: 16, top: 8, bottom: 4, containLabel: true }, tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: (v: number) => TRY(v) }, xAxis: { type: "value", axisLabel: { color: MUT, formatter: (v: number) => v / 1000 + "B" }, splitLine: { lineStyle: { color: LINE } } }, yAxis: { type: "category", data: D.yatirim.map((i) => i.label).reverse(), axisLabel: { color: INK, fontSize: 11, width: 120, overflow: "truncate" } }, series: [{ type: "bar", data: D.yatirim.map((i) => i.amount).reverse(), itemStyle: { color: COFFEE, borderRadius: [0, 5, 5, 0] }, barWidth: "58%" }] };
    case "c-isletme": return { textStyle: base, color: PALETTE, tooltip: { trigger: "item", valueFormatter: (v: number) => TRY(v) }, legend: { bottom: 0, textStyle: { color: MUT, fontSize: 11 }, type: "scroll" }, series: [{ type: "pie", radius: ["42%", "68%"], center: ["50%", "44%"], avoidLabelOverlap: true, itemStyle: { borderColor: "#fff", borderWidth: 2 }, label: { show: false }, data: D.isletme.map((i) => ({ name: i.label, value: i.amount })) }] };
    case "c-yil": { const y = sum(D.yatirim), il = sum(D.isletme) * 12, dg = sum(D.diger); return { textStyle: base, grid: { left: 4, right: 16, top: 10, bottom: 4, containLabel: true }, tooltip: { trigger: "axis", valueFormatter: (v: number) => TRY(v) }, xAxis: { type: "category", data: ["Yatırım\n(tek sefer)", "Yıllık\nişletme", "Diğer\nkalemler"], axisLabel: { color: INK, fontSize: 11 } }, yAxis: { type: "value", axisLabel: { color: MUT, formatter: (v: number) => v / 1000 + "B" }, splitLine: { lineStyle: { color: LINE } } }, series: [{ type: "bar", data: [{ value: y, itemStyle: { color: "#8c6440" } }, { value: il, itemStyle: { color: "#6f4e37" } }, { value: dg, itemStyle: { color: "#5ba6cb" } }], barWidth: "48%", itemStyle: { borderRadius: [5, 5, 0, 0] } }] }; }
    case "c-diger": return { textStyle: base, grid: { left: 4, right: 16, top: 8, bottom: 4, containLabel: true }, tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: (v: number) => TRY(v) }, xAxis: { type: "value", axisLabel: { color: MUT, formatter: (v: number) => v / 1000 + "B" }, splitLine: { lineStyle: { color: LINE } } }, yAxis: { type: "category", data: D.diger.map((i) => i.label).reverse(), axisLabel: { color: INK, fontSize: 11, width: 120, overflow: "truncate" } }, series: [{ type: "bar", data: D.diger.map((i) => i.amount).reverse(), itemStyle: { color: "#5ba6cb", borderRadius: [0, 5, 5, 0] }, barWidth: "58%" }] };
    case "c-pazar": return { textStyle: base, tooltip: { trigger: "item", formatter: (p: any) => `${p.name}<br/><b>${NUM(p.value)} kişi</b>` }, series: [{ type: "funnel", top: 6, bottom: 6, left: "6%", right: "6%", minSize: "38%", maxSize: "100%", sort: "descending", gap: 3, label: { position: "inside", color: "#fff", fontSize: 11 }, data: D.pazar.map((k, i) => ({ name: k.label, value: k.kisi, itemStyle: { color: ["#8c6440", "#6f4e37", "#241a13"][i % 3] } })) }] };
    case "c-gantt": { const gr = D.gantt; return { textStyle: base, grid: { left: 4, right: 12, top: 24, bottom: 4, containLabel: true }, tooltip: { trigger: "item", formatter: (p: any) => (p.seriesName === "süre" ? `${gr[gr.length - 1 - p.dataIndex].ad}<br/>${p.value} ay` : "") }, xAxis: { type: "value", min: 0, max: 12, interval: 1, position: "top", axisLabel: { color: MUT, fontSize: 10, formatter: (v: number) => S.ganttAylar[v] || "" }, splitLine: { lineStyle: { color: LINE } } }, yAxis: { type: "category", data: gr.map((g) => g.ad).reverse(), axisLabel: { color: INK, fontSize: 10, width: 120, overflow: "truncate" } }, series: [{ name: "ofis", type: "bar", stack: "t", itemStyle: { color: "transparent" }, data: gr.map((g) => g.basla).reverse(), silent: true }, { name: "süre", type: "bar", stack: "t", barWidth: "55%", data: gr.map((g) => ({ value: g.sure, itemStyle: { color: g.renk, borderRadius: 4 } })).reverse() }] }; }
    case "c-kanal": return { textStyle: base, color: PALETTE, tooltip: { trigger: "item", formatter: (p: any) => `${p.name}<br/><b>%${p.value}</b>` }, legend: { bottom: 0, textStyle: { color: MUT, fontSize: 11 }, type: "scroll" }, series: [{ type: "pie", radius: "62%", center: ["50%", "44%"], itemStyle: { borderColor: "#fff", borderWidth: 2 }, label: { show: false }, data: D.kanal.map((k) => ({ name: k.ad, value: k.pay })) }] };
    default: return null;
  }
}

/** chartId için tablo (grafik/tablo çifti) */
export function tableRowsFor(id: string, D: DataSet): { headers: string[]; rows: string[][] } | null {
  switch (id) {
    case "c-yatirim": return { headers: ["Kalem", "Tutar"], rows: D.yatirim.map((i) => [i.label, TRY(i.amount)]).concat([["Toplam", TRY(sum(D.yatirim))]]) };
    case "c-isletme": return { headers: ["Kalem", "Aylık"], rows: D.isletme.map((i) => [i.label, TRY(i.amount)]).concat([["Aylık toplam", TRY(sum(D.isletme))]]) };
    case "c-yil": return { headers: ["Kalem", "Tutar"], rows: [["Yatırım (tek seferlik)", TRY(sum(D.yatirim))], ["Yıllık işletme (12 ay)", TRY(sum(D.isletme) * 12)], ["Diğer gerekli kalemler", TRY(sum(D.diger))], ["1. yıl toplam", TRY(sum(D.yatirim) + sum(D.isletme) * 12 + sum(D.diger))]] };
    case "c-diger": return { headers: ["Kalem", "Tutar", "Not"], rows: D.diger.map((i) => [i.label, TRY(i.amount), i.note || ""]) };
    case "c-pazar": return { headers: ["Katman", "Kişi", "Tanım"], rows: D.pazar.map((k) => [k.label, NUM(k.kisi), k.not]) };
    case "c-gantt": return { headers: ["Görev", "Başlangıç", "Süre"], rows: D.gantt.map((g) => [g.ad, S.ganttAylar[g.basla] + " 2026", g.sure + " ay"]) };
    case "c-kanal": return { headers: ["Kanal", "Pay"], rows: D.kanal.map((k) => [k.ad, "%" + k.pay]) };
    default: return null;
  }
}

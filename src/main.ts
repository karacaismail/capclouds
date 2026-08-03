import Alpine from "alpinejs";
import "./style.css";
import {
  groups,
  seoScores,
  defaultChannels,
  conversionDefaults,
  guides,
  type BudgetChannel,
} from "./data";

/* -------- yardımcılar -------- */
const TRY = (n: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(isFinite(n) ? n : 0);

const NUM = (n: number) =>
  new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(
    isFinite(n) ? n : 0
  );

const LS_KEY = "cc_checklist_v1";

declare global {
  interface Window {
    Alpine: typeof Alpine;
  }
}

/* -------- Navigasyon store -------- */
Alpine.store("nav", {
  tab: "genel" as string,
  mobileOpen: false,
  go(t: string) {
    this.tab = t;
    this.mobileOpen = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      history.replaceState(null, "", "#" + t);
    } catch {}
  },
  init() {
    const h = location.hash.replace("#", "");
    if (h) this.tab = h;
  },
});

/* -------- Checklist bileşeni -------- */
Alpine.data("checklist", () => ({
  groups,
  checked: {} as Record<string, boolean>,
  init() {
    const saved = JSON.parse(localStorage.getItem(LS_KEY) || "null");
    const map: Record<string, boolean> = {};
    for (const g of groups)
      for (const it of g.items)
        map[it.id] = saved && it.id in saved ? saved[it.id] : it.status === "done";
    this.checked = map;
  },
  toggle(id: string) {
    this.checked[id] = !this.checked[id];
    localStorage.setItem(LS_KEY, JSON.stringify(this.checked));
  },
  reset() {
    localStorage.removeItem(LS_KEY);
    this.init();
  },
  groupDone(key: string) {
    const g = groups.find((x) => x.key === key);
    if (!g) return 0;
    return g.items.filter((i) => this.checked[i.id]).length;
  },
  groupTotal(key: string) {
    return groups.find((x) => x.key === key)?.items.length || 0;
  },
  get totalItems() {
    return groups.reduce((a, g) => a + g.items.length, 0);
  },
  get totalDone() {
    return groups.reduce(
      (a, g) => a + g.items.filter((i) => this.checked[i.id]).length,
      0
    );
  },
  get percent() {
    return Math.round((this.totalDone / this.totalItems) * 100);
  },
  badgeClass(s: string) {
    return s === "done" ? "badge-ok" : s === "partial" ? "badge-warn" : "badge-bad";
  },
  badgeText(s: string) {
    return s === "done" ? "Kurulu" : s === "partial" ? "Kısmen" : "Yapılmadı";
  },
}));

/* -------- SEO skor bileşeni -------- */
Alpine.data("seo", () => ({
  scores: seoScores,
  get overall() {
    return Math.round(
      this.scores.reduce((a, s) => a + s.score, 0) / this.scores.length
    );
  },
  band(v: number) {
    if (v <= 40) return { label: "Kritik", cls: "text-bad", bar: "bg-bad" };
    if (v <= 60) return { label: "Zayıf — Geliştirilmeli", cls: "text-warn", bar: "bg-warn" };
    if (v <= 80) return { label: "Orta-İyi", cls: "text-cloud-600", bar: "bg-cloud-400" };
    return { label: "Güçlü", cls: "text-ok", bar: "bg-ok" };
  },
  barColor(v: number) {
    if (v <= 40) return "bg-bad";
    if (v <= 60) return "bg-warn";
    if (v <= 80) return "bg-cloud-400";
    return "bg-ok";
  },
  // dairesel gösterge için stroke-dashoffset (r=52 → çevre ≈ 326.7)
  dash(v: number) {
    const c = 2 * Math.PI * 52;
    return c - (c * v) / 100;
  },
  circ: 2 * Math.PI * 52,
}));

/* -------- Bütçe hesaplayıcı -------- */
Alpine.data("budget", () => ({
  total: 60000,
  channels: defaultChannels.map((c) => ({ ...c })) as BudgetChannel[],
  cvr: conversionDefaults.cvr,
  aov: conversionDefaults.aov,
  growth: 8, // aylık büyüme %
  months: 12,
  fmt: TRY,
  num: NUM,

  get allocSum() {
    return this.channels
      .filter((c) => c.enabled)
      .reduce((a, c) => a + Number(c.alloc), 0);
  },
  normalize() {
    const sum = this.allocSum;
    if (sum === 0) return;
    this.channels.forEach((c) => {
      if (c.enabled) c.alloc = Math.round((c.alloc / sum) * 100);
    });
  },
  amount(c: BudgetChannel) {
    if (!c.enabled) return 0;
    const s = this.allocSum || 1;
    return (this.total * Number(c.alloc)) / s;
  },
  impressions(c: BudgetChannel) {
    if (c.cpm <= 0) return 0;
    return (this.amount(c) / c.cpm) * 1000;
  },
  clicks(c: BudgetChannel) {
    return (this.impressions(c) * Number(c.ctr)) / 100;
  },
  get paidSpend() {
    return this.channels
      .filter((c) => c.enabled && (c.kind === "paid" || c.kind === "influencer"))
      .reduce((a, c) => a + this.amount(c), 0);
  },
  get totalImpr() {
    return this.channels.reduce((a, c) => a + this.impressions(c), 0);
  },
  get totalClicks() {
    return this.channels.reduce((a, c) => a + this.clicks(c), 0);
  },
  get orders() {
    return (this.totalClicks * this.cvr) / 100;
  },
  get revenue() {
    return this.orders * this.aov;
  },
  get roas() {
    return this.paidSpend > 0 ? this.revenue / this.paidSpend : 0;
  },
  get cpl() {
    return this.orders > 0 ? this.paidSpend / this.orders : 0;
  },
  // 12 aylık kümülatif projeksiyon (büyüme ile)
  get projection() {
    const rows: { m: number; spend: number; revenue: number }[] = [];
    let curRev = this.revenue;
    let curSpend = this.total;
    let cumSpend = 0;
    let cumRev = 0;
    for (let m = 1; m <= this.months; m++) {
      cumSpend += curSpend;
      cumRev += curRev;
      rows.push({ m, spend: cumSpend, revenue: cumRev });
      curRev *= 1 + this.growth / 100;
    }
    return rows;
  },
  get annualRevenue() {
    const p = this.projection;
    return p.length ? p[p.length - 1].revenue : 0;
  },
  get annualSpend() {
    const p = this.projection;
    return p.length ? p[p.length - 1].spend : 0;
  },
  kindLabel(k: string) {
    return (
      {
        paid: "Ücretli Reklam",
        content: "Organik İçerik",
        influencer: "Influencer",
        seo: "SEO",
        tool: "Araç/Yönetim",
      } as Record<string, string>
    )[k] || k;
  },
  kindClass(k: string) {
    return (
      {
        paid: "bg-espresso-100 text-espresso-700",
        content: "bg-cloud-100 text-cloud-700",
        influencer: "bg-warn/15 text-warn",
        seo: "bg-ok/15 text-ok",
        tool: "bg-espresso-50 text-espresso-500",
      } as Record<string, string>
    )[k] || "bg-espresso-50";
  },
}));

/* -------- Uygulama rehberi (accordion) -------- */
Alpine.data("guides", () => ({
  list: guides,
  open: "meta" as string,
  toggle(id: string) {
    this.open = this.open === id ? "" : id;
  },
}));

window.Alpine = Alpine;
Alpine.start();

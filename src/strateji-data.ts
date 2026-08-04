/* ============================================================
   STRATEJİ VERİ KATMANI (tek kaynak / JSON tabanlı)
   Bu dosya hem strateji sayfasındaki ECharts grafiklerini hem de
   tabloları besler; Google E-Tablo sekmeleriyle senkron tutulur.
   Yazan: Tolga Akşen · 2026-08-04
   ============================================================ */

export interface MoneyItem { label: string; amount: number; note?: string }

/* --- FİNANSAL PLAN --- */
// Yatırım harcamaları (tek seferlik / kuruluş)
export const yatirim: MoneyItem[] = [
  { label: "Web & SEO teknik düzeltme", amount: 25000 },
  { label: "Ölçüm & piksel kurulumu", amount: 35000 },
  { label: "Şube sayfaları & yerel arama", amount: 45000 },
  { label: "Online mağaza altyapısı", amount: 60000 },
  { label: "Marka kimliği (sıfırdan) + içerik kiti", amount: 70000 },
  { label: "AI araç kurulumu & otomasyon", amount: 20000 },
];
// Aylık işletme giderleri (tekrar eden, reklam hariç)
export const isletme: MoneyItem[] = [
  { label: "Dijital Pazarlama Lideri (Tolga)", amount: 65000 },
  { label: "Uzman adayı (yetiştirilecek)", amount: 30000 },
  { label: "Grafiker (orta seviye)", amount: 40000 },
  { label: "Video/foto prodüksiyon", amount: 15000 },
  { label: "Araç & yazılım (AI dahil)", amount: 10000 },
  { label: "Influencer koordinasyon", amount: 12000 },
  { label: "Yönetim & raporlama", amount: 8000 },
];
// Diğer gerekli kalemler (opex/capex dışı)
export const digerKalemler: MoneyItem[] = [
  { label: "Nakit tamponu / rezerv (3 ay)", amount: 90000, note: "Beklenmedik gider koruması" },
  { label: "Eğitim & sertifikasyon", amount: 15000, note: "Ekip yetkinliği" },
  { label: "Yazılım lisans (yıllık)", amount: 24000, note: "Tasarım, e-posta, SEO araçları" },
  { label: "Yasal / danışman", amount: 20000, note: "KVKK, sözleşme, franchise" },
];
export const sum = (a: MoneyItem[]) => a.reduce((s, i) => s + i.amount, 0);

/* --- PAZAR BÜYÜKLÜĞÜ (üç katman, jargon terimsiz) --- */
export const pazarKatman: { label: string; kisi: number; not: string }[] = [
  { label: "Toplam Ulaşılabilir Pazar", kisi: 30000000, not: "TR'de düzenli kahve tüketen + dijitalde aktif kitle" },
  { label: "Hedeflenebilir Pazar", kisi: 4500000, not: "Şube illeri, 18–40 yaş, premium/üçüncü dalga ilgili" },
  { label: "Gerçekçi Hedef Pazar (12–18 ay)", kisi: 315000, not: "Anlamlı dijital temas kurulabilecek kitle" },
];

/* --- 12 AYLIK GANTT (ay ofseti + süre, 2026-09 = 0) --- */
export const ganttAylar = ["Eyl", "Eki", "Kas", "Ara", "Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu"];
export const ganttGorevler: { ad: string; basla: number; sure: number; renk: string }[] = [
  { ad: "Faz 1 · Ölçüm & SEO düzeltme", basla: 0, sure: 1, renk: "#d1523f" },
  { ad: "Faz 2 · Piksel & ilk reklam", basla: 1, sure: 1, renk: "#d9902a" },
  { ad: "Faz 3 · Yerel SEO & ölçekleme", basla: 2, sure: 1, renk: "#5ba6cb" },
  { ad: "Faz 4 · E-ticaret & katalog", basla: 3, sure: 3, renk: "#2e9e6b" },
  { ad: "Faz 5 · Marka & sürdürülebilir", basla: 6, sure: 6, renk: "#6f4e37" },
  { ad: "İK · Tolga (lider)", basla: 0, sure: 12, renk: "#241a13" },
  { ad: "İK · Ekip kurulumu", basla: 1, sure: 2, renk: "#8c6440" },
];

/* --- KANAL BÜTÇE PAYLARI (örnek aylık reklam dağılımı) --- */
export const kanalPay: { ad: string; pay: number }[] = [
  { ad: "Meta Ads", pay: 30 },
  { ad: "Google Ads", pay: 20 },
  { ad: "TikTok", pay: 12 },
  { ad: "Influencer", pay: 15 },
  { ad: "Organik içerik", pay: 12 },
  { ad: "SEO", pay: 6 },
  { ad: "Araç/Yönetim", pay: 5 },
];

/* --- KPI HEDEFLERİ (çeyreklik) --- */
export const kpi: { metrik: string; simdi: string; ceyrek1: string; ceyrek2: string; yil: string }[] = [
  { metrik: "SEO puanı (/100)", simdi: "42", ceyrek1: "60", ceyrek2: "70", yil: "80" },
  { metrik: "Organik oturum / ay", simdi: "baz", ceyrek1: "+%40", ceyrek2: "+%90", yil: "+%180" },
  { metrik: "Aktif piksel / araç", simdi: "2", ceyrek1: "7", ceyrek2: "9", yil: "11" },
  { metrik: "Reklam ROAS", simdi: "—", ceyrek1: "1.6x", ceyrek2: "2.2x", yil: "3.0x" },
  { metrik: "Franchise nitelikli aday / çeyrek", simdi: "—", ceyrek1: "15", ceyrek2: "30", yil: "60" },
];

export const TRY = (n: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
export const NUM = (n: number) => new Intl.NumberFormat("tr-TR").format(n);

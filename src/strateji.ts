import "@phosphor-icons/web/regular";
import "./style.css";

const REPO = "https://github.com/karacaismail/capclouds/blob/main/strateji/";

const docs: { icon: string; title: string; file: string }[] = [
  { icon: "ph-list-checks", title: "00 · Yönetici Özeti", file: "00-yonetici-ozeti.md" },
  { icon: "ph-compass", title: "01 · Vizyon · Misyon · Değerler", file: "01-vizyon-misyon-degerler.md" },
  { icon: "ph-tree-structure", title: "02 · Organizasyon · İK · İş Akışları", file: "02-organizasyon-ik-is-akislari.md" },
  { icon: "ph-chart-pie-slice", title: "03 · Pazar Analizi", file: "03-pazar-analizi.md" },
  { icon: "ph-users-three", title: "04 · Rakip & Rekabet Analizi", file: "04-rakip-analizi.md" },
  { icon: "ph-megaphone", title: "05 · Dijital Pazarlama Stratejisi", file: "05-dijital-pazarlama-stratejisi.md" },
  { icon: "ph-magnifying-glass", title: "05a · SEO", file: "kanallar/seo.md" },
  { icon: "ph-stack", title: "05b · Programatik SEO", file: "kanallar/programatik-seo.md" },
  { icon: "ph-google-logo", title: "05c · Google Ads", file: "kanallar/google-ads.md" },
  { icon: "ph-meta-logo", title: "05d · Meta Business + Pixel", file: "kanallar/meta-business-pixel.md" },
  { icon: "ph-tiktok-logo", title: "05e · TikTok", file: "kanallar/tiktok.md" },
  { icon: "ph-chart-line", title: "05f · Yandex Metrica", file: "kanallar/yandex-metrica.md" },
  { icon: "ph-fire", title: "05g · Hotjar / Clarity", file: "kanallar/hotjar.md" },
  { icon: "ph-arrows-clockwise", title: "05h · Criteo", file: "kanallar/criteo.md" },
  { icon: "ph-broadcast", title: "05i · AdRoll", file: "kanallar/adroll.md" },
  { icon: "ph-target", title: "05j · Remarketing", file: "kanallar/remarketing.md" },
  { icon: "ph-tag", title: "05k · Google Tag Manager", file: "kanallar/google-tag-manager.md" },
  { icon: "ph-shopping-cart", title: "05l · WooCommerce & Web UI", file: "kanallar/woocommerce-web-ui.md" },
  { icon: "ph-palette", title: "05m · Marka Kimliği (sıfırdan)", file: "kanallar/marka-kimligi.md" },
  { icon: "ph-coins", title: "06 · Finansal Plan", file: "06-finansal-plan.md" },
  { icon: "ph-warning-diamond", title: "07 · Gap & Bilinmeyen-Bilinmeyenler", file: "07-gap-analizi-unknown-unknowns.md" },
  { icon: "ph-calendar-check", title: "08 · Zaman Planı & Gantt", file: "08-zaman-plani-gantt.md" },
  { icon: "ph-shield-check", title: "09 · Durum Tespiti (Due Diligence)", file: "09-durum-tespiti-due-diligence.md" },
];

const list = document.getElementById("doclist");
if (list) {
  list.innerHTML = docs
    .map(
      (d) => `<a class="card !p-4 flex items-center gap-3 hover:border-espresso-400 transition-colors"
        href="${REPO}${d.file}" target="_blank" rel="noopener">
        <span class="grid place-items-center w-10 h-10 shrink-0 rounded-xl2 bg-espresso-50 text-espresso-700 text-[1.3rem]"><i class="ph ${d.icon}"></i></span>
        <span class="font-bold text-[1.05rem] min-w-0 flex-1">${d.title}</span>
        <i class="ph ph-arrow-right text-espresso-400"></i>
      </a>`
    )
    .join("");
}

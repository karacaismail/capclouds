/* ============================================================
   VERİ KATMANI — Cups & Clouds dijital pazarlama panosu
   Denetim: cupsandclouds.com (03.08.2026 · canlı HTML + GTM
   konteyneri + Yoast sitemap analizi ile tespit edildi)
   ============================================================ */

export type Status = "done" | "partial" | "todo";

export interface ChecklistItem {
  id: string;
  title: string;
  status: Status; // tespit edilen MEVCUT durum
  note: string; // sağ sütun: mevcut durum açıklaması
  detected: boolean; // false ise "tespit edilemedi, sen kontrol et"
}

export interface ChecklistGroup {
  key: string;
  title: string;
  desc: string;
  items: ChecklistItem[];
}

/* ---------- ENTEGRASYON & GÖREV CHECKLIST'İ ---------- */
export const groups: ChecklistGroup[] = [
  {
    key: "olcumleme",
    title: "1 · Ölçümleme & Analitik Altyapısı",
    desc: "Reklam harcamadan önce ölçüm kurulmalı. Ölçemediğin şeyi yönetemezsin: hangi kanal para kazandırıyor, hangi sayfa satışa götürüyor, ancak buradan görürsün.",
    items: [
      {
        id: "gtm",
        title: "Google Tag Manager (etiket yöneticisi) kurulumu",
        status: "done",
        detected: true,
        note: "KURULU. Sitede GTM-KZKJWLZM konteyneri çalışıyor. İyi haber: bundan sonra tüm pikselleri koda dokunmadan, tek panelden ekleyebiliriz.",
      },
      {
        id: "ga4",
        title: "Google Analytics 4 (ziyaretçi analitiği)",
        status: "done",
        detected: true,
        note: "KURULU. G-KRHM7XRYPF ölçüm kimliği GTM üzerinden yükleniyor. Ziyaretçi sayısı toplanıyor; ancak aşağıdaki 'olay/dönüşüm' takibi yapılmadan bu veri yarım kalır.",
      },
      {
        id: "ga4-events",
        title: "GA4 olay & dönüşüm takibi (menü tıklama, franchise formu, yol tarifi)",
        status: "todo",
        detected: true,
        note: "YAPILMADI. GA4 var ama sadece sayfa görüntüleme sayıyor. Franchise başvurusu, iletişim formu, 'yol tarifi al', menü indirme gibi değerli aksiyonlar dönüşüm olarak işaretlenmemiş. En kritik ilk iş.",
      },
      {
        id: "yandex-metrica",
        title: "Yandex Metrica kurulumu",
        status: "todo",
        detected: true,
        note: "YAPILMADI. Sitede Yandex Metrica yok. Türkiye trafiğinde Yandex önemli ve Metrica ücretsiz; üstelik ısı haritası ve oturum kaydını da o veriyor.",
      },
      {
        id: "session-record",
        title: "Oturum kaydı & ısı haritası (Webvisor / Clarity / Hotjar)",
        status: "todo",
        detected: true,
        note: "YAPILMADI. Ziyaretçinin sayfada nereye tıkladığını, nerede takılıp çıktığını gösteren kayıt yok. Yandex Metrica Webvisor veya Microsoft Clarity ile ücretsiz çözülür.",
      },
      {
        id: "consent",
        title: "Çerez onayı / KVKK aydınlatma (Consent Mode v2)",
        status: "partial",
        detected: true,
        note: "KISMEN. Sitede temel bir çerez bildirimi mevcut, ancak Google Consent Mode v2 ile reklam/analitik izinlerinin etiket yöneticisine bağlanması netleştirilmeli. KVKK ve Meta/Google için 2024 sonrası zorunlu.",
      },
    ],
  },
  {
    key: "reklam-piksel",
    title: "2 · Reklam Pikselleri & Yeniden Pazarlama",
    desc: "Piksel, reklam platformuna 'bu kişi siteme geldi' der. Piksel olmadan reklam vermek, gözü kapalı para atmaktır: kime ulaştığını, kimin geri geldiğini bilemezsin.",
    items: [
      {
        id: "meta-pixel",
        title: "Meta Pixel (Instagram/Facebook) + Business Manager",
        status: "todo",
        detected: true,
        note: "YAPILMADI. Sitede Meta Pixel (fbq) yok. Instagram, kafe markası için 1 numaralı kanal; piksel olmadan Instagram reklamları optimize edilemez ve siteyi gezenlere geri reklam gösterilemez.",
      },
      {
        id: "meta-capi",
        title: "Meta Conversions API (sunucu taraflı ölçüm)",
        status: "todo",
        detected: true,
        note: "YAPILMADI. iOS gizlilik güncellemeleri sonrası sadece piksel yetmiyor; sunucu taraflı Conversions API ile ölçüm kaybı %20-30 azalır. Meta Pixel'den hemen sonra gelir.",
      },
      {
        id: "google-ads-tag",
        title: "Google Ads dönüşüm etiketi & yeniden pazarlama",
        status: "partial",
        detected: true,
        note: "KISMEN. GTM konteynerinde Google Ads/remarketing izleri (googleadservices, doubleclick) var; yani remarketing etiketi kurulmuş görünüyor. Ancak net bir dönüşüm etiketi (AW-...) doğrulanamadı. Kurulum tamamlanıp test edilmeli.",
      },
      {
        id: "criteo",
        title: "Criteo pikseli (dinamik yeniden pazarlama)",
        status: "todo",
        detected: true,
        note: "YAPILMADI. Criteo yok. Criteo, ancak online satış (ürün kataloğu) devreye girince mantıklı; e-ticaret açılana kadar beklemeli. Yol haritasında 2. faza koyduk.",
      },
      {
        id: "adroll",
        title: "AdRoll pikseli (çapraz platform retargeting)",
        status: "todo",
        detected: true,
        note: "YAPILMADI. AdRoll yok. Criteo gibi, e-ticaret/katalog gerektirir. Türkiye'de Meta + Google retargeting çoğu ihtiyacı karşılar; AdRoll'u opsiyonel/ileri faz olarak işaretledik.",
      },
      {
        id: "tiktok-pixel",
        title: "TikTok Pixel + TikTok Business",
        status: "todo",
        detected: true,
        note: "YAPILMADI. TikTok pikseli yok. Kahve/kafe içeriği TikTok'ta çok güçlü ve genç kitleye ulaşımın en ucuz olduğu yer; piksel şimdiden kurulmalı ki reklam başlayınca veri hazır olsun.",
      },
      {
        id: "pinterest",
        title: "Pinterest etiketi (opsiyonel)",
        status: "todo",
        detected: true,
        note: "YAPILMADI. Pinterest yok. Görsel/menü içerikleri için düşük öncelikli fırsat. İlk fazda şart değil, işaretledik ki gözden kaçmasın.",
      },
    ],
  },
  {
    key: "seo-teknik",
    title: "3 · SEO — Teknik Temeller",
    desc: "Teknik SEO, Google'ın siteni doğru okumasını sağlar. Burada küçük ayarlar organik (bedava) trafikte büyük fark yaratır.",
    items: [
      {
        id: "robots-lang",
        title: "robots.txt'in /en/ ve /ar/ dillerini engellemesini kaldır",
        status: "todo",
        detected: true,
        note: "ACİL HATA. robots.txt şu an İngilizce (/en/) ve Arapça (/ar/) sayfaları Google'a KAPATIYOR — ama hreflang etiketleri bu dilleri işaret ediyor. Yani çok dilli emek boşa gidiyor. Turist/yabancı kitle için bu engel kaldırılmalı.",
      },
      {
        id: "title-tags",
        title: "Sayfa başlıklarını (title) anahtar kelimeyle düzelt",
        status: "todo",
        detected: true,
        note: "YAPILMADI. Ana sayfa başlığı 'Cups & Clouds - Cups & Clouds' — marka iki kez, anahtar kelime yok. 'Cups & Clouds | İstanbul Kahve & Bakery — Şubeler & Franchise' gibi aranan kelimeler eklenmeli.",
      },
      {
        id: "meta-desc",
        title: "Meta açıklamalarını (description) yaz",
        status: "todo",
        detected: true,
        note: "YAPILMADI. Ana sayfada meta açıklama yok; Google slider metnini ('#mutluluk #enerji...') çekip gösteriyor. Her sayfaya 150-160 karakter, tıklama çeken açıklama yazılmalı.",
      },
      {
        id: "h1",
        title: "Her sayfada tek ve anlamlı H1 başlığı",
        status: "todo",
        detected: true,
        note: "YAPILMADI. Ana sayfada 3 adet H1 var (SEO'da 1 olmalı) ve içeriği sadece marka adı. Elementor şablonundaki fazla H1'ler H2'ye çevrilmeli.",
      },
      {
        id: "sitemap-robots",
        title: "Sitemap'i robots.txt'e ekle & Search Console'a gönder",
        status: "partial",
        detected: true,
        note: "KISMEN. Yoast sitemap_index.xml üretiyor (iyi) ama robots.txt'te 'Sitemap:' satırı yok ve Search Console gönderimi doğrulanamadı. Tek satırla bağlanmalı.",
      },
      {
        id: "gsc-bing",
        title: "Google Search Console + Bing/Yandex Webmaster kaydı",
        status: "todo",
        detected: false,
        note: "TESPİT EDİLEMEDİ. Search Console/Yandex Webmaster hesaplarına dışarıdan bakılamaz. Sende hesap varsa işaretle; yoksa ilk hafta açılmalı (organik trafiğin röntgeni).",
      },
      {
        id: "perf",
        title: "Sayfa hızı & Core Web Vitals iyileştirmesi",
        status: "todo",
        detected: true,
        note: "YAPILMADI (iyileştirme gerekli). Site Elementor ile kurulu ve ana sayfa HTML'i ~420 KB, çok sayıda görsel var. Görsel sıkıştırma, tembel yükleme ve önbellek ile mobil hız yükseltilmeli.",
      },
    ],
  },
  {
    key: "seo-yerel",
    title: "4 · SEO — Yerel & İçerik (Kafe için en kritik)",
    desc: "26 şubeli bir kafe için en değerli trafik 'yakınımdaki kahveci' aramalarıdır. Yerel SEO ve Google İşletme Profili doğrudan şubeye müşteri getirir.",
    items: [
      {
        id: "gbp",
        title: "Her şube için Google İşletme Profili (Maps) optimizasyonu",
        status: "todo",
        detected: false,
        note: "TESPİT EDİLEMEDİ (site dışı). Şubelerin Google Haritalar profilleri fotoğraf, çalışma saati, menü linki ve yorum yönetimiyle güncellenmeli. 'Yakınımda kahve' aramasında öne çıkmanın 1 numaralı yolu.",
      },
      {
        id: "localbusiness-schema",
        title: "LocalBusiness / CafeOrCoffeeShop yapısal veri (schema)",
        status: "todo",
        detected: true,
        note: "YAPILMADI. Sitede Yoast'ın genel Organization şeması var ama şubeler için LocalBusiness/adres/çalışma saati şeması yok. Bu, Google'da zengin sonuç ve harita eşleşmesi sağlar.",
      },
      {
        id: "menu-schema",
        title: "Menü sayfası için Menu yapısal verisi",
        status: "todo",
        detected: true,
        note: "YAPILMADI. Menü sayfası var ama ürün/fiyat schema'sı yok. Menu schema ile Google, kahve çeşitlerini arama sonucunda gösterebilir.",
      },
      {
        id: "local-pages",
        title: "Şube bazlı açılış sayfaları ('Ortaköy kahve', 'Çekmeköy kafe')",
        status: "todo",
        detected: true,
        note: "YAPILMADI. Tek bir /subeler/ sayfası var. Her semt için ayrı, o semtin adıyla optimize sayfa, yerel aramalarda çok daha güçlüdür.",
      },
      {
        id: "blog-content",
        title: "Düzenli blog / içerik üretimi (SEO + marka)",
        status: "partial",
        detected: true,
        note: "KISMEN. Blogda sadece 4 yazı var (kahve demleme, baristanın sırrı vb.). Temel atılmış ama düzenli yayın yok. Haftada 1 içerik ile organik trafik ve marka otoritesi büyür.",
      },
    ],
  },
  {
    key: "sosyal-icerik",
    title: "5 · Organik Sosyal Medya & İçerik",
    desc: "Kahve markasının kalbi Instagram ve TikTok'ta atar. Reklamdan önce güçlü bir organik içerik akışı, hem markayı hem de reklam performansını büyütür.",
    items: [
      {
        id: "content-calendar",
        title: "Aylık içerik takvimi (Instagram + TikTok Reels)",
        status: "todo",
        detected: false,
        note: "TESPİT EDİLEMEDİ. İçerik planı sende. Haftalık tema (yeni ürün, barista, mekân, kullanıcı içeriği) ile öngörülebilir, düzenli akış kurulmalı.",
      },
      {
        id: "ugc",
        title: "Kullanıcı içeriği (UGC) & etiket kampanyası (#cupsandclouds)",
        status: "todo",
        detected: true,
        note: "YAPILMADI (sistematik değil). Ana sayfada #mutluluk #keyif etiketleri var ama düzenli bir UGC toplama/paylaşma sistemi yok. Müşteri fotoğrafları en ucuz ve en güvenilir içeriktir.",
      },
      {
        id: "gbp-social",
        title: "Şube ekiplerinden içerik akışı (fotoğraf/video toplama)",
        status: "todo",
        detected: false,
        note: "TESPİT EDİLEMEDİ. 26 şube = 26 içerik kaynağı. Şubelerden düzenli görsel toplayan basit bir sistem (WhatsApp grubu/form) merkezî içerik üretimini besler.",
      },
      {
        id: "whatsapp",
        title: "WhatsApp Business / katalog & hızlı iletişim",
        status: "partial",
        detected: true,
        note: "KISMEN. Sitede WhatsApp bağlantısı görünüyor. WhatsApp Business katalog, otomatik yanıt ve franchise sorularını karşılayacak şekilde yapılandırılmalı.",
      },
    ],
  },
  {
    key: "eticaret",
    title: "6 · E-ticaret & Dönüşüm Altyapısı",
    desc: "Şu an site kurumsal/tanıtım sitesi; online satış yok. Paketli kahve, ekipman veya hediye setini online satmak yeni bir gelir kanalı ve tüm retargeting/katalog reklamlarının önünü açar.",
    items: [
      {
        id: "woocommerce",
        title: "Online mağaza altyapısı (paketli kahve / merch satışı)",
        status: "todo",
        detected: true,
        note: "YAPILMADI. /shop, /sepet, /odeme sayfaları 404 veriyor — online mağaza yok. Site WordPress olduğu için WooCommerce ile eklenebilir. Kavrulmuş çekirdek + merch iyi bir başlangıç.",
      },
      {
        id: "datalayer-ecom",
        title: "DataLayer e-ticaret olayları (view_item, add_to_cart, purchase)",
        status: "todo",
        detected: true,
        note: "YAPILMADI. Online satış açılınca GTM DataLayer ile ürün görüntüleme, sepete ekleme, satın alma olayları basılmalı ki tüm piksel ve ROAS ölçümü çalışsın.",
      },
      {
        id: "merchant-center",
        title: "Google Merchant Center + ürün feed'i (Shopping)",
        status: "todo",
        detected: true,
        note: "YAPILMADI. Merchant Center yok. Online mağaza + ürün feed'i olmadan Google Shopping/PMax ürün reklamı verilemez. E-ticaret fazına bağlı.",
      },
      {
        id: "catalog-meta",
        title: "Meta & TikTok ürün kataloğu (dinamik reklam)",
        status: "todo",
        detected: true,
        note: "YAPILMADI. Katalog yok. Online satış açılınca Meta/TikTok kataloğu ile 'baktığın ürünü' gösteren dinamik reklamlar açılır — en yüksek ROAS'lı format.",
      },
    ],
  },
];

/* ---------- SEO SKOR KARTI (kategori bazında) ---------- */
export interface ScoreCat {
  label: string;
  score: number; // 0-100
  note: string;
}
export const seoScores: ScoreCat[] = [
  { label: "Teknik SEO", score: 58, note: "HTTPS, canonical, viewport, Cloudflare CDN var; ama robots.txt dilleri engelliyor, sitemap robots'a bağlı değil." },
  { label: "Sayfa İçi (On-Page)", score: 38, note: "Başlıklar zayıf, meta açıklama yok, çoklu H1. Hızlı düzeltilebilir alan." },
  { label: "İçerik", score: 40, note: "Blog başlatılmış ama sadece 4 yazı; düzenli üretim yok." },
  { label: "Yapısal Veri", score: 45, note: "Yoast temel şemaları var; LocalBusiness ve Menu şeması eksik." },
  { label: "Yerel SEO", score: 35, note: "26 şube için şube sayfaları ve İşletme Profili optimizasyonu eksik — en büyük kayıp." },
  { label: "Uluslararası SEO", score: 30, note: "hreflang doğru ama robots.txt /en/ ve /ar/'ı engelliyor; emek boşa gidiyor." },
  { label: "Performans (hız)", score: 45, note: "Elementor + ağır görseller; mobil hız optimizasyonu gerekli (ölçüm önerilir)." },
  { label: "Ölçümleme Olgunluğu", score: 42, note: "GTM + GA4 kurulu (artı); dönüşüm takibi, piksel ve retargeting eksik." },
];

/* ---------- BÜTÇE HESAPLAYICI: kanal varsayılanları ----------
   TR pazarı için gerçekçi, muhafazakâr başlangıç varsayımları.
   Kullanıcı hepsini panelden değiştirebilir. */
export interface BudgetChannel {
  id: string;
  name: string;
  kind: "paid" | "content" | "influencer" | "seo" | "tool";
  alloc: number; // yüzde
  cpm: number; // TL / 1000 gösterim (paid için)
  ctr: number; // % tıklama oranı
  note: string;
  enabled: boolean;
}
export const defaultChannels: BudgetChannel[] = [
  { id: "meta", name: "Meta Ads (Instagram / Facebook)", kind: "paid", alloc: 30, cpm: 90, ctr: 1.3, enabled: true, note: "Marka + yerel erişim + retargeting. Kafe için ana kanal." },
  { id: "google", name: "Google Ads (Arama + PMax)", kind: "paid", alloc: 20, cpm: 140, ctr: 3.5, enabled: true, note: "'Yakınımda kahve', 'kahve franchise' niyetli aramalar." },
  { id: "tiktok", name: "TikTok Ads", kind: "paid", alloc: 12, cpm: 55, ctr: 1.0, enabled: true, note: "Genç kitle, en ucuz erişim, viral potansiyel." },
  { id: "influencer", name: "Influencer & İşbirlikleri", kind: "influencer", alloc: 15, cpm: 45, ctr: 0.8, enabled: true, note: "Mikro/orta influencer şube ziyaretleri ve içerik." },
  { id: "organik", name: "Organik İçerik Üretimi (prodüksiyon)", kind: "content", alloc: 12, cpm: 0, ctr: 0, enabled: true, note: "Foto/video çekim, tasarım, community yönetimi." },
  { id: "seo", name: "SEO & İçerik / Blog", kind: "seo", alloc: 6, cpm: 0, ctr: 0, enabled: true, note: "Teknik SEO, şube sayfaları, düzenli blog." },
  { id: "tools", name: "Araç & Yönetim (tool + ajans/uzman)", kind: "tool", alloc: 5, cpm: 0, ctr: 0, enabled: true, note: "Metrica/Clarity ücretsiz; tasarım aracı, raporlama, yönetim." },
];

/* Dönüşüm varsayımları (kullanıcı değiştirebilir) */
export const conversionDefaults = {
  cvr: 2.5, // tıklayanların % kaçı aksiyon/satış (site dönüşüm oranı)
  aov: 350, // ortalama sepet / müşteri değeri (TL) — online satış veya ort. adisyon
  franchiseRate: 0.4, // tıklamaların % kaçı franchise başvurusuna döner (franchise trafiği)
  franchiseValue: 15000, // 1 nitelikli franchise adayının işletmeye tahmini değeri (TL)
};

/* ---------- UYGULAMA REHBERİ (adım adım) ---------- */
export interface Guide {
  id: string;
  icon: string;
  title: string;
  steps: string[];
}
export const guides: Guide[] = [
  {
    id: "meta",
    icon: "📘",
    title: "Meta Pixel + Conversions API",
    steps: [
      "business.facebook.com üzerinden Meta Business hesabı ve Reklam Hesabı aç.",
      'Etkinlikler Yöneticisi’nde yeni bir "Veri Kaynağı → Web" (Pixel) oluştur, kimliği kopyala.',
      'GTM’de yeni etiket → "Meta Pixel" şablonu → Pixel kimliğini yapıştır → tetikleyici: All Pages.',
      "Menü, franchise formu, iletişim gibi aksiyonlara özel olay etiketleri (Lead, Contact) ekle.",
      "Conversions API için Meta’da erişim anahtarı üret; sunucu tarafı (stape.io / CAPI Gateway) ile bağla.",
      "Meta Pixel Helper eklentisiyle test et; Etkinlikler Yöneticisi’nde olayların düştüğünü doğrula.",
    ],
  },
  {
    id: "metrica",
    icon: "📊",
    title: "Yandex Metrica + Webvisor (oturum kaydı)",
    steps: [
      "metrica.yandex.com’da ücretsiz hesap aç, yeni sayıcı (counter) oluştur, alan adını gir.",
      'Kurulumda "Webvisor", "Isı haritası" ve "Form analizi" seçeneklerini AÇ.',
      'Sayıcı kimliğini kopyala; GTM’de "Özel HTML" etiketiyle Metrica kodunu yapıştır (All Pages).',
      "Yayına al, birkaç saat bekle; ziyaretçi kayıtları ve ısı haritaları dolmaya başlar.",
      "KVKK için çerez metnine Yandex Metrica’yı ekle.",
    ],
  },
  {
    id: "ga4",
    icon: "🎯",
    title: "GA4 dönüşüm & olay takibi",
    steps: [
      "GA4’te (zaten kurulu) Yönetici → Etkinlikler bölümünü aç.",
      "GTM’de tıklama tetikleyicileri kur: franchise formu, iletişim, tel: ve wa.me tıklaması, ‘yol tarifi’.",
      "Her tetikleyiciye GA4 Etkinlik etiketi bağla (ör. generate_lead, contact).",
      "GA4’te bu olayları ‘Anahtar etkinlik/dönüşüm’ olarak işaretle.",
      "GTM Önizleme (Preview) ile test et; DebugView’da olayları gör.",
    ],
  },
  {
    id: "clarity",
    icon: "🔥",
    title: "Microsoft Clarity (ısı haritası, ücretsiz)",
    steps: [
      "clarity.microsoft.com’da ücretsiz proje oluştur.",
      'GTM galerisinde hazır "Microsoft Clarity" şablonu vardır; kur ve proje kimliğini gir.',
      "Tetikleyici All Pages; yayına al.",
      "Kayıtlar (recordings) ve heatmap ile hangi bölümde takılıp çıkıldığını izle.",
    ],
  },
  {
    id: "robots",
    icon: "🛠️",
    title: "SEO hızlı düzeltmeleri",
    steps: [
      "robots.txt’ten ‘Disallow: /en/’ ve ‘Disallow: /ar/’ satırlarını kaldır.",
      "robots.txt sonuna ‘Sitemap: https://cupsandclouds.com/sitemap_index.xml’ ekle.",
      "Yoast’ta her sayfanın başlık ve meta açıklamasını anahtar kelimeyle yeniden yaz.",
      "Elementor şablonundaki fazla H1’leri H2’ye çevir (sayfa başına tek H1).",
      "Search Console + Yandex Webmaster’a siteyi doğrula, sitemap gönder.",
    ],
  },
  {
    id: "local",
    icon: "📍",
    title: "Yerel SEO & İşletme Profili",
    steps: [
      "Her şube için Google İşletme Profili talep et/doğrula (sahiplen).",
      "Kategori, çalışma saati, telefon, menü linki, 10+ güncel fotoğraf ekle.",
      "Her şubeye site içinde ayrı sayfa aç (semt adıyla başlık + adres + harita).",
      "Bu sayfalara LocalBusiness/CafeOrCoffeeShop yapısal verisi ekle.",
      "Müşteri yorumlarına düzenli yanıt ver; yorum toplamayı teşvik et (QR kart).",
    ],
  },
];

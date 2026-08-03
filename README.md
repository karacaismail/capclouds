# Cups & Clouds — Dijital Pazarlama Denetim & Eylem Panosu

Bu depo, **cupsandclouds.com** için hazırlanan tek sayfalık interaktif bir dijital
pazarlama kontrol panosudur. İçinde:

- **Site & SEO denetimi** — sayfa envanteri, site haritası, kategori bazlı SEO puanı
- **Entegrasyon listesi** — kurulu / eksik ölçümleme ve reklam araçları (işaretlenebilir checklist, tarayıcıda kaydeder)
- **Rakip analizi** — Türkiye kahve zinciri pazarı karşılaştırması
- **Strateji** — iki cepheli büyüme + organik / ücretli PPC / influencer planları
- **Yol haritası** — 12 aylık, fazlara bölünmüş uygulama planı
- **Bütçe hesaplama** — kanal dağılımı, erişim/tıklama/dönüşüm/ROAS ve 12 aylık projeksiyon
- **Uygulama rehberi** — her işin adım adım "nasıl yapılır" anlatımı

## Teknoloji

- **TypeScript** + **Alpine.js** (etkileşim) + **Tailwind CSS** (Flat 2.0 tasarım)
- **Vite** ile derlenir, **GitHub Pages** üzerinde yayınlanır
- Roboto yazı tipi, min. 1.1rem gövde metni, erişilebilirlik odaklı UX

## Geliştirme

```bash
npm install
npm run dev      # yerel geliştirme
npm run build    # dist/ üretir
npm run preview  # derlenmiş çıktıyı önizle
```

## Yayın

`main` dalına her push, `.github/workflows/deploy.yml` üzerinden otomatik olarak
GitHub Pages'e derleyip dağıtır.

> Yayın adresi: https://karacaismail.github.io/capclouds/

---

*Denetim tarihi: 03.08.2026 — canlı site HTML'i, GTM konteyneri ve Yoast sitemap analizine dayanır.*

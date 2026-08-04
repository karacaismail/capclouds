# 02 · Organizasyon Şeması · İK Planı · İş Akışları

> **Yazan:** Tolga Akşen · **Onay:** Genel Müdür · **Tarih:** 2026-08-04
> İlk ay **Tolga Akşen** Dijital Pazarlama Lideri olarak istihdam edilir; bu dokümandaki tüm stratejiler
> onun sorumluluğunda üretilmiş sayılır. Tolga **Genel Müdür'e** bağlıdır. İlk 3 ayda altında küçük bir ekip kurulur.

---

## 1. Organizasyon Şeması (hedef yapı — ilk 3 ay sonu)

```mermaid
graph TD
    GM["Genel Müdür<br/>(strateji onayı · bütçe · nihai karar)"]
    T["Tolga Akşen<br/>Dijital Pazarlama Lideri<br/>(strateji · kanal yönetimi · raporlama)"]
    U["Dijital Pazarlama Uzman Adayı<br/>(yetiştirilecek · reklam ops · içerik takvimi)"]
    G["Grafiker (orta seviye)<br/>(görsel · marka kimliği uygulama · video kurgu)"]
    F["Freelance / Dış Kaynak<br/>(video prodüksiyon · influencer · SEO teknik)"]

    GM --> T
    T --> U
    T --> G
    T -.sözleşmeli.-> F

    OPS["Operasyon / Şube Md.<br/>(içerik kaynağı · yerel etkinlik)"]
    GM --> OPS
    OPS -. içerik akışı .-> T
```

**Raporlama hattı:** Genel Müdür → Tolga Akşen → (Uzman adayı + Grafiker). Operasyon/Şube müdürlüğü GM'ye
bağlıdır ama Tolga'ya **içerik ve yerel etkinlik** akışı sağlar (kesikli çizgi = işbirliği, yönetim değil).

### Roller ve sorumluluklar (RACI özeti)
| Görev | GM | Tolga | Uzman adayı | Grafiker |
|---|:--:|:--:|:--:|:--:|
| Strateji & bütçe onayı | **A** | R | I | I |
| Kanal stratejisi & optimizasyon | I | **A/R** | C | I |
| Reklam kurulumu & günlük ops | I | A | **R** | I |
| İçerik takvimi & yayın | I | A | **R** | C |
| Görsel/video & marka kimliği uygulaması | I | A | I | **R** |
| Raporlama (aylık) | **A** | **R** | C | I |
> A=Onaylayan, R=Yapan, C=Danışılan, I=Bilgilendirilen

---

## 2. İK Planı — ilk 3 ay (istihdam & yetiştirme)

```mermaid
gantt
    title İK & Ekip Kurulumu (İlk 3 Ay)
    dateFormat  YYYY-MM-DD
    axisFormat  %d %b
    section Lider
    Tolga Akşen işe başlar          :done, t1, 2026-09-01, 3d
    Strateji & sistem kurulumu      :active, t2, 2026-09-04, 40d
    section Uzman adayı
    İlan & mülakat                  :h1, 2026-09-15, 20d
    İşe alım & oryantasyon          :h2, after h1, 7d
    Eğitim (reklam/analitik)        :h3, after h2, 45d
    section Grafiker
    İlan & portföy değerlendirme    :g1, 2026-10-01, 18d
    İşe alım                        :g2, after g1, 7d
    Marka kimliği uygulamaya başlar :g3, after g2, 30d
    section Kapanış
    Ekip tam operasyonel            :milestone, m1, 2026-11-30, 0d
```

**Kademeler:**
1. **Ay 1 (Eylül):** Tolga işe başlar → ölçüm altyapısı + strateji dokümanları + hızlı SEO düzeltmeleri.
   Uzman adayı ilanı açılır.
2. **Ay 2 (Ekim):** Uzman adayı işe alınır (reklam/analitik eğitimine girer); grafiker ilanı + işe alım.
3. **Ay 3 (Kasım):** Grafiker marka kimliği uygulamasına başlar; ekip tam operasyonel; roller netleşir.

**Yetiştirme (uzman adayı müfredatı — 45 gün):** GA4/GTM → Meta Business & Pixel → Google Ads → içerik/SEO →
raporlama. Her hafta bir kanal, sonunda küçük bir canlı kampanya ile sınama (test-önce).

---

## 3. İş Akışları (temel süreçler)

### 3.1 Haftalık içerik üretim akışı
```mermaid
flowchart LR
    A["Şubelerden ham içerik<br/>(foto/video · WhatsApp)"] --> B["Tolga: haftalık tema seçimi"]
    B --> C["Grafiker: kurgu/tasarım<br/>(+AI varyant)"]
    C --> D["Tolga: onay & marka kontrolü"]
    D --> E["Uzman adayı: planlama & yayın<br/>(Instagram · TikTok · GBP)"]
    E --> F["Ölçüm: erişim/etkileşim → rapor"]
    F -->|zayıfsa| B
```

### 3.2 Reklam kampanya akışı (test-önce)
```mermaid
flowchart LR
    P["Hedef & bütçe (Tolga)"] --> Q["Piksel/dönüşüm hazır mı?"]
    Q -->|Hayır| R["Ölç kur (dur)"]
    Q -->|Evet| S["Küçük A/B test kampanya"]
    S --> T["48-72s ölç"]
    T -->|ROAS eşik üstü| U["Ölçekle"]
    T -->|Altı| V["Kreatif/hedef revize → tekrar test"]
    U --> W["Haftalık raporla"]
```

### 3.3 Franchise adayı (lead) akışı
```mermaid
flowchart LR
    L["Reklam/SEO → Franchise sayfası"] --> M["Form + getiri hesaplayıcı"]
    M --> N["Otomatik yanıt + CRM kaydı"]
    N --> O["GM/İş Geliştirme: nitelendirme"]
    O -->|nitelikli| X["Görüşme & süreç"]
    O -->|değil| Y["Besleme e-postası"]
```

---

## 4. Karar Hakları (RAPID özeti)
- **R (Recommend):** Tolga — strateji ve kanal önerilerini hazırlar.
- **A (Agree):** GM — bütçe ve kırmızı çizgi uyumu.
- **P (Perform):** Uzman adayı + Grafiker — uygulama.
- **I (Input):** Operasyon/Şube — saha gerçeği, içerik.
- **D (Decide):** GM — nihai karar; Tolga tanımlı bütçe içinde operasyonel kararları verir.

Tek **Karar Günlüğü (Decision Log)** tutulur; her önemli karar + karşı görüş kaydedilir (silinemez).

---

*Önceki: [01 · Vizyon-Misyon-Değerler](01-vizyon-misyon-degerler.md) · Sonraki: [03 · Pazar Analizi →](03-pazar-analizi.md)*

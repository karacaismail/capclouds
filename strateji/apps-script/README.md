# Apps Script — sürücü hücreleri renklendir

Strateji panosundaki ECharts grafiklerini besleyen hücreler, E-Tablonun
**"CANLI VERİ (grafik kaynağı)"** sekmesindeki `deger` (C) sütunudur (Gantt için `süre`/D de dahil).

Google Sheets MCP araçları belirli bir hücrenin arka plan/yazı rengini değiştiremediği için,
bu hücreleri **koyu yeşil zemin + limon sarısı yazı + bold** yapmak üzere tek seferlik bir
Apps Script kullanılır.

## Çalıştırma (30 sn)
1. [E-Tabloyu aç](https://docs.google.com/spreadsheets/d/18HI2tVtR0aUHzhFIlm9JxcBNTEYeAu2WmxonDQmi4bU/edit) → **Uzantılar → Apps Script**.
2. [`renklendir-canli-hucreler.gs`](renklendir-canli-hucreler.gs) içeriğini yapıştır, kaydet.
3. Fonksiyon listesinden **`renklendirCanliHucreler`** → **Çalıştır**. İzin iste → izin ver.
4. Bitince sürücü hücreler yeşil/limon/bold olur.

> Menüden çalıştırmak istersen: betikteki `onOpen` sayesinde E-Tabloyu yeniden açtığında
> üstte **"Cups & Clouds → Sürücü hücreleri renklendir"** menüsü belirir.

## Sonrası
Bu hücrelerdeki sayıları değiştir → strateji panosundaki tablo ve grafik
(pasta payı / çubuk uzunluğu) **canlı** güncellenir (sayfa 60 sn'de bir tazeler; "Yenile" ile anında).

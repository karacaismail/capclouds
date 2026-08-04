# Cups & Clouds Strateji Sistemi — Mevcut Durum Matrisi (harvest)

> Tarih: 2026-08-04 · Bu bir **durum tespiti/çalışma belgesidir** (stratejik içerik kanoniği değildir).
> Amaç: eksikleri gizlemeden ortaya koymak ve tamamlama sırasını belirlemek.
> Kural: commit/push/deploy YOK (Codex bağımsız doğrulamasından sonra). Tek yazar. Diskteki ilerleme harvest edildi.

## A. Envanter (gerçek ölçüm)

| Alan | Mevcut | Hedef | Durum |
|---|---|---|---|
| Kanonik veri kaynağı | `dokumanlar.json` (özet + **ham HTML string** detay) | Şemalı, bölünmüş JSON + **structured block** | ❌ HTML string yasak → yeniden modellenecek |
| Doküman sayısı | 23 madde JSON + 25 md | Kanonik JSON (md kaynak değil) | ⚠️ md hâlâ referans |
| 00 Yönetici Özeti | 83 kelime (iskelet) | Tam yapı | ❌ |
| 01 Vizyon/Misyon/Değerler | 686 kelime | Tam yapı + ECA/GATE | ⚠️ içerik var, yapı eksik |
| 02 Org/İK/İş Akışları | 701 kelime + Mermaid | Tam + owner/RACI/gantt | ⚠️ |
| 03 Pazar Analizi | 90 kelime (iskelet) | 3 katman + formül/kaynak/güven/senaryo | ❌ |
| 04 Rakip Analizi | 1665 kelime | Çok boyutlu karşılaştırma + kaynak | ⚠️ iyi, boyut/kaynak zenginleştirilecek |
| 05 Dijital Strateji (genel) | 77 kelime (iskelet) | Huni + kanal orkestrasyonu | ❌ |
| 05a–05m Kanallar (13) | ~40 kelime/dosya (iskelet) | Her kanal tam strateji | ❌ (13 dosya) |
| 06 Finansal Plan | 57 kelime (iskelet) | CAPEX/OPEX/cash-flow/senaryo/ROI/CAC/LTV | ❌ |
| 07 Gap & Unknown-unknowns | 62 kelime (iskelet) | Gap + bilinmeyen-bilinmeyen matrisi | ❌ |
| 08 Zaman Planı | 98 kelime + üst-seviye Gantt | 40 gün (gün-be-gün) + 12 hafta + çeyrek | ❌ |
| 09 Due Diligence | 1217 kelime | Tam risk çerçevesi | ✅ (yapı zenginleştirilecek) |
| ECharts grafik | 7 (finans/pazar/gantt/kanal) | Doküman başına chartSpec | ⚠️ yetersiz |
| Strateji-öncesi ECA/GATE/KIQ/red-team | Web ürününde YOK | Yapıya taşınacak | ❌ |
| Test-first kanıtı | Yok (yalnız manuel) | Şema doğrulama + build + 320px kanıt | ❌ |
| Accordion kontratı | `<button>`, tek-açık ✅ | + aria-controls, hash, reduced-motion, tam içerik | ⚠️ kısmi |
| Canlı Sheets bağlama | Finans/pazar/kanal/gantt canlı ✅ | Tek kaynak + sürücü hücre biçimi | ⚠️ (biçim Apps Script bekliyor) |

## B. Ana eksikler (özet)
1. **Kanonik model yanlış:** JSON içinde ham HTML var; structured block'a (heading/paragraph/list/table/callout/evidence/decision/kpi/gate/timeline/source/chartSpec) geçilecek.
2. **İçerik iskelet:** 00,03,05,06,07,08 + 13 kanal + 40 günlük plan tam değil.
3. **Karar sistemi taşınmadı:** Fact/Estimate/Assumption/Unknown, KIQ/PIR, red-team, premortem, senaryolar, GATE-S, ECA, karar günlüğü web ürününde yok.
4. **Kanıt disiplini yok:** sayısal iddialarda formül/kaynak/tarih/güven/senaryo eksik.
5. **Test-first kanıtı yok:** şema validation + otomatik kontrol yok.

## C. Tamamlama sırası (bu görev)
1. **Mimari:** JSON Schema + TS tipleri + block modeli + manifest + runtime validation.
2. **Renderer + accordion kontratı** (aria/hash/keyboard/reduced-motion, tam structured içerik).
3. **İçerik göçü + yazımı** (parity ile): 01/02/04/09 göç; 03/05/06/07/08 + 13 kanal tam yazım.
4. **Karar katmanı:** ECA/GATE/KIQ/senaryo/red-team blokları her ana dokümana.
5. **Zaman planı:** 40 gün gün-be-gün + 12 hafta + 3/6 ay + 2026 sonu + 2027 çeyrek.
6. **Finans modeli:** CAPEX/OPEX/cash-flow/senaryo/ROI-ROAS-CAC-LTV/franchise ekonomisi.
7. **Sheets tek kaynak** doğrulama + sürücü hücre biçimi (Apps Script).
8. **Test-first kanıt kapıları:** schema validate + tsc + build + 320px overflow=0 + accordion davranış + canlı veri.

> Not: Bu, çok fazlı bir tamamlamadır; her turda gerçek (placeholder'sız) derinlik eklenir, diskte kalır,
> commit/deploy Codex doğrulaması sonrası yapılır. "Tamamlandı" ancak C.8 kapıları kanıtlanınca denir.

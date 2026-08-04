/**
 * Cups & Clouds — Strateji panosu "sürücü hücre" işaretleyici
 * -----------------------------------------------------------
 * ECharts grafiklerini ve tabloları besleyen hücreleri görsel olarak işaretler:
 *   • koyu yeşil zemin (#0b6e2e)
 *   • limon sarısı yazı (#e8ff00)
 *   • kalın (bold)
 *
 * NEDEN Apps Script? Google Sheets MCP araçları belirli bir hücrenin
 * arka plan/yazı rengini değiştiremiyor; bu yüzden bu tek seferlik betik kullanılır.
 *
 * NASIL ÇALIŞTIRILIR (30 saniye):
 *   1) E-Tabloyu aç → Uzantılar (Extensions) → Apps Script.
 *   2) Bu dosyanın içeriğini yapıştır, kaydet.
 *   3) Üstteki fonksiyon listesinden "renklendirCanliHucreler" seç → Çalıştır (Run).
 *   4) İlk çalıştırmada Google izin ister → izin ver.
 * Bittiğinde "CANLI VERİ (grafik kaynağı)" sekmesindeki değer hücreleri
 * yeşil/limon/bold olur. Bu hücreleri değiştirdikçe panodaki grafik+tablo güncellenir.
 */

var SPREADSHEET_ID = '18HI2tVtR0aUHzhFIlm9JxcBNTEYeAu2WmxonDQmi4bU';
var SHEET_NAME = 'CANLI VERİ (grafik kaynağı)';
var YESIL = '#0b6e2e';   // koyu yeşil
var LIMON = '#e8ff00';   // limon sarısı
var BASLIK_BG = '#241a13';
var BASLIK_FG = '#f5efe6';

function renklendirCanliHucreler() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) throw new Error('Sekme bulunamadı: ' + SHEET_NAME);

  var last = sh.getLastRow();
  if (last < 2) throw new Error('Veri yok.');

  // C sütunu (deger) = tüm grafiklerin ana sürücü hücreleri
  sh.getRange(2, 3, last - 1, 1)
    .setBackground(YESIL).setFontColor(LIMON).setFontWeight('bold');

  // D sütunu = yalnız "gantt" satırlarında 'süre' de bir sürücüdür
  var gruplar = sh.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < gruplar.length; i++) {
    if (String(gruplar[i][0]).trim() === 'gantt') {
      sh.getRange(i + 2, 4, 1, 1)
        .setBackground(YESIL).setFontColor(LIMON).setFontWeight('bold');
    }
  }

  // Başlık satırı (görsel düzen)
  sh.getRange(1, 1, 1, 4)
    .setBackground(BASLIK_BG).setFontColor(BASLIK_FG).setFontWeight('bold');

  SpreadsheetApp.flush();
  SpreadsheetApp.getUi && SpreadsheetApp.getUi().alert('Sürücü hücreler işaretlendi ✓');
}

/**
 * (Opsiyonel) E-Tabloyu her açtığında menüye "Cups & Clouds" ekler.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Cups & Clouds')
    .addItem('Sürücü hücreleri renklendir', 'renklendirCanliHucreler')
    .addToUi();
}

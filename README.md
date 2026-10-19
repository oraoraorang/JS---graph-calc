# GraphCalc – Grafik Hesap Makinesi

Desmos'tan esinlenilmiş, tarayıcıda çalışan küçük bir grafik hesap makinesi. İfadeleri (`y = a * sin(x)`) yazarsınız, grafik anında çizilir; **kaydırıcılar (slider)** ile parametreleri canlı olarak değiştirebilirsiniz. Veriler tarayıcının **LocalStorage**'ında saklanır, sayfa yenilense de kaybolmaz.



**Canlı demo:** _(Netlify linkini buraya ekleyin)_

## Özellikler

- Birden fazla ifadeyi aynı grafikte, farklı renklerle çizme
- Kaydırıcı ekleme (ad, değer, min, max, adım) ve ifadelerde kullanma (`a`, `b`, `c` ...)
- Fare tekerleği ile yakınlaştırma, sürükleyerek kaydırma, **Reset view** ile başlangıç görünümüne dönme
- Yakınlaştırma/kaydırma durumu, kaydırıcı veya ifade değişse de korunur
- İfadeyi gizleme/gösterme, renk değiştirme
- Hatalı ifadelerde anlaşılır hata mesajı (bilinmeyen değişken, sözdizimi hatası vb.)
- Mobil uyumlu düzen

## Proje Gereksinimleriyle Eşleşme

| Gereksinim | Uygulamadaki karşılığı |
|------------|------------------------|
| **Ekle**       | `+ Expression` ve `+ Slider` butonları |
| **Listele**    | Sol paneldeki ifade ve kaydırıcı listesi |
| **Güncelle**   | İfade metnini/rengini/görünürlüğünü, kaydırıcı adını/değerini/min-max-adımını düzenleme |
| **Sil**        | Her satırdaki çöp kutusu butonu |
| Kütüphane      | jQuery (+ math.js ve function-plot) |
| CSS            | Tailwind CSS (CDN) |
| Veri saklama   | LocalStorage |
| Klasörler      | `js/components`, `js/pages`, `js/interfaces` |

## Kullanılan Teknolojiler

| Teknoloji | Amaç |
|-----------|------|
| [jQuery 3.7.1](https://jquery.com/) | DOM işlemleri ve olaylar |
| [Tailwind CSS 4 (browser build)](https://tailwindcss.com/) | Arayüz stilleri (CDN, derleme adımı yok) |
| [math.js 14](https://mathjs.org/) | İfadeleri ayrıştırma ve hesaplama |
| [function-plot 1.25](https://mauriciopoppe.github.io/function-plot/) | Grafik çizimi (D3 tabanlı) |
| LocalStorage | Verilerin tarayıcıda saklanması |

Tüm kütüphaneler sabit sürümle CDN'den yüklenir; bu yüzden uygulamanın çalışması için internet bağlantısı gerekir.

## Kurulum ve Çalıştırma

Proje derleme gerektirmez; statik dosyalardan oluşur. Ancak JavaScript dosyaları **ES modülü** olarak yüklendiği için `index.html` dosyasına çift tıklayarak (`file://`) değil, bir yerel sunucu üzerinden açılmalıdır.

```bash
# Projeyi indirin
git clone <repo-adresi>
cd graphcalc

# Yerel sunucuyu başlatın (Node.js gerekir)
npm start
```

Terminalde yazan adresi (genellikle `http://localhost:3000`) tarayıcıda açın.

Alternatifler:

```bash
python3 -m http.server 8000      # sonra http://localhost:8000
```

veya VS Code'da **Live Server** eklentisiyle `index.html` dosyasını açın.

## Kullanım

1. İlk açılışta bir kaydırıcı (`a`) ve bir ifade (`y = a * sin(x)`) örnek olarak gelir. `a` kaydırıcısını oynatın.
2. **+ Expression** ile yeni ifade ekleyin. `y =` yazmak isteğe bağlıdır: `x^2`, `y = x^2` ve `f(x) = x^2` aynıdır.
3. **+ Slider** ile yeni kaydırıcı ekleyin (`a`, `b`, `c`... adları otomatik verilir). Adını değiştirip ifadelerde kullanın: `y = b * cos(x) + a`.
4. Grafiği fare tekerleğiyle yakınlaştırın, sürükleyerek kaydırın.

### Desteklenen ifadeler

- İşlemler: `+ - * / ^`, parantez, kapalı çarpma (`2x`)
- Fonksiyonlar: `sin, cos, tan, sqrt, abs, log, exp, ...` ve math.js'in diğer sayısal fonksiyonları
- Sabitler: `pi`, `e`
- Kaydırıcı adları: `x`, `y` ve math.js'te zaten tanımlı adlar (`e`, `i`, `pi`, `sin` ...) kullanılamaz.

### Bilinen sınırlamalar

- Yalnızca `y = f(x)` biçimi desteklenir (denklem, eşitsizlik, parametrik ve kutupsal eğriler yoktur).
- Reel olmayan (karmaşık) sonuç veren noktalar çizilmez; grafikte boşluk olarak görünür (örn. `sqrt(x)` için `x < 0`).
- Veriler yalnızca o tarayıcıda ve o cihazda saklanır.

## Proje Yapısı

```
graphcalc/
├── index.html
├── css/styles.css
├── docs/screenshot.png
└── js/
    ├── main.js                    # Giriş noktası
    ├── pages/
    │   └── GraphPage.js           # Sayfa: bileşenleri ve servisleri birbirine bağlar
    ├── components/
    │   ├── ItemList.js            # Liste (Listele)
    │   ├── ExpressionItem.js      # İfade satırı (Güncelle / Sil)
    │   ├── SliderItem.js          # Kaydırıcı satırı (Güncelle / Sil)
    │   └── GraphView.js           # function-plot ile grafik çizimi
    ├── services/
    │   ├── itemService.js         # CRUD işlemleri (Ekle / Listele / Güncelle / Sil)
    │   ├── storage.js             # LocalStorage okuma/yazma
    │   └── mathService.js         # math.js ile ifade ayrıştırma ve doğrulama
    ├── interfaces/
    │   └── types.js               # JSDoc ile veri tipleri
    └── utils/                     # id, renk paleti, ikonlar
```

## Netlify'a Yayınlama

Derleme adımı olmadığından yayın çok basittir.

**Yöntem 1 – GitHub ile:**
1. Projeyi public bir GitHub reposuna yükleyin.
2. [Netlify](https://app.netlify.com/) → **Add new site → Import an existing project** → GitHub reposunu seçin.
3. **Build command** boş kalsın, **Publish directory** `.` olsun (`netlify.toml` bunu zaten tanımlar). **Deploy** deyin.

**Yöntem 2 – Sürükle bırak:** Netlify'da **Add new site → Deploy manually** ekranına proje klasörünü sürükleyin.

Yayın adresini bu dosyanın üstündeki **Canlı demo** satırına ekleyin.

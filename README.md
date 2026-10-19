# GraphCalc – Grafik Hesap Makinesi

Desmos'tan esinlenilmiş, tarayıcıda çalışan küçük bir grafik hesap makinesi. İfadeleri (`y = a * sin(x)`) yazarsınız, grafik anında çizilir; **kaydırıcılar (slider)** ile parametreleri canlı olarak değiştirebilirsiniz. Veriler tarayıcının **LocalStorage**'ında saklanır, sayfa yenilense de kaybolmaz.



**Canlı demo:** https://elegant-melomakarona-f406c2.netlify.app/

## Özellikler

- Birden fazla ifadeyi aynı grafikte, farklı renklerle çizme
- Kaydırıcı ekleme (ad, değer, min, max, adım) ve ifadelerde kullanma (`a`, `b`, `c` ...)
- Fare tekerleği ile yakınlaştırma, sürükleyerek kaydırma, **Reset view** ile başlangıç görünümüne dönme
- Yakınlaştırma/kaydırma durumu, kaydırıcı veya ifade değişse de korunur
- İfadeyi gizleme/gösterme, renk değiştirme
- Hatalı ifadelerde anlaşılır hata mesajı (bilinmeyen değişken, sözdizimi hatası vb.)
- Mobil uyumlu düzen

  
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

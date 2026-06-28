# Umut Ceyran — Portfolyo

Jamie portfolyo şablonu temel alınarak, Umut Ceyran'ın içeriğiyle yeniden düzenlenmiş
tek sayfalık portfolyo sitesi. **Türkçe varsayılan dil**, sağ üstteki düğmeyle
**İngilizce'ye** geçilebilir.

## Çalıştırma

Site tamamen statiktir; herhangi bir kurulum gerektirmeden çalışır.

- En basit yol: `index.html` dosyasına çift tıklayın.
- Yerel sunucu (önerilir): klasörde bir terminal açıp:
  ```
  python -m http.server 8000
  ```
  ardından tarayıcıda `http://localhost:8000` adresine gidin.
- Yayına almak için klasördeki tüm dosyaları Netlify / GitHub Pages / herhangi bir
  statik barındırıcıya yükleyin.

## Yapı

```
index.html              → Tüm içerik (TR varsayılan, EN data-en içinde)
index.js                → Menü, GSAP animasyonları, dil değiştirici
css/index.css           → Özel stiller (kartlar, sertifikalar, vb.)
css/tailwind-build.css  → Derlenmiş Tailwind (DÜZENLEMEYİN — yeniden derlenir)
css/tailwind.css        → Tailwind girdi dosyası (yeniden derleme için)
assets/images/          → profile.jpeg (ana foto) + profile-alt.jpeg (yedek)
CV.md                   → İndirilebilir CV
tailwind.config.js      → Tailwind ayarları (tw- ön eki)
```

## Dil seçeneği nasıl çalışır?

Her çevrilebilir öğe Türkçe metni içinde, İngilizce karşılığını ise `data-en`
özniteliğinde tutar:

```html
<span data-en="Get in touch">İletişime Geç</span>
```

Yeni bir metin eklerken İngilizcesini de `data-en` ile verin; düğme otomatik
olarak değiştirecektir. Seçilen dil tarayıcıda hatırlanır (localStorage).

## İçeriği düzenleme

Metinleri doğrudan `index.html` içinden değiştirebilirsiniz. Profil fotoğrafını
değiştirmek için `assets/images/profile.jpeg` dosyasını kendi görselinizle
değiştirin (aynı isimle).

## Tailwind'i yeniden derleme

`index.html` içine **yeni bir Tailwind sınıfı** eklerseniz (`tw-...`),
`tailwind-build.css` dosyasını yeniden derlemeniz gerekir:

```
npm install
npm run build:tailwind     # tek seferlik derleme
npm run watch:tailwind     # değişiklikleri izleyerek otomatik derleme
```

Mevcut sınıfları kullandığınız sürece (renk, metin değişikliği, vb.)
yeniden derlemeye gerek yoktur.

---

Tasarım temeli: Jamie Portfolio (Paul / PaulleDemon, MIT). İçerik: Umut Ceyran.

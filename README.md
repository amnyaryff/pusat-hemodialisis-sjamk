# Pusat Hemodialisis SJAMK — laman web

Laman web statik dwibahasa (Bahasa Melayu / English) dibina dengan
[Eleventy](https://www.11ty.dev/). Rekaan mengikut templat hospital "Doctorate" (biru
`#3e8cff` + biru gelap `#07306e`, fon DM Sans). Kandungan diisi dengan **teks contoh
(placeholder)** — cari perkataan `PLACEHOLDER` dan gantikan dengan maklumat sebenar.

Borang temujanji di halaman utama dan medan e-mel di footer ialah borang `mailto:`
(tiada pelayan) — ia hanya membuka aplikasi e-mel pengunjung, sama seperti pautan `tel:` / WhatsApp.

## Keperluan

- Node.js 18 atau lebih baru

## Menjalankan secara tempatan

```bash
npm install        # sekali sahaja
npm run dev        # pelayan pembangunan di http://localhost:8080
npm run build      # hasilkan laman statik ke folder _site/
```

Folder `_site/` ialah keseluruhan laman web — muat naik isinya ke mana-mana hos statik.

## Struktur

```
src/
  _data/          <- semua kandungan boleh edit (JSON)
  _includes/      <- layout + partial (jangan perlu diubah untuk kandungan biasa)
  *.njk           <- halaman
  blog/*.md       <- artikel blog (satu fail = satu artikel)
  assets/         <- CSS, JS, imej
```

## Mengedit kandungan

| Nak ubah… | Edit fail |
|---|---|
| Nama, telefon, WhatsApp, e-mel, alamat, peta, waktu operasi | `src/_data/site.json` |
| Semua teks antara muka + terjemahan BM/EN | `src/_data/i18n.json` (kunci mesti sama di `ms` dan `en`) |
| Statistik (120 pesakit, 10 mesin, kapasiti 60) | `src/_data/stats.json` |
| 2 profil doktor + carta organisasi (10 jawatan) | `src/_data/team.json` |
| Senarai panel yang diterima (nama + nota) | `src/_data/panel.json` — juga muncul sebagai bar bergerak di halaman utama |
| Kadar pengangkutan (RM200 sebulan) | teks dalam `src/_data/i18n.json` — cari `services.transport.priceValue` dan `home.hero.transportNote` |

- **Nombor WhatsApp** guna format antarabangsa tanpa `+` (contoh `60123456789`).
- **Peta Google:** gantikan `mapsUrl` (pautan biasa) dan `mapsEmbed` (pautan `...&output=embed`)
  dengan lokasi sebenar.
- **Gambar:** letak fail dalam `src/assets/img/` dan kemas kini rujukan dalam
  `src/_data/team.json` (`photo`) atau terus dalam halaman.

## Menambah artikel blog (bulanan)

1. Salin mana-mana fail dalam `src/blog/` sebagai templat.
2. Namakan fail dengan tajuk ringkas, contoh `src/blog/jaga-tekanan-darah.md`.
3. Kemas kini bahagian atas fail:

   ```yaml
   ---
   title: "Tajuk artikel anda"
   date: 2026-10-01
   author: "Dr. Nama"
   description: "Ringkasan satu ayat untuk enjin carian."
   ---
   ```

4. Tulis kandungan dalam format Markdown di bawah baris `---`.
5. `npm run build` — artikel akan muncul di `/blog/`, di bahagian "Blog Terkini" pada
   halaman utama, dan dalam suapan `/feed.xml` secara automatik.

## Bahasa

Bahasa Melayu ialah bahasa lalai. Suis **BM | EN** di bar navigasi menukar bahasa dan
pilihan itu disimpan dalam pelayar pengunjung (localStorage key `sjamk-lang`) merentas
semua halaman. Setiap kunci dalam `i18n.json` mesti wujud dalam kedua-dua `ms` dan `en`.
Badan artikel blog kekal dalam bahasa asal ia ditulis.

## Menerbitkan (hos statik percuma)

- **Netlify / Cloudflare Pages:** set build command `npm run build`, publish directory `_site`.
- **GitHub Pages:** jalankan `npm run build` dan terbitkan folder `_site/`.

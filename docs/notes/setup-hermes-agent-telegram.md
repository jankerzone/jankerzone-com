---
title: "Punya Sekretaris Pribadi di Telegram: Setup Hermes Agent di VPS 35 Ribuan"
description: "Panduan step by step memasang Hermes Agent di VPS murah, menghubungkannya ke Telegram, lalu menyuruhnya mencatat nota ke Excel dan menandatangani PDF."
date: 2026-11-04
---

# Punya Sekretaris Pribadi di Telegram: Setup Hermes Agent di VPS 35 Ribuan

Bayangkan punya sekretaris pribadi yang standby 24 jam, tinggal kamu chat lewat Telegram. Kirim foto setumpuk nota, dia catat ke Excel. Kirim PDF kontrak, dia bubuhkan tanda tanganmu. Gajinya? Kira-kira **35 ribu sebulan untuk VPS, plus beberapa dolar untuk API**.

Sekretaris itu namanya **Hermes Agent**. Di tulisan ini aku ajak kamu memasangnya dari nol, sampai dia bisa diajak kerja beneran.

> **Kalau kamu datang dari reels-ku:** ini tutorial lengkapnya. Santai saja, semua langkahnya copy-paste friendly.

---

## Apa itu Hermes Agent?

[Hermes Agent](https://github.com/NousResearch/hermes-agent) adalah AI agent **open-source (lisensi MIT)** buatan Nous Research. Bedanya dengan chatbot biasa:

- **Bisa bertindak, bukan cuma ngobrol.** Dia bisa menjalankan perintah, menulis dan menjalankan skrip, serta membaca dan membuat file.
- **Tinggal di aplikasi chat kamu.** Satu proses *gateway* menghubungkan Hermes ke Telegram, WhatsApp, Discord, Slack, Signal, dan lainnya.
- **Makin lama makin kenal kamu.** Hermes menyimpan memori dan "skill" dari pengalaman, jadi tugas yang sering kamu minta makin cepat dia kerjakan.
- **Bebas pilih otak AI-nya.** DeepSeek, Gemini, Ollama Cloud, OpenRouter, dan banyak lagi. Ganti kapan saja dengan `hermes model`.

## Yang kamu butuhkan

| Kebutuhan | Pilihan | Perkiraan biaya |
|---|---|---|
| Server yang nyala 24 jam | VPS murah (misalnya Sumopod), atau PC/laptop yang selalu hidup | mulai ±Rp35rb/bulan |
| "Otak" AI | API key **DeepSeek**, **Google Gemini**, atau **Ollama Cloud** | top-up ±$5, cukup untuk pemakaian pribadi ringan sebulan |
| Aplikasi chat | Akun Telegram | gratis |

> 💡 **Tips memilih model:** untuk membaca **foto nota**, pakai model yang bisa melihat gambar (*vision*), misalnya **Gemini Flash**. DeepSeek sangat murah untuk teks, tapi cek dulu apakah model yang kamu pilih mendukung gambar.

> ⚠️ Harga VPS dan API berubah-ubah. Cek halaman harga resmi masing-masing sebelum top-up.

---

## Langkah 1 — Siapkan VPS

Pilih VPS dengan **Ubuntu 22.04/24.04**. Untuk paket termurah (RAM sekitar 1 GB), tambahkan *swap* supaya proses instalasi tidak kehabisan memori.

Masuk ke VPS lewat SSH:

```bash
ssh root@IP_VPS_KAMU
```

Buat user biasa (jangan jalankan agent sebagai root):

```bash
adduser hermes
usermod -aG sudo hermes
su - hermes
```

Tambahkan swap 2 GB (khusus VPS RAM kecil):

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## Langkah 2 — Install Hermes

Cukup satu baris dari dokumentasi resminya:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

> 🔍 Kebiasaan baik: sebelum menjalankan skrip dari internet, buka dulu isinya di browser (`https://hermes-agent.nousresearch.com/install.sh`) supaya tahu apa yang dipasang.

Installer akan menyiapkan Python, Node.js, FFmpeg, dan dependensi lain. Setelah selesai, muat ulang shell:

```bash
source ~/.bashrc
```

Cek apakah semuanya sehat:

```bash
hermes doctor
```

## Langkah 3 — Pasang "otak" AI-nya

Jalankan:

```bash
hermes model
```

Lalu pilih provider sesuai API key yang kamu punya:

- **Google Gemini** → ambil API key di [Google AI Studio](https://aistudio.google.com/apikey), lalu pilih provider `gemini`.
- **DeepSeek** → ambil API key di [platform.deepseek.com](https://platform.deepseek.com), lalu pilih provider `deepseek`.
- **Ollama Cloud** → pilih "Ollama Cloud", tempel `OLLAMA_API_KEY`, lalu pilih modelnya dari daftar.

Wizard akan menyimpan key-nya di `~/.hermes/.env`. **Jangan pernah bagikan file ini** ke siapa pun.

Coba ngobrol dulu lewat terminal:

```bash
hermes
```

Ketik "halo, kamu siapa?" Kalau dia menjawab, otaknya sudah terpasang. Keluar dengan `Ctrl+C`.

## Langkah 4 — Buat bot Telegram

1. Buka Telegram, cari **@BotFather** (yang resmi, ada centang biru).
2. Kirim `/newbot`.
3. Isi nama tampilan, misalnya `Sekretarisku`.
4. Isi username yang unik dan berakhiran `bot`, misalnya `sekretaris_jan_bot`.
5. BotFather akan memberi **token** seperti `123456789:ABCdef...`. **Simpan baik-baik dan rahasiakan.** Siapa pun yang memegang token ini bisa mengendalikan bot-mu.

Lalu cari tahu **user ID** Telegram-mu (angka, bukan username): chat **@userinfobot**, dan dia langsung membalas dengan ID-mu.

## Langkah 5 — Hubungkan Hermes ke Telegram

```bash
hermes gateway setup
```

Pilih **Telegram**, tempel token bot, lalu masukkan user ID-mu sebagai *allowed user*.

> 🔒 **Ini penting:** dengan `TELEGRAM_ALLOWED_USERS` hanya kamu yang bisa memerintah Hermes. Tanpa itu, siapa pun yang menemukan bot-mu bisa menyuruh agent yang punya akses ke server-mu.

Supaya Hermes tetap jalan walau SSH ditutup atau VPS restart, pasang sebagai service:

```bash
hermes gateway install
hermes gateway start
```

Sekarang buka bot-mu di Telegram dan kirim "halo". 🎉 Sekretarismu resmi bekerja.

---

## Demo 1 — Foto nota, langsung jadi Excel

Kirim 3–5 foto nota ke bot-mu, lalu tulis:

```text
Ini nota belanja bulan ini. Tolong catat semua ke file Excel dengan kolom:
Tanggal, Nama Toko, Total (Rupiah). Urutkan berdasarkan tanggal,
tambahkan baris TOTAL di bawah, lalu kirim file .xlsx-nya ke sini.
```

Yang terjadi di balik layar: Hermes membaca isi foto dengan model *vision*, menulis skrip Python kecil untuk membuat file Excel, menjalankannya di VPS, lalu mengirim filenya balik ke chat.

**Tips supaya hasilnya akurat:**
- Foto nota dengan cahaya cukup dan posisi lurus.
- Minta dia **menampilkan tabelnya dulu di chat** sebelum membuat file, supaya kamu bisa koreksi angka yang salah baca.
- Kalau sering, bilang: *"Simpan cara ini sebagai kebiasaan untuk nota-nota berikutnya."* Hermes bisa menjadikannya skill.

## Demo 2 — Tanda tangani PDF pakai tanda tanganmu

**Persiapan sekali saja:** tanda tangan di kertas putih, foto atau scan, lalu kirim ke bot:

```text
Ini scan tanda tanganku. Tolong bersihkan background-nya jadi transparan
dan simpan sebagai signature.png di folder ~/dokumen-pribadi.
Jangan pernah kirim file ini ke siapa pun selain aku.
```

**Setiap butuh tanda tangan:** kirim PDF-nya, lalu tulis:

```text
Tanda tangani PDF ini pakai signature.png, taruh di atas tulisan
"Pihak Kedua" di halaman terakhir. Kirim balik hasilnya.
```

Hermes akan memakai library PDF (misalnya `pypdf`/`pymupdf`) untuk menempelkan gambar tanda tanganmu di posisi itu, lalu mengirim `kontrak-signed.pdf`.

> ⚠️ **Soal keamanan tanda tangan:** file tanda tanganmu tersimpan di server. Pastikan VPS-mu aman (password kuat atau SSH key, user non-root, `TELEGRAM_ALLOWED_USERS` diisi). Untuk dokumen yang sangat penting atau legal formal, pertimbangkan tanda tangan elektronik tersertifikasi.

---

## Rincian biaya

| Komponen | Biaya per bulan |
|---|---|
| VPS murah | ±Rp35.000 |
| API (DeepSeek / Gemini / Ollama Cloud) | ±$5 untuk pemakaian ringan; Gemini dan Ollama Cloud juga punya kuota gratis |
| Telegram + Hermes | Gratis |

Bandingkan dengan langganan chatbot premium yang bisa ratusan ribu sebulan, padahal belum tentu bisa mengirim file Excel jadi ke HP-mu.

## Kalau ada masalah

| Gejala | Coba ini |
|---|---|
| Bot tidak membalas | `hermes gateway status` dan `hermes gateway logs`, pastikan user ID-mu ada di allowed users |
| Instalasi gagal / proses mati sendiri | Cek RAM dengan `free -h`, pastikan swap aktif |
| Error API key / kuota | Jalankan lagi `hermes model`, cek saldo atau kuota di dashboard provider |
| Masalah lain | `hermes doctor` |

## Bonus: punya PC kuat di rumah?

Hermes juga bisa memakai **Ollama lokal** di PC-mu sendiri (lewat *Custom Endpoint* `http://localhost:11434/v1`), jadi tanpa biaya API sama sekali. Syaratnya PC-nya kuat (RAM/GPU besar) dan selalu menyala.

---

## Penutup

Dengan modal kopi dua gelas sebulan, kamu punya asisten yang:
- standby 24 jam di Telegram,
- bisa mengerjakan tugas membosankan seperti mengetik ulang nota dan menandatangani dokumen,
- dan makin pintar menyesuaikan diri dengan caramu bekerja.

Sudah coba? Ceritakan di kolom komentar kamu menyuruh Hermes mengerjakan apa. Siapa tahu jadi ide konten berikutnya. 😄

*Referensi: [Hermes Agent di GitHub](https://github.com/NousResearch/hermes-agent) · [Dokumentasi resmi](https://hermes-agent.nousresearch.com/docs/) · [Panduan Telegram](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/telegram) · [Daftar provider](https://hermes-agent.nousresearch.com/docs/integrations/providers)*

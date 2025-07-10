# BOT-TRADING

Bot trading ini kini dilengkapi server Express dan dashboard web sederhana.

## Instalasi dan Menjalankan

1. Pastikan Node.js versi 18 atau lebih baru telah terpasang.
2. Salin `.env.example` menjadi `.env` lalu isi variabel yang dibutuhkan, terutama `DASHBOARD_TOKEN`.
3. Jalankan `npm install` untuk mengunduh seluruh dependensi.
4. Mulai aplikasi dengan perintah:

   ```bash
   npm start
   ```

   Perintah di atas menjalankan bot WhatsApp sekaligus server dashboard. Secara
   default dashboard tersedia di `http://localhost:3000` atau port yang diatur
   melalui variabel `PORT` pada `.env`.

Seluruh permintaan ke dashboard atau API harus menyertakan header:

```
Authorization: Bearer <DASHBOARD_TOKEN>
```

## Fitur Dashboard

- **Dashboard utama** – menampilkan status bot.
- **Orders** – melihat pending order dan posisi live.
- **Activity Log** – placeholder log aktivitas.
- **Manual Control** – menjalankan perintah bot secara manual.
- **Scheduler** – halaman penjadwalan (placeholder).
- **Prompt Manager** – mengelola file prompt.
- **Settings** – mengubah konfigurasi `.env` dan berkas di `config/`.
- **Recipients Management** – kelola daftar penerima notifikasi.

Semua halaman masih sederhana dan dapat dikembangkan sesuai kebutuhan.

## REST API

Setiap endpoint di bawah ini memerlukan header `Authorization: Bearer <DASHBOARD_TOKEN>`:

- `GET /status` – status terkini bot.
- `GET /orders` – daftar pending order dan posisi aktif.
- `POST /command` – menjalankan perintah bot, body `{ "command": "<cmd>" }`.
- `GET /settings` – membaca file `.env` dan konfigurasi di folder `config/`.
- `POST /settings` – menyimpan pengaturan yang dikirim pada body.
- `GET /prompts` – menampilkan daftar berkas prompt atau isi berkas jika memakai parameter `file`.
- `POST /prompts` – menyimpan berkas prompt, body `{ "file": "name.txt", "content": "..." }`.

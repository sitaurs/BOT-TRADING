# BOT-TRADING

Bot trading ini kini dilengkapi server Express dan dashboard web sederhana.

## Menjalankan

1. Salin `.env.example` menjadi `.env` dan isi `DASHBOARD_TOKEN` dengan token rahasia.
2. Jalankan `npm install` untuk mengunduh dependensi.
3. Mulai aplikasi dengan:
   ```bash
   npm start
   ```
   Perintah tersebut akan menjalankan bot WhatsApp sekaligus server web.

Dashboard dapat diakses melalui `http://localhost:3000` dengan menyertakan header:

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

Tampilan dashboard memakai tema gradasi ungu-biru dengan efek blur dan animasi sederhana sehingga lebih enak dipandang. Halaman-halaman tersebut masih dapat dikembangkan lebih lanjut sesuai kebutuhan.

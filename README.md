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

## Panduan Lengkap Deploy di VPS

Berikut contoh langkah instalasi pada server berbasis Ubuntu. Sesuaikan perintah
jika Anda menggunakan distro lain.

### 1. Persiapan Server

```bash
# pasang git dan Node.js 18 LTS
sudo apt update && sudo apt install -y git curl
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Mengunduh Aplikasi

```bash
# clone repository
git clone https://github.com/username/BOT-TRADING.git
cd BOT-TRADING
npm install
```

### 3. Konfigurasi `.env`

Salin berkas contoh dan isi sesuai kredensial Anda.

```bash
cp .env.example .env
```

Setidaknya ubah `DASHBOARD_TOKEN` dengan nilai rahasia. Token ini digunakan
untuk mengakses dashboard dan REST API. Selain itu sesuaikan juga kunci API
lain seperti `GEMINI_API_KEY`, `CHART_IMG_KEY_x`, dan parameter broker.

### 4. Menjalankan Bot

Jalankan perintah berikut untuk memulai bot dan server dashboard:

```bash
npm start
```

Secara bawaan dashboard aktif pada port `3000`. Anda dapat mengubah port melalui
variabel `PORT` pada `.env`.

### 5. Menjalankan Otomatis dengan `systemd`

Agar bot otomatis aktif saat server menyala, buat file
`/etc/systemd/system/bot-trading.service` seperti berikut:

```ini
[Unit]
Description=Bot Trading
After=network.target

[Service]
WorkingDirectory=/path/to/BOT-TRADING
ExecStart=/usr/bin/npm start
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Aktifkan layanan dengan:

```bash
sudo systemctl enable --now bot-trading
```

### 6. Konfigurasi Nginx Reverse Proxy

Contoh konfigurasi dasar agar domain mengarah ke dashboard di port 3000:

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Simpan sebagai `/etc/nginx/sites-available/bot-trading` lalu aktifkan dengan
`ln -s /etc/nginx/sites-available/bot-trading /etc/nginx/sites-enabled/` dan
`sudo nginx -s reload`.

#### Bila Port 80/443 Sudah Digunakan

Apabila server telah memiliki aplikasi lain pada port tersebut, jalankan Nginx
pada port berbeda (misal 8080) atau manfaatkan konfigurasi _reverse proxy_ pada
aplikasi utama. Contoh jika Nginx hanya sebagai _proxy_ tambahan:

```nginx
server {
    listen 8080;
    server_name example.com;
    location /bot/ {
        proxy_pass http://localhost:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 7. Alternatif Menggunakan Apache

Aktifkan modul `proxy` dan `proxy_http` kemudian tambahkan konfigurasi berikut
pada virtual host Anda:

```apache
ProxyPass "/" "http://localhost:3000/"
ProxyPassReverse "/" "http://localhost:3000/"
```

Pastikan port yang digunakan tidak bentrok dengan aplikasi lain. Setelah
konfigurasi selesai, muat ulang layanan web server Anda.


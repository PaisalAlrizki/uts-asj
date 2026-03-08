DOKUMENTASI PROYEK UTS - ADMINISTRASI SISTEM JARINGAN
Implementasi Full-Stack Docker (Microservices)

Tugas ini berisi implementasi jaringan server menggunakan Docker. Di dalam proyek ini ada 4 layanan utama yang saling terhubung dalam satu network 'asj-net'.

1. DAFTAR LAYANAN & PORT
- Website (Nginx)   : Port 3000 (Frontend statis)
- API (Node.js)     : Port 8080 (Backend logic & koneksi database)
- Database (Postgres): Port 5432 (Penyimpanan data relasional)
- MinIO (Storage)    : Port 9000 & 9001 (S3-Compatible Object Storage)

2. CARA INSTALASI DI DEBIAN 12
Pastikan Docker dan Docker Compose sudah terpasang.
1. Clone repo: git clone https://github.com/paisal-repository/proyek-asj.git
2. Masuk folder: cd proyek-asj
3. Jalankan sistem: docker compose up -d --build

3. KONFIGURASI PENTING (.env)
Semua koneksi (DB_USER, DB_PASS, dll) sudah diatur secara otomatis di file .env. 
Keamanan data terjaga karena kredensial tidak ditulis langsung di kode program.

4. MAINTENANCE & TROUBLESHOOTING
- Jika database error 'Auth Failed' (masalah sinkronisasi volume):
  docker compose down -v
  docker compose up -d --build
  (Catatan: Flag -v akan mereset volume agar password baru terdeteksi).

- Untuk memantau aktifitas API atau debugging:
  docker compose logs -f api

5. AKSES LAYANAN (IP DEBIAN)
- Web Interface  : http://192.168.1.30:3000
- API Users      : http://192.168.1.30:8080/users
- MinIO Console  : http://192.168.1.30:9001 (User: icall, Pass: icall.2006)

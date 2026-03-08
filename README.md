PROYEK UTS ASJ - DOCKER FULLSTACK

Tugas ini berisi implementasi jaringan server menggunakan Docker. Di dalam proyek ini ada 4 layanan utama yang saling terhubung: Frontend, Backend API, Database, dan Object Storage.

Layanan & Port:
- Website (Nginx): Port 3000
- API (Node.js): Port 8080
- Database (Postgres): Port 5432
- MinIO (Storage): Port 9000 & 9001

Cara Install di Debian:
1. Clone repo ini:
   git clone https://github.com/paisal-repository/proyek-asj.git
2. Masuk ke folder:
   cd proyek-asj
3. Jalankan docker:
   docker compose up -d --build

Konfigurasi Penting:
Semua koneksi sudah diatur di file .env. Kalau database error 'Auth Failed', 
jalankan perintah ini buat reset volume:
docker compose down -v
docker compose up -d --build

Akses lewat browser di IP Debian:
- Web: http://192.168.1.30:3000
- API: http://192.168.1.30:8080/users
- MinIO: http://192.168.1.30:9001 (User: icall, Pass: icall.2006)

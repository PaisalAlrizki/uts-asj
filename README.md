Tugas UTS Administrasi Sistem Jaringan - Genap 2026
Nama: Paisal Alrizki
Kelas: XII TKJ

Sistem ini menggunakan arsitektur microservices yang dijalankan dengan Docker.

Daftar Service dan Port:
- Frontend: Nginx (Port 3000)
- Backend API: Node.js Express (Port 8080)
- Database: PostgreSQL
- Object Storage: MinIO (Port 9000)

Cara Menjalankan:
1. Pastikan docker-compose sudah terinstall.
2. Jalankan perintah: docker-compose up --build
3. Tunggu proses build dan start selesai.

Fitur:
- CRUD User (Create, Read, Update, Delete).
- Upload foto profil ke MinIO storage.
- Validasi email unik (pop-up error jika email sudah ada).
- Cek metadata JSON: http://localhost:8080/users

Tugas UTS Administrasi Sistem Jaringan - Genap 2026
Nama: Paisal Alrizki
Kelas: XII TKJ

Sistem ini dibuat menggunakan arsitektur microservices yang dijalankan di dalam kontainer Docker.

Daftar Service dan Port:
- Frontend: Menggunakan Nginx di port 3000
- Backend API: Node.js Express di port 8080
- Database: PostgreSQL untuk simpan data user
- Object Storage: MinIO di port 9000 untuk simpan file gambar

Cara Menjalankan:
1. Pastikan docker dan docker-compose sudah terinstall di sistem.
2. Masuk ke folder proyek.
3. Jalankan perintah: docker-compose up --build
4. Tunggu sampai semua log service muncul di terminal.

Fitur:
- CRUD User (Tambah, Tampil, Edit, Hapus).
- Upload foto profil langsung ke MinIO.
- Validasi email (tidak bisa input email yang sama).
- Cek metadata JSON bisa di alamat: http://localhost:8080/users

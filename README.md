# UTS Administrasi Sistem Jaringan 2026
Aplikasi CRUD User berbasis Microservices dengan Docker Compose.

## 🚀 Cara Menjalankan Proyek
Cukup jalankan satu perintah ini di terminal:
```bash
docker-compose up --build
```


## 🌐 Akses Layanan
* **Frontend:** http://localhost:3000
* **API Metadata:** http://localhost:8080/users
* **MinIO Storage:** http://localhost:9000

## ✅ Fitur yang Tersedia
1. **CRUD Lengkap:** Tambah, Tampil, Edit, dan Hapus data pengguna.
2. **Validasi:** Peringatan "Opps! Email telah digunakan" jika email duplikat.
3. **Persistensi:** Data tersimpan di PostgreSQL dan foto tersimpan di MinIO.

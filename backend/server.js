const express = require('express');
const multer = require('multer');
const Minio = require('minio'); // Gunakan cara ini agar 'Minio.Client' terbaca
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. KONEKSI DATABASE
const sequelize = new Sequelize(
  process.env.DB_NAME || 'asj_db',
  process.env.DB_USER || 'paisal',
  process.env.DB_PASSWORD || 'password123',
  {
    host: process.env.DB_HOST || 'db',
    dialect: 'postgres',
    logging: false // Biar terminal nggak penuh log SQL
  }
);

// 2. MODEL USER
const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    photoUrl: DataTypes.STRING,
    photoName: DataTypes.STRING
});

// 3. KONEKSI MINIO
const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'minio',
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ROOT_USER || 'icall',
    secretKey: process.env.MINIO_ROOT_PASSWORD || 'icall.2006'
});

// INIT BUCKET MINIO
async function initMinio() {
    const bucket = 'photos';
    try {
        const exists = await minioClient.bucketExists(bucket);
        if (!exists) {
            await minioClient.makeBucket(bucket);
            const policy = {
                Version: "2012-10-17",
                Statement: [{
                    Effect: "Allow",
                    Principal: { AWS: ["*"] },
                    Action: ["s3:GetObject"],
                    Resource: [`arn:aws:s3:::${bucket}/*`]
                }]
            };
            await minioClient.setBucketPolicy(bucket, JSON.stringify(policy));
            console.log("Bucket 'photos' created with public policy.");
        }
    } catch (e) { console.error("Minio Init Error:", e.message); }
}

const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });

// --- ROUTES ---

app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({ order: [['createdAt', 'DESC']] });
        res.json(users);
    } catch (e) { res.status(500).send(e.message); }
});

app.post('/users', upload.single('photo'), async (req, res) => {
    try {
        const { name, email } = req.body;
        const fileName = `${Date.now()}-${req.file.originalname}`;
        await minioClient.putObject('photos', fileName, req.file.buffer);
        
        // Gunakan IP Debian atau hostname container
        const photoUrl = `http://192.168.1.30:9000/photos/${fileName}`;
        const user = await User.create({ name, email, photoUrl, photoName: fileName });
        res.status(201).json(user);
    } catch (e) { res.status(400).send(e.message); }
});

app.put('/users/:id', upload.single('photo'), async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).send("User tidak ditemukan");

        let { name, email } = req.body;
        let updateData = { name, email };

        if (req.file) {
            // Hapus foto lama di MinIO sebelum upload yang baru
            try { await minioClient.removeObject('photos', user.photoName); } catch(err) {}
            
            const fileName = `${Date.now()}-${req.file.originalname}`;
            await minioClient.putObject('photos', fileName, req.file.buffer);
            updateData.photoUrl = `http://192.168.1.30:9000/photos/${fileName}`;
            updateData.photoName = fileName;
        }

        await user.update(updateData);
        res.json(user);
    } catch (e) { res.status(400).send(e.message); }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            try { await minioClient.removeObject('photos', user.photoName); } catch(err) {}
            await user.destroy();
        }
        res.json({ message: "Deleted" });
    } catch (e) { res.status(500).send(e.message); }
});

// JALANKAN SEMUA
sequelize.sync().then(() => {
    initMinio().then(() => {
        app.listen(8080, '0.0.0.0', () => {
            console.log("Server API ASJ Ready di port 8080");
        });
    });
});

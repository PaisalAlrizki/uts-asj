const express = require('express');
const multer = require('multer');
const { Client } = require('minio');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const sequelize = new Sequelize('user_db', 'admin', 'password123', {
    host: 'db',
    dialect: 'postgres',
    logging: false
});

const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    photoUrl: DataTypes.STRING,
    photoName: DataTypes.STRING
});

const minioClient = new Client({
    endPoint: 'minio',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin123'
});

async function initMinio() {
    const bucket = 'photos';
    try {
        if (!(await minioClient.bucketExists(bucket))) {
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
        }
    } catch (e) { console.error(e.message); }
}

const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });

app.get('/users', async (req, res) => {
    const users = await User.findAll({ order: [['createdAt', 'DESC']] });
    res.json(users);
});

app.post('/users', upload.single('photo'), async (req, res) => {
    try {
        const { name, email } = req.body;
        const fileName = `${Date.now()}-${req.file.originalname}`;
        await minioClient.putObject('photos', fileName, req.file.buffer);
        const photoUrl = `http://${req.hostname}:9000/photos/${fileName}`;
        const user = await User.create({ name, email, photoUrl, photoName: fileName });
        res.status(201).json(user);
    } catch (e) { res.status(400).send(e.message); }
});

// ENDPOINT EDIT (UPDATE)
app.put('/users/:id', upload.single('photo'), async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).send("User tidak ditemukan");

        let { name, email } = req.body;
        let updateData = { name, email };

        if (req.file) {
            const fileName = `${Date.now()}-${req.file.originalname}`;
            await minioClient.putObject('photos', fileName, req.file.buffer);
            updateData.photoUrl = `http://${req.hostname}:9000/photos/${fileName}`;
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
            await minioClient.removeObject('photos', user.photoName);
            await user.destroy();
        }
        res.json({ message: "Deleted" });
    } catch (e) { res.status(500).send(e.message); }
});

sequelize.sync().then(() => {
    initMinio().then(() => {
        app.listen(8080, '0.0.0.0', () => console.log("Ready"));
    });
});

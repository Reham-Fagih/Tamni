const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 5000;

const bcrypt = require('bcrypt');
const collection = require('./config');

app.use(express.static('public'));
app.use('/img', express.static(path.join(__dirname, 'img')));

app.use(express.json());

const storage = multer.diskStorage({
    destinatsion: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.single('image'), (req, res) => {
    if (req.file) {
        res.json({ message: 'Image uploaded successfully!', filePath: req.file.path });
    } else {
        res.status(400).json({ message: 'Image upload failed!' });
    }
});

app.get('/LogIn', (req, res) => {
    res.render('LogIn');
});

app.get('/SignUp', (req, res) => {
    res.render('SignUp');
});

app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }

    const existingUser = await collection.findOne({name: data.name});
    if(existingUser){
        res.send('User already exists');
    }else {
        const userdata = await collection.insertMany(data);
        comsole.log(userdata);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const collection = require('./config');
const app = express();
const PORT = 5000;

app.use(express.static('public'));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
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
    res.sendFile(path.join(__dirname, 'public', 'logInPage.html'));
});

app.get('/SignUp', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signUp.html'));
});

app.post('/signUp', async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    };

    const existingUser = await collection.findOne({ name: data.name });
    if (existingUser) {
        res.send('User already exists');
    } else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword;
        const userdata = await collection.insertMany([data]);
        console.log(userdata);
        res.send('User registered successfully');
    }
});

app.post('/logInPage', async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send('Username not found');
        } else {
            const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
            if (isPasswordMatch) {
                res.redirect('/');
            } else {
                res.send('Wrong password');
            }
        }
    } catch (error) {
        res.send('Error during login');
        console.error(error);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

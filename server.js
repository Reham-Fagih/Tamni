const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const collection = require('./db');
const app = express();
const PORT = 5000;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use(express.json());
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: true }));
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

app.get('/resultpage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'resultpage.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.single('image'), (req, res) => {
    if (req.file) {
        res.json({ message: 'Image uploaded successfully!', redirectTo: '/resultpage' });
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

    if (!data.name || !data.password) {
        return res.status(400).send('Username and password are required'); 
    }

    try {
        const existingUser = await collection.findOne({ name: data.name });
        if (existingUser) {
            return res.status(409).send('User already exists'); 
        }

        const hashedPassword = await bcrypt.hash(data.password, 10); 
        const userData = {
            name: data.name,
            password: hashedPassword 
        };

        const result = await collection.create(userData); 
        console.log('User registered:', result);
        res.status(201).redirect('/'); 
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).send('Error during registration'); 
    }
});


app.post('/logInPage', async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        console.log('User found:', check); 

        if (!check) {
            return res.status(404).send('Username not found'); 
        }

        console.log('Input Password:', req.body.password); 
        console.log('Stored Hash:', check.password); 

        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        console.log('Password Match:', isPasswordMatch); 

        if (isPasswordMatch) {
            return res.redirect('/'); 
        } else {
            return res.status(401).send('Wrong password'); 
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Error during login'); 
    }
});


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
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

    // Validate input
    if (!data.name || !data.password) {
        return res.status(400).send('Username and password are required'); // 400 Bad Request
    }

    try {
        const existingUser = await collection.findOne({ name: data.name });
        if (existingUser) {
            return res.status(409).send('User already exists'); // 409 Conflict
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword;

        const userdata = await collection.insertOne(data); // Changed to insertOne
        console.log(userdata);
        res.status(201).redirect('/'); // 201 Created
    } catch (error) {
        console.error('Error during registration:', error); // Log error details
        res.status(500).send('Error during registration'); // 500 Internal Server Error
    }
});


app.post('/logInPage', async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        console.log('User found:', check); // Log user details

        if (!check) {
            return res.status(404).send('Username not found'); // 404 Not Found
        }

        console.log('Input Password:', req.body.password); // Log input password
        console.log('Stored Hash:', check.password); // Log stored password hash

        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        console.log('Password Match:', isPasswordMatch); // Log result of comparison

        if (isPasswordMatch) {
            return res.redirect('/'); 
        } else {
            return res.status(401).send('Wrong password'); // 401 Unauthorized
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Error during login'); // 500 Internal Server Error
    }
});


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

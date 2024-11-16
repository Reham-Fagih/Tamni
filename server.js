const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const collection = require('./db');
const app = express();
const http = require('http');
const server = http.createServer(app);  
const { Server } = require("socket.io");
const io = new Server(server);  
const PORT = 5000;
const { spawn } = require('child_process');
const bodyParser = require("body-parser");

app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use(express.json());
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

app.get('/LogIn', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'logInPage.html'));
});

app.get('/SignUp', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signUp.html'));
});





app.post('/predict', upload.single('image'), (req, res) => {
    const imagePath = req.file.path;
    console.log('Received file:', imagePath);
  
    let responseSent = false;
    let predictionResult = '';
  
    const pythonProcess = spawn('python3', [path.join(__dirname, 'model.py'), imagePath]);
  
    pythonProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      predictionResult += data.toString();  
    });
  
    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
  
    pythonProcess.on('close', (code) => {
      if (responseSent) return;
  
      responseSent = true;
  
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        return res.status(500).json({ error: 'Error running the model' });
      }
  
      return res.json({
        message: 'Prediction successful',
        prediction: predictionResult.trim() 
      });
    });
  
    pythonProcess.on('error', (err) => {
      if (responseSent) return;
      responseSent = true;
      console.error(`Error spawning Python process: ${err}`);
      res.status(500).json({ error: 'Error with the Python process' });
    });
  });
  
// server.js

const session = require('express-session');

// Use express-session middleware
app.use(session({
    secret: 'your_secret_key', // Secret key for signing session cookies
    resave: false, // Don't save session if unmodified
    saveUninitialized: true, // Save a session that is new but not modified
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Signup route
app.post('/signUp', async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password,
        role: req.body.role
    };

    if (!data.name || !data.password || !data.role) {
        return res.status(400).send('Username, password, and role are required');
    }

    try {
        const existingUser = await collection.findOne({ name: data.name });
        if (existingUser) {
            return res.status(409).send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const userData = {
            name: data.name,
            password: hashedPassword,
            role: data.role
        };

        const result = await collection.create(userData);
        console.log('User registered:', result);

        // Store user info in the session
        req.session.user = { name: data.name, role: data.role };

        // Redirect to the appropriate page
        if (data.role === 'doctor') {
            return res.redirect('/doctorpage.html');
        } else if (data.role === 'patient') {
            return res.redirect('/index.html');
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).send('Error during registration');
    }
});

// Login route
app.post('/logInPage', async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            return res.status(404).send('Username not found');
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);

        if (isPasswordMatch) {
            // Store user info in the session
            req.session.user = { name: check.name, role: check.role };

            // Redirect based on the user's role
            if (check.role === 'doctor') {
                return res.redirect('/doctorpage.html');
            } else if (check.role === 'patient') {
                return res.redirect('/index.html');
            }
        } else {
            return res.status(401).send('Wrong password');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Error during login');
    }
});


app.get('/ChatRoom', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ChatRoom.html'));
});

const usersColors = {};  // لتخزين socket.id

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    //  لون عشوائي 
    const userColor = '#' + Math.floor(Math.random()*16777215).toString(16);  
    usersColors[socket.id] = userColor; 
    socket.on('sendMessage', (message) => {
        const messageData = {
            id: socket.id,
            text: message,
            color: usersColors[socket.id]
        };
        io.emit('receiveMessage', messageData); 
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete usersColors[socket.id]; 
    });
});

const patientRoutes = require('./routes/ patients');
app.use('/api', patientRoutes);
app.get('/records', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'RecordsScreen.html'));
  });
  

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

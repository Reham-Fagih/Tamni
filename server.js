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

<<<<<<< HEAD
=======


>>>>>>> e4d745a8d2561d7ee8eb72b72a6687f79e14d504
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
<<<<<<< HEAD
});
=======
  });
>>>>>>> e4d745a8d2561d7ee8eb72b72a6687f79e14d504

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

app.get('/ChatRoom', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ChatRoom.html'));
});
const usersColors = {};  // لتخزين اللون الخاص بكل مستخدم بناءً على الـ socket.id

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    // تعيين لون عشوائي أو اختيار لون معين للمستخدم عند الاتصال
    const userColor = '#' + Math.floor(Math.random()*16777215).toString(16);  // يولد لون عشوائي
    usersColors[socket.id] = userColor;  // تخزين اللون للمستخدم بناءً على الـ socket.id

    // عند إرسال الرسالة، يتم تضمين الـ color الخاص بالمستخدم
    socket.on('sendMessage', (message) => {
        const messageData = {
            id: socket.id,
            text: message,
            color: usersColors[socket.id]  // إضافة اللون الخاص بالمستخدم
        };
        io.emit('receiveMessage', messageData);  // إرسال الرسالة إلى جميع المستخدمين
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete usersColors[socket.id];  // حذف اللون عند مغادرة المستخدم
    });
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

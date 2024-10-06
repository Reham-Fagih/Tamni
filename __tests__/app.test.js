
const request = require('supertest');
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Setup the server
const app = express();
const uploadDir = path.join(__dirname, '../uploads');

// Set up multer for testing
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });
app.use(express.static('public'));

app.post('/upload', upload.single('image'), (req, res) => {
    if (req.file) {
        res.status(200).json({ message: 'Image uploaded successfully!', filePath: req.file.path });
    } else {
        res.status(400).json({ message: 'Image upload failed!' });
    }
});

// Test cases
describe('Image Upload API', () => {
    beforeAll(() => {
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
    });

    afterAll(() => {
        // Clean up uploaded files after tests
        fs.readdir(uploadDir, (err, files) => {
            if (err) return;
            files.forEach(file => {
                fs.unlink(path.join(uploadDir, file), err => {
                    if (err) console.error(err);
                });
            });
        });
    });

    it('should upload an image successfully', async () => {
        const response = await request(app)
            .post('/upload')
            .attach('image', path.join(__dirname, 'test_image.png')); // Use an actual image file here

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Image uploaded successfully!');
    });

    it('should return an error when no image is uploaded', async () => {
        const response = await request(app)
            .post('/upload');

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Image upload failed!');
    });
});
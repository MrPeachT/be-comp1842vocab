const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://user_id:Cjzosu5Ol7RBKEp8@cluster0.o9ppe1m.mongodb.net/vocab-builder?appName=Cluster0';

mongoose.connect(MONGO_URI, {
  dbName: 'vocab_builder',
  serverSelectionTimeoutMS: 5000
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const wordRoutes = require('./routes/wordRoutes');
wordRoutes(app);

const authRoutes = require('./routes/authRoutes');   
authRoutes(app);                                     

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  }
});

const upload = multer({ storage });

app.use('/uploads', express.static(uploadDir));

app.get('/', (req, res) => {
  res.json({ message: 'API is alive.' });
});

app.post('/api/upload', upload.single('image'), (req, res) => {
  console.log('Upload endpoint hit');

  if (!req.file) {
    console.log('No file received');
    return res.status(400).json({ error: 'No file uploaded' });
  }

  console.log('Stored file:', req.file.filename);

  const imageUrl =
    `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.json({ imageUrl });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
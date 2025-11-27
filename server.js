const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());                       
app.use(express.urlencoded({ extended: true })); 

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://user_id:Cjzosu5Ol7RBKEp8@cluster0.o9ppe1m.mongodb.net/vocab-builder?appName=Cluster0';

mongoose.connect(MONGO_URI, {
  dbName: 'vocab_builder',
  serverSelectionTimeoutMS: 5000,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const wordRoutes = require('./routes/wordRoutes');
wordRoutes(app);

app.get('/', (req, res) => {
  res.json({ message: 'API is alive.' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

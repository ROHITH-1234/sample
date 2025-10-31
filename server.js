const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Initialize Express
const app = express();

// Middleware
app.use(express.json({ extended: false }));
app.use(cors());

// Define Routes
app.use('/api/users', require('./backend/src/routes/users'));
app.use('/api/auth', require('./backend/src/routes/auth'));
app.use('/api/companies', require('./backend/src/routes/companies'));
app.use('/api/candidates', require('./backend/src/routes/candidates'));
app.use('/api/jobs', require('./backend/src/routes/jobs'));
app.use('/api/applications', require('./backend/src/routes/applications'));
app.use('/api/ai', require('./backend/src/routes/ai'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('frontend/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai-job-portal', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
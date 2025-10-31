const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: [String],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  salary: {
    type: String
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
    required: true
  },
  keywords: {
    type: [String]
  },
  status: {
    type: String,
    enum: ['Open', 'Closed', 'Paused'],
    default: 'Open'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Add text index for search optimization
JobSchema.index({ 
  title: 'text', 
  description: 'text', 
  requirements: 'text',
  keywords: 'text'
});

module.exports = mongoose.model('job', JobSchema);
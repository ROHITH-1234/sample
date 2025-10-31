const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'job',
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'candidate',
    required: true
  },
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Hired'],
    default: 'Applied'
  },
  coverLetter: {
    type: String
  },
  matchScore: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('application', ApplicationSchema);
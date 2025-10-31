const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Job = require('../models/Job');

// @route   POST api/jobs
// @desc    Create a job listing
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newJob = new Job({
      company: req.user.id,
      ...req.body
    });
    
    const job = await newJob.save();
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/jobs
// @desc    Get all jobs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ date: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/jobs/company
// @desc    Get all jobs by company
// @access  Private
router.get('/company', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.user.id }).sort({ date: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/jobs/recommended
// @desc    Get recommended jobs for candidate
// @access  Private
router.get('/recommended', auth, async (req, res) => {
  try {
    // In a real app, this would use AI matching
    // For now, just return all active jobs
    const jobs = await Job.find({ status: 'active' }).sort({ date: -1 });
    
    // Add dummy match scores
    const jobsWithScores = jobs.map(job => ({
      ...job.toObject(),
      matchScore: Math.floor(Math.random() * 100)
    }));
    
    res.json(jobsWithScores);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
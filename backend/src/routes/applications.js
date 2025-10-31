const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Application = require('../models/Application');

// @route   POST api/applications
// @desc    Create a job application
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newApplication = new Application({
      candidate: req.user.id,
      job: req.body.job,
      status: 'pending',
      matchScore: Math.floor(Math.random() * 100) // Dummy score for demo
    });
    
    const application = await newApplication.save();
    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/applications/me
// @desc    Get all applications by candidate
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user.id }).sort({ date: -1 });
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/applications/company
// @desc    Get all applications for company jobs
// @access  Private
router.get('/company', auth, async (req, res) => {
  try {
    const applications = await Application.find().sort({ date: -1 });
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/applications/:id
// @desc    Update application status
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { $set: { status: req.body.status } },
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }
    
    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
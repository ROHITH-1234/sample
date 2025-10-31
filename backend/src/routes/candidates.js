const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Candidate = require('../models/Candidate');

// @route   GET api/candidates/me
// @desc    Get current candidate profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ user: req.user.id });
    
    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate profile not found' });
    }
    
    res.json(candidate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/candidates
// @desc    Create or update candidate profile
// @access  Private
router.post('/', auth, async (req, res) => {
  const {
    name,
    skills,
    experience,
    education
  } = req.body;
  
  // Build candidate profile object
  const candidateFields = {};
  candidateFields.user = req.user.id;
  if (name) candidateFields.name = name;
  if (skills) candidateFields.skills = skills.split(',').map(skill => skill.trim());
  if (experience) candidateFields.experience = experience;
  if (education) candidateFields.education = education;
  
  try {
    let candidate = await Candidate.findOne({ user: req.user.id });
    
    if (candidate) {
      // Update
      candidate = await Candidate.findOneAndUpdate(
        { user: req.user.id },
        { $set: candidateFields },
        { new: true }
      );
      
      return res.json(candidate);
    }
    
    // Create
    candidate = new Candidate(candidateFields);
    await candidate.save();
    res.json(candidate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/candidates/resume
// @desc    Upload resume
// @access  Private
router.put('/resume', auth, async (req, res) => {
  try {
    // In a real app, this would handle file upload
    // For now, just update the resume field with a filename
    const candidate = await Candidate.findOneAndUpdate(
      { user: req.user.id },
      { $set: { resume: 'resume.pdf' } },
      { new: true }
    );
    
    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate profile not found' });
    }
    
    res.json(candidate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
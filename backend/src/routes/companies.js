const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Company = require('../models/Company');

// @route   GET api/companies/me
// @desc    Get current company profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user.id });
    
    if (!company) {
      return res.status(404).json({ msg: 'Company profile not found' });
    }
    
    res.json(company);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/companies
// @desc    Create or update company profile
// @access  Private
router.post('/', auth, async (req, res) => {
  const {
    name,
    website,
    location,
    industry,
    description,
    contactEmail,
    contactPhone
  } = req.body;
  
  // Build company profile object
  const companyFields = {};
  companyFields.user = req.user.id;
  if (name) companyFields.name = name;
  if (website) companyFields.website = website;
  if (location) companyFields.location = location;
  if (industry) companyFields.industry = industry;
  if (description) companyFields.description = description;
  if (contactEmail) companyFields.contactEmail = contactEmail;
  if (contactPhone) companyFields.contactPhone = contactPhone;
  
  try {
    let company = await Company.findOne({ user: req.user.id });
    
    if (company) {
      // Update
      company = await Company.findOneAndUpdate(
        { user: req.user.id },
        { $set: companyFields },
        { new: true }
      );
      
      return res.json(company);
    }
    
    // Create
    company = new Company(companyFields);
    await company.save();
    res.json(company);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/companies
// @desc    Get all companies
// @access  Public
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/companies/:id
// @desc    Get company by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }
    
    res.json(company);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Company not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
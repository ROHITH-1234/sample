const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const natural = require('natural');
const { Configuration, OpenAIApi } = require('openai');

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Initialize NLP tools
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;

// @route   POST api/ai/job-match
// @desc    Match candidate with jobs using AI
// @access  Private
router.post('/job-match', auth, async (req, res) => {
  try {
    const { candidateId } = req.body;
    
    // Get candidate profile
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }
    
    // Get all active jobs
    const jobs = await Job.find({ status: 'Open' }).populate('company', 'name');
    
    // Calculate match scores using TF-IDF
    const tfidf = new TfIdf();
    
    // Add candidate skills and experience as a document
    const candidateDoc = [
      ...candidate.skills,
      ...candidate.experience.map(exp => `${exp.title} ${exp.description || ''}`)
    ].join(' ');
    tfidf.addDocument(candidateDoc);
    
    // Add each job as a document and calculate similarity
    const jobMatches = jobs.map(job => {
      const jobDoc = [
        job.title,
        job.description,
        ...job.requirements,
        ...(job.keywords || [])
      ].join(' ');
      
      tfidf.addDocument(jobDoc);
      
      // Calculate similarity score (simplified)
      let score = 0;
      const candidateTokens = tokenizer.tokenize(candidateDoc.toLowerCase());
      
      candidateTokens.forEach(token => {
        if (jobDoc.toLowerCase().includes(token)) {
          score += 1;
        }
      });
      
      // Normalize score (0-100)
      score = Math.min(100, Math.round((score / candidateTokens.length) * 100));
      
      return {
        job: {
          id: job._id,
          title: job.title,
          company: job.company.name,
          location: job.location,
          jobType: job.jobType,
          salary: job.salary
        },
        matchScore: score
      };
    });
    
    // Sort by match score (highest first)
    jobMatches.sort((a, b) => b.matchScore - a.matchScore);
    
    res.json(jobMatches);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/ai/resume-parse
// @desc    Parse resume and extract skills using AI
// @access  Private
router.post('/resume-parse', auth, async (req, res) => {
  try {
    const { resumeText } = req.body;
    
    // Use OpenAI to extract skills and experience
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Extract the following information from this resume:\n\n1. Skills (as a comma-separated list)\n2. Work Experience (with job titles and companies)\n3. Education\n\nResume text:\n${resumeText}\n\nOutput in JSON format:`,
      max_tokens: 500,
      temperature: 0.3,
    });
    
    const parsedData = JSON.parse(response.data.choices[0].text.trim());
    
    res.json(parsedData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/ai/optimize-search
// @desc    Optimize job search query using AI
// @access  Public
router.post('/optimize-search', async (req, res) => {
  try {
    const { query } = req.body;
    
    // Use OpenAI to expand and optimize the search query
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Expand this job search query with relevant keywords and skills to improve search results:\n\nOriginal query: "${query}"\n\nOptimized search terms (comma-separated):`,
      max_tokens: 100,
      temperature: 0.5,
    });
    
    const optimizedTerms = response.data.choices[0].text.trim().split(',').map(term => term.trim());
    
    res.json({ 
      original: query,
      optimized: optimizedTerms
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
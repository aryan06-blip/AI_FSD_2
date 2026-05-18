const Candidate = require('../models/Candidate');

exports.addCandidate = async (req, res) => {
  try {
    const { name, email, skills, experience, projects } = req.body;
    
    // Validate required fields
    if (!name || !email || experience === undefined) {
      return res.status(400).json({ error: 'Name, email, and experience are required' });
    }

    const candidate = new Candidate({
      name,
      email,
      skills,
      experience,
      projects
    });

    await candidate.save();
    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

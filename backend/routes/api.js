const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const matchController = require('../controllers/matchController');

// Candidate APIs
router.post('/candidates', candidateController.addCandidate);
router.get('/candidates', candidateController.getAllCandidates);

// Job Matching APIs
router.post('/match', matchController.shortlistBasic);
router.post('/ai/shortlist', matchController.shortlistAI);

module.exports = router;

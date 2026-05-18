const Candidate = require('../models/Candidate');

exports.shortlistBasic = async (req, res) => {
  try {
    const { requiredSkills, minExperience } = req.body;
    
    if (!requiredSkills || !Array.isArray(requiredSkills)) {
      return res.status(400).json({ error: 'requiredSkills array is required' });
    }

    const candidates = await Candidate.find({
      experience: { $gte: minExperience || 0 }
    });

    const matched = candidates.map(candidate => {
      const matchedSkills = candidate.skills.filter(skill =>
        requiredSkills.some(reqSkill => reqSkill.toLowerCase() === skill.toLowerCase())
      );
      const score = requiredSkills.length > 0 ? (matchedSkills.length / requiredSkills.length) * 100 : 0;
      return {
        ...candidate._doc,
        matchScore: score,
        matchedSkills
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.json(matched);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.shortlistAI = async (req, res) => {
  try {
    const { requiredSkills, minExperience, candidates } = req.body;

    let candidatesList = candidates;
    if (!candidatesList || candidatesList.length === 0) {
       candidatesList = await Candidate.find({
         experience: { $gte: minExperience || 0 }
       });
    }

    if (candidatesList.length === 0) {
      return res.json({ evaluations: [] });
    }

    const candidatesText = candidatesList.map((c, i) => 
      `${i + 1}. ${c.name} - Skills: ${c.skills.join(', ')} - Exp: ${c.experience} years - Bio: ${c.projects || 'None'}`
    ).join('\n');

    const prompt = `
      Job requires: ${requiredSkills.join(', ')} (${minExperience}+ years experience)
      
      Candidates:
      ${candidatesText}
      
      Rank the top candidates based on how well they match the requirements and explain why each is suitable. Provide a concise evaluation.
      You MUST respond in valid JSON format exactly matching this structure:
      {
        "evaluations": [
          {
            "candidateName": "Name",
            "rank": 1,
            "explanation": "Brief explanation of why..."
          }
        ]
      }
    `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error?.message || 'Error from OpenRouter');
    }
    
    const content = data.choices[0].message.content;
    let aiResponse;
    try {
        // Find JSON block in case there's markdown around it
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            aiResponse = JSON.parse(jsonMatch[0]);
        } else {
            aiResponse = JSON.parse(content);
        }
    } catch(e) {
        aiResponse = { error: "Failed to parse AI response", raw: content };
    }

    res.json(aiResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

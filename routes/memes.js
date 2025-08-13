const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');
const { generateDailyMeme } = require('../services/memeGenerator');

// Daily meme database
const memeDatabase = [
  {
    id: 1,
    title: "When you realize ChatGPT can do your job better than you...",
    content: "🔥 Plot twist: It already is. 🔥",
    category: "AI Reality Check",
    viralScore: 95
  },
  {
    id: 2,
    title: "Me explaining to my boss why AI won't replace me",
    content: "Meanwhile, AI is already doing my job...",
    category: "Workplace Humor",
    viralScore: 88
  },
  {
    id: 3,
    title: "Job security in 2024:",
    content: "🤖 AI: 'I can do that' 👨‍💼 You: 'But I have experience!' 🤖 AI: 'I can learn in 2 seconds'",
    category: "AI vs Human",
    viralScore: 92
  },
  {
    id: 4,
    title: "My job description vs What AI actually does:",
    content: "📝 Me: 'Complex analysis and strategic thinking' 🤖 AI: *Does it in 0.3 seconds*",
    category: "Job Reality",
    viralScore: 87
  },
  {
    id: 5,
    title: "When you finally learn to code to future-proof your career",
    content: "💻 You: 'Now I'm safe!' 🤖 GitHub Copilot: 'Allow me to introduce myself...'",
    category: "Tech Humor",
    viralScore: 90
  },
  {
    id: 6,
    title: "The three stages of job automation grief:",
    content: "😤 Denial → 😰 Panic → 😅 Acceptance → 🤖 Learning to code",
    category: "Career Stages",
    viralScore: 85
  },
  {
    id: 7,
    title: "AI replacing jobs be like:",
    content: "👨‍💼 'I have 10 years of experience!' 🤖 'I have 10 seconds of training data!'",
    category: "Experience vs AI",
    viralScore: 93
  },
  {
    id: 8,
    title: "My LinkedIn after AI takes my job:",
    content: "🔗 'Open to work' → 'Open to learning AI' → 'Open to becoming AI'",
    category: "Career Pivot",
    viralScore: 89
  },
  {
    id: 9,
    title: "When you check ismyjobcooked.com and see 95% automation risk:",
    content: "😱 *Panic* → 😤 *Denial* → 😅 *Acceptance* → 🚀 *Time to pivot*",
    category: "Reality Check",
    viralScore: 91
  },
  {
    id: 10,
    title: "The future of work:",
    content: "🤖 AI does the work 👨‍💼 Human supervises AI 🤖 AI supervises human 👨‍💼 Human becomes AI",
    category: "Future Work",
    viralScore: 86
  },
  {
    id: 11,
    title: "Job interview in 2025:",
    content: "👔 'What's your experience with AI?' 👨‍💼 'I survived the automation wave of 2024'",
    category: "Future Interviews",
    viralScore: 88
  },
  {
    id: 12,
    title: "When AI writes better code than you:",
    content: "💻 You: *Spends 4 hours debugging* 🤖 AI: *Writes perfect code in 30 seconds*",
    category: "Developer Humor",
    viralScore: 94
  },
  {
    id: 13,
    title: "The automation timeline:",
    content: "2024: AI helps with tasks → 2025: AI does most tasks → 2026: AI does all tasks → 2027: AI creates new tasks for humans",
    category: "Timeline",
    viralScore: 87
  },
  {
    id: 14,
    title: "My resume after AI takes over:",
    content: "📄 'Proficient in Microsoft Office' → 'Proficient in ChatGPT' → 'Proficient in not being replaced by AI'",
    category: "Resume Evolution",
    viralScore: 90
  },
  {
    id: 15,
    title: "When you realize your job is 'cooked':",
    content: "🔥 'Well-done' → 'Burnt' → 'Ashes' → 'Time to become a prompt engineer'",
    category: "Career Crisis",
    viralScore: 92
  }
];

// Get daily meme endpoint
router.get('/daily', async (req, res) => {
  try {
    const dailyMeme = await generateDailyMeme(memeDatabase);
    logger.info('Daily meme generated successfully');
    res.json(dailyMeme);
  } catch (error) {
    logger.error('Error generating daily meme:', error);
    res.status(500).json({
      error: 'Failed to generate daily meme',
      message: error.message
    });
  }
});

// Get random meme endpoint
router.get('/random', async (req, res) => {
  try {
    const randomMeme = memeDatabase[Math.floor(Math.random() * memeDatabase.length)];
    res.json({
      ...randomMeme,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error getting random meme:', error);
    res.status(500).json({
      error: 'Failed to get random meme',
      message: error.message
    });
  }
});

// Get meme by category endpoint
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const categoryMemes = memeDatabase.filter(
      meme => meme.category.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase()
    );
    
    if (categoryMemes.length === 0) {
      return res.status(404).json({
        error: 'Category not found',
        message: `No memes found in category: ${category}`,
        availableCategories: [...new Set(memeDatabase.map(meme => meme.category))]
      });
    }
    
    res.json({
      category: category,
      memes: categoryMemes,
      count: categoryMemes.length
    });
  } catch (error) {
    logger.error('Error getting memes by category:', error);
    res.status(500).json({
      error: 'Failed to get memes by category',
      message: error.message
    });
  }
});

// Get trending memes endpoint
router.get('/trending', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const trendingMemes = memeDatabase
      .sort((a, b) => b.viralScore - a.viralScore)
      .slice(0, parseInt(limit));
    
    res.json({
      memes: trendingMemes,
      count: trendingMemes.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error getting trending memes:', error);
    res.status(500).json({
      error: 'Failed to get trending memes',
      message: error.message
    });
  }
});

// Get all memes endpoint
router.get('/all', async (req, res) => {
  try {
    res.json({
      memes: memeDatabase,
      count: memeDatabase.length,
      categories: [...new Set(memeDatabase.map(meme => meme.category))],
      averageViralScore: Math.round(
        memeDatabase.reduce((sum, meme) => sum + meme.viralScore, 0) / memeDatabase.length
      )
    });
  } catch (error) {
    logger.error('Error getting all memes:', error);
    res.status(500).json({
      error: 'Failed to get all memes',
      message: error.message
    });
  }
});

// Generate custom meme endpoint
router.post('/generate', async (req, res) => {
  try {
    const { jobTitle, cookedScore, mood } = req.body;
    
    if (!jobTitle || !cookedScore) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'jobTitle and cookedScore are required'
      });
    }

    const customMeme = generateCustomMeme(jobTitle, cookedScore, mood);
    res.json(customMeme);
  } catch (error) {
    logger.error('Error generating custom meme:', error);
    res.status(500).json({
      error: 'Failed to generate custom meme',
      message: error.message
    });
  }
});

// Helper function to generate custom memes
function generateCustomMeme(jobTitle, cookedScore, mood = 'neutral') {
  const memeTemplates = {
    high: [
      {
        title: `When you realize ${jobTitle} is ${cookedScore}% automated:`,
        content: "🤖 AI: 'I got this' 👨‍💼 You: 'But I went to college!' 🤖 AI: 'I learned this in 2 minutes'"
      },
      {
        title: `${jobTitle} job security in 2024:`,
        content: "📉 Going down faster than my motivation to learn new skills"
      }
    ],
    medium: [
      {
        title: `${jobTitle} automation status:`,
        content: "😅 AI can do parts of it, but not the important stuff... yet"
      },
      {
        title: `My ${jobTitle} career path:`,
        content: "👨‍💼 Human → 🤖 AI Assistant → 🤖 AI Supervisor → 🤖 AI"
      }
    ],
    low: [
      {
        title: `${jobTitle} automation risk:`,
        content: "😎 AI-proof job! Time to become the one who builds the AI"
      },
      {
        title: `${jobTitle} job security:`,
        content: "🛡️ You're safe! AI still can't handle the human touch"
      }
    ]
  };

  let category;
  if (cookedScore >= 70) category = 'high';
  else if (cookedScore >= 40) category = 'medium';
  else category = 'low';

  const templates = memeTemplates[category];
  const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];

  return {
    id: Date.now(),
    title: selectedTemplate.title,
    content: selectedTemplate.content,
    category: 'Custom Generated',
    viralScore: Math.floor(Math.random() * 20) + 80,
    jobTitle: jobTitle,
    cookedScore: cookedScore,
    timestamp: new Date().toISOString()
  };
}

module.exports = router;

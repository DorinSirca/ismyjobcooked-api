// Simple console logger
const logger = {
  info: (message) => console.log(`[INFO] ${message}`),
  error: (message) => console.error(`[ERROR] ${message}`),
  warn: (message) => console.warn(`[WARN] ${message}`)
};

// Meme templates for different job categories and risk levels
const memeTemplates = {
  high: [
    {
      title: "When you realize your job is 90% automated:",
      content: "🤖 AI: 'I got this' 👨‍💼 You: 'But I have 10 years of experience!' 🤖 AI: 'I learned this in 10 seconds'",
      category: "High Risk Reality Check"
    },
    {
      title: "Job security in 2024:",
      content: "📉 Going down faster than my motivation to learn new skills",
      category: "Career Crisis"
    },
    {
      title: "My job description vs What AI actually does:",
      content: "📝 Me: 'Complex analysis and strategic thinking' 🤖 AI: *Does it in 0.3 seconds*",
      category: "Job Reality"
    }
  ],
  medium: [
    {
      title: "AI can do parts of my job, but not the important stuff:",
      content: "😅 You're safe... for now",
      category: "Medium Risk Humor"
    },
    {
      title: "When AI tries to replace you but fails:",
      content: "🤖 AI: 'I can handle this' 👨‍💼 You: 'Good luck with the client meetings'",
      category: "AI vs Human"
    },
    {
      title: "My career path:",
      content: "👨‍💼 Human → 🤖 AI Assistant → 🤖 AI Supervisor → 🤖 AI",
      category: "Career Evolution"
    }
  ],
  low: [
    {
      title: "AI-proof job status:",
      content: "😎 You're safe! AI still can't handle the human touch",
      category: "Low Risk Celebration"
    },
    {
      title: "When you're the one building the AI:",
      content: "💻 You: 'I'm creating the tools that will replace everyone else' 😈",
      category: "Tech Humor"
    },
    {
      title: "Job security level:",
      content: "🛡️ AI-proof! Time to become the robot whisperer",
      category: "Job Security"
    }
  ]
};

// Daily meme rotation based on date
const dailyMemeRotation = [
  {
    title: "When you realize ChatGPT can do your job better than you...",
    content: "🔥 Plot twist: It already is. 🔥",
    category: "AI Reality Check",
    viralScore: 95
  },
  {
    title: "Me explaining to my boss why AI won't replace me",
    content: "Meanwhile, AI is already doing my job...",
    category: "Workplace Humor",
    viralScore: 88
  },
  {
    title: "Job security in 2024:",
    content: "🤖 AI: 'I can do that' 👨‍💼 You: 'But I have experience!' 🤖 AI: 'I can learn in 2 seconds'",
    category: "AI vs Human",
    viralScore: 92
  },
  {
    title: "My job description vs What AI actually does:",
    content: "📝 Me: 'Complex analysis and strategic thinking' 🤖 AI: *Does it in 0.3 seconds*",
    category: "Job Reality",
    viralScore: 87
  },
  {
    title: "When you finally learn to code to future-proof your career",
    content: "💻 You: 'Now I'm safe!' 🤖 GitHub Copilot: 'Allow me to introduce myself...'",
    category: "Tech Humor",
    viralScore: 90
  },
  {
    title: "The three stages of job automation grief:",
    content: "😤 Denial → 😰 Panic → 😅 Acceptance → 🤖 Learning to code",
    category: "Career Stages",
    viralScore: 85
  },
  {
    title: "AI replacing jobs be like:",
    content: "👨‍💼 'I have 10 years of experience!' 🤖 'I have 10 seconds of training data!'",
    category: "Experience vs AI",
    viralScore: 93
  },
  {
    title: "My LinkedIn after AI takes my job:",
    content: "🔗 'Open to work' → 'Open to learning AI' → 'Open to becoming AI'",
    category: "Career Pivot",
    viralScore: 89
  },
  {
    title: "When you check ismyjobcooked.com and see 95% automation risk:",
    content: "😱 *Panic* → 😤 *Denial* → 😅 *Acceptance* → 🚀 *Time to pivot*",
    category: "Reality Check",
    viralScore: 91
  },
  {
    title: "The future of work:",
    content: "🤖 AI does the work 👨‍💼 Human supervises AI 🤖 AI supervises human 👨‍💼 Human becomes AI",
    category: "Future Work",
    viralScore: 86
  },
  {
    title: "Job interview in 2025:",
    content: "👔 'What's your experience with AI?' 👨‍💼 'I survived the automation wave of 2024'",
    category: "Future Interviews",
    viralScore: 88
  },
  {
    title: "When AI writes better code than you:",
    content: "💻 You: *Spends 4 hours debugging* 🤖 AI: *Writes perfect code in 30 seconds*",
    category: "Developer Humor",
    viralScore: 94
  },
  {
    title: "The automation timeline:",
    content: "2024: AI helps with tasks → 2025: AI does most tasks → 2026: AI does all tasks → 2027: AI creates new tasks for humans",
    category: "Timeline",
    viralScore: 87
  },
  {
    title: "My resume after AI takes over:",
    content: "📄 'Proficient in Microsoft Office' → 'Proficient in ChatGPT' → 'Proficient in not being replaced by AI'",
    category: "Resume Evolution",
    viralScore: 90
  },
  {
    title: "When you realize your job is 'cooked':",
    content: "🔥 'Well-done' → 'Burnt' → 'Ashes' → 'Time to become a prompt engineer'",
    category: "Career Crisis",
    viralScore: 92
  }
];

/**
 * Generate daily meme based on current date
 * @param {Array} memeDatabase - The meme database
 * @returns {Object} Daily meme
 */
async function generateDailyMeme(memeDatabase) {
  try {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    
    // Use day of year to select meme (ensures same meme for same day)
    const memeIndex = dayOfYear % dailyMemeRotation.length;
    const dailyMeme = dailyMemeRotation[memeIndex];
    
    logger.info(`Daily meme generated for day ${dayOfYear}: ${dailyMeme.title}`);
    
    return {
      ...dailyMeme,
      id: dayOfYear,
      isDaily: true,
      dayOfYear: dayOfYear,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Error generating daily meme:', error);
    throw error;
  }
}

/**
 * Generate meme based on job analysis
 * @param {Object} jobData - Job analysis data
 * @returns {Object} Generated meme
 */
async function generateJobSpecificMeme(jobData) {
  try {
    const { title, automationRisk, category } = jobData;
    
    // Determine risk level
    let riskLevel;
    if (automationRisk >= 70) riskLevel = 'high';
    else if (automationRisk >= 40) riskLevel = 'medium';
    else riskLevel = 'low';
    
    // Get templates for risk level
    const templates = memeTemplates[riskLevel];
    const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    // Customize meme with job-specific content
    const customizedMeme = {
      title: selectedTemplate.title.replace('your job', `${title}`),
      content: selectedTemplate.content,
      category: selectedTemplate.category,
      jobTitle: title,
      automationRisk: automationRisk,
      jobCategory: category,
      viralScore: Math.floor(Math.random() * 20) + 80,
      timestamp: new Date().toISOString()
    };
    
    logger.info(`Job-specific meme generated for ${title}: ${customizedMeme.title}`);
    
    return customizedMeme;
  } catch (error) {
    logger.error('Error generating job-specific meme:', error);
    throw error;
  }
}

/**
 * Generate trending meme based on current events
 * @returns {Object} Trending meme
 */
async function generateTrendingMeme() {
  try {
    const trendingTemplates = [
      {
        title: "Latest AI breakthrough:",
        content: "🤖 AI: 'I can now do your job' 👨‍💼 You: 'But I have a degree!' 🤖 AI: 'I have access to all degrees'",
        category: "AI Breakthrough"
      },
      {
        title: "When your company announces 'AI integration':",
        content: "😱 Translation: 'We're replacing humans with robots'",
        category: "Company News"
      },
      {
        title: "Job market in 2024:",
        content: "📈 AI jobs: Up 500% 📉 Human jobs: Down 50% 😅 Your job: Somewhere in between",
        category: "Market Trends"
      },
      {
        title: "When you see your job listed as 'AI-proof':",
        content: "😎 You: 'I'm safe!' 🤖 AI: 'Challenge accepted'",
        category: "Job Security"
      },
      {
        title: "The automation paradox:",
        content: "🤖 AI creates jobs → 🤖 AI takes jobs → 🤖 AI creates more jobs → 🤖 AI takes more jobs",
        category: "Automation Paradox"
      }
    ];
    
    const selectedTemplate = trendingTemplates[Math.floor(Math.random() * trendingTemplates.length)];
    
    const trendingMeme = {
      ...selectedTemplate,
      id: Date.now(),
      isTrending: true,
      viralScore: Math.floor(Math.random() * 15) + 85,
      timestamp: new Date().toISOString()
    };
    
    logger.info('Trending meme generated');
    
    return trendingMeme;
  } catch (error) {
    logger.error('Error generating trending meme:', error);
    throw error;
  }
}

/**
 * Generate personalized meme based on user data
 * @param {Object} userData - User preferences and history
 * @returns {Object} Personalized meme
 */
async function generatePersonalizedMeme(userData) {
  try {
    const { favoriteJobs, searchHistory, riskPreference } = userData;
    
    // Create personalized content based on user data
    let personalizedContent;
    
    if (favoriteJobs && favoriteJobs.length > 0) {
      const randomJob = favoriteJobs[Math.floor(Math.random() * favoriteJobs.length)];
      personalizedContent = `Your favorite job (${randomJob}) is ${randomJob.automationRisk}% automated. ${randomJob.automationRisk >= 70 ? 'Time to pivot!' : 'You might be safe... for now.'}`;
    } else if (searchHistory && searchHistory.length > 0) {
      const recentSearch = searchHistory[searchHistory.length - 1];
      personalizedContent = `You recently searched for '${recentSearch.jobTitle}'. ${recentSearch.cookedScore >= 70 ? 'That job is cooked! 🔥' : 'That job might survive the AI apocalypse.'}`;
    } else {
      personalizedContent = "Based on your search patterns, you're clearly worried about AI taking your job. Smart thinking! 🤖";
    }
    
    const personalizedMeme = {
      title: "Your personalized job automation status:",
      content: personalizedContent,
      category: "Personalized",
      isPersonalized: true,
      viralScore: Math.floor(Math.random() * 20) + 80,
      timestamp: new Date().toISOString()
    };
    
    logger.info('Personalized meme generated');
    
    return personalizedMeme;
  } catch (error) {
    logger.error('Error generating personalized meme:', error);
    throw error;
  }
}

/**
 * Generate meme for specific platform
 * @param {string} platform - Social media platform
 * @param {Object} jobData - Job data (optional)
 * @returns {Object} Platform-specific meme
 */
async function generatePlatformMeme(platform, jobData = null) {
  try {
    const platformTemplates = {
      twitter: [
        {
          title: "🔥 HOT TAKE 🔥",
          content: "Your job is probably already automated and you don't even know it.",
          category: "Twitter Hot Take"
        },
        {
          title: "Thread: Why your job is cooked 🧵",
          content: "1/ AI can do it faster\n2/ AI can do it cheaper\n3/ AI doesn't need coffee breaks\n4/ AI doesn't call in sick\n5/ AI doesn't ask for raises",
          category: "Twitter Thread"
        }
      ],
      tiktok: [
        {
          title: "POV: You just found out your job is 90% automated",
          content: "😱 *Panic* → 😤 *Denial* → 😅 *Acceptance* → 🚀 *Time to learn coding*",
          category: "TikTok POV"
        },
        {
          title: "The automation dance 💃",
          content: "🤖 AI: *Does your job perfectly* 👨‍💼 You: *Still gets paid* 💃 *Dance break*",
          category: "TikTok Dance"
        }
      ],
      linkedin: [
        {
          title: "Professional insight on job automation trends",
          content: "The future of work is evolving rapidly. Those who adapt to AI collaboration will thrive. #FutureOfWork #AI #CareerDevelopment",
          category: "LinkedIn Professional"
        },
        {
          title: "Thought leadership moment",
          content: "Instead of fearing AI, let's focus on how we can leverage it to enhance our human capabilities. #AI #Innovation #Leadership",
          category: "LinkedIn Thought Leadership"
        }
      ]
    };
    
    const templates = platformTemplates[platform.toLowerCase()] || platformTemplates.twitter;
    const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    let platformMeme = {
      ...selectedTemplate,
      platform: platform.toLowerCase(),
      viralScore: Math.floor(Math.random() * 20) + 80,
      timestamp: new Date().toISOString()
    };
    
    // Add job-specific content if provided
    if (jobData) {
      platformMeme.jobTitle = jobData.title;
      platformMeme.automationRisk = jobData.automationRisk;
    }
    
    logger.info(`Platform-specific meme generated for ${platform}`);
    
    return platformMeme;
  } catch (error) {
    logger.error('Error generating platform meme:', error);
    throw error;
  }
}

module.exports = {
  generateDailyMeme,
  generateJobSpecificMeme,
  generateTrendingMeme,
  generatePersonalizedMeme,
  generatePlatformMeme,
  memeTemplates,
  dailyMemeRotation
};

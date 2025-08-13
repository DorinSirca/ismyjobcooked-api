const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');
const { analyzeJob } = require('../services/jobAnalyzer');
const { generateRandomJob } = require('../services/jobGenerator');
const { getJobCategories } = require('../services/jobCategories');
const { validateJobTitle } = require('../middleware/validation');

// Comprehensive job database with real automation risk data
const jobDatabase = {
  // Finance & Accounting
  'junior accountant': {
    title: 'Junior Accountant',
    category: 'Finance',
    automationRisk: 88,
    medianSalary: 42000,
    creativityRequired: 15,
    aiReplacements: 'ACTIVE',
    riskFactors: ['data entry', 'repetitive tasks', 'rule-based decisions'],
    aiTools: ['QuickBooks AI', 'Xero', 'Sage Intacct'],
    timeToAutomation: '2-3 years'
  },
  'financial analyst': {
    title: 'Financial Analyst',
    category: 'Finance',
    automationRisk: 45,
    medianSalary: 85000,
    creativityRequired: 60,
    aiReplacements: 'EMERGING',
    riskFactors: ['data analysis', 'reporting', 'basic modeling'],
    aiTools: ['Tableau AI', 'Power BI', 'Alteryx'],
    timeToAutomation: '5-7 years'
  },
  'investment banker': {
    title: 'Investment Banker',
    category: 'Finance',
    automationRisk: 25,
    medianSalary: 150000,
    creativityRequired: 80,
    aiReplacements: 'LIMITED',
    riskFactors: ['relationship building', 'complex negotiations'],
    aiTools: ['DealRoom', 'PitchBook'],
    timeToAutomation: '10+ years'
  },

  // Technology
  'software developer': {
    title: 'Software Developer',
    category: 'Technology',
    automationRisk: 23,
    medianSalary: 95000,
    creativityRequired: 85,
    aiReplacements: 'MINIMAL',
    riskFactors: ['AI pair programming', 'code generation'],
    aiTools: ['GitHub Copilot', 'ChatGPT', 'Claude'],
    timeToAutomation: '10+ years'
  },
  'data scientist': {
    title: 'Data Scientist',
    category: 'Technology',
    automationRisk: 35,
    medianSalary: 120000,
    creativityRequired: 75,
    aiReplacements: 'EMERGING',
    riskFactors: ['automated ML', 'data preprocessing'],
    aiTools: ['AutoML', 'DataRobot', 'H2O.ai'],
    timeToAutomation: '7-10 years'
  },
  'web developer': {
    title: 'Web Developer',
    category: 'Technology',
    automationRisk: 40,
    medianSalary: 75000,
    creativityRequired: 70,
    aiReplacements: 'EMERGING',
    riskFactors: ['website builders', 'AI code generation'],
    aiTools: ['Wix ADI', 'Webflow', 'ChatGPT'],
    timeToAutomation: '5-8 years'
  },

  // Healthcare
  'nurse': {
    title: 'Nurse',
    category: 'Healthcare',
    automationRisk: 18,
    medianSalary: 65000,
    creativityRequired: 60,
    aiReplacements: 'MINIMAL',
    riskFactors: ['patient care', 'emotional support'],
    aiTools: ['AI diagnostics', 'telemedicine'],
    timeToAutomation: '15+ years'
  },
  'doctor': {
    title: 'Doctor',
    category: 'Healthcare',
    automationRisk: 12,
    medianSalary: 200000,
    creativityRequired: 90,
    aiReplacements: 'MINIMAL',
    riskFactors: ['AI diagnostics', 'telemedicine'],
    aiTools: ['IBM Watson', 'Google Health AI'],
    timeToAutomation: '20+ years'
  },
  'medical technician': {
    title: 'Medical Technician',
    category: 'Healthcare',
    automationRisk: 55,
    medianSalary: 45000,
    creativityRequired: 30,
    aiReplacements: 'ACTIVE',
    riskFactors: ['lab automation', 'imaging analysis'],
    aiTools: ['Lab automation systems', 'AI imaging'],
    timeToAutomation: '3-5 years'
  },

  // Education
  'teacher': {
    title: 'Teacher',
    category: 'Education',
    automationRisk: 45,
    medianSalary: 48000,
    creativityRequired: 75,
    aiReplacements: 'PARTIAL',
    riskFactors: ['online learning', 'AI tutoring'],
    aiTools: ['Khan Academy', 'Duolingo', 'ChatGPT'],
    timeToAutomation: '8-12 years'
  },
  'professor': {
    title: 'Professor',
    category: 'Education',
    automationRisk: 30,
    medianSalary: 85000,
    creativityRequired: 85,
    aiReplacements: 'LIMITED',
    riskFactors: ['research', 'mentoring'],
    aiTools: ['AI research tools', 'online platforms'],
    timeToAutomation: '15+ years'
  },

  // Retail & Customer Service
  'cashier': {
    title: 'Cashier',
    category: 'Retail',
    automationRisk: 92,
    medianSalary: 28000,
    creativityRequired: 10,
    aiReplacements: 'EVERYWHERE',
    riskFactors: ['self-checkout', 'mobile payments'],
    aiTools: ['Self-checkout systems', 'Amazon Go'],
    timeToAutomation: '1-2 years'
  },
  'customer service representative': {
    title: 'Customer Service Representative',
    category: 'Retail',
    automationRisk: 82,
    medianSalary: 35000,
    creativityRequired: 25,
    aiReplacements: 'ACTIVE',
    riskFactors: ['chatbots', 'AI voice systems'],
    aiTools: ['ChatGPT', 'Intercom', 'Zendesk AI'],
    timeToAutomation: '2-4 years'
  },

  // Creative & Media
  'graphic designer': {
    title: 'Graphic Designer',
    category: 'Media',
    automationRisk: 67,
    medianSalary: 52000,
    creativityRequired: 80,
    aiReplacements: 'EMERGING',
    riskFactors: ['AI image generation', 'template design'],
    aiTools: ['Midjourney', 'DALL-E', 'Canva AI'],
    timeToAutomation: '3-6 years'
  },
  'content writer': {
    title: 'Content Writer',
    category: 'Media',
    automationRisk: 75,
    medianSalary: 45000,
    creativityRequired: 70,
    aiReplacements: 'ACTIVE',
    riskFactors: ['AI writing tools', 'content generation'],
    aiTools: ['ChatGPT', 'Jasper', 'Copy.ai'],
    timeToAutomation: '2-4 years'
  },
  'video editor': {
    title: 'Video Editor',
    category: 'Media',
    automationRisk: 58,
    medianSalary: 55000,
    creativityRequired: 75,
    aiReplacements: 'EMERGING',
    riskFactors: ['AI video editing', 'automated cuts'],
    aiTools: ['Runway ML', 'CapCut AI', 'Adobe Firefly'],
    timeToAutomation: '4-7 years'
  },

  // Legal
  'lawyer': {
    title: 'Lawyer',
    category: 'Legal',
    automationRisk: 34,
    medianSalary: 120000,
    creativityRequired: 70,
    aiReplacements: 'LIMITED',
    riskFactors: ['document review', 'legal research'],
    aiTools: ['LexisNexis AI', 'DoNotPay', 'Harvey AI'],
    timeToAutomation: '8-12 years'
  },
  'paralegal': {
    title: 'Paralegal',
    category: 'Legal',
    automationRisk: 65,
    medianSalary: 52000,
    creativityRequired: 40,
    aiReplacements: 'ACTIVE',
    riskFactors: ['document preparation', 'research'],
    aiTools: ['Legal AI tools', 'document automation'],
    timeToAutomation: '3-6 years'
  },

  // Manufacturing
  'factory worker': {
    title: 'Factory Worker',
    category: 'Manufacturing',
    automationRisk: 85,
    medianSalary: 35000,
    creativityRequired: 20,
    aiReplacements: 'ACTIVE',
    riskFactors: ['robotics', 'automation'],
    aiTools: ['Industrial robots', 'IoT sensors'],
    timeToAutomation: '2-5 years'
  },
  'quality inspector': {
    title: 'Quality Inspector',
    category: 'Manufacturing',
    automationRisk: 78,
    medianSalary: 42000,
    creativityRequired: 25,
    aiReplacements: 'ACTIVE',
    riskFactors: ['computer vision', 'AI inspection'],
    aiTools: ['AI vision systems', 'IoT monitoring'],
    timeToAutomation: '3-5 years'
  }
};

// Analyze job endpoint
router.post('/analyze', validateJobTitle, async (req, res) => {
  try {
    const { jobTitle } = req.body;
    const normalizedTitle = jobTitle.toLowerCase().trim();
    
    logger.info(`Analyzing job: ${jobTitle}`);

    // Check if job exists in database
    let jobData = jobDatabase[normalizedTitle];
    
    if (!jobData) {
      // Generate analysis for unknown job
      jobData = await analyzeJob(jobTitle);
    }

    // Calculate cooked score and level
    const cookedScore = jobData.automationRisk;
    const cookedLevel = getCookedLevel(cookedScore);
    
    // Generate funny summary
    const funnySummary = generateFunnySummary(jobData);
    
    // Prepare response
    const response = {
      title: jobData.title,
      category: jobData.category,
      cookedScore: cookedScore,
      cookedLevel: cookedLevel,
      summary: funnySummary,
      automationRisk: jobData.automationRisk,
      medianSalary: `$${jobData.medianSalary.toLocaleString()}`,
      aiReplacements: jobData.aiReplacements,
      creativityRequired: jobData.creativityRequired,
      riskFactors: jobData.riskFactors,
      aiTools: jobData.aiTools,
      timeToAutomation: jobData.timeToAutomation,
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error) {
    logger.error('Error analyzing job:', error);
    res.status(500).json({
      error: 'Failed to analyze job',
      message: error.message
    });
  }
});

// Get random job endpoint
router.get('/random', async (req, res) => {
  try {
    const randomJob = await generateRandomJob(jobDatabase);
    res.json(randomJob);
  } catch (error) {
    logger.error('Error generating random job:', error);
    res.status(500).json({
      error: 'Failed to generate random job',
      message: error.message
    });
  }
});

// Get job categories endpoint
router.get('/categories', async (req, res) => {
  try {
    const categories = await getJobCategories(jobDatabase);
    res.json(categories);
  } catch (error) {
    logger.error('Error getting job categories:', error);
    res.status(500).json({
      error: 'Failed to get job categories',
      message: error.message
    });
  }
});

// Get jobs by category endpoint
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const categoryJobs = Object.values(jobDatabase).filter(
      job => job.category.toLowerCase() === category.toLowerCase()
    );
    
    if (categoryJobs.length === 0) {
      return res.status(404).json({
        error: 'Category not found',
        message: `No jobs found in category: ${category}`
      });
    }
    
    res.json({
      category: category,
      jobs: categoryJobs,
      count: categoryJobs.length
    });
  } catch (error) {
    logger.error('Error getting jobs by category:', error);
    res.status(500).json({
      error: 'Failed to get jobs by category',
      message: error.message
    });
  }
});

// Get all jobs endpoint (for admin/debugging)
router.get('/all', async (req, res) => {
  try {
    res.json({
      jobs: jobDatabase,
      count: Object.keys(jobDatabase).length,
      categories: [...new Set(Object.values(jobDatabase).map(job => job.category))]
    });
  } catch (error) {
    logger.error('Error getting all jobs:', error);
    res.status(500).json({
      error: 'Failed to get all jobs',
      message: error.message
    });
  }
});

// Helper functions
function getCookedLevel(score) {
  if (score >= 90) return 'BURNT 🔥';
  if (score >= 75) return 'WELL-DONE';
  if (score >= 50) return 'SIMMERING';
  if (score >= 25) return 'MEDIUM RARE';
  return 'RAW';
}

function generateFunnySummary(jobData) {
  const summaries = {
    high: [
      `Bad news chief... GPT just did your annual report in 12 seconds and didn't even ask for coffee.`,
      `Oof. Even a potato could do this job better. Actually, a potato probably IS doing this job now.`,
      `The robots are already doing this better than you. Time to learn how to code or become a robot whisperer.`,
      `AI can handle ${jobData.automationRisk}% of your daily tasks. The other ${100 - jobData.automationRisk}% is just pretending to be busy.`
    ],
    medium: [
      `AI can do parts of this job, but not the important stuff. You're safe... for now.`,
      `ChatGPT is already handling complaints better than humans. At least it doesn't need therapy.`,
      `AI can make logos now, but it still can't argue with clients about why Comic Sans is a terrible choice.`,
      `Surprisingly, humans are still better at this. Who knew?`
    ],
    low: [
      `Plot twist: You're the one cooking everyone else's jobs. Congrats, you're basically a digital chef.`,
      `Robots can't give hugs or deal with bodily fluids with the same grace. You're basically irreplaceable.`,
      `AI can research cases but can't bill clients for breathing. Your job security is measured in billable hours.`,
      `This job is basically AI-proof. Congratulations!`
    ]
  };

  let category;
  if (jobData.automationRisk >= 70) category = 'high';
  else if (jobData.automationRisk >= 40) category = 'medium';
  else category = 'low';

  const categorySummaries = summaries[category];
  return categorySummaries[Math.floor(Math.random() * categorySummaries.length)];
}

module.exports = router;

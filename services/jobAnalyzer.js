const OpenAI = require('openai');

// Simple console logger
const logger = {
  info: (message) => console.log(`[INFO] ${message}`),
  error: (message) => console.error(`[ERROR] ${message}`),
  warn: (message) => console.warn(`[WARN] ${message}`)
};

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Job category mapping for better analysis
const jobCategories = {
  'finance': ['accountant', 'analyst', 'banker', 'financial', 'investment', 'trading', 'auditor'],
  'technology': ['developer', 'engineer', 'programmer', 'scientist', 'architect', 'devops', 'data'],
  'healthcare': ['doctor', 'nurse', 'therapist', 'technician', 'medical', 'health', 'clinical'],
  'education': ['teacher', 'professor', 'instructor', 'educator', 'tutor', 'academic'],
  'retail': ['cashier', 'sales', 'customer', 'service', 'representative', 'clerk'],
  'media': ['designer', 'writer', 'editor', 'content', 'creative', 'artist', 'journalist'],
  'legal': ['lawyer', 'attorney', 'paralegal', 'legal', 'counsel', 'advocate'],
  'manufacturing': ['worker', 'operator', 'technician', 'inspector', 'factory', 'production']
};

// Automation risk factors and their weights
const riskFactors = {
  'data entry': 0.8,
  'repetitive tasks': 0.7,
  'rule-based decisions': 0.6,
  'document processing': 0.75,
  'customer service': 0.65,
  'basic analysis': 0.5,
  'reporting': 0.6,
  'scheduling': 0.7,
  'quality control': 0.8,
  'inventory management': 0.75,
  'basic coding': 0.4,
  'content creation': 0.6,
  'translation': 0.8,
  'bookkeeping': 0.85,
  'data collection': 0.7,
  'phone support': 0.8,
  'email handling': 0.7,
  'form processing': 0.8,
  'basic research': 0.5,
  'social media management': 0.6
};

// AI tools by category
const aiToolsByCategory = {
  'finance': ['QuickBooks AI', 'Xero', 'Sage Intacct', 'Tableau AI', 'Power BI'],
  'technology': ['GitHub Copilot', 'ChatGPT', 'Claude', 'AutoML', 'DataRobot'],
  'healthcare': ['IBM Watson', 'Google Health AI', 'AI diagnostics', 'telemedicine'],
  'education': ['Khan Academy', 'Duolingo', 'ChatGPT', 'AI tutoring systems'],
  'retail': ['ChatGPT', 'Intercom', 'Zendesk AI', 'Self-checkout systems'],
  'media': ['Midjourney', 'DALL-E', 'Canva AI', 'ChatGPT', 'Jasper'],
  'legal': ['LexisNexis AI', 'DoNotPay', 'Harvey AI', 'Legal AI tools'],
  'manufacturing': ['Industrial robots', 'IoT sensors', 'AI vision systems']
};

/**
 * Analyze a job title and return automation risk assessment
 * @param {string} jobTitle - The job title to analyze
 * @returns {Object} Job analysis data
 */
async function analyzeJob(jobTitle) {
  try {
    logger.info(`Analyzing unknown job: ${jobTitle}`);

    // First, try to categorize the job
    const category = categorizeJob(jobTitle);
    
    // Calculate base automation risk
    const baseRisk = calculateBaseRisk(jobTitle, category);
    
    // Try to get AI analysis if OpenAI is available
    let aiAnalysis = null;
    if (process.env.OPENAI_API_KEY) {
      try {
        aiAnalysis = await getAIAnalysis(jobTitle, category);
      } catch (error) {
        logger.warn('OpenAI analysis failed, using fallback:', error.message);
      }
    }
    
    // Combine base analysis with AI analysis
    const finalAnalysis = combineAnalysis(jobTitle, category, baseRisk, aiAnalysis);
    
    logger.info(`Job analysis completed: ${jobTitle} - Risk: ${finalAnalysis.automationRisk}%`);
    
    return finalAnalysis;
  } catch (error) {
    logger.error('Error in job analysis:', error);
    // Return fallback analysis
    return generateFallbackAnalysis(jobTitle);
  }
}

/**
 * Categorize job based on keywords
 */
function categorizeJob(jobTitle) {
  const title = jobTitle.toLowerCase();
  
  for (const [category, keywords] of Object.entries(jobCategories)) {
    if (keywords.some(keyword => title.includes(keyword))) {
      return category;
    }
  }
  
  // Default categorization based on common patterns
  if (title.includes('manager') || title.includes('director') || title.includes('executive')) {
    return 'management';
  }
  if (title.includes('assistant') || title.includes('coordinator') || title.includes('specialist')) {
    return 'administrative';
  }
  
  return 'general';
}

/**
 * Calculate base automation risk
 */
function calculateBaseRisk(jobTitle, category) {
  const title = jobTitle.toLowerCase();
  let riskScore = 0;
  let factorCount = 0;
  
  // Check for risk factors in job title
  for (const [factor, weight] of Object.entries(riskFactors)) {
    if (title.includes(factor.replace(' ', '')) || title.includes(factor)) {
      riskScore += weight;
      factorCount++;
    }
  }
  
  // Category-based adjustments
  const categoryAdjustments = {
    'finance': 0.1,
    'technology': -0.2,
    'healthcare': -0.3,
    'education': -0.1,
    'retail': 0.2,
    'media': 0.0,
    'legal': -0.2,
    'manufacturing': 0.3,
    'management': -0.3,
    'administrative': 0.1,
    'general': 0.0
  };
  
  const categoryAdjustment = categoryAdjustments[category] || 0;
  
  // Calculate final risk
  let finalRisk = factorCount > 0 ? (riskScore / factorCount) * 100 : 50;
  finalRisk += categoryAdjustment * 100;
  
  // Ensure risk is between 0 and 100
  finalRisk = Math.max(0, Math.min(100, finalRisk));
  
  return Math.round(finalRisk);
}

/**
 * Get AI analysis from OpenAI
 */
async function getAIAnalysis(jobTitle, category) {
  try {
    const prompt = `Analyze the automation risk for the job title "${jobTitle}" in the ${category} category. 
    
    Consider factors like:
    - Repetitive vs creative tasks
    - Data processing requirements
    - Human interaction needs
    - Decision-making complexity
    - Current AI capabilities in this field
    
    Return a JSON response with:
    {
      "automationRisk": number (0-100),
      "creativityRequired": number (0-100),
      "riskFactors": [array of strings],
      "aiTools": [array of relevant AI tools],
      "timeToAutomation": "string (e.g., '2-3 years')",
      "reasoning": "brief explanation"
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert in job market analysis and AI automation trends. Provide accurate, data-driven assessments."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    const response = completion.choices[0].message.content;
    
    try {
      return JSON.parse(response);
    } catch (parseError) {
      logger.warn('Failed to parse AI response:', parseError);
      return null;
    }
  } catch (error) {
    logger.error('OpenAI API error:', error);
    throw error;
  }
}

/**
 * Combine base analysis with AI analysis
 */
function combineAnalysis(jobTitle, category, baseRisk, aiAnalysis) {
  let finalRisk = baseRisk;
  let creativityRequired = 50;
  let riskFactors = [];
  let aiTools = [];
  let timeToAutomation = '5-10 years';
  
  if (aiAnalysis) {
    // Weight AI analysis more heavily
    finalRisk = Math.round((baseRisk * 0.3) + (aiAnalysis.automationRisk * 0.7));
    creativityRequired = aiAnalysis.creativityRequired || 50;
    riskFactors = aiAnalysis.riskFactors || [];
    aiTools = aiAnalysis.aiTools || [];
    timeToAutomation = aiAnalysis.timeToAutomation || '5-10 years';
  } else {
    // Use fallback values
    creativityRequired = Math.max(20, 100 - finalRisk);
    riskFactors = getDefaultRiskFactors(category);
    aiTools = aiToolsByCategory[category] || ['General AI tools'];
    timeToAutomation = getTimeToAutomation(finalRisk);
  }
  
  // Estimate salary based on risk and category
  const estimatedSalary = estimateSalary(category, finalRisk, creativityRequired);
  
  return {
    title: jobTitle.charAt(0).toUpperCase() + jobTitle.slice(1),
    category: category.charAt(0).toUpperCase() + category.slice(1),
    automationRisk: finalRisk,
    medianSalary: estimatedSalary,
    creativityRequired: Math.round(creativityRequired),
    aiReplacements: getReplacementStatus(finalRisk),
    riskFactors: riskFactors,
    aiTools: aiTools,
    timeToAutomation: timeToAutomation
  };
}

/**
 * Generate fallback analysis when all else fails
 */
function generateFallbackAnalysis(jobTitle) {
  const randomRisk = Math.floor(Math.random() * 60) + 20; // 20-80 range
  const category = categorizeJob(jobTitle);
  
  return {
    title: jobTitle.charAt(0).toUpperCase() + jobTitle.slice(1),
    category: category.charAt(0).toUpperCase() + category.slice(1),
    automationRisk: randomRisk,
    medianSalary: Math.floor(Math.random() * 80000) + 30000,
    creativityRequired: Math.max(20, 100 - randomRisk),
    aiReplacements: getReplacementStatus(randomRisk),
    riskFactors: getDefaultRiskFactors(category),
    aiTools: aiToolsByCategory[category] || ['General AI tools'],
    timeToAutomation: getTimeToAutomation(randomRisk)
  };
}

/**
 * Get default risk factors by category
 */
function getDefaultRiskFactors(category) {
  const defaultFactors = {
    'finance': ['data processing', 'reporting', 'analysis'],
    'technology': ['code generation', 'testing', 'documentation'],
    'healthcare': ['data entry', 'scheduling', 'basic diagnostics'],
    'education': ['grading', 'content creation', 'administration'],
    'retail': ['customer service', 'inventory', 'transactions'],
    'media': ['content creation', 'editing', 'formatting'],
    'legal': ['document review', 'research', 'form preparation'],
    'manufacturing': ['quality control', 'monitoring', 'assembly'],
    'management': ['reporting', 'scheduling', 'communication'],
    'administrative': ['data entry', 'scheduling', 'documentation'],
    'general': ['repetitive tasks', 'data processing', 'basic analysis']
  };
  
  return defaultFactors[category] || ['general automation'];
}

/**
 * Get replacement status based on risk
 */
function getReplacementStatus(risk) {
  if (risk >= 80) return 'ACTIVE';
  if (risk >= 60) return 'EMERGING';
  if (risk >= 40) return 'LIMITED';
  return 'MINIMAL';
}

/**
 * Get time to automation based on risk
 */
function getTimeToAutomation(risk) {
  if (risk >= 80) return '1-3 years';
  if (risk >= 60) return '3-5 years';
  if (risk >= 40) return '5-10 years';
  return '10+ years';
}

/**
 * Estimate salary based on category and risk
 */
function estimateSalary(category, risk, creativity) {
  const baseSalaries = {
    'finance': 65000,
    'technology': 85000,
    'healthcare': 70000,
    'education': 50000,
    'retail': 35000,
    'media': 55000,
    'legal': 80000,
    'manufacturing': 45000,
    'management': 75000,
    'administrative': 45000,
    'general': 50000
  };
  
  let baseSalary = baseSalaries[category] || 50000;
  
  // Adjust for risk (higher risk = lower salary)
  const riskAdjustment = (100 - risk) / 100;
  
  // Adjust for creativity (higher creativity = higher salary)
  const creativityAdjustment = creativity / 100;
  
  const finalSalary = Math.round(baseSalary * (0.8 + (riskAdjustment * 0.2) + (creativityAdjustment * 0.3)));
  
  return Math.max(25000, Math.min(200000, finalSalary));
}

module.exports = {
  analyzeJob
};

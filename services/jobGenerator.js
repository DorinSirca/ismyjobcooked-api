const { logger } = require('../utils/logger');

// Extended job database for random generation
const extendedJobDatabase = {
  // Finance & Accounting
  'junior accountant': { title: 'Junior Accountant', category: 'Finance', automationRisk: 88 },
  'senior accountant': { title: 'Senior Accountant', category: 'Finance', automationRisk: 75 },
  'financial analyst': { title: 'Financial Analyst', category: 'Finance', automationRisk: 45 },
  'investment banker': { title: 'Investment Banker', category: 'Finance', automationRisk: 25 },
  'auditor': { title: 'Auditor', category: 'Finance', automationRisk: 70 },
  'bookkeeper': { title: 'Bookkeeper', category: 'Finance', automationRisk: 92 },
  'tax preparer': { title: 'Tax Preparer', category: 'Finance', automationRisk: 85 },
  'credit analyst': { title: 'Credit Analyst', category: 'Finance', automationRisk: 60 },
  'treasurer': { title: 'Treasurer', category: 'Finance', automationRisk: 35 },
  'financial advisor': { title: 'Financial Advisor', category: 'Finance', automationRisk: 40 },

  // Technology
  'software developer': { title: 'Software Developer', category: 'Technology', automationRisk: 23 },
  'data scientist': { title: 'Data Scientist', category: 'Technology', automationRisk: 35 },
  'web developer': { title: 'Web Developer', category: 'Technology', automationRisk: 40 },
  'devops engineer': { title: 'DevOps Engineer', category: 'Technology', automationRisk: 30 },
  'product manager': { title: 'Product Manager', category: 'Technology', automationRisk: 20 },
  'system administrator': { title: 'System Administrator', category: 'Technology', automationRisk: 45 },
  'database administrator': { title: 'Database Administrator', category: 'Technology', automationRisk: 50 },
  'network engineer': { title: 'Network Engineer', category: 'Technology', automationRisk: 35 },
  'cybersecurity analyst': { title: 'Cybersecurity Analyst', category: 'Technology', automationRisk: 25 },
  'machine learning engineer': { title: 'Machine Learning Engineer', category: 'Technology', automationRisk: 15 },

  // Healthcare
  'nurse': { title: 'Nurse', category: 'Healthcare', automationRisk: 18 },
  'doctor': { title: 'Doctor', category: 'Healthcare', automationRisk: 12 },
  'medical technician': { title: 'Medical Technician', category: 'Healthcare', automationRisk: 55 },
  'pharmacist': { title: 'Pharmacist', category: 'Healthcare', automationRisk: 30 },
  'physical therapist': { title: 'Physical Therapist', category: 'Healthcare', automationRisk: 20 },
  'radiologist': { title: 'Radiologist', category: 'Healthcare', automationRisk: 40 },
  'medical assistant': { title: 'Medical Assistant', category: 'Healthcare', automationRisk: 65 },
  'dental hygienist': { title: 'Dental Hygienist', category: 'Healthcare', automationRisk: 25 },
  'respiratory therapist': { title: 'Respiratory Therapist', category: 'Healthcare', automationRisk: 30 },
  'occupational therapist': { title: 'Occupational Therapist', category: 'Healthcare', automationRisk: 15 },

  // Education
  'teacher': { title: 'Teacher', category: 'Education', automationRisk: 45 },
  'professor': { title: 'Professor', category: 'Education', automationRisk: 30 },
  'tutor': { title: 'Tutor', category: 'Education', automationRisk: 50 },
  'school administrator': { title: 'School Administrator', category: 'Education', automationRisk: 35 },
  'librarian': { title: 'Librarian', category: 'Education', automationRisk: 60 },
  'guidance counselor': { title: 'Guidance Counselor', category: 'Education', automationRisk: 25 },
  'special education teacher': { title: 'Special Education Teacher', category: 'Education', automationRisk: 20 },
  'curriculum developer': { title: 'Curriculum Developer', category: 'Education', automationRisk: 40 },
  'educational consultant': { title: 'Educational Consultant', category: 'Education', automationRisk: 30 },
  'online instructor': { title: 'Online Instructor', category: 'Education', automationRisk: 55 },

  // Retail & Customer Service
  'cashier': { title: 'Cashier', category: 'Retail', automationRisk: 92 },
  'customer service representative': { title: 'Customer Service Representative', category: 'Retail', automationRisk: 82 },
  'sales associate': { title: 'Sales Associate', category: 'Retail', automationRisk: 70 },
  'store manager': { title: 'Store Manager', category: 'Retail', automationRisk: 45 },
  'retail supervisor': { title: 'Retail Supervisor', category: 'Retail', automationRisk: 50 },
  'inventory specialist': { title: 'Inventory Specialist', category: 'Retail', automationRisk: 80 },
  'loss prevention specialist': { title: 'Loss Prevention Specialist', category: 'Retail', automationRisk: 60 },
  'merchandiser': { title: 'Merchandiser', category: 'Retail', automationRisk: 65 },
  'retail buyer': { title: 'Retail Buyer', category: 'Retail', automationRisk: 40 },
  'customer success manager': { title: 'Customer Success Manager', category: 'Retail', automationRisk: 35 },

  // Creative & Media
  'graphic designer': { title: 'Graphic Designer', category: 'Media', automationRisk: 67 },
  'content writer': { title: 'Content Writer', category: 'Media', automationRisk: 75 },
  'video editor': { title: 'Video Editor', category: 'Media', automationRisk: 58 },
  'photographer': { title: 'Photographer', category: 'Media', automationRisk: 45 },
  'journalist': { title: 'Journalist', category: 'Media', automationRisk: 60 },
  'social media manager': { title: 'Social Media Manager', category: 'Media', automationRisk: 70 },
  'marketing specialist': { title: 'Marketing Specialist', category: 'Media', automationRisk: 55 },
  'public relations specialist': { title: 'Public Relations Specialist', category: 'Media', automationRisk: 40 },
  'copywriter': { title: 'Copywriter', category: 'Media', automationRisk: 65 },
  'art director': { title: 'Art Director', category: 'Media', automationRisk: 35 },

  // Legal
  'lawyer': { title: 'Lawyer', category: 'Legal', automationRisk: 34 },
  'paralegal': { title: 'Paralegal', category: 'Legal', automationRisk: 65 },
  'legal assistant': { title: 'Legal Assistant', category: 'Legal', automationRisk: 75 },
  'court reporter': { title: 'Court Reporter', category: 'Legal', automationRisk: 80 },
  'legal secretary': { title: 'Legal Secretary', category: 'Legal', automationRisk: 85 },
  'compliance officer': { title: 'Compliance Officer', category: 'Legal', automationRisk: 45 },
  'contract administrator': { title: 'Contract Administrator', category: 'Legal', automationRisk: 60 },
  'intellectual property specialist': { title: 'Intellectual Property Specialist', category: 'Legal', automationRisk: 50 },
  'litigation support specialist': { title: 'Litigation Support Specialist', category: 'Legal', automationRisk: 55 },
  'legal researcher': { title: 'Legal Researcher', category: 'Legal', automationRisk: 70 },

  // Manufacturing
  'factory worker': { title: 'Factory Worker', category: 'Manufacturing', automationRisk: 85 },
  'quality inspector': { title: 'Quality Inspector', category: 'Manufacturing', automationRisk: 78 },
  'production supervisor': { title: 'Production Supervisor', category: 'Manufacturing', automationRisk: 50 },
  'machine operator': { title: 'Machine Operator', category: 'Manufacturing', automationRisk: 80 },
  'industrial engineer': { title: 'Industrial Engineer', category: 'Manufacturing', automationRisk: 30 },
  'maintenance technician': { title: 'Maintenance Technician', category: 'Manufacturing', automationRisk: 40 },
  'welder': { title: 'Welder', category: 'Manufacturing', automationRisk: 60 },
  'assembler': { title: 'Assembler', category: 'Manufacturing', automationRisk: 85 },
  'machinist': { title: 'Machinist', category: 'Manufacturing', automationRisk: 65 },
  'safety coordinator': { title: 'Safety Coordinator', category: 'Manufacturing', automationRisk: 45 },

  // Administrative & Office
  'administrative assistant': { title: 'Administrative Assistant', category: 'Administrative', automationRisk: 75 },
  'executive assistant': { title: 'Executive Assistant', category: 'Administrative', automationRisk: 60 },
  'office manager': { title: 'Office Manager', category: 'Administrative', automationRisk: 55 },
  'receptionist': { title: 'Receptionist', category: 'Administrative', automationRisk: 80 },
  'data entry clerk': { title: 'Data Entry Clerk', category: 'Administrative', automationRisk: 95 },
  'file clerk': { title: 'File Clerk', category: 'Administrative', automationRisk: 90 },
  'secretary': { title: 'Secretary', category: 'Administrative', automationRisk: 85 },
  'coordinator': { title: 'Coordinator', category: 'Administrative', automationRisk: 65 },
  'scheduler': { title: 'Scheduler', category: 'Administrative', automationRisk: 70 },
  'records manager': { title: 'Records Manager', category: 'Administrative', automationRisk: 75 },

  // Management
  'project manager': { title: 'Project Manager', category: 'Management', automationRisk: 35 },
  'operations manager': { title: 'Operations Manager', category: 'Management', automationRisk: 40 },
  'human resources manager': { title: 'Human Resources Manager', category: 'Management', automationRisk: 45 },
  'marketing manager': { title: 'Marketing Manager', category: 'Management', automationRisk: 30 },
  'sales manager': { title: 'Sales Manager', category: 'Management', automationRisk: 35 },
  'finance manager': { title: 'Finance Manager', category: 'Management', automationRisk: 40 },
  'general manager': { title: 'General Manager', category: 'Management', automationRisk: 25 },
  'department head': { title: 'Department Head', category: 'Management', automationRisk: 30 },
  'team lead': { title: 'Team Lead', category: 'Management', automationRisk: 35 },
  'supervisor': { title: 'Supervisor', category: 'Management', automationRisk: 40 }
};

// Fun job titles for the "Degen AI Predictor"
const degenJobTitles = [
  'Crypto Vibes Manager',
  'Chief Meme Officer',
  'Blockchain Whisperer',
  'NFT Curator',
  'Metaverse Architect',
  'TikTok Shaman',
  'AI Therapist',
  'Digital Nomad Coordinator',
  'Influencer Wrangler',
  'Productivity Guru',
  'Vibe Consultant',
  'Energy Healer',
  'Crystal Grid Designer',
  'Aura Photographer',
  'Chakra Balancer',
  'Moon Phase Coordinator',
  'Astral Projection Guide',
  'Quantum Manifestation Coach',
  'Reality Shifter',
  'Consciousness Expander',
  'Vibrational Frequency Tuner',
  'Ethereal Experience Designer',
  'Cosmic Alignment Specialist',
  'Dimensional Gateway Operator',
  'Soul Purpose Navigator'
];

/**
 * Generate a random job from the database
 * @param {Object} jobDatabase - The job database to use
 * @returns {Object} Random job data
 */
async function generateRandomJob(jobDatabase) {
  try {
    const jobEntries = Object.entries(jobDatabase);
    const randomEntry = jobEntries[Math.floor(Math.random() * jobEntries.length)];
    const [jobKey, jobData] = randomEntry;
    
    logger.info(`Random job generated: ${jobData.title}`);
    
    return {
      ...jobData,
      key: jobKey,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Error generating random job:', error);
    throw error;
  }
}

/**
 * Generate a random job from a specific category
 * @param {string} category - The job category
 * @param {Object} jobDatabase - The job database to use
 * @returns {Object} Random job data from category
 */
async function generateRandomJobByCategory(category, jobDatabase) {
  try {
    const categoryJobs = Object.entries(jobDatabase).filter(
      ([key, job]) => job.category.toLowerCase() === category.toLowerCase()
    );
    
    if (categoryJobs.length === 0) {
      throw new Error(`No jobs found in category: ${category}`);
    }
    
    const randomEntry = categoryJobs[Math.floor(Math.random() * categoryJobs.length)];
    const [jobKey, jobData] = randomEntry;
    
    logger.info(`Random job generated from category ${category}: ${jobData.title}`);
    
    return {
      ...jobData,
      key: jobKey,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Error generating random job by category:', error);
    throw error;
  }
}

/**
 * Generate a completely random "degen" job title
 * @returns {Object} Random degen job data
 */
async function generateDegenJob() {
  try {
    const randomTitle = degenJobTitles[Math.floor(Math.random() * degenJobTitles.length)];
    const randomRisk = Math.floor(Math.random() * 100) + 1;
    const randomSalary = Math.floor(Math.random() * 200000) + 50000;
    
    const degenJob = {
      title: randomTitle,
      category: 'Degen',
      automationRisk: randomRisk,
      medianSalary: randomSalary,
      creativityRequired: Math.floor(Math.random() * 100) + 1,
      aiReplacements: 'QUANTUM',
      riskFactors: ['reality distortion', 'vibe interference', 'dimensional shifts'],
      aiTools: ['Quantum AI', 'Vibe Detector', 'Reality Shifter 3000'],
      timeToAutomation: 'Already automated in parallel universe',
      timestamp: new Date().toISOString()
    };
    
    logger.info(`Degen job generated: ${randomTitle}`);
    
    return degenJob;
  } catch (error) {
    logger.error('Error generating degen job:', error);
    throw error;
  }
}

/**
 * Get a random job with specific risk level
 * @param {string} riskLevel - 'low', 'medium', 'high'
 * @param {Object} jobDatabase - The job database to use
 * @returns {Object} Random job with specified risk level
 */
async function generateRandomJobByRisk(riskLevel, jobDatabase) {
  try {
    let filteredJobs;
    
    switch (riskLevel.toLowerCase()) {
      case 'low':
        filteredJobs = Object.entries(jobDatabase).filter(
          ([key, job]) => job.automationRisk < 40
        );
        break;
      case 'medium':
        filteredJobs = Object.entries(jobDatabase).filter(
          ([key, job]) => job.automationRisk >= 40 && job.automationRisk < 70
        );
        break;
      case 'high':
        filteredJobs = Object.entries(jobDatabase).filter(
          ([key, job]) => job.automationRisk >= 70
        );
        break;
      default:
        throw new Error('Invalid risk level. Use: low, medium, or high');
    }
    
    if (filteredJobs.length === 0) {
      throw new Error(`No jobs found with ${riskLevel} automation risk`);
    }
    
    const randomEntry = filteredJobs[Math.floor(Math.random() * filteredJobs.length)];
    const [jobKey, jobData] = randomEntry;
    
    logger.info(`Random ${riskLevel} risk job generated: ${jobData.title}`);
    
    return {
      ...jobData,
      key: jobKey,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Error generating random job by risk:', error);
    throw error;
  }
}

/**
 * Get multiple random jobs
 * @param {number} count - Number of jobs to generate
 * @param {Object} jobDatabase - The job database to use
 * @returns {Array} Array of random job data
 */
async function generateMultipleRandomJobs(count = 5, jobDatabase) {
  try {
    const jobs = [];
    const jobEntries = Object.entries(jobDatabase);
    
    for (let i = 0; i < count && i < jobEntries.length; i++) {
      const randomIndex = Math.floor(Math.random() * jobEntries.length);
      const [jobKey, jobData] = jobEntries[randomIndex];
      
      jobs.push({
        ...jobData,
        key: jobKey,
        timestamp: new Date().toISOString()
      });
      
      // Remove selected job to avoid duplicates
      jobEntries.splice(randomIndex, 1);
    }
    
    logger.info(`Generated ${jobs.length} random jobs`);
    
    return jobs;
  } catch (error) {
    logger.error('Error generating multiple random jobs:', error);
    throw error;
  }
}

/**
 * Get trending jobs based on automation risk
 * @param {number} count - Number of trending jobs to return
 * @param {Object} jobDatabase - The job database to use
 * @returns {Array} Array of trending job data
 */
async function getTrendingJobs(count = 10, jobDatabase) {
  try {
    const jobEntries = Object.entries(jobDatabase);
    
    // Sort by automation risk (highest first for "trending" effect)
    const sortedJobs = jobEntries
      .sort((a, b) => b[1].automationRisk - a[1].automationRisk)
      .slice(0, count)
      .map(([jobKey, jobData]) => ({
        ...jobData,
        key: jobKey,
        timestamp: new Date().toISOString()
      }));
    
    logger.info(`Generated ${sortedJobs.length} trending jobs`);
    
    return sortedJobs;
  } catch (error) {
    logger.error('Error getting trending jobs:', error);
    throw error;
  }
}

module.exports = {
  generateRandomJob,
  generateRandomJobByCategory,
  generateDegenJob,
  generateRandomJobByRisk,
  generateMultipleRandomJobs,
  getTrendingJobs,
  extendedJobDatabase,
  degenJobTitles
};

const { logger } = require('../utils/logger');

// Job categories with metadata
const jobCategories = {
  'Finance': {
    name: 'Finance',
    description: 'Financial services, accounting, and investment roles',
    icon: 'fas fa-chart-line',
    color: 'text-green-400',
    automationTrend: 'high',
    totalJobs: 0,
    averageRisk: 0
  },
  'Technology': {
    name: 'Technology',
    description: 'Software development, IT, and technical roles',
    icon: 'fas fa-code',
    color: 'text-cyan-400',
    automationTrend: 'medium',
    totalJobs: 0,
    averageRisk: 0
  },
  'Healthcare': {
    name: 'Healthcare',
    description: 'Medical, nursing, and healthcare support roles',
    icon: 'fas fa-heartbeat',
    color: 'text-pink-400',
    automationTrend: 'low',
    totalJobs: 0,
    averageRisk: 0
  },
  'Education': {
    name: 'Education',
    description: 'Teaching, academic, and educational support roles',
    icon: 'fas fa-graduation-cap',
    color: 'text-blue-400',
    automationTrend: 'medium',
    totalJobs: 0,
    averageRisk: 0
  },
  'Retail': {
    name: 'Retail',
    description: 'Sales, customer service, and retail operations',
    icon: 'fas fa-shopping-cart',
    color: 'text-purple-400',
    automationTrend: 'high',
    totalJobs: 0,
    averageRisk: 0
  },
  'Media': {
    name: 'Media',
    description: 'Creative, design, and content creation roles',
    icon: 'fas fa-video',
    color: 'text-red-400',
    automationTrend: 'medium',
    totalJobs: 0,
    averageRisk: 0
  },
  'Legal': {
    name: 'Legal',
    description: 'Legal services, law enforcement, and compliance',
    icon: 'fas fa-gavel',
    color: 'text-yellow-400',
    automationTrend: 'low',
    totalJobs: 0,
    averageRisk: 0
  },
  'Manufacturing': {
    name: 'Manufacturing',
    description: 'Production, assembly, and industrial roles',
    icon: 'fas fa-industry',
    color: 'text-orange-400',
    automationTrend: 'high',
    totalJobs: 0,
    averageRisk: 0
  },
  'Administrative': {
    name: 'Administrative',
    description: 'Office support, coordination, and administrative roles',
    icon: 'fas fa-briefcase',
    color: 'text-gray-400',
    automationTrend: 'high',
    totalJobs: 0,
    averageRisk: 0
  },
  'Management': {
    name: 'Management',
    description: 'Leadership, supervision, and management roles',
    icon: 'fas fa-users-cog',
    color: 'text-indigo-400',
    automationTrend: 'low',
    totalJobs: 0,
    averageRisk: 0
  }
};

/**
 * Get all job categories with statistics
 * @param {Object} jobDatabase - The job database to calculate stats from
 * @returns {Object} Categories with metadata and statistics
 */
async function getJobCategories(jobDatabase) {
  try {
    // Calculate statistics for each category
    const categoriesWithStats = { ...jobCategories };
    
    for (const [categoryName, categoryData] of Object.entries(categoriesWithStats)) {
      const categoryJobs = Object.values(jobDatabase).filter(
        job => job.category === categoryName
      );
      
      categoryData.totalJobs = categoryJobs.length;
      
      if (categoryJobs.length > 0) {
        const totalRisk = categoryJobs.reduce((sum, job) => sum + job.automationRisk, 0);
        categoryData.averageRisk = Math.round(totalRisk / categoryJobs.length);
      }
    }
    
    logger.info('Job categories retrieved with statistics');
    
    return {
      categories: categoriesWithStats,
      totalCategories: Object.keys(categoriesWithStats).length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Error getting job categories:', error);
    throw error;
  }
}

/**
 * Get jobs by category
 * @param {string} category - The category name
 * @param {Object} jobDatabase - The job database
 * @returns {Object} Jobs in the specified category
 */
async function getJobsByCategory(category, jobDatabase) {
  try {
    const categoryJobs = Object.values(jobDatabase).filter(
      job => job.category.toLowerCase() === category.toLowerCase()
    );
    
    if (categoryJobs.length === 0) {
      throw new Error(`No jobs found in category: ${category}`);
    }
    
    const categoryData = jobCategories[category] || {
      name: category,
      description: 'General category',
      icon: 'fas fa-briefcase',
      color: 'text-gray-400'
    };
    
    logger.info(`Retrieved ${categoryJobs.length} jobs from category: ${category}`);
    
    return {
      category: categoryData,
      jobs: categoryJobs,
      count: categoryJobs.length,
      averageRisk: Math.round(
        categoryJobs.reduce((sum, job) => sum + job.automationRisk, 0) / categoryJobs.length
      ),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Error getting jobs by category:', error);
    throw error;
  }
}

/**
 * Get category statistics
 * @param {Object} jobDatabase - The job database
 * @returns {Object} Category statistics
 */
async function getCategoryStatistics(jobDatabase) {
  try {
    const stats = {};
    const categoryCounts = {};
    const categoryRisks = {};
    
    // Calculate statistics
    for (const job of Object.values(jobDatabase)) {
      const category = job.category;
      
      if (!categoryCounts[category]) {
        categoryCounts[category] = 0;
        categoryRisks[category] = [];
      }
      
      categoryCounts[category]++;
      categoryRisks[category].push(job.automationRisk);
    }
    
    // Calculate averages and other stats
    for (const [category, risks] of Object.entries(categoryRisks)) {
      const averageRisk = Math.round(risks.reduce((sum, risk) => sum + risk, 0) / risks.length);
      const maxRisk = Math.max(...risks);
      const minRisk = Math.min(...risks);
      
      stats[category] = {
        totalJobs: categoryCounts[category],
        averageRisk: averageRisk,
        maxRisk: maxRisk,
        minRisk: minRisk,
        riskRange: maxRisk - minRisk,
        highRiskJobs: risks.filter(risk => risk >= 70).length,
        lowRiskJobs: risks.filter(risk => risk < 40).length
      };
    }
    
    // Overall statistics
    const allRisks = Object.values(jobDatabase).map(job => job.automationRisk);
    const overallStats = {
      totalJobs: Object.keys(jobDatabase).length,
      totalCategories: Object.keys(categoryCounts).length,
      averageRisk: Math.round(allRisks.reduce((sum, risk) => sum + risk, 0) / allRisks.length),
      maxRisk: Math.max(...allRisks),
      minRisk: Math.min(...allRisks),
      highRiskJobs: allRisks.filter(risk => risk >= 70).length,
      lowRiskJobs: allRisks.filter(risk => risk < 40).length
    };
    
    logger.info('Category statistics calculated');
    
    return {
      categories: stats,
      overall: overallStats,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Error getting category statistics:', error);
    throw error;
  }
}

/**
 * Get trending categories based on automation risk
 * @param {Object} jobDatabase - The job database
 * @param {number} limit - Number of categories to return
 * @returns {Array} Trending categories
 */
async function getTrendingCategories(jobDatabase, limit = 5) {
  try {
    const categoryStats = await getCategoryStatistics(jobDatabase);
    const categories = Object.entries(categoryStats.categories)
      .map(([name, stats]) => ({
        name,
        ...stats,
        trendScore: stats.averageRisk + (stats.highRiskJobs * 0.5)
      }))
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, limit);
    
    logger.info(`Retrieved ${categories.length} trending categories`);
    
    return {
      categories: categories,
      count: categories.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Error getting trending categories:', error);
    throw error;
  }
}

/**
 * Search categories by keyword
 * @param {string} keyword - Search keyword
 * @param {Object} jobDatabase - The job database
 * @returns {Array} Matching categories
 */
async function searchCategories(keyword, jobDatabase) {
  try {
    const matchingCategories = [];
    const searchTerm = keyword.toLowerCase();
    
    for (const [categoryName, categoryData] of Object.entries(jobCategories)) {
      if (categoryName.toLowerCase().includes(searchTerm) ||
          categoryData.description.toLowerCase().includes(searchTerm)) {
        
        const categoryJobs = Object.values(jobDatabase).filter(
          job => job.category === categoryName
        );
        
        matchingCategories.push({
          ...categoryData,
          name: categoryName,
          totalJobs: categoryJobs.length,
          averageRisk: categoryJobs.length > 0 
            ? Math.round(categoryJobs.reduce((sum, job) => sum + job.automationRisk, 0) / categoryJobs.length)
            : 0
        });
      }
    }
    
    logger.info(`Found ${matchingCategories.length} categories matching: ${keyword}`);
    
    return {
      categories: matchingCategories,
      count: matchingCategories.length,
      searchTerm: keyword,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Error searching categories:', error);
    throw error;
  }
}

/**
 * Get category comparison data
 * @param {Array} categories - Array of category names to compare
 * @param {Object} jobDatabase - The job database
 * @returns {Object} Comparison data
 */
async function compareCategories(categories, jobDatabase) {
  try {
    const comparison = {};
    
    for (const categoryName of categories) {
      const categoryJobs = Object.values(jobDatabase).filter(
        job => job.category.toLowerCase() === categoryName.toLowerCase()
      );
      
      if (categoryJobs.length > 0) {
        const risks = categoryJobs.map(job => job.automationRisk);
        comparison[categoryName] = {
          totalJobs: categoryJobs.length,
          averageRisk: Math.round(risks.reduce((sum, risk) => sum + risk, 0) / risks.length),
          maxRisk: Math.max(...risks),
          minRisk: Math.min(...risks),
          highRiskPercentage: Math.round((risks.filter(risk => risk >= 70).length / risks.length) * 100),
          lowRiskPercentage: Math.round((risks.filter(risk => risk < 40).length / risks.length) * 100)
        };
      }
    }
    
    logger.info(`Compared ${Object.keys(comparison).length} categories`);
    
    return {
      comparison: comparison,
      categories: Object.keys(comparison),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Error comparing categories:', error);
    throw error;
  }
}

module.exports = {
  getJobCategories,
  getJobsByCategory,
  getCategoryStatistics,
  getTrendingCategories,
  searchCategories,
  compareCategories,
  jobCategories
};

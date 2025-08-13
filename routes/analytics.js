const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');

// In-memory analytics storage (in production, use a database)
let analyticsData = {
  totalSearches: 0,
  totalShares: 0,
  jobSearches: {},
  popularJobs: [],
  dailyStats: {},
  shareMetrics: {
    twitter: 0,
    tiktok: 0,
    linkedin: 0,
    clipboard: 0
  },
  userSessions: [],
  viralContent: []
};

// Track job search endpoint
router.post('/track', async (req, res) => {
  try {
    const { jobTitle, cookedScore, userAgent, timestamp } = req.body;
    
    if (!jobTitle) {
      return res.status(400).json({
        error: 'Missing required field',
        message: 'jobTitle is required'
      });
    }

    // Update analytics
    analyticsData.totalSearches++;
    
    // Track job-specific searches
    const normalizedTitle = jobTitle.toLowerCase().trim();
    if (!analyticsData.jobSearches[normalizedTitle]) {
      analyticsData.jobSearches[normalizedTitle] = {
        searches: 0,
        averageScore: 0,
        totalScore: 0
      };
    }
    
    analyticsData.jobSearches[normalizedTitle].searches++;
    if (cookedScore) {
      analyticsData.jobSearches[normalizedTitle].totalScore += cookedScore;
      analyticsData.jobSearches[normalizedTitle].averageScore = 
        analyticsData.jobSearches[normalizedTitle].totalScore / 
        analyticsData.jobSearches[normalizedTitle].searches;
    }

    // Track daily stats
    const today = new Date().toISOString().split('T')[0];
    if (!analyticsData.dailyStats[today]) {
      analyticsData.dailyStats[today] = {
        searches: 0,
        shares: 0,
        uniqueJobs: new Set()
      };
    }
    analyticsData.dailyStats[today].searches++;
    analyticsData.dailyStats[today].uniqueJobs.add(normalizedTitle);

    // Track user session
    analyticsData.userSessions.push({
      jobTitle: normalizedTitle,
      cookedScore: cookedScore || 0,
      userAgent: userAgent || 'unknown',
      timestamp: timestamp || new Date().toISOString()
    });

    // Update popular jobs
    updatePopularJobs();

    logger.info(`Job search tracked: ${jobTitle} (Score: ${cookedScore})`);
    
    res.json({
      success: true,
      message: 'Search tracked successfully',
      totalSearches: analyticsData.totalSearches
    });
  } catch (error) {
    logger.error('Error tracking job search:', error);
    res.status(500).json({
      error: 'Failed to track search',
      message: error.message
    });
  }
});

// Track share endpoint
router.post('/share', async (req, res) => {
  try {
    const { platform, jobTitle, cookedScore, shareText } = req.body;
    
    if (!platform || !jobTitle) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'platform and jobTitle are required'
      });
    }

    // Update share metrics
    analyticsData.totalShares++;
    
    if (analyticsData.shareMetrics[platform.toLowerCase()]) {
      analyticsData.shareMetrics[platform.toLowerCase()]++;
    }

    // Track viral content
    analyticsData.viralContent.push({
      platform: platform.toLowerCase(),
      jobTitle: jobTitle,
      cookedScore: cookedScore || 0,
      shareText: shareText || '',
      timestamp: new Date().toISOString()
    });

    // Update daily stats
    const today = new Date().toISOString().split('T')[0];
    if (analyticsData.dailyStats[today]) {
      analyticsData.dailyStats[today].shares++;
    }

    logger.info(`Share tracked: ${platform} - ${jobTitle}`);
    
    res.json({
      success: true,
      message: 'Share tracked successfully',
      totalShares: analyticsData.totalShares
    });
  } catch (error) {
    logger.error('Error tracking share:', error);
    res.status(500).json({
      error: 'Failed to track share',
      message: error.message
    });
  }
});

// Get analytics dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    // Calculate recent stats
    const recentStats = calculateRecentStats(parseInt(days));
    
    // Get trending jobs
    const trendingJobs = getTrendingJobs();
    
    // Get viral content
    const viralContent = getViralContent();
    
    res.json({
      overview: {
        totalSearches: analyticsData.totalSearches,
        totalShares: analyticsData.totalShares,
        averageCookedScore: calculateAverageCookedScore(),
        uniqueJobsSearched: Object.keys(analyticsData.jobSearches).length
      },
      recentStats: recentStats,
      trendingJobs: trendingJobs,
      shareMetrics: analyticsData.shareMetrics,
      viralContent: viralContent,
      popularJobs: analyticsData.popularJobs.slice(0, 10),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error getting analytics dashboard:', error);
    res.status(500).json({
      error: 'Failed to get analytics dashboard',
      message: error.message
    });
  }
});

// Get job-specific analytics
router.get('/job/:jobTitle', async (req, res) => {
  try {
    const { jobTitle } = req.params;
    const normalizedTitle = jobTitle.toLowerCase().trim();
    
    const jobData = analyticsData.jobSearches[normalizedTitle];
    
    if (!jobData) {
      return res.status(404).json({
        error: 'Job not found',
        message: `No analytics data found for: ${jobTitle}`
      });
    }
    
    // Get recent searches for this job
    const recentSearches = analyticsData.userSessions
      .filter(session => session.jobTitle === normalizedTitle)
      .slice(-10)
      .reverse();
    
    res.json({
      jobTitle: jobTitle,
      searches: jobData.searches,
      averageScore: Math.round(jobData.averageScore * 100) / 100,
      recentSearches: recentSearches,
      rank: getJobRank(normalizedTitle),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error getting job analytics:', error);
    res.status(500).json({
      error: 'Failed to get job analytics',
      message: error.message
    });
  }
});

// Get trending jobs
router.get('/trending', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const trendingJobs = getTrendingJobs(parseInt(limit));
    
    res.json({
      trendingJobs: trendingJobs,
      count: trendingJobs.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error getting trending jobs:', error);
    res.status(500).json({
      error: 'Failed to get trending jobs',
      message: error.message
    });
  }
});

// Get share analytics
router.get('/shares', async (req, res) => {
  try {
    const { platform, days = 30 } = req.query;
    
    let shareData = analyticsData.shareMetrics;
    
    if (platform) {
      shareData = {
        [platform.toLowerCase()]: analyticsData.shareMetrics[platform.toLowerCase()] || 0
      };
    }
    
    // Get recent viral content
    const recentViralContent = analyticsData.viralContent
      .filter(content => {
        const contentDate = new Date(content.timestamp);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));
        return contentDate >= cutoffDate;
      })
      .slice(-20)
      .reverse();
    
    res.json({
      shareMetrics: shareData,
      viralContent: recentViralContent,
      totalShares: analyticsData.totalShares,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error getting share analytics:', error);
    res.status(500).json({
      error: 'Failed to get share analytics',
      message: error.message
    });
  }
});

// Helper functions
function updatePopularJobs() {
  const jobEntries = Object.entries(analyticsData.jobSearches);
  analyticsData.popularJobs = jobEntries
    .sort((a, b) => b[1].searches - a[1].searches)
    .map(([jobTitle, data]) => ({
      title: jobTitle,
      searches: data.searches,
      averageScore: Math.round(data.averageScore * 100) / 100
    }));
}

function calculateRecentStats(days) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const recentSessions = analyticsData.userSessions.filter(session => {
    const sessionDate = new Date(session.timestamp);
    return sessionDate >= cutoffDate;
  });
  
  const recentSearches = recentSessions.length;
  const uniqueJobs = new Set(recentSessions.map(session => session.jobTitle)).size;
  const averageScore = recentSessions.length > 0 
    ? Math.round(recentSessions.reduce((sum, session) => sum + session.cookedScore, 0) / recentSessions.length * 100) / 100
    : 0;
  
  return {
    searches: recentSearches,
    uniqueJobs: uniqueJobs,
    averageScore: averageScore,
    period: `${days} days`
  };
}

function getTrendingJobs(limit = 10) {
  return analyticsData.popularJobs.slice(0, limit);
}

function getViralContent(limit = 10) {
  return analyticsData.viralContent
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
}

function calculateAverageCookedScore() {
  const sessionsWithScore = analyticsData.userSessions.filter(session => session.cookedScore > 0);
  if (sessionsWithScore.length === 0) return 0;
  
  const totalScore = sessionsWithScore.reduce((sum, session) => sum + session.cookedScore, 0);
  return Math.round(totalScore / sessionsWithScore.length * 100) / 100;
}

function getJobRank(jobTitle) {
  const rank = analyticsData.popularJobs.findIndex(job => job.title === jobTitle);
  return rank >= 0 ? rank + 1 : null;
}

// Reset analytics (for testing/development)
router.post('/reset', async (req, res) => {
  try {
    analyticsData = {
      totalSearches: 0,
      totalShares: 0,
      jobSearches: {},
      popularJobs: [],
      dailyStats: {},
      shareMetrics: {
        twitter: 0,
        tiktok: 0,
        linkedin: 0,
        clipboard: 0
      },
      userSessions: [],
      viralContent: []
    };
    
    logger.info('Analytics data reset');
    res.json({
      success: true,
      message: 'Analytics data reset successfully'
    });
  } catch (error) {
    logger.error('Error resetting analytics:', error);
    res.status(500).json({
      error: 'Failed to reset analytics',
      message: error.message
    });
  }
});

module.exports = router;

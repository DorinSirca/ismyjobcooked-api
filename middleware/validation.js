const { ValidationError } = require('./errorHandler');

/**
 * Validate job title input
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function validateJobTitle(req, res, next) {
  try {
    const { jobTitle } = req.body;
    
    if (!jobTitle) {
      throw new ValidationError('Job title is required');
    }
    
    if (typeof jobTitle !== 'string') {
      throw new ValidationError('Job title must be a string');
    }
    
    const trimmedTitle = jobTitle.trim();
    
    if (trimmedTitle.length === 0) {
      throw new ValidationError('Job title cannot be empty');
    }
    
    if (trimmedTitle.length > 100) {
      throw new ValidationError('Job title is too long (max 100 characters)');
    }
    
    // Check for potentially harmful content
    const harmfulPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi
    ];
    
    for (const pattern of harmfulPatterns) {
      if (pattern.test(trimmedTitle)) {
        throw new ValidationError('Job title contains invalid content');
      }
    }
    
    // Update request body with cleaned title
    req.body.jobTitle = trimmedTitle;
    
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Validate share request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function validateShareRequest(req, res, next) {
  try {
    const { platform, jobTitle, cookedScore, shareText } = req.body;
    
    // Validate platform
    if (!platform) {
      throw new ValidationError('Platform is required');
    }
    
    const validPlatforms = ['twitter', 'tiktok', 'linkedin', 'clipboard', 'facebook', 'instagram'];
    if (!validPlatforms.includes(platform.toLowerCase())) {
      throw new ValidationError(`Invalid platform. Must be one of: ${validPlatforms.join(', ')}`);
    }
    
    // Validate job title
    if (!jobTitle) {
      throw new ValidationError('Job title is required');
    }
    
    if (typeof jobTitle !== 'string' || jobTitle.trim().length === 0) {
      throw new ValidationError('Job title must be a non-empty string');
    }
    
    // Validate cooked score
    if (cookedScore !== undefined) {
      const score = Number(cookedScore);
      if (isNaN(score) || score < 0 || score > 100) {
        throw new ValidationError('Cooked score must be a number between 0 and 100');
      }
    }
    
    // Validate share text (optional)
    if (shareText && typeof shareText !== 'string') {
      throw new ValidationError('Share text must be a string');
    }
    
    if (shareText && shareText.length > 500) {
      throw new ValidationError('Share text is too long (max 500 characters)');
    }
    
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Validate analytics tracking request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function validateAnalyticsRequest(req, res, next) {
  try {
    const { jobTitle, cookedScore, userAgent, timestamp } = req.body;
    
    // Validate job title
    if (!jobTitle) {
      throw new ValidationError('Job title is required');
    }
    
    if (typeof jobTitle !== 'string' || jobTitle.trim().length === 0) {
      throw new ValidationError('Job title must be a non-empty string');
    }
    
    // Validate cooked score (optional)
    if (cookedScore !== undefined) {
      const score = Number(cookedScore);
      if (isNaN(score) || score < 0 || score > 100) {
        throw new ValidationError('Cooked score must be a number between 0 and 100');
      }
    }
    
    // Validate user agent (optional)
    if (userAgent && typeof userAgent !== 'string') {
      throw new ValidationError('User agent must be a string');
    }
    
    // Validate timestamp (optional)
    if (timestamp) {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        throw new ValidationError('Invalid timestamp format');
      }
      
      // Check if timestamp is not too far in the future or past
      const now = new Date();
      const timeDiff = Math.abs(now.getTime() - date.getTime());
      const maxDiff = 24 * 60 * 60 * 1000; // 24 hours
      
      if (timeDiff > maxDiff) {
        throw new ValidationError('Timestamp is too far from current time');
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Validate query parameters for pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function validatePagination(req, res, next) {
  try {
    const { limit, offset, page } = req.query;
    
    // Validate limit
    if (limit !== undefined) {
      const limitNum = Number(limit);
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        throw new ValidationError('Limit must be a number between 1 and 100');
      }
      req.query.limit = limitNum;
    }
    
    // Validate offset
    if (offset !== undefined) {
      const offsetNum = Number(offset);
      if (isNaN(offsetNum) || offsetNum < 0) {
        throw new ValidationError('Offset must be a non-negative number');
      }
      req.query.offset = offsetNum;
    }
    
    // Validate page
    if (page !== undefined) {
      const pageNum = Number(page);
      if (isNaN(pageNum) || pageNum < 1) {
        throw new ValidationError('Page must be a positive number');
      }
      req.query.page = pageNum;
    }
    
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Validate category parameter
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function validateCategory(req, res, next) {
  try {
    const { category } = req.params;
    
    if (!category) {
      throw new ValidationError('Category parameter is required');
    }
    
    if (typeof category !== 'string' || category.trim().length === 0) {
      throw new ValidationError('Category must be a non-empty string');
    }
    
    // Clean the category parameter
    req.params.category = category.trim();
    
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Validate meme generation request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function validateMemeGeneration(req, res, next) {
  try {
    const { jobTitle, cookedScore, mood, platform } = req.body;
    
    // Validate job title
    if (!jobTitle) {
      throw new ValidationError('Job title is required');
    }
    
    if (typeof jobTitle !== 'string' || jobTitle.trim().length === 0) {
      throw new ValidationError('Job title must be a non-empty string');
    }
    
    // Validate cooked score
    if (!cookedScore) {
      throw new ValidationError('Cooked score is required');
    }
    
    const score = Number(cookedScore);
    if (isNaN(score) || score < 0 || score > 100) {
      throw new ValidationError('Cooked score must be a number between 0 and 100');
    }
    
    // Validate mood (optional)
    if (mood && typeof mood !== 'string') {
      throw new ValidationError('Mood must be a string');
    }
    
    const validMoods = ['happy', 'sad', 'angry', 'neutral', 'excited', 'worried'];
    if (mood && !validMoods.includes(mood.toLowerCase())) {
      throw new ValidationError(`Invalid mood. Must be one of: ${validMoods.join(', ')}`);
    }
    
    // Validate platform (optional)
    if (platform) {
      const validPlatforms = ['twitter', 'tiktok', 'linkedin', 'instagram', 'facebook'];
      if (!validPlatforms.includes(platform.toLowerCase())) {
        throw new ValidationError(`Invalid platform. Must be one of: ${validPlatforms.join(', ')}`);
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Sanitize input to prevent XSS
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input;
  }
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize request body
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function sanitizeRequestBody(req, res, next) {
  try {
    if (req.body) {
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = sanitizeInput(req.body[key]);
        }
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validateJobTitle,
  validateShareRequest,
  validateAnalyticsRequest,
  validatePagination,
  validateCategory,
  validateMemeGeneration,
  sanitizeInput,
  sanitizeRequestBody
};

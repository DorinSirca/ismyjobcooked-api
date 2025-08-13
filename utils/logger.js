const winston = require('winston');
const path = require('path');

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Define log colors
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

// Add colors to Winston
winston.addColors(logColors);

// Create log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    if (stack) {
      log += `\n${stack}`;
    }
    
    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }
    
    return log;
  })
);

// Create console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    if (stack) {
      log += `\n${stack}`;
    }
    
    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }
    
    return log;
  })
);

// Create logger instance
const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'ismyjobcooked-api' },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: consoleFormat,
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug'
    }),
    
    // File transport for errors
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // File transport for all logs
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ],
  
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/exceptions.log')
    })
  ],
  
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/rejections.log')
    })
  ]
});

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Add request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };
    
    if (res.statusCode >= 400) {
      logger.warn('HTTP Request', logData);
    } else {
      logger.http('HTTP Request', logData);
    }
  });
  
  next();
};

// Add performance logging
const performanceLogger = (operation, duration, metadata = {}) => {
  const logData = {
    operation,
    duration: `${duration}ms`,
    ...metadata
  };
  
  if (duration > 1000) {
    logger.warn('Slow operation detected', logData);
  } else if (duration > 500) {
    logger.info('Operation performance', logData);
  } else {
    logger.debug('Operation completed', logData);
  }
};

// Add job analysis logging
const jobAnalysisLogger = (jobTitle, automationRisk, category, metadata = {}) => {
  logger.info('Job analysis completed', {
    jobTitle,
    automationRisk,
    category,
    ...metadata
  });
};

// Add meme generation logging
const memeGenerationLogger = (memeType, metadata = {}) => {
  logger.info('Meme generated', {
    type: memeType,
    ...metadata
  });
};

// Add analytics logging
const analyticsLogger = (event, data = {}) => {
  logger.info('Analytics event', {
    event,
    ...data
  });
};

// Add error logging with context
const errorLogger = (error, context = {}) => {
  logger.error('Application error', {
    message: error.message,
    stack: error.stack,
    ...context
  });
};

// Add security logging
const securityLogger = (event, details = {}) => {
  logger.warn('Security event', {
    event,
    ...details
  });
};

// Add startup logging
const startupLogger = (port, environment) => {
  logger.info('Server startup', {
    port,
    environment,
    timestamp: new Date().toISOString()
  });
};

// Add shutdown logging
const shutdownLogger = (reason) => {
  logger.info('Server shutdown', {
    reason,
    timestamp: new Date().toISOString()
  });
};

// Export logger and utility functions
module.exports = {
  logger,
  requestLogger,
  performanceLogger,
  jobAnalysisLogger,
  memeGenerationLogger,
  analyticsLogger,
  errorLogger,
  securityLogger,
  startupLogger,
  shutdownLogger
};

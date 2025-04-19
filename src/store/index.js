/**
 * index.js
 * Central export point for all utility functions in the Learnify application
 */

// Import and re-export all formatters
export {
  formatDate,
  formatDuration,
  formatNumber,
  formatPrice,
  formatCreditExpiry,
  truncateText,
  formatFileSize,
  formatPercentage,
  formatList,
  formatAcademicLevel
} from './formatters';

// Import and re-export all validators
export {
  isValidEmail,
  validatePassword,
  validateUsername,
  isValidPhone,
  isNotEmpty,
  isValidLevel,
  isValidSubject,
  isNotPastDate,
  isValidCreditCard,
  isValidFileType,
  isValidFileSize,
  isValidUrl,
  validateYoutubeUrl,
  validateForm
} from './validators';

/**
 * Generate a unique ID
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} Unique ID
 */
export const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}${randomStr}`;
};

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  if (obj instanceof Object) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, deepClone(value)])
    );
  }
  
  return obj;
};

/**
 * Debounce a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle a function call
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Group an array of objects by a key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped object
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Check if an object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} True if empty
 */
export const isEmpty = (obj) => {
  if (obj === null || obj === undefined) {
    return true;
  }
  
  if (typeof obj !== 'object') {
    return false;
  }
  
  return Object.keys(obj).length === 0;
};

/**
 * Get the browser's locale
 * @returns {string} Browser locale
 */
export const getBrowserLocale = () => {
  return navigator.language || navigator.userLanguage || 'en-US';
};

/**
 * Get a value from localStorage with expiry check
 * @param {string} key - Key to retrieve
 * @returns {any} Retrieved value or null if expired/not found
 */
export const getStorageWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);
  
  if (!itemStr) {
    return null;
  }
  
  try {
    const item = JSON.parse(itemStr);
    const now = new Date();
    
    // Check if the item has an expiry time
    if (item.expiry && now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value;
  } catch (error) {
    return null;
  }
};

/**
 * Set a value in localStorage with an expiry time
 * @param {string} key - Key to set
 * @param {any} value - Value to store
 * @param {number} expiryInMinutes - Expiry time in minutes
 */
export const setStorageWithExpiry = (key, value, expiryInMinutes = 0) => {
  const now = new Date();
  const item = {
    value: value,
    expiry: expiryInMinutes > 0 ? now.getTime() + (expiryInMinutes * 60 * 1000) : null
  };
  
  localStorage.setItem(key, JSON.stringify(item));
};

/**
 * Convert an array to CSV format
 * @param {Array} array - Array of objects to convert
 * @param {Array} columns - Column definitions
 * @returns {string} CSV string
 */
export const arrayToCsv = (array, columns) => {
  if (!array.length || !columns.length) {
    return '';
  }
  
  const header = columns.map(column => `"${column.header || column.key}"`).join(',');
  const rows = array.map(item => {
    return columns.map(column => {
      const value = item[column.key] !== undefined ? item[column.key] : '';
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',');
  });
  
  return [header, ...rows].join('\n');
};

/**
 * Download data as a file
 * @param {string} data - Data to download
 * @param {string} filename - Filename
 * @param {string} type - MIME type
 */
export const downloadFile = (data, filename, type = 'text/plain') => {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};

/**
 * Calculate the percentage of a value in a range
 * @param {number} value - Current value
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Percentage (0-100)
 */
export const calculatePercentage = (value, min, max) => {
  if (min === max) return 100;
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
};

/**
 * Get academic levels available in the application
 * @returns {Array} Array of level objects
 */
export const getAcademicLevels = () => {
  return [
    { id: 'igcse', name: 'IGCSE', label: 'IGCSE' },
    { id: 'as', name: 'AS', label: 'AS Level' },
    { id: 'a', name: 'A', label: 'A Level' }
  ];
};

/**
 * Get available subjects for a specific academic level
 * @param {string} level - Academic level
 * @returns {Array} Array of subject objects
 */
export const getSubjectsForLevel = (level) => {
  const normalizedLevel = level?.toLowerCase() || '';
  
  // Common subjects available for all levels
  const commonSubjects = [
    { id: 'maths', name: 'Mathematics' },
    { id: 'physics', name: 'Physics' },
    { id: 'biology', name: 'Biology' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'computer_science', name: 'Computer Science' },
    { id: 'business_studies', name: 'Business Studies' },
    { id: 'accounting', name: 'Accounting' },
    { id: 'geography', name: 'Geography' },
    { id: 'history', name: 'History' },
    { id: 'travel_tourism', name: 'Travel and Tourism' }
  ];
  
  // Any level-specific subjects could be added here
  switch (normalizedLevel) {
    case 'igcse':
      return commonSubjects;
    case 'as':
      return commonSubjects;
    case 'a':
      return commonSubjects;
    default:
      return commonSubjects;
  }
};
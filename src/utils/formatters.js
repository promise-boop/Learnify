/**
 * formatters.js
 * Utility functions for formatting data in the Learnify application
 */

/**
 * Format a date to a readable string
 * @param {Date|string} date - Date object or ISO string to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  const defaultOptions = {
    short: false,
    includeTime: false,
    includeYear: true,
    ...options
  };
  
  try {
    if (defaultOptions.short) {
      return dateObj.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: defaultOptions.includeYear ? '2-digit' : undefined
      });
    }
    
    const dateStr = dateObj.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: defaultOptions.includeYear ? 'numeric' : undefined
    });
    
    if (defaultOptions.includeTime) {
      const timeStr = dateObj.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      });
      return `${dateStr} at ${timeStr}`;
    }
    
    return dateStr;
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(dateObj);
  }
};

/**
 * Format a duration in minutes to a readable string
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration string
 */
export const formatDuration = (minutes) => {
  if (typeof minutes !== 'number' || isNaN(minutes)) {
    return 'Invalid duration';
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.floor(minutes % 60);
  
  if (hours === 0) {
    return `${remainingMinutes} min${remainingMinutes !== 1 ? 's' : ''}`;
  }
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} min${remainingMinutes !== 1 ? 's' : ''}`;
};

/**
 * Format a number with commas as thousands separators
 * @param {number} number - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (number) => {
  if (typeof number !== 'number' || isNaN(number)) {
    return 'Invalid number';
  }
  
  return number.toLocaleString();
};

/**
 * Format a price in USD
 * @param {number} amount - Price amount
 * @param {Object} options - Formatting options
 * @returns {string} Formatted price string
 */
export const formatPrice = (amount, options = {}) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'Invalid amount';
  }
  
  const defaultOptions = {
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options
  };
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: defaultOptions.currency,
    minimumFractionDigits: defaultOptions.minimumFractionDigits,
    maximumFractionDigits: defaultOptions.maximumFractionDigits
  }).format(amount);
};

/**
 * Format a credit expiry date to show days remaining
 * @param {Date|string} expiryDate - Expiry date
 * @returns {string} Formatted expiry string
 */
export const formatCreditExpiry = (expiryDate) => {
  const expiry = expiryDate instanceof Date ? expiryDate : new Date(expiryDate);
  
  if (isNaN(expiry.getTime())) {
    return 'Invalid expiry date';
  }
  
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return 'Expired';
  }
  
  if (diffDays === 0) {
    return 'Expires today';
  }
  
  if (diffDays === 1) {
    return 'Expires tomorrow';
  }
  
  return `Expires in ${diffDays} days`;
};

/**
 * Truncate text to a specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return `${text.substring(0, maxLength).trim()}...`;
};

/**
 * Format a file size in bytes to a human-readable string
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (typeof bytes !== 'number' || isNaN(bytes) || bytes < 0) {
    return 'Invalid size';
  }
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(size < 10 && unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`;
};

/**
 * Format a percentage value
 * @param {number} value - Percentage value (0-100)
 * @param {Object} options - Formatting options
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, options = {}) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return 'Invalid percentage';
  }
  
  const defaultOptions = {
    decimals: 0,
    includeSymbol: true,
    ...options
  };
  
  const formattedValue = value.toFixed(defaultOptions.decimals);
  
  return defaultOptions.includeSymbol ? `${formattedValue}%` : formattedValue;
};

/**
 * Format a list of items into a comma-separated string
 * @param {Array} items - Array of items to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted list string
 */
export const formatList = (items, options = {}) => {
  if (!Array.isArray(items)) {
    return '';
  }
  
  const defaultOptions = {
    limit: items.length,
    conjunction: 'and',
    ...options
  };
  
  const limitedItems = items.slice(0, defaultOptions.limit);
  
  if (limitedItems.length === 0) {
    return '';
  }
  
  if (limitedItems.length === 1) {
    return String(limitedItems[0]);
  }
  
  if (limitedItems.length === 2) {
    return `${limitedItems[0]} ${defaultOptions.conjunction} ${limitedItems[1]}`;
  }
  
  const lastItem = limitedItems.pop();
  return `${limitedItems.join(', ')} ${defaultOptions.conjunction} ${lastItem}`;
};

/**
 * Format an academic level to a standardized display format
 * @param {string} level - Academic level (IGCSE, AS, A)
 * @returns {string} Formatted academic level
 */
export const formatAcademicLevel = (level) => {
  if (!level || typeof level !== 'string') {
    return 'Unknown Level';
  }
  
  const normalizedLevel = level.trim().toUpperCase();
  
  switch (normalizedLevel) {
    case 'IGCSE':
      return 'IGCSE';
    case 'AS':
      return 'AS Level';
    case 'A':
    case 'A LEVEL':
    case 'ALEVEL':
      return 'A Level';
    default:
      return normalizedLevel;
  }
};
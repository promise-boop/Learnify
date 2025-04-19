/**
 * validators.js
 * Utility functions for validating data in the Learnify application
 */

/**
 * Validate an email address
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  // RFC 5322 compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return emailRegex.test(email);
};

/**
 * Validate a password based on strength requirements
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with status and message
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  
  return { valid: true, message: 'Password is strong' };
};

/**
 * Check if a username is valid
 * @param {string} username - Username to validate
 * @returns {Object} Validation result with status and message
 */
export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    return { valid: false, message: 'Username is required' };
  }
  
  if (username.length < 3) {
    return { valid: false, message: 'Username must be at least 3 characters long' };
  }
  
  if (username.length > 20) {
    return { valid: false, message: 'Username must be less than 20 characters long' };
  }
  
  // Only allow alphanumeric characters and underscores
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, message: 'Username can only contain letters, numbers, and underscores' };
  }
  
  return { valid: true, message: 'Username is valid' };
};

/**
 * Validate a phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  
  // Basic international phone number validation
  // Allows for various formats: +1234567890, 123-456-7890, (123) 456-7890
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.trim());
};

/**
 * Validate if a string is not empty
 * @param {string} value - Value to check
 * @returns {boolean} True if not empty
 */
export const isNotEmpty = (value) => {
  if (typeof value !== 'string') {
    return false;
  }
  
  return value.trim().length > 0;
};

/**
 * Validate if a selected level is valid
 * @param {string} level - Academic level to validate
 * @returns {boolean} True if valid
 */
export const isValidLevel = (level) => {
  if (!level || typeof level !== 'string') {
    return false;
  }
  
  const normalizedLevel = level.trim().toUpperCase();
  const validLevels = ['IGCSE', 'AS', 'A', 'A LEVEL'];
  
  return validLevels.includes(normalizedLevel);
};

/**
 * Validate if a subject is valid based on level
 * @param {string} subject - Subject to validate
 * @param {string} level - Academic level
 * @returns {boolean} True if valid
 */
export const isValidSubject = (subject, level) => {
  if (!subject || !level || typeof subject !== 'string' || typeof level !== 'string') {
    return false;
  }
  
  const normalizedLevel = level.trim().toUpperCase();
  const normalizedSubject = subject.trim().toLowerCase();
  
  const validSubjects = [
    'maths', 'physics', 'biology', 'chemistry', 'computer science', 
    'history', 'geography', 'accounting', 'travel and tourism', 'business studies'
  ];
  
  // Check if it's a valid subject in our list
  return validSubjects.includes(normalizedSubject);
};

/**
 * Validate a date is not in the past
 * @param {Date|string} date - Date to validate
 * @returns {boolean} True if valid
 */
export const isNotPastDate = (date) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return false;
  }
  
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  dateObj.setHours(0, 0, 0, 0);
  
  return dateObj >= now;
};

/**
 * Validate if a credit card number is valid using Luhn algorithm
 * @param {string} cardNumber - Credit card number to validate
 * @returns {boolean} True if valid
 */
export const isValidCreditCard = (cardNumber) => {
  if (!cardNumber || typeof cardNumber !== 'string') {
    return false;
  }
  
  // Remove any non-digit characters
  const digitsOnly = cardNumber.replace(/\D/g, '');
  
  if (digitsOnly.length < 13 || digitsOnly.length > 19) {
    return false;
  }
  
  // Luhn algorithm
  let sum = 0;
  let shouldDouble = false;
  
  // Loop through values starting from the rightmost digit
  for (let i = digitsOnly.length - 1; i >= 0; i--) {
    let digit = parseInt(digitsOnly.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
};

/**
 * Validate if a file is of an accepted type
 * @param {File} file - File to validate
 * @param {Array} acceptedTypes - Array of accepted MIME types
 * @returns {boolean} True if valid
 */
export const isValidFileType = (file, acceptedTypes = []) => {
  if (!file || !file.type) {
    return false;
  }
  
  if (acceptedTypes.length === 0) {
    return true; // No restrictions
  }
  
  return acceptedTypes.includes(file.type);
};

/**
 * Validate if a file size is under the maximum allowed
 * @param {File} file - File to validate
 * @param {number} maxSizeInBytes - Maximum file size in bytes
 * @returns {boolean} True if valid
 */
export const isValidFileSize = (file, maxSizeInBytes) => {
  if (!file || typeof file.size !== 'number') {
    return false;
  }
  
  return file.size <= maxSizeInBytes;
};

/**
 * Validate if a URL is valid
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
export const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (error) {
    return false;
  }
};

/**
 * Validate if a YouTube URL is valid
 * @param {string} url - YouTube URL to validate
 * @returns {Object} Validation result with status and video ID if valid
 */
export const validateYoutubeUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return { valid: false, videoId: null };
  }
  
  // Extract video ID from different YouTube URL formats
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/i
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return { valid: true, videoId: match[1] };
    }
  }
  
  return { valid: false, videoId: null };
};

/**
 * Validate form data against a schema
 * @param {Object} data - Form data to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} Validation result with errors and isValid flag
 */
export const validateForm = (data, schema) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(schema).forEach(field => {
    const value = data[field];
    const rules = schema[field];
    
    // Required field check
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors[field] = rules.requiredMessage || `${field} is required`;
      isValid = false;
      return;
    }
    
    // Skip other validations if field is empty and not required
    if (!value && !rules.required) {
      return;
    }
    
    // Type validation
    if (rules.type && typeof value !== rules.type) {
      errors[field] = rules.typeMessage || `${field} must be of type ${rules.type}`;
      isValid = false;
      return;
    }
    
    // Min length validation
    if (rules.minLength && value.length < rules.minLength) {
      errors[field] = rules.minLengthMessage || `${field} must be at least ${rules.minLength} characters`;
      isValid = false;
      return;
    }
    
    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      errors[field] = rules.maxLengthMessage || `${field} must be less than ${rules.maxLength} characters`;
      isValid = false;
      return;
    }
    
    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      errors[field] = rules.patternMessage || `${field} is invalid`;
      isValid = false;
      return;
    }
    
    // Custom validation function
    if (rules.validate && typeof rules.validate === 'function') {
      const customError = rules.validate(value, data);
      if (customError) {
        errors[field] = customError;
        isValid = false;
        return;
      }
    }
  });
  
  return { isValid, errors };
};
export interface ValidationErrors {
  location?: string;
  date?: string;
  searchQuery?: string;
}

/**
 * Sanitizes text input by removing potentially dangerous characters
 * @param input The text to sanitize
 * @returns Sanitized text
 */
export const sanitizeText = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replace(/[&]/g, '') // Remove & to prevent HTML entity injection
    .replace(/[;]/g, '') // Remove ; to prevent SQL injection
    .replace(/['"]/g, '') // Remove quotes to prevent SQL injection
    .trim();
};

/**
 * Validates if a string is a valid date in YYYY-MM-DD format
 * @param date The date string to validate
 * @returns boolean indicating if the date is valid
 */
export const validateDate = (date: string): boolean => {
  // Check if the date is in YYYY-MM-DD format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;

  // Check if it's a valid date
  const parsedDate = new Date(date);
  return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
};

/**
 * Validates if a location string contains only safe characters
 * @param location The location string to validate
 * @returns boolean indicating if the location is valid
 */
export const validateLocation = (location: string): boolean => {
  // Allow letters, numbers, spaces, and common location characters
  const locationRegex = /^[a-zA-Z0-9\s\-.,()]+$/;
  return locationRegex.test(location);
};

/**
 * Validates if a search query string contains only safe characters
 * @param query The search query string to validate
 * @returns boolean indicating if the query is valid
 */
export const validateSearchQuery = (query: string): boolean => {
  // Allow letters, numbers, spaces, and common search characters
  const searchRegex = /^[a-zA-Z0-9\s\-.,()&]+$/;
  return searchRegex.test(query);
};

/**
 * Validates search parameters and returns any validation errors
 * @param params The search parameters to validate
 * @param t Translation function
 * @returns Object containing any validation errors
 */
export const validateSearchParams = (
  params: { location: string; date: string; searchQuery: string },
  t: (key: string) => string,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!params.location.trim()) {
    errors.location = t('location-required');
  } else if (!validateLocation(params.location)) {
    errors.location = t('invalid-location');
  }

  if (!params.date.trim()) {
    errors.date = t('date-required');
  } else if (!validateDate(params.date)) {
    errors.date = t('invalid-date');
  }

  if (params.searchQuery && !validateSearchQuery(params.searchQuery)) {
    errors.searchQuery = t('invalid-search-query');
  }

  return errors;
};

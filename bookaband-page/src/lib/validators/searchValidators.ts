export interface ValidationErrors {
  location?: string;
  date?: string;
  searchQuery?: string;
}

export const sanitizeText = (input: string): string => {
  return input
    .replace(/[<>]/g, '')
    .replace(/[&]/g, '')
    .replace(/[;]/g, '')
    .replace(/['"]/g, '')
    .trim();
};

export const validateDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;

  const parsedDate = new Date(date);
  return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
};

export const validateLocation = (location: string): boolean => {
  const locationRegex = /^[a-zA-Z0-9\s\-.,()]+$/;
  return locationRegex.test(location);
};

export const validateSearchQuery = (query: string): boolean => {
  const searchRegex = /^[a-zA-Z0-9\s\-.,()&]+$/;
  return searchRegex.test(query);
};

export const validateSearchParams = (
  params: { location?: string; date?: string; searchQuery?: string },
  t: (key: string) => string,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!params.location || !params.location.trim()) {
    errors.location = t('location-required');
  } else if (!validateLocation(params.location)) {
    errors.location = t('invalid-location');
  }

  if (!params.date || !params.date.trim()) {
    errors.date = t('date-required');
  } else if (!validateDate(params.date)) {
    errors.date = t('invalid-date');
  }

  if (params.searchQuery && !validateSearchQuery(params.searchQuery)) {
    errors.searchQuery = t('invalid-search-query');
  }

  return errors;
};

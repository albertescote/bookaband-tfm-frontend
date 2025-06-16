export interface ValidationErrors {
  location?: string;
  date?: string;
  artistName?: string;
  general?: string;
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
  if (!date) return true;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;

  const parsedDate = new Date(date);
  return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
};

export const validateLocation = (location: string): boolean => {
  if (!location) return true;
  const locationRegex = /^[\p{L}\p{N}\s\-.,()]+$/u;
  return locationRegex.test(location);
};

export const validateArtistName = (query: string): boolean => {
  if (!query) return true;
  const artistNameRegex = /^[\p{L}\p{N}\s\-.,()&!'+#@\/:"]+$/u;
  return artistNameRegex.test(query);
};

export const validateSearchParams = (
  params: { location?: string; date?: string; artistName?: string },
  t: (key: string) => string,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (
    !params.location?.trim() &&
    !params.date?.trim() &&
    !params.artistName?.trim()
  ) {
    errors.general = t('at-least-one-field-required');
    return errors;
  }

  if (params.location?.trim() && !validateLocation(params.location)) {
    errors.location = t('invalid-location');
  }

  if (params.date?.trim() && !validateDate(params.date)) {
    errors.date = t('invalid-date');
  }

  if (params.artistName?.trim() && !validateArtistName(params.artistName)) {
    errors.artistName = t('invalid-artist-name');
  }

  return errors;
};

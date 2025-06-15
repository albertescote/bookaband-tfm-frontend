export const STORAGE_KEY = 'bandFormData';

export const clearFormData = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getFormData = () => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : null;
};

export const setFormData = (data: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

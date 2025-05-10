const checkStrVar = (variable: string | undefined, name: string): string => {
  if (!variable) throw new Error(`undefined variable: ${name}`);
  return variable;
};
const BACKEND_URL = checkStrVar(process.env.BACKEND_URL, 'BACKEND_URL');

const GOOGLE_MAPS_API_KEY = checkStrVar(
  process.env.GOOGLE_MAPS_API_KEY,
  'GOOGLE_MAPS_API_KEY',
);

export { BACKEND_URL, GOOGLE_MAPS_API_KEY };

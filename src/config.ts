const checkStrVar = (variable: string | undefined, name: string): string => {
  if (!variable) throw new Error(`undefined variable: ${name}`);
  return variable;
};
const BACKEND_URL = checkStrVar(process.env.BACKEND_URL, 'BACKEND_URL');
const BACKEND_PUBLIC_KEY = checkStrVar(
  process.env.BACKEND_PUBLIC_KEY,
  'BACKEND_PUBLIC_KEY',
);

export { BACKEND_URL, BACKEND_PUBLIC_KEY };

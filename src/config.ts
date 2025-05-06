const checkStrVar = (variable: string | undefined, name: string): string => {
  if (!variable) throw new Error(`undefined variable: ${name}`);
  return variable;
};
const BACKEND_URL = checkStrVar(process.env.BACKEND_URL, 'BACKEND_URL');
const FRONTEND_URL = checkStrVar(process.env.FRONTEND_URL, 'FRONTEND_URL');

const GOOGLE_CLIENT_ID = checkStrVar(
  process.env.GOOGLE_CLIENT_ID,
  'GOOGLE_CLIENT_ID',
);

const BACKEND_PUBLIC_KEY = checkStrVar(
  process.env.BACKEND_PUBLIC_KEY,
  'BACKEND_PUBLIC_KEY',
);

export { BACKEND_URL, FRONTEND_URL, BACKEND_PUBLIC_KEY, GOOGLE_CLIENT_ID };

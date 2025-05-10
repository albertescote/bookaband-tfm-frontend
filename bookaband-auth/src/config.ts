const checkStrVar = (variable: string | undefined, name: string): string => {
  if (!variable) throw new Error(`undefined variable: ${name}`);
  return variable;
};
const BACKEND_URL = checkStrVar(process.env.BACKEND_URL, 'BACKEND_URL');
const AUTH_URL = checkStrVar(process.env.AUTH_URL, 'AUTH_URL');

const GOOGLE_CLIENT_ID = checkStrVar(
  process.env.GOOGLE_CLIENT_ID,
  'GOOGLE_CLIENT_ID',
);

export { BACKEND_URL, AUTH_URL, GOOGLE_CLIENT_ID };

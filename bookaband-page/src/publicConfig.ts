const checkStrVar = (variable: string | undefined, name: string): string => {
  if (!variable) throw new Error(`undefined variable: ${name}`);
  return variable;
};
const AUTH_URL = checkStrVar(
  process.env.NEXT_PUBLIC_AUTH_URL,
  'NEXT_PUBLIC_AUTH_URL',
);

const BACKEND_URL = checkStrVar(
  process.env.NEXT_PUBLIC_BACKEND_URL,
  'NEXT_PUBLIC_BACKEND_URL',
);

export { AUTH_URL, BACKEND_URL };

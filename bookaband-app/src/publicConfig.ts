const checkStrVar = (variable: string | undefined, name: string): string => {
  if (!variable) throw new Error(`undefined variable: ${name}`);
  return variable;
};
const AUTH_URL = checkStrVar(
  process.env.NEXT_PUBLIC_AUTH_URL,
  'NEXT_PUBLIC_AUTH_URL',
);
const PAGE_URL = checkStrVar(
  process.env.NEXT_PUBLIC_PAGE_URL,
  'NEXT_PUBLIC_PAGE_URL',
);

export { AUTH_URL, PAGE_URL };

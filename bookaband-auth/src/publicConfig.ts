const checkStrVar = (variable: string | undefined, name: string): string => {
  if (!variable) throw new Error(`undefined variable: ${name}`);
  return variable;
};
const PAGE_URL = checkStrVar(
  process.env.NEXT_PUBLIC_PAGE_URL,
  'NEXT_PUBLIC_PAGE_URL',
);
const APP_URL = checkStrVar(
  process.env.NEXT_PUBLIC_APP_URL,
  'NEXT_PUBLIC_APP_URL',
);

export { PAGE_URL, APP_URL };

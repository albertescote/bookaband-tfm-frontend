const checkStrVar = (variable: string | undefined, name: string): string => {
  if (!variable) throw new Error(`undefined variable: ${name}`);
  return variable;
};
const BACKEND_URL = checkStrVar(process.env.BACKEND_URL, 'BACKEND_URL');

export { BACKEND_URL };

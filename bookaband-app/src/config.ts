const checkStrVar = (variable: string | undefined, name: string): string => {
  if (!variable) throw new Error(`undefined variable: ${name}`);
  return variable;
};

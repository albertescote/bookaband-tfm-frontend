const checkStrVar = (variable: string | undefined, name: string): string => {
  if (!variable) throw new Error(`undefined variable: ${name}`);
  return variable;
};
const BACKEND_URL = checkStrVar(process.env.BACKEND_URL, 'BACKEND_URL');
const FRONTEND_URL = checkStrVar(process.env.FRONTEND_URL, 'FRONTEND_URL');

const BACKEND_PUBLIC_KEY = checkStrVar(
  process.env.BACKEND_PUBLIC_KEY,
  'BACKEND_PUBLIC_KEY',
);
const COMMON_PROTECTED_ROUTES: string[] = [
  '/offer-details',
  '/profile',
  '/chat',
  '/chat/[id]',
  '/booking',
  '/booking/[id]',
];

const CLIENT_PROTECTED_ROUTES: string[] = ['/chat/new'];
const MUSICIAN_PROTECTED_ROUTES: string[] = [
  '/manage-offers',
  '/band',
  '/offer',
];

export {
  BACKEND_URL,
  FRONTEND_URL,
  BACKEND_PUBLIC_KEY,
  COMMON_PROTECTED_ROUTES,
  CLIENT_PROTECTED_ROUTES,
  MUSICIAN_PROTECTED_ROUTES,
};

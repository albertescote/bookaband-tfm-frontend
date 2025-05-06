'use client';
import LoginButton from '@/components/layout/header/loginButton';
import SignUpButton from '@/components/layout/header/signUpButton';
import { useWebPageAuth } from '@/providers/webPageAuthProvider';
import LogoutButton from '@/components/layout/header/logoutButton';

const RegistrationButtons = ({ language }: { language: string }) => {
  const { user } = useWebPageAuth();

  return (
    <div className="flex items-center space-x-4">
      {!!user ? (
        <LogoutButton language={language}></LogoutButton>
      ) : (
        <LoginButton language={language}></LoginButton>
      )}
      {!user && <SignUpButton language={language}></SignUpButton>}
    </div>
  );
};

export default RegistrationButtons;

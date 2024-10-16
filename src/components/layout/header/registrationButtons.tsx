'use client';
import LoginButton from '@/components/layout/header/loginButton';
import SignUpButton from '@/components/layout/header/signUpButton';
import { useAuth } from '@/providers/AuthProvider';

const RegistrationButtons = ({ language }: { language: string }) => {
  const { authentication } = useAuth();

  return (
    <div className="flex items-center space-x-4">
      <LoginButton language={language}></LoginButton>
      {!authentication.isAuthenticated && (
        <SignUpButton language={language}></SignUpButton>
      )}
    </div>
  );
};

export default RegistrationButtons;

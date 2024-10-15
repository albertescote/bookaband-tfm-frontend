'use client';
import { useEffect, useState } from 'react';
import { validateAccessToken } from '@/service/auth';
import LoginButton from '@/components/layout/header/loginButton';
import SignUpButton from '@/components/layout/header/signUpButton';

const RegistrationButtons = ({ language }: { language: string }) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    validateAccessToken().then((result) => {
      setAuthenticated(!!result);
    });
  }, []);
  return (
    <div className="flex items-center space-x-4">
      <LoginButton language={language}></LoginButton>
      {!authenticated && <SignUpButton language={language}></SignUpButton>}
    </div>
  );
};

export default RegistrationButtons;

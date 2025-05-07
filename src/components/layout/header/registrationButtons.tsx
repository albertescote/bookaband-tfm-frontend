'use client';
import LoginButton from '@/components/layout/header/loginButton';
import SignUpButton from '@/components/layout/header/signUpButton';
import { useWebPageAuth } from '@/providers/webPageAuthProvider';
import UserMenu from '@/components/layout/header/userMenu';
import React from 'react';
import NotificationsMenu from '@/components/layout/header/notificationsMenu';
import MessagesMenu from '@/components/layout/header/messagesMenu';

const RegistrationButtons = ({ language }: { language: string }) => {
  const { user } = useWebPageAuth();

  return (
    <div className="flex items-center space-x-8 py-4">
      {!!user && (
        <>
          <NotificationsMenu language={language}></NotificationsMenu>
          <MessagesMenu language={language}></MessagesMenu>
          <UserMenu language={language} />
        </>
      )}
      {!user && (
        <>
          <LoginButton language={language}></LoginButton>
          <SignUpButton language={language}></SignUpButton>
        </>
      )}
    </div>
  );
};

export default RegistrationButtons;
